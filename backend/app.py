from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import hashlib
from datetime import datetime
from werkzeug.utils import secure_filename

# ✅ MODEL IMPORT
from model import predict_pothole

app = Flask(__name__)
CORS(app)

# ---------------- CONFIG ----------------
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'roadintel.db')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


# ---------------- DATABASE ----------------
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            image_path TEXT NOT NULL,
            location TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            pothole_count INTEGER DEFAULT 0,
            severity_score REAL DEFAULT 0,
            threat_level TEXT DEFAULT 'Safe',
            status TEXT DEFAULT 'pending',
            avg_confidence REAL DEFAULT 0,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_email) REFERENCES users(email)
        )
    ''')

    cursor.execute('CREATE INDEX IF NOT EXISTS idx_location ON reports(location)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_status ON reports(status)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_timestamp ON reports(timestamp)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_threat_level ON reports(threat_level)')

    conn.commit()
    conn.close()


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def calculate_severity_score(pothole_count, avg_confidence):
    severity = (pothole_count * 20) + (avg_confidence * 50)

    if severity < 20:
        level = "Safe"
    elif severity < 40:
        level = "Low Risk"
    elif severity < 70:
        level = "Moderate Risk"
    else:
        level = "High Risk"

    return round(severity, 2), level


# ---------------- ROUTES ----------------

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200


@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        role = data.get('role', 'user')

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        if len(password) < 6:
            return jsonify({'error': 'Password too short'}), 400

        password_hash = hash_password(password)

        conn = get_db()
        cursor = conn.cursor()

        try:
            cursor.execute(
                'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
                (email, password_hash, role)
            )
            conn.commit()
            conn.close()
            return jsonify({'message': 'User created', 'email': email}), 201
        except sqlite3.IntegrityError:
            conn.close()
            return jsonify({'error': 'Email exists'}), 409

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip()
        password = data.get('password', '')

        password_hash = hash_password(password)

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute(
            'SELECT email, role FROM users WHERE email=? AND password_hash=?',
            (email, password_hash)
        )
        user = cursor.fetchone()
        conn.close()

        if user:
            return jsonify({'email': user['email'], 'role': user['role']}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image'}), 400

        file = request.files['image']
        user_email = request.form.get('email')
        location = request.form.get('location', 'Unknown')
        latitude = request.form.get('latitude', type=float)
        longitude = request.form.get('longitude', type=float)

        if not user_email or not file.filename:
            return jsonify({'error': 'Missing fields'}), 400

        filename = secure_filename(f"{datetime.now().timestamp()}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # ✅ MODEL CALL
        label, avg_confidence, pothole_count, output_path = predict_pothole(filepath)

        severity_score, threat_level = calculate_severity_score(
            pothole_count,
            avg_confidence
        )

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO reports 
            (user_email, image_path, location, latitude, longitude, pothole_count, severity_score, threat_level, avg_confidence, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_email,
            output_path,
            location,
            latitude,
            longitude,
            pothole_count,
            severity_score,
            threat_level,
            avg_confidence,
            'pending'
        ))

        conn.commit()
        report_id = cursor.lastrowid
        conn.close()

        return jsonify({
            'report_id': report_id,
            'prediction': label,
            'pothole_count': pothole_count,
            'severity_score': severity_score,
            'threat_level': threat_level,
            'avg_confidence': round(avg_confidence, 2),
            'location': location,
            'latitude': latitude,
            'longitude': longitude,
            'status': 'pending'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/all-reports', methods=['GET'])
def all_reports():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM reports ORDER BY timestamp DESC')
    reports = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({'reports': reports, 'total': len(reports)})


@app.route('/reports-by-location/<location>', methods=['GET'])
def reports_by_location(location):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        'SELECT * FROM reports WHERE location LIKE ? ORDER BY timestamp DESC',
        (f'%{location}%',)
    )
    reports = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify({'location': location, 'reports': reports})


@app.route('/reports/<int:report_id>/status', methods=['PATCH'])
def update_status(report_id):
    data = request.get_json()
    status = data.get('status')

    if status not in ['pending', 'resolved']:
        return jsonify({'error': 'Invalid status'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('UPDATE reports SET status=? WHERE id=?', (status, report_id))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Updated'})


@app.route('/stats', methods=['GET'])
def stats():
    conn = get_db()
    cursor = conn.cursor()

    # Total reports
    cursor.execute('SELECT COUNT(*) as total FROM reports')
    total = cursor.fetchone()['total']

    # Avg severity
    cursor.execute('SELECT AVG(severity_score) as avg_severity FROM reports')
    avg_severity = cursor.fetchone()['avg_severity'] or 0

    # Threat distribution
    cursor.execute('''
        SELECT threat_level, COUNT(*) as count 
        FROM reports 
        GROUP BY threat_level
    ''')
    threat_counts = {row['threat_level']: row['count'] for row in cursor.fetchall()}

    # ✅ NEW: Status counts
    cursor.execute('''
        SELECT status, COUNT(*) as count 
        FROM reports 
        GROUP BY status
    ''')
    status_counts = {row['status']: row['count'] for row in cursor.fetchall()}

    conn.close()

    return jsonify({
    "total_reports": total,
    "avg_severity": avg_severity,
    "threat_counts": threat_counts,
    "status_counts": {
        "pending": status_counts.get("pending", 0),
        "resolved": status_counts.get("resolved", 0)
    }
})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
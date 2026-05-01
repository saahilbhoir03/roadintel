# RoadIntel - Pothole Detection System Setup Guide

## Overview
RoadIntel is a full-stack pothole detection system combining:
- **Frontend**: Next.js 16 with React 19 for user reporting and admin dashboard
- **Backend**: Flask Python API with Roboflow YOLOv8 integration
- **Database**: SQLite for data persistence

---

## Prerequisites
- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- Roboflow API key (free account at https://roboflow.com)
- Modern browser with geolocation support

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd /vercel/share/v0-project
pnpm install
```

### 2. Configure Environment
Create a `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
pnpm dev
```
Frontend runs at: `http://localhost:3000`

---

## Backend Setup

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
Create a `.env` file in the backend directory:
```
ROBOFLOW_API_KEY=your_api_key_here
ROBOFLOW_PROJECT_ID=pothole-detection-project
ROBOFLOW_VERSION=1
FLASK_ENV=development
FLASK_DEBUG=1
```

**Get your API key:**
1. Sign up at https://roboflow.com
2. Create/find a pothole detection project
3. Copy your API key from project settings

### 3. Start Flask Server
```bash
cd backend
python app.py
```
Backend runs at: `http://localhost:5000`

---

## System Architecture

### User Flow (Reporting)
1. Select "Report Potholes" on home page
2. Login/Signup with email/password
3. Upload pothole image
4. Enter location name
5. Click "Get GPS" to capture coordinates (optional)
6. Submit for detection
7. View results with severity analysis

### Admin Flow (Monitoring)
1. Select "Monitor & Manage" on home page
2. Login/Signup as admin
3. View dashboard with:
   - Real-time statistics
   - Severity distribution chart (pie chart)
   - Sortable/filterable reports table
   - Interactive map of pothole locations
   - Location-based image gallery

---

## Features Implemented

### ✅ Core Features
- [x] Email/password authentication with role-based access (User/Admin)
- [x] Pothole image detection using Roboflow YOLOv8
- [x] GPS coordinate capture and mapping (Leaflet)
- [x] Advanced severity scoring (multi-factor calculation)
- [x] Status tracking (pending/resolved)
- [x] Location-based filtering and search

### ✅ Admin Features
- [x] Severity distribution chart (Recharts)
- [x] Sortable reports table (time, location, severity)
- [x] Interactive map showing all pothole locations
- [x] Location-based image gallery viewer
- [x] Mark reports as resolved/pending
- [x] Real-time statistics dashboard

---

## Severity Scoring Algorithm

The system calculates severity based on:
1. **Pothole Count** (40% weight): Number of potholes detected
2. **Pothole Size** (30% weight): Average bounding box dimensions
3. **Confidence** (30% weight): Average detection confidence

**Threat Levels:**
- **Safe** (0-20): Minimal risk
- **Low Risk** (20-40): Monitor for changes
- **Moderate Risk** (40-70): Schedule repair soon
- **High Risk** (70+): Urgent repair needed

---

## API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /login` - Login user

### Detection
- `POST /predict` - Upload image and detect potholes

### Admin
- `GET /all-reports` - Fetch all reports with filters
- `GET /reports-by-location/{location}` - Get images for specific location
- `PATCH /reports/{id}/status` - Update report status
- `GET /stats` - Get dashboard statistics

---

## File Structure

```
/app
  /auth             # Authentication pages
  /dashboard        # Admin dashboard
  /upload           # User upload interface
  /page.tsx         # Home page with role selection
  /layout.tsx       # Root layout

/components
  /ui               # shadcn/ui components
  /dashboard        # Dashboard-specific components
    severity-chart.tsx    # Pie chart for severity distribution
    location-map.tsx      # Leaflet map component
    report-table.tsx      # Reports data table
    image-gallery.tsx     # Image viewer component

/backend
  app.py            # Flask API server
  requirements.txt  # Python dependencies
  /uploads          # Uploaded images storage
  /data
    roadintel.db    # SQLite database
```

---

## Troubleshooting

### "Connection error" on Frontend
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is enabled (already configured in Flask)

### Geolocation not working
- Browser must have permission to access location
- Test with HTTPS or localhost
- Check browser console for permission errors

### Roboflow API errors
- Verify API key is correct and active
- Check API key has project access
- Ensure project ID matches your Roboflow project

### Database errors
- Delete `backend/data/roadintel.db` to reset
- Restart Flask server to reinitialize database

---

## Development Notes

- **Mock Predictions**: If Roboflow API fails, the system returns mock detection data for testing
- **Local Storage**: Auth state persists in browser localStorage
- **CORS**: Backend has CORS enabled for localhost:3000
- **Image Storage**: Uploaded images stored locally in `backend/uploads/`

---

## Deployment Considerations

For production:
1. Move to a cloud database (Supabase, AWS RDS, etc.)
2. Use environment variables from hosting platform
3. Implement proper error handling and logging
4. Add rate limiting on API endpoints
5. Use HTTPS and secure cookies
6. Implement proper password hashing (currently SHA-256)
7. Add request validation and sanitization

---

## Support & Resources

- Roboflow Docs: https://roboflow.com/docs
- Next.js Docs: https://nextjs.org/docs
- Flask Docs: https://flask.palletsprojects.com
- Leaflet Docs: https://leafletjs.com
- Recharts Docs: https://recharts.org

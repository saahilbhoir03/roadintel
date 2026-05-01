# 🚗 RoadIntel - Pothole Detection System

<div align="center">

### AI-Powered Pothole Detection & Real-Time Monitoring System

A full-stack application combining **Next.js 16** (Frontend), **Flask** (Backend), and **Roboflow YOLOv8** (AI Detection) to report, track, and manage road damage in real-time.

[Quick Start](#quick-start) • [Features](#features) • [Setup](#setup) • [Architecture](#architecture) • [Documentation](#documentation)

</div>

---

## 🎯 Overview

RoadIntel enables community members to report potholes from mobile devices while giving administrators comprehensive tools to track, analyze, and manage repairs. Using advanced AI detection, it automatically assesses severity and provides actionable insights.

**Problem Solved**: Fragmented pothole reporting → Centralized AI-powered monitoring system

---

## ✨ Key Features

### For Users (Reporters)
- 📱 **Easy Reporting**: Upload images with just a few clicks
- 🗺️ **GPS Tracking**: Automatic location capture (optional)
- ⚡ **Instant Analysis**: Real-time AI detection results
- 🎯 **Severity Assessment**: Automatic threat level classification
- 💾 **Report History**: Track all your submissions

### For Admins (Managers)
- 📊 **Analytics Dashboard**: Real-time statistics and metrics
- 📈 **Severity Charts**: Visual distribution of threat levels
- 🗺️ **Interactive Maps**: Geographic visualization of problem areas
- 📋 **Sortable Reports**: Filter by location, status, time, and severity
- 🖼️ **Image Galleries**: Browse all images from a specific location
- ✅ **Status Management**: Mark repairs as complete
- 🔍 **Location Search**: Find all reports for any area

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)
- Modern browser

### 30-Second Setup

```bash
# Terminal 1: Frontend
cd /vercel/share/v0-project
pnpm install
pnpm dev
# Opens http://localhost:3000

# Terminal 2: Backend
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### First Test
1. Go to http://localhost:3000
2. Choose "Report Potholes" or "Monitor & Manage"
3. Sign up with any email/password
4. Upload an image or view the dashboard
5. **It works without a Roboflow API key!** (Uses mock detection)

See [QUICKSTART.md](./QUICKSTART.md) for detailed instructions.

---

## 📋 Full Feature List

| Feature | Details | Status |
|---------|---------|--------|
| **User Authentication** | Email/password with role-based access | ✅ Complete |
| **Image Upload** | Drag-drop with preview | ✅ Complete |
| **AI Detection** | Roboflow YOLOv8 integration | ✅ Complete |
| **Severity Scoring** | Multi-factor algorithm | ✅ Complete |
| **GPS Capture** | HTML5 Geolocation API | ✅ Complete |
| **Status Tracking** | Pending/Resolved workflow | ✅ Complete |
| **Dashboard** | Real-time statistics | ✅ Complete |
| **Severity Chart** | Pie chart visualization | ✅ Complete |
| **Location Map** | Interactive Leaflet map | ✅ Complete |
| **Report Filtering** | By location, status, time | ✅ Complete |
| **Image Gallery** | Browse location-based images | ✅ Complete |
| **Responsive Design** | Mobile, tablet, desktop | ✅ Complete |

See [FEATURES.md](./FEATURES.md) for detailed feature breakdown.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js 16)              │
│  - Home Page (Role Selection)                        │
│  - Auth Page (Login/Signup)                          │
│  - Upload Page (Report Potholes)                     │
│  - Dashboard (Admin Analytics)                       │
└──────────────────┬──────────────────────────────────┘
                   │ (HTTP/JSON)
                   ↓
┌─────────────────────────────────────────────────────┐
│                 Backend (Flask API)                   │
│  - Authentication Endpoints                          │
│  - Image Upload & Processing                         │
│  - Roboflow YOLOv8 Integration                       │
│  - Severity Calculation                              │
│  - Admin Report Querying                             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│            Database (SQLite) & Storage               │
│  - Users & Authentication                            │
│  - Reports & Metadata                                │
│  - Image Files                                       │
└─────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 16 |
| **UI Components** | React | 19 |
| **Styling** | Tailwind CSS | 3.4 |
| **Charts** | Recharts | Latest |
| **Maps** | Leaflet | 1.9+ |
| **Backend** | Flask | 2.3 |
| **Database** | SQLite | 3 |
| **AI Model** | Roboflow YOLOv8 | Latest |

---

## 📁 Project Structure

```
RoadIntel/
├── app/
│   ├── page.tsx                    # Home page
│   ├── layout.tsx                  # Root layout
│   ├── auth/page.tsx               # Login/Signup
│   ├── upload/page.tsx             # User reporting
│   └── dashboard/page.tsx          # Admin dashboard
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   └── dashboard/                  # Dashboard components
│       ├── severity-chart.tsx
│       ├── location-map.tsx
│       ├── report-table.tsx
│       └── image-gallery.tsx
│
├── backend/
│   ├── app.py                      # Flask server
│   ├── requirements.txt            # Python deps
│   ├── uploads/                    # Image storage
│   └── data/
│       └── roadintel.db            # SQLite DB
│
└── Documentation/
    ├── README.md                   # This file
    ├── QUICKSTART.md               # 5-min setup
    ├── SETUP.md                    # Full setup
    ├── PROJECT_SUMMARY.md          # Complete overview
    └── FEATURES.md                 # Feature details
```

---

## 🔧 Setup & Configuration

### Frontend Setup
```bash
# Install dependencies
pnpm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start development server
pnpm dev
```

### Backend Setup
```bash
# Install dependencies
cd backend
pip install -r requirements.txt

# Configure environment (create .env file)
ROBOFLOW_API_KEY=your_api_key_here
ROBOFLOW_PROJECT_ID=pothole-detection-project
ROBOFLOW_VERSION=1

# Start server
python app.py
```

**Note**: The system works with mock data if you don't provide a Roboflow API key. [Get one free here](https://roboflow.com)

See [SETUP.md](./SETUP.md) for comprehensive setup instructions.

---

## 📊 Severity Scoring Algorithm

RoadIntel uses a sophisticated multi-factor algorithm to calculate severity:

```
Severity Score = 
  (Pothole Count × 40%) + 
  (Average Size × 30%) + 
  (Detection Confidence × 30%)

Result: 0-100 scale
```

**Threat Levels:**
- 🟢 **Safe** (0-20): No significant risk
- 🟡 **Low Risk** (20-40): Monitor and document
- 🟠 **Moderate Risk** (40-70): Plan repairs soon
- 🔴 **High Risk** (70+): Urgent attention needed

---

## 🔌 API Reference

### User Endpoints
```bash
POST /signup
  Body: { email, password, role }
  
POST /login
  Body: { email, password }
```

### Detection Endpoint
```bash
POST /predict
  Body: FormData { image, email, location, latitude, longitude }
  Response: { report_id, pothole_count, severity_score, threat_level }
```

### Admin Endpoints
```bash
GET /all-reports?status=pending&location=Main&sort=timestamp
GET /reports-by-location/{location}
PATCH /reports/{id}/status { status: "resolved" }
GET /stats
```

See [SETUP.md](./SETUP.md#api-endpoints) for full API documentation.

---

## 💻 Development

### Running Tests
```bash
# Frontend tests
pnpm test

# Backend tests
cd backend && python -m pytest
```

### Building for Production
```bash
# Frontend
pnpm build
pnpm start

# Backend
gunicorn --bind 0.0.0.0:5000 app:app
```

---

## 🌍 Deployment

RoadIntel is deployment-ready:

**Frontend**: Vercel, Netlify, AWS Amplify
- `pnpm build` creates optimized Next.js build

**Backend**: AWS Lambda, Heroku, DigitalOcean, AWS EC2
- Production-ready Flask configuration included

**Database**: Supabase, AWS RDS, CockroachDB
- SQLite → PostgreSQL migration guide in [SETUP.md](./SETUP.md)

See [SETUP.md](./SETUP.md#deployment-considerations) for production setup.

---

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes
- **[SETUP.md](./SETUP.md)** - Complete setup and deployment guide
- **[FEATURES.md](./FEATURES.md)** - Detailed feature breakdown
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Technical architecture
- **[/v0_plans/pragmatic-scheme.md](./v0_plans/pragmatic-scheme.md)** - Development plan

---

## 🛠️ Troubleshooting

### "Connection error" appears
- Verify backend is running: `curl http://localhost:5000/health`
- Check frontend env: `NEXT_PUBLIC_API_URL=http://localhost:5000`

### GPS not working
- Browser must grant location permission
- Works on localhost or HTTPS only

### No pothole detections
- Backend runs with mock data by default
- [Get Roboflow API key](https://roboflow.com) for real detections

### Database issues
- Delete `backend/data/roadintel.db` to reset
- Restart backend to reinitialize

---

## 🤝 Contributing

Contributions welcome! Areas for expansion:

- [ ] Real-time notifications
- [ ] Historical trend analysis
- [ ] Mobile native app (React Native/Expo)
- [ ] Automated work order creation
- [ ] Budget impact analysis
- [ ] Community voting on severity

---

## 📝 License

This project is open source and available for educational and community use.

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Roboflow Documentation](https://roboflow.com/docs)
- [Leaflet Maps](https://leafletjs.com)
- [Recharts Documentation](https://recharts.org)

---

## 📧 Support

For issues, questions, or suggestions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review documentation files
3. Check console logs in browser DevTools

---

<div align="center">

**Built with ❤️ for smarter cities**

[⬆ Back to Top](#-roadintel---pothole-detection-system)

</div>

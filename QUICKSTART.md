# RoadIntel - Quick Start (5 Minutes)

## The Fastest Way to Get Running

### Step 1: Clone/Download Project
```bash
# Already in project directory
cd /vercel/share/v0-project
```

### Step 2: Start the Frontend (Terminal 1)
```bash
pnpm install  # Only first time
pnpm dev
```
Open: `http://localhost:3000`

### Step 3: Start the Backend (Terminal 2)
```bash
cd backend
pip install -r requirements.txt  # Only first time
# Create .env file with:
#   ROBOFLOW_API_KEY=test_key
#   ROBOFLOW_PROJECT_ID=pothole-detection-project
#   ROBOFLOW_VERSION=1
python app.py
```
Backend: `http://localhost:5000`

---

## Test the App (No Real Roboflow Key Needed)

1. **Home Page** → Click "Continue as User" or "Continue as Admin"

2. **Login** → Sign up with any email/password
   - User role: Will upload potholes
   - Admin role: Will see dashboard

3. **User Mode - Upload Image**
   - Click "Report Potholes"
   - Select any image file
   - Enter location (e.g., "Main Street")
   - Click "Get GPS" (if browser allows)
   - Submit - You'll see mock detection results

4. **Admin Mode - View Dashboard**
   - Click "Monitor & Manage"
   - See:
     - Stats cards (Total Reports, Avg Severity, etc.)
     - Severity pie chart
     - Reports table with filtering/sorting
     - Interactive map (if GPS data exists)
     - Image gallery for each location

---

## Key Features to Try

### As User:
- Sign up / Login
- Upload image with location
- Capture GPS coordinates (Allow location access)
- See severity analysis (Safe/Low/Moderate/High Risk)
- View pothole count and confidence score

### As Admin:
- Sort reports by time, location, or severity
- Filter by status (Pending/Resolved)
- Click location name to see all images there
- Mark reports as "Resolved"
- View severity distribution chart
- See all locations on the map

---

## Mock API Response (Testing Without Roboflow)

If you don't have a Roboflow API key, the backend returns mock data:
```json
{
  "report_id": 1,
  "pothole_count": 2,
  "severity_score": 65.5,
  "threat_level": "Moderate Risk",
  "avg_confidence": 0.82,
  "location": "Main Street",
  "status": "pending"
}
```

To use real Roboflow:
1. Sign up at https://roboflow.com
2. Create/import pothole detection dataset
3. Add your API key to `backend/.env`

---

## Architecture Overview

```
User uploads image
        ↓
Frontend sends to Backend
        ↓
Roboflow API detects potholes
        ↓
Calculate severity score
        ↓
Save to SQLite database
        ↓
Admin dashboard queries database
        ↓
Display charts, maps, and reports
```

---

## File Locations

- **Frontend**: `/app` and `/components`
- **Backend**: `/backend/app.py`
- **Database**: `/backend/data/roadintel.db` (auto-created)
- **Images**: `/backend/uploads/` (auto-created)

---

## Next Steps

After running locally:
1. Try uploading different images
2. Create multiple reports from different locations
3. Test sorting and filtering
4. Check the map with GPS coordinates
5. Toggle report status between pending/resolved

For production, see `SETUP.md` for deployment instructions.

# 🚧 RoadIntel — AI-Based Road Damage Detection System

RoadIntel is a full-stack web application that detects potholes from images using AI and provides a dashboard for monitoring, analysis, and status tracking.

---

## 📌 Features

* 📷 Upload road images for analysis
* 🤖 AI-based pothole detection (YOLOv8 via Roboflow)
* 📊 Severity calculation based on detection results
* 📈 Admin dashboard with:

  * Total reports
  * Severity distribution
  * Pending vs Resolved tracking
* 🔍 Filtering & sorting by location and status
* 🗺️ Location-based visualization
* 🔄 Status management (Pending → Resolved)

---

## 🏗️ Tech Stack

**Frontend**

* Next.js (React)
* Tailwind CSS

**Backend**

* Flask (Python)
* REST API

**AI / ML**

* YOLOv8 (via Roboflow API)

**Database**

* SQLite

**Other Tools**

* OpenCV (image processing)
* Git & GitHub

---

## ⚙️ System Architecture

User → Frontend → Flask Backend → Roboflow API → SQLite → Dashboard

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/saahilbhoir03/roadintel.git
cd roadintel
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend runs on:

```
http://127.0.0.1:5000
```

---

### 3️⃣ Frontend Setup

```bash
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env` file in backend:

```
ROBOFLOW_API_KEY=your_api_key_here
```

---

## 📊 API Endpoints

| Endpoint               | Method | Description                      |
| ---------------------- | ------ | -------------------------------- |
| `/predict`             | POST   | Upload image and detect potholes |
| `/all-reports`         | GET    | Get all reports                  |
| `/stats`               | GET    | Get dashboard statistics         |
| `/reports/<id>/status` | PATCH  | Update report status             |

---

## 📸 Screenshots

(Add screenshots here for better presentation)

---

## 🎯 Future Improvements

* 📱 Mobile app integration
* 🌍 Live GPS tracking
* ☁️ Cloud database (Firebase/Supabase)
* ⚡ Offline model using YOLO `.pt`
* 🔔 Notification system

---

## 📚 Project Info

* **Project Name:** RoadIntel
* **Type:** BE Major Project
* **Domain:** AI + Web Development

---

## 👨‍💻 Author

**Sahil Bhoir**
GitHub: https://github.com/saahilbhoir03

---

## 📄 License

This project is for academic and educational purposes.

---

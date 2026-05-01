# RoadIntel - Feature Breakdown

## 🏠 Home Page (`/`)
**What**: Landing page with role selection
**Components**:
- Hero section with branding
- Two main cards: "Report Potholes" (User) and "Monitor & Manage" (Admin)
- Feature highlights section
- Login status display with logout option

**Key Actions**:
- Select role → Redirects to login/signup
- See login status if already authenticated
- Logout to start fresh

---

## 🔐 Authentication (`/auth`)
**What**: Login and signup interface
**Features**:
- Tabbed interface (Login / Sign Up)
- Email validation
- Password strength checking (6+ chars)
- Password confirmation
- Role-based registration
- Error and success messages
- Persistent authentication state

**Database Impact**:
- Creates user with hashed password
- Stores role (user/admin)
- Tracks creation timestamp

---

## 📤 User Upload Interface (`/upload`)
**What**: Main interface for reporting potholes
**Features**:
1. **Image Upload**
   - Drag-drop or click to upload
   - Image preview
   - Format validation (images only)

2. **Location Information**
   - Text input for location name
   - GPS coordinate capture button
   - Automatic GPS permission handling
   - Visual confirmation of GPS data

3. **Detection Results**
   - Real-time severity analysis
   - Threat level with color badge
   - Pothole count
   - Confidence score
   - Coordinates display
   - Report ID for tracking

**User Experience**:
- Single-page flow
- Visual feedback at each step
- Error handling with messages
- Logout option

**Database Impact**:
- Creates report with:
  - User email
  - Image file path
  - Location string
  - GPS coordinates
  - Pothole count
  - Severity score
  - Threat level
  - Status (pending)
  - Confidence average

---

## 📊 Admin Dashboard (`/dashboard`)
### Overview Tab
**What**: High-level dashboard statistics
**Metrics Displayed**:
- Total Reports (count)
- Average Severity (0-100)
- Pending Reports (yellow)
- Resolved Reports (green)
- Severity Distribution Pie Chart

**Interactivity**:
- Color-coded metrics
- Visual severity chart
- Real-time stat updates

### Reports Tab
**What**: Detailed report management interface
**Features**:

1. **Filters & Sorting**
   - Location search (text input)
   - Status filter (All / Pending / Resolved)
   - Sort options:
     - By Time (newest first)
     - By Location (A-Z)
     - By Severity (highest first)

2. **Reports Table**
   - Columns: Location | Potholes | Severity | Threat | Status | Time | Actions
   - Clickable location names → Opens image gallery
   - Color-coded threat level badges
   - Color-coded status badges
   - Mark as Resolved / Reopen buttons
   - Sortable data

3. **Pagination/Virtualization**
   - All data loaded initially
   - Client-side filtering for performance
   - Responsive column hiding on mobile

### Map Tab
**What**: Geospatial visualization
**Features**:
- Interactive Leaflet map
- Location markers with color-coded threat levels
- Auto-centered on report locations
- Popup on marker hover:
  - Location name
  - Pothole count
  - Threat level
- Fallback message if no GPS data

---

## 🖼️ Image Gallery Modal
**What**: Browse all images from a location
**Triggered By**: Clicking location name in reports table
**Features**:

1. **Main Image Viewer**
   - Large image display
   - Clickable for lightbox zoom
   - Error handling for missing images

2. **Report Details Panel**
   - Status badge
   - Threat level badge
   - Potholes count
   - Severity score
   - Recording timestamp

3. **Navigation**
   - Previous/Next buttons
   - Progress bar showing current image
   - Image counter (X of Y)
   - Thumbnail strip below

4. **Lightbox**
   - Full-screen image view
   - Click or X to close
   - Dark overlay background

---

## 📈 Severity Chart
**Component**: SeverityChart (Recharts PieChart)
**Location**: Dashboard > Overview Tab
**Data Source**: GET /stats endpoint
**Displays**:
- Pie chart of threat level distribution
- Color-coded by threat level:
  - Green: Safe
  - Yellow: Low Risk
  - Orange: Moderate Risk
  - Red: High Risk
- Percentage labels
- Interactive legend
- Hover tooltips

---

## 🗺️ Location Map
**Component**: LocationMap (Leaflet MapContainer)
**Location**: Dashboard > Map Tab
**Features**:
- OpenStreetMap tiles
- Circle markers for each report
- Color-coded by threat level
- Radius based on severity
- Popup information on click
- Auto-centered on data

**Fallback**: Message if no GPS coordinates

---

## 🔄 Database Operations

### User Registration
```sql
INSERT INTO users (email, password_hash, role, created_at)
VALUES (?, ?, ?, CURRENT_TIMESTAMP)
```

### Report Creation
```sql
INSERT INTO reports 
(user_email, image_path, location, latitude, longitude, 
 pothole_count, severity_score, threat_level, status, avg_confidence, timestamp)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP)
```

### Admin Queries
```sql
-- Get all reports with filters
SELECT * FROM reports 
WHERE status = ? AND location LIKE ?
ORDER BY timestamp DESC

-- Get all images for location
SELECT * FROM reports 
WHERE location LIKE ?
ORDER BY timestamp DESC

-- Get statistics
SELECT threat_level, COUNT(*) 
FROM reports 
GROUP BY threat_level
```

### Status Update
```sql
UPDATE reports 
SET status = ? 
WHERE id = ?
```

---

## 🛡️ Security Measures

1. **Authentication**
   - Password hashing (SHA-256)
   - Email uniqueness validation
   - Role-based access control

2. **API**
   - CORS enabled for localhost
   - Content-type validation
   - File size limits (16MB)

3. **Input Validation**
   - Email format checking
   - Password length validation
   - File type verification

4. **Database**
   - Parameterized queries (SQL injection prevention)
   - Indexed columns for efficient queries

---

## 📱 Responsive Design

**Breakpoints**:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Adaptations**:
- Single column on mobile
- Grid layout on desktop
- Touch-friendly buttons
- Scrollable tables
- Map fullscreen on mobile

---

## ♿ Accessibility

**Implemented**:
- Semantic HTML elements
- ARIA labels where needed
- Color contrast (WCAG AA)
- Keyboard navigation
- Screen reader support
- Alt text for images (where applicable)

---

## 🎨 Design System

**Colors**:
- Primary: Blue (#0066cc)
- Accent: Amber/Orange
- Success: Green
- Warning: Yellow
- Error: Red
- Neutral: Grays (slate-50 to slate-900)

**Typography**:
- Headings: Bold (font-bold)
- Body: Regular (font-normal)
- Mono: Code snippets

**Spacing**:
- Base unit: 0.25rem (1px)
- Uses Tailwind scale: p-4, gap-6, etc.

**Shadows & Effects**:
- backdrop-blur for glass effect
- Rounded corners: rounded-lg
- Hover state transitions

---

## ⚡ Performance Optimizations

1. **Frontend**
   - Image lazy loading
   - Debounced search
   - Client-side filtering
   - Local image caching

2. **Backend**
   - Database indexing
   - Connection pooling
   - Gzip compression

3. **General**
   - Minimal dependencies
   - Tree-shaking enabled
   - CSS bundling

---

## 🔗 Integration Points

**Roboflow API**:
- Endpoint: `https://detect.roboflow.com/{project}/{version}`
- Auth: API key in query params
- Returns: Prediction coordinates & confidence

**Leaflet Maps**:
- Tile source: OpenStreetMap
- Library: react-leaflet
- No API key required

**Recharts**:
- Chart type: Pie chart
- Data: Grouped counts by threat level

---

## 📝 State Management

**Frontend**:
- React hooks (useState, useEffect)
- localStorage for auth persistence
- Form state in component

**Backend**:
- Flask session (stateless)
- SQLite database for persistence

---

## Error Handling

**User Feedback**:
- Toast-like alerts (Alert component)
- Error messages for validation
- Success confirmations
- Loading states (Spinner)

**Common Errors Handled**:
- Missing API connection
- GPS permission denied
- Image upload failure
- Invalid credentials
- Database errors


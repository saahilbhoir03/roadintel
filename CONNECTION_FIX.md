# Fix: "Connection Error - Make Sure Backend Is Running"

## Quick Fix (3 Steps)

### Step 1: Kill Any Running Processes
```bash
# Kill anything running on port 5000
lsof -ti:5000 | xargs kill -9

# Or on Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Step 2: Start Backend Correctly
```bash
cd /vercel/share/v0-project/backend

# Install dependencies
pip install -r requirements.txt

# Run the Flask app
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Step 3: Start Frontend (New Terminal)
```bash
cd /vercel/share/v0-project

# Install if needed
pnpm install

# Run dev server
pnpm dev
```

You should see:
```
➜ Local: http://localhost:3000
```

---

## Verify It Works

1. **Check Backend is Running**
   - Visit: http://localhost:5000 in your browser
   - You should see some response (or a simple message)
   - Check browser console - no CORS errors

2. **Check Frontend can Reach Backend**
   - Open http://localhost:3000
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try to login
   - Look for requests to `http://localhost:5000/login`
   - Should see a successful response (not red)

3. **Check for Errors**
   - Browser Console: Look for any error messages
   - Backend Terminal: Should show request logs like:
     ```
     127.0.0.1 - - [time] "POST /login HTTP/1.1" 200 -
     ```

---

## Common Issues & Solutions

### Issue 1: "Connection Refused"
**Cause**: Backend not running or wrong port

**Fix**:
```bash
# Make sure backend is running
cd backend
python app.py

# If it says "Address already in use":
lsof -ti:5000 | xargs kill -9
python app.py
```

---

### Issue 2: "Address Already in Use" Error
**Cause**: Something else is using port 5000

**Fix**:
```bash
# List what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port (modify backend/app.py last line):
# Change: app.run(debug=True, port=5000)
# To: app.run(debug=True, port=5001)

# Then update frontend .env:
# NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

### Issue 3: CORS Error (Backend Receiving But Frontend Blocked)
**Cause**: Browser blocking cross-origin requests

**Signs**:
- Backend logs show the request came in
- Browser console shows CORS error
- Network tab shows response blocked

**Fix**: Already configured in backend! The line `CORS(app)` handles this. If still failing:
```bash
# Make sure you're using localhost, not 127.0.0.1
# Update backend:
app.run(debug=True, host='0.0.0.0', port=5000)
```

---

### Issue 4: Backend Starts But Freezes/Crashes
**Cause**: Missing dependencies or database issue

**Fix**:
```bash
cd backend

# Reinstall all dependencies fresh
pip install --upgrade pip
pip install -r requirements.txt

# Delete old database (it will recreate)
rm -rf data/roadintel.db

# Try running again
python app.py
```

---

### Issue 5: Frontend Shows "Make sure backend is running" but Backend IS Running
**Cause**: Frontend looking at wrong URL

**Fix**:
```bash
# 1. Check what URL frontend is trying to use
#    Look in app/auth/page.tsx around line 12:
#    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

# 2. If using custom port, set env var:
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# 3. Restart frontend:
pnpm dev
```

---

## Complete Debugging Checklist

- [ ] Backend terminal shows: `Running on http://127.0.0.1:5000`
- [ ] Frontend terminal shows: `Local: http://localhost:3000`
- [ ] Visit http://localhost:3000 - page loads
- [ ] Open DevTools (F12)
- [ ] Try to login
- [ ] Check Network tab - see request to `localhost:5000/login`
- [ ] Response status is 200/400/401 (not 0 or error)
- [ ] Backend terminal shows the request logged
- [ ] No CORS errors in browser console

---

## Ultra-Fast Start (Copy & Paste)

```bash
# Terminal 1 - Backend
cd /vercel/share/v0-project/backend
pip install -r requirements.txt
python app.py

# Terminal 2 - Frontend  
cd /vercel/share/v0-project
pnpm install
pnpm dev

# Then open: http://localhost:3000
```

If you get any errors after these exact steps, let me know the error message!

---

## Port Quick Reference

| Service | Port | URL | File to Check |
|---------|------|-----|---------------|
| Frontend | 3000 | http://localhost:3000 | package.json |
| Backend | 5000 | http://localhost:5000 | backend/app.py |

---

## Still Not Working?

Share these details:
1. What error do you see?
2. Output from backend terminal (copy-paste)
3. Browser console error (F12 → Console)
4. Network tab request details (F12 → Network → click the request)

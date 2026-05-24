# 🚀 CelebrationHub - START HERE!

## ✅ Setup Complete!

All configuration files have been created and dependencies installed:

- ✅ `backend/.env` - Backend configuration
- ✅ `web/.env` - Web app configuration  
- ✅ `mobile/.env` - Mobile app (IP: 192.168.0.105)
- ✅ All npm dependencies installed
- ✅ **Podman services configured and RUNNING** 🐳
  - MongoDB (port 27017)
  - Redis (port 6379)
  - MinIO (ports 9000, 9001)

---

## 🎯 QUICK START (Choose One)

### ⚡ Option 1: One-Click Start (Windows)

**Just double-click:** `START_ALL_TERMINALS.bat`

This automatically:
1. Starts Podman services (MongoDB, Redis, MinIO)
2. Opens Backend terminal
3. Opens Web terminal
4. Opens Mobile terminal

### 🖥️ Option 2: VS Code (Recommended for Development)

Open **3 terminals** in VS Code (`Ctrl + Shift + ~`):

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd web
npm run dev
```

**Terminal 3:**
```bash
cd mobile
npm start
```

---

## 🐳 Docker Desktop Required!

**IMPORTANT:** Docker Desktop must be running first!

1. **Check system tray** for Docker whale icon
2. If not running: **Launch "Docker Desktop"** from Start menu
3. Wait for icon to show "Docker Desktop is running"
4. Then start services above

### Start Docker Services Manually:
```bash
docker-compose up -d mongodb redis minio

# Verify running:
docker ps
```

---

## 🌐 Access Your Applications

Once all services are running:

| Service | URL | Purpose |
|---------|-----|---------|
| 🌐 **Web App** | **http://localhost:5173** | Main web interface |
| 🔧 **Backend API** | http://localhost:5000 | REST API |
| 📱 **Mobile (Expo)** | Scan QR in terminal | Mobile app dev |
| 🗄️ **MongoDB** | mongodb://localhost:27017 | Database |
| 🔴 **Redis** | localhost:6379 | Cache |
| 📦 **MinIO** | http://localhost:9001 | File storage |

---

## 📱 Running Mobile App on Your Phone

After running `npm start` in mobile folder:

**Step 1: Install Expo Go**
- **iOS**: App Store → Search "Expo Go" → Install
- **Android**: Play Store → Search "Expo Go" → Install

**Step 2: Connect**
- Make sure your phone is on **same WiFi** as computer
- Open Expo Go app
- **iOS**: Open Camera → Scan QR code from terminal
- **Android**: Open Expo Go → Scan QR code from terminal

**Step 3: Test**
- App loads on your phone!
- Try register/login
- Check backend terminal for OTP codes

### Alternative: Run in Browser
Press **`w`** in the Expo terminal to open web version

---

## 🧪 Testing the Apps

### Web App Test:
1. Open http://localhost:5173
2. Click **"Get Started"** or **"Register"**
3. Enter any phone: `+1234567890` or email
4. **Check backend terminal** for OTP (e.g., `OTP: 123456`)
5. Enter OTP → You're in!
6. Explore dashboard

### Mobile App Test:
1. Scan QR with Expo Go
2. Tap "Register"
3. Enter phone/email
4. **Check backend terminal** for OTP
5. Enter OTP → Explore app!

---

## ⚙️ Your Configuration

### Backend Environment
```
MongoDB: mongodb://localhost:27017/celebrationhub
Redis: localhost:6379
Port: 5000
OTP Mode: Console (check terminal for codes)
```

### Mobile Environment
```
API URL: http://192.168.0.105:5000
Your Computer IP: 192.168.0.105
```

**Note:** Your phone must be on same WiFi network!

---

## 🐛 Common Issues & Solutions

### "Docker is not available"
```bash
# Solution:
1. Launch Docker Desktop from Start menu
2. Wait 30-60 seconds for startup
3. Look for whale icon in system tray
4. Then run: docker-compose up -d mongodb redis minio
```

### "Cannot connect to MongoDB"
```bash
# Check if Docker containers are running:
docker ps

# Should see: mongodb, redis, minio

# If not, start them:
docker-compose up -d mongodb redis minio

# Check logs:
docker-compose logs mongodb
```

### "Port 5000 already in use"
```bash
# Find and kill process:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### "Mobile app: Network request failed"
- ✅ Backend must be running
- ✅ Use IP address (192.168.0.105) not localhost
- ✅ Phone and computer on same WiFi
- ✅ Check Windows Firewall (allow port 5000)

### "Module not found" errors
```bash
# Reinstall dependencies:
cd backend && npm install
cd ../web && npm install
cd ../mobile && npm install --legacy-peer-deps
```

---

## 📊 Health Checks

```bash
# Check Docker containers
docker ps

# Test backend API
curl http://localhost:5000/health

# Test MongoDB connection
docker exec -it celebrationhub-mongodb-1 mongosh --eval "db.version()"

# Test Redis
docker exec -it celebrationhub-redis-1 redis-cli ping
```

---

## 🛑 Stopping Everything

### Stop Applications:
- Press `Ctrl + C` in each terminal

### Stop Docker Services:
```bash
docker-compose down
```

### Quick Stop (Windows):
- Double-click: `STOP_ALL.bat`

---

## 📚 What's Next?

### Development Tasks:
1. **Backend**: Implement actual OTP sending (Twilio/email)
2. **Web**: Build event creation and details pages
3. **Mobile**: Add camera integration
4. **Database**: Create all Mongoose models
5. **Real-time**: Implement Socket.IO chat

### Documentation:
- `docs/ARCHITECTURE.md` - System design
- `docs/API.md` - API endpoints (50+)
- `docs/DATABASE.md` - Database schemas (14 collections)
- `docs/DEPLOYMENT.md` - Production deployment
- `docs/MVP_ROADMAP.md` - 3-phase development plan

---

## 🎉 You're All Set!

Everything is configured and ready to go!

**Start Sequence:**
1. ✅ Check Docker Desktop is running
2. ✅ Run `START_ALL.bat` OR start manually in VS Code
3. ✅ Open http://localhost:5173
4. ✅ Start coding! 🚀

**Need Help?**
- Check `QUICKSTART.md` for detailed instructions
- Review `RUN_NOW.md` for additional info
- Check terminal logs for errors

---

**Happy Coding! 🎊**

# 🚀 Run CelebrationHub NOW!

## ✅ Status: All .env files created!

- ✅ `backend/.env` - Backend configuration with Docker MongoDB/Redis
- ✅ `web/.env` - Web app configuration
- ✅ `mobile/.env` - Mobile app with your IP: **192.168.0.105**

## 🐳 Docker Desktop is Starting...

Docker Desktop is launching in the background. Once it's ready (look for the whale icon in your system tray), the services will be available.

---

## 🎯 Quick Start Options

### Option 1: Automated Start (Easiest)

**Double-click: `START_ALL.bat`**

This will:
1. Start Docker services (MongoDB, Redis, MinIO)
2. Start Backend (new terminal)
3. Start Web App (new terminal)
4. Start Mobile App (new terminal)

### Option 2: Manual Start in VS Code

Open 3 terminals in VS Code:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Web:**
```bash
cd web
npm run dev
```

**Terminal 3 - Mobile:**
```bash
cd mobile
npm start
```

### Option 3: Start Docker Services First

If Docker Desktop shows "Running" in system tray:

```bash
# Start MongoDB, Redis, MinIO
docker-compose up -d mongodb redis minio

# Verify they're running
docker ps
```

Then start the apps (Option 1 or 2).

---

## 🌐 Access Your Apps

Once running:

| Service | URL |
|---------|-----|
| 🌐 Web App | **http://localhost:5173** |
| 🔧 Backend API | **http://localhost:5000** |
| 📱 Mobile (Expo) | Scan QR code or press `w` for web |
| 🗄️ MongoDB | mongodb://localhost:27017 |
| 🔴 Redis | localhost:6379 |
| 📦 MinIO Console | http://localhost:9001 (admin/password: minioadmin) |

---

## 📱 Running Mobile App

After `npm start` in mobile folder:

**On Your Phone (Recommended):**
1. Install "Expo Go" app from App Store/Play Store
2. Scan the QR code with your camera (iOS) or Expo Go app (Android)
3. App will load on your phone!

**In Browser:**
- Press **`w`** in terminal to open web version

**In Emulator:**
- Press **`a`** for Android emulator
- Press **`i`** for iOS simulator (Mac only)

---

## ⚙️ Configuration Details

### Backend (.env)
- **MongoDB**: mongodb://localhost:27017/celebrationhub
- **Redis**: localhost:6379
- **OTP Mode**: Console (check terminal for OTP codes)
- **CORS**: Allows localhost:5173 and your mobile IP

### Mobile (.env)
- **API URL**: http://192.168.0.105:5000
- Uses your computer's IP address so phone can connect
- Both devices must be on same WiFi network

---

## 🧪 Testing the Apps

### Web App (http://localhost:5173):
1. Click "Get Started" or "Register"
2. Enter phone number: `+1234567890` or email
3. Check backend terminal for OTP code (e.g., "OTP: 123456")
4. Enter OTP and login
5. Explore dashboard

### Mobile App:
1. Open Expo Go and scan QR code
2. Tap "Register"
3. Enter phone/email
4. Check backend terminal for OTP
5. Enter OTP and explore

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if Docker Desktop is running
docker ps

# If not showing containers, start them:
docker-compose up -d mongodb redis minio

# Check logs
docker-compose logs mongodb
```

### "Port 5000 already in use"
```bash
# Kill the process
netstat -ano | findstr :5000
# Find the PID, then:
taskkill /PID <PID> /F
```

### "Mobile app can't connect"
- Make sure backend is running
- Verify your IP is correct in `mobile/.env`
- Phone and computer must be on same WiFi
- Check Windows Firewall isn't blocking port 5000

### "Docker is not running"
- Look for Docker whale icon in system tray
- If not running, launch "Docker Desktop" from Start menu
- Wait 30-60 seconds for it to fully start
- Then run: `docker-compose up -d mongodb redis minio`

---

## 📊 Checking Status

```bash
# Check Docker containers
docker ps

# Check backend
curl http://localhost:5000/health

# Check MongoDB
docker exec -it celebrationhub-mongodb-1 mongosh

# Check Redis
docker exec -it celebrationhub-redis-1 redis-cli ping
```

---

## 🛑 Stopping Everything

**Quick Stop:**
- Double-click: `STOP_ALL.bat`
- Or press `Ctrl+C` in each terminal

**Stop Docker services:**
```bash
docker-compose down
```

---

## 🎉 You're Ready!

All configuration is complete. Just waiting for Docker Desktop to finish starting, then you can run everything!

**Next Steps:**
1. Wait for Docker Desktop whale icon to show "Running"
2. Run `START_ALL.bat` or start services manually
3. Open http://localhost:5173
4. Start building! 🚀

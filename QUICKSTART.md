# CelebrationHub - Quick Start Guide

## ✅ Dependencies Installed!

All npm packages have been successfully installed.

## 🚀 Running the Project in VS Code

### Option 1: Run Each Service Manually

Open **3 separate terminals** in VS Code (`Ctrl + Shift + ~` to split):

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Web:**
```bash
cd web
npm run dev
```
✅ Web app running on http://localhost:5173

**Terminal 3 - Mobile:**
```bash
cd mobile
npm start
```
✅ Expo DevTools will open
- Press **`a`** for Android emulator
- Press **`i`** for iOS simulator (Mac only)
- Press **`w`** for web browser
- Scan QR code with Expo Go app on your phone

---

## ⚙️ Configuration Required

### 1. Backend Environment (.env)

Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000

# MongoDB (Install MongoDB or use Docker)
MONGODB_URI=mongodb://localhost:27017/celebrationhub

# Redis (Install Redis or use Docker)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# Email (Optional - for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS (Optional - for OTP)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

### 2. Web Environment (.env)

Create `web/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Mobile Environment (.env)

Create `mobile/.env`:
```env
# Use your computer's IP address, not localhost
API_URL=http://192.168.1.100:5000
SOCKET_URL=http://192.168.1.100:5000
```

**To find your IP address:**
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` (look for inet)

---

## 📋 Prerequisites

### Required Services

You need MongoDB and Redis running. Choose one option:

**Option A: Docker (Easiest)**
```bash
# Start MongoDB + Redis + MinIO
docker-compose up -d mongodb redis minio
```

**Option B: Install Locally**
- Install MongoDB 7+: https://www.mongodb.com/try/download/community
- Install Redis 7+: https://redis.io/download

---

## 🏃 Step-by-Step First Run

1. **Create environment files:**
   ```bash
   # Backend
   cd backend
   copy .env.example .env
   # Edit .env with your settings
   
   # Web
   cd ../web
   copy .env.example .env
   
   # Mobile
   cd ../mobile
   copy .env.example .env
   ```

2. **Start database services:**
   ```bash
   # From project root
   docker-compose up -d mongodb redis
   ```
   
   OR start MongoDB and Redis manually if installed locally.

3. **Run the applications:**
   
   Open 3 terminals in VS Code:
   
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2
   cd web && npm run dev
   
   # Terminal 3
   cd mobile && npm start
   ```

4. **Test the web app:**
   - Open http://localhost:5173
   - Click "Get Started" to register
   - Enter phone/email and test OTP flow

5. **Test the mobile app:**
   - Install "Expo Go" app on your phone
   - Scan QR code from terminal
   - Test login/register flow

---

## 🛠️ Troubleshooting

### "Cannot connect to database"
- Make sure MongoDB is running: `docker-compose ps` or check if MongoDB service is running
- Check MONGODB_URI in backend/.env

### "Cannot connect to Redis"
- Make sure Redis is running: `docker-compose ps` or check if Redis service is running
- Check REDIS_HOST and REDIS_PORT in backend/.env

### "EADDRINUSE: Port already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Mobile app "Network request failed"
- Use your computer's IP address (not localhost) in mobile/.env
- Make sure backend is running
- Check firewall isn't blocking port 5000

### Expo "Command not found"
```bash
npm install -g expo-cli
# or use npx
npx expo start
```

---

## 📱 Testing Mobile App

### On Physical Device (Recommended):
1. Install "Expo Go" from App Store/Play Store
2. Run `npm start` in mobile folder
3. Scan QR code with phone camera (iOS) or Expo Go app (Android)

### On Emulator:
**Android:**
1. Install Android Studio
2. Set up Android Virtual Device (AVD)
3. Press **`a`** when Expo DevTools is running

**iOS (Mac only):**
1. Install Xcode
2. Install iOS Simulator
3. Press **`i`** when Expo DevTools is running

---

## 📂 Project URLs

| Service | URL |
|---------|-----|
| Web App | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Docs (coming soon) | http://localhost:5000/api-docs |
| MongoDB | mongodb://localhost:27017 |
| Redis | localhost:6379 |
| MinIO Console | http://localhost:9001 |

---

## 🎯 Next Steps

1. **Backend**: Implement the actual OTP sending logic (currently mocked)
2. **Web**: Build out event creation and detail pages
3. **Mobile**: Add camera integration and push notifications
4. **Database**: Implement all Mongoose models from docs/DATABASE.md
5. **Real-time**: Connect Socket.IO for live chat

---

## 📚 Documentation

- **Architecture**: `docs/ARCHITECTURE.md`
- **API Endpoints**: `docs/API.md`
- **Database Schema**: `docs/DATABASE.md`
- **Deployment**: `docs/DEPLOYMENT.md`
- **Roadmap**: `docs/MVP_ROADMAP.md`

---

## 🐛 Getting Help

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review the error messages carefully
3. Check logs in terminal
4. Verify all environment variables are set

---

**Ready to build! 🎉**

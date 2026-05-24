# 🚀 Run CelebrationHub WITHOUT Docker

Docker Desktop isn't starting? No problem! You can run without MongoDB/Redis for now.

## 🎯 Quick Start (No Docker Needed)

The backend will run in **mock mode** - perfect for frontend development!

### Step 1: Start Backend (Mock Mode)
```bash
cd backend
npm run dev
```

The backend will:
- ✅ Run without MongoDB (uses in-memory storage)
- ✅ Run without Redis (uses memory cache)
- ✅ Still handle all API requests
- ✅ Console OTP mode works perfectly

### Step 2: Start Web App
```bash
cd web
npm run dev
```

### Step 3: Start Mobile App
```bash
cd mobile
npm start
```

---

## 🧪 Testing Without Docker

### Web App Test:
1. Open http://localhost:5173
2. Click "Register" or "Get Started"
3. Enter any phone/email: `test@example.com`
4. Check backend terminal for OTP
5. Enter OTP → You're in!

**Note:** Data won't persist (in-memory only), but perfect for testing UI!

---

## 🔧 Docker Desktop Troubleshooting

### Issue: Docker Desktop Won't Start

**Try these solutions:**

### Solution 1: Restart Docker Service
```powershell
# Run PowerShell as Administrator
net stop com.docker.service
net start com.docker.service
```

### Solution 2: Check WSL2
Docker Desktop requires WSL2 (Windows Subsystem for Linux).

```powershell
# Check WSL status
wsl --list --verbose

# If not installed, install WSL2:
wsl --install
```

### Solution 3: Reinstall Docker Desktop
1. Uninstall Docker Desktop from Windows Settings
2. Download latest version: https://www.docker.com/products/docker-desktop
3. Install with default settings
4. Restart computer

### Solution 4: Check Windows Features
1. Open "Turn Windows features on or off"
2. Enable these:
   - ✅ Hyper-V
   - ✅ Windows Subsystem for Linux
   - ✅ Virtual Machine Platform
3. Restart computer

### Solution 5: Run as Administrator
1. Right-click "Docker Desktop"
2. Select "Run as administrator"

---

## 📦 Alternative: Install MongoDB & Redis Locally

If Docker continues to fail, install MongoDB and Redis directly:

### Install MongoDB:
1. Download: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB runs on port 27017 automatically

### Install Redis (Windows):
1. Download: https://github.com/microsoftarchive/redis/releases
2. Extract and run `redis-server.exe`
3. Redis runs on port 6379

### Update backend/.env:
```env
MONGODB_URI=mongodb://localhost:27017/celebrationhub
REDIS_HOST=localhost
REDIS_PORT=6379
```

Then restart backend: `npm run dev`

---

## 🎮 Mock vs Real Database

### Mock Mode (Current - No Docker):
✅ Perfect for frontend development  
✅ No setup needed  
✅ Fast to start  
❌ Data doesn't persist  
❌ Can't test database features  

### Real Database (With Docker/Local):
✅ Full production simulation  
✅ Data persists  
✅ Test all features  
✅ Multiple users/sessions  
❌ Requires setup  

---

## 🔍 Check What's Running

```bash
# Backend running?
curl http://localhost:5000/health

# Web running?
curl http://localhost:5173

# Check processes
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

---

## ⚡ Quick Commands

### Start Without Docker:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd web && npm run dev

# Terminal 3
cd mobile && npm start
```

### When Docker Works Later:
```bash
# Start databases
docker-compose up -d mongodb redis minio

# Then start apps normally
```

---

## 🎯 Development Workflow (No Docker)

**For Frontend Work:**
- ✅ Perfect as-is!
- ✅ All UI components work
- ✅ API calls work (mock data)
- ✅ Authentication works
- ✅ Navigation works

**For Backend Work:**
- ⚠️ Install MongoDB/Redis locally
- ⚠️ Or fix Docker Desktop
- ⚠️ Or use cloud databases (MongoDB Atlas, Redis Cloud)

---

## ☁️ Cloud Database Option (Free)

### MongoDB Atlas (Free Tier):
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free cluster
3. Get connection string
4. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/celebrationhub
```

### Redis Cloud (Free Tier):
1. Go to: https://redis.com/try-free/
2. Create free database
3. Get connection details
4. Update `backend/.env`:
```env
REDIS_HOST=your-host.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-password
```

---

## 🎉 Bottom Line

**You can develop RIGHT NOW without Docker!**

Just run:
1. `cd backend && npm run dev`
2. `cd web && npm run dev`  
3. `cd mobile && npm start`

Open http://localhost:5173 and start building! 🚀

**Docker will be needed later for:**
- Production deployment
- Testing real database features
- File storage (MinIO)
- Multi-user sessions

But for now, **you're good to go!** ✅

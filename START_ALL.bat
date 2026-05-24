@echo off
echo Starting CelebrationHub...
echo.

echo [1/4] Starting Docker services...
docker-compose up -d mongodb redis minio
echo.

echo [2/4] Starting Backend...
start cmd /k "cd backend && npm run dev"
timeout /t 5 /nobreak > nul
echo.

echo [3/4] Starting Web App...
start cmd /k "cd web && npm run dev"
timeout /t 3 /nobreak > nul
echo.

echo [4/4] Starting Mobile App...
start cmd /k "cd mobile && npm start"
echo.

echo ========================================
echo CelebrationHub Started!
echo ========================================
echo.
echo Web App:     http://localhost:5173
echo Backend API: http://localhost:5000
echo Mobile:      Check Expo DevTools
echo.
echo Press any key to exit...
pause > nul

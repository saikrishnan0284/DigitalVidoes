@echo off
echo ========================================
echo  Starting CelebrationHub Services
echo  Opening 3 separate terminal windows...
echo ========================================
echo.

REM Start Podman services first
echo Starting Podman services (MongoDB, Redis, MinIO)...
podman start celebrationhub-mongo celebrationhub-redis celebrationhub-minio 2>nul
timeout /t 3 /nobreak > nul

REM Start Backend in new window
start "CelebrationHub Backend" cmd /k "cd /d %~dp0backend && npm run dev"

REM Wait 3 seconds
timeout /t 3 /nobreak > nul

REM Start Web in new window
start "CelebrationHub Web" cmd /k "cd /d %~dp0web && npm run dev"

REM Wait 2 seconds
timeout /t 2 /nobreak > nul

REM Start Mobile in new window
start "CelebrationHub Mobile" cmd /k "cd /d %~dp0mobile && npm start"

echo.
echo ========================================
echo  All services started in separate windows!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Web:      http://localhost:5173
echo Mobile:   Scan QR code from Expo window
echo.
echo Press any key to close this window...
pause > nul

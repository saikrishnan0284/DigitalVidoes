@echo off
echo ====================================
echo Starting CelebrationHub Services
echo Using Podman
echo ====================================
echo.

REM Start services if not running
podman start celebrationhub-mongo 2>nul || echo MongoDB already running or starting...
podman start celebrationhub-redis 2>nul || echo Redis already running or starting...
podman start celebrationhub-minio 2>nul || echo MinIO already running or starting...

echo.
echo Waiting for services to be ready...
timeout /t 3 /nobreak >nul

echo.
echo ====================================
echo Service Status:
echo ====================================
podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo ====================================
echo Services Ready!
echo ====================================
echo MongoDB:       mongodb://localhost:27017
echo Redis:         localhost:6379
echo MinIO API:     http://localhost:9000
echo MinIO Console: http://localhost:9001
echo   Username: minioadmin
echo   Password: minioadmin
echo ====================================
echo.
echo You can now start your backend:
echo   cd backend ^&^& npm run dev
echo.
pause

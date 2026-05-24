@echo off
echo ====================================
echo Starting CelebrationHub Docker Services
echo ====================================
echo.
echo Starting MongoDB, Redis, and MinIO...
echo.

docker-compose up -d mongodb redis minio

echo.
echo ====================================
echo Checking service status...
echo ====================================
docker ps --filter "name=celebrationhub"

echo.
echo ====================================
echo Services Started!
echo ====================================
echo MongoDB:  mongodb://localhost:27017
echo Redis:    localhost:6379
echo MinIO API: http://localhost:9000
echo MinIO Console: http://localhost:9001
echo   Username: minioadmin
echo   Password: minioadmin
echo ====================================
pause

@echo off
echo ====================================
echo Recreating Podman Containers
echo ====================================
echo.
echo This will:
echo 1. Stop existing containers
echo 2. Remove containers
echo 3. Recreate all services
echo.
echo WARNING: Data will be preserved in volumes
echo.
pause

echo.
echo Stopping containers...
podman stop celebrationhub-mongo celebrationhub-redis celebrationhub-minio 2>nul

echo Removing containers...
podman rm celebrationhub-mongo celebrationhub-redis celebrationhub-minio 2>nul

echo Creating network...
podman network create celebrationhub-network 2>nul

echo.
echo Creating MongoDB container...
podman run -d ^
  --name celebrationhub-mongo ^
  --network celebrationhub-network ^
  -p 27017:27017 ^
  -e MONGO_INITDB_ROOT_USERNAME=admin ^
  -e MONGO_INITDB_ROOT_PASSWORD=password ^
  -e MONGO_INITDB_DATABASE=celebrationhub ^
  -v mongodb_data:/data/db ^
  -v mongodb_config:/data/configdb ^
  --restart unless-stopped ^
  mongo:7.0

echo Creating Redis container...
podman run -d ^
  --name celebrationhub-redis ^
  --network celebrationhub-network ^
  -p 6379:6379 ^
  -v redis_data:/data ^
  --restart unless-stopped ^
  redis:7-alpine redis-server --appendonly yes

echo Creating MinIO container...
podman run -d ^
  --name celebrationhub-minio ^
  --network celebrationhub-network ^
  -p 9000:9000 ^
  -p 9001:9001 ^
  -e MINIO_ROOT_USER=minioadmin ^
  -e MINIO_ROOT_PASSWORD=minioadmin ^
  -v minio_data:/data ^
  --restart unless-stopped ^
  minio/minio:latest server /data --console-address ":9001"

echo.
echo Waiting for services to start...
timeout /t 5 /nobreak >nul

echo.
echo ====================================
echo Containers Recreated!
echo ====================================
podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo ====================================
echo Services Ready!
echo ====================================
pause

# 🐳 CelebrationHub with Podman

This project is now configured to use **Podman** instead of Docker Desktop!

## ✅ Current Status

All services are **RUNNING** with Podman:
- ✅ **MongoDB** (port 27017) - Database
- ✅ **Redis** (port 6379) - Caching & sessions
- ✅ **MinIO** (ports 9000, 9001) - S3-compatible storage

## 🚀 Quick Start

### Start All Services
```bash
START_PODMAN_SERVICES.bat
```
or
```bash
podman start celebrationhub-mongo celebrationhub-redis celebrationhub-minio
```

### Start Application
```bash
START_ALL_TERMINALS.bat
```
This will:
1. Start Podman services (if not running)
2. Start Backend (Terminal 1)
3. Start Web (Terminal 2)
4. Start Mobile (Terminal 3)

## 📋 Service Management

### Check Status
```bash
PODMAN_STATUS.bat
```
or
```bash
podman ps -a --filter "name=celebrationhub"
```

### Stop Services
```bash
STOP_PODMAN_SERVICES.bat
```
or
```bash
podman stop celebrationhub-mongo celebrationhub-redis celebrationhub-minio
```

### View Logs
```bash
# MongoDB logs
podman logs celebrationhub-mongo

# Redis logs
podman logs celebrationhub-redis

# MinIO logs
podman logs celebrationhub-minio

# Follow logs (real-time)
podman logs -f celebrationhub-mongo
```

## 🔧 Service Details

### MongoDB
- **Container**: celebrationhub-mongo
- **Port**: 27017
- **Connection**: `mongodb://localhost:27017/celebrationhub`
- **Admin**: Username: `admin`, Password: `password`
- **Data Volume**: mongodb_data

### Redis
- **Container**: celebrationhub-redis
- **Port**: 6379
- **Connection**: `localhost:6379`
- **Persistence**: Enabled (AOF)
- **Data Volume**: redis_data

### MinIO
- **Container**: celebrationhub-minio
- **API Port**: 9000
- **Console**: http://localhost:9001
- **Credentials**: 
  - Username: `minioadmin`
  - Password: `minioadmin`
- **Data Volume**: minio_data

## 💾 Data Persistence

All data is stored in Podman volumes and persists across container restarts:
- `mongodb_data` - MongoDB database files
- `mongodb_config` - MongoDB configuration
- `redis_data` - Redis data and snapshots
- `minio_data` - MinIO object storage

### List Volumes
```bash
podman volume ls | grep celebrationhub
```

### Backup Data
```bash
# MongoDB backup
podman exec celebrationhub-mongo mongodump --out=/data/backup

# Redis backup
podman exec celebrationhub-redis redis-cli BGSAVE
```

## 🔄 Container Lifecycle

### Restart Services
```bash
podman restart celebrationhub-mongo celebrationhub-redis celebrationhub-minio
```

### Remove Containers (keeps volumes)
```bash
podman rm -f celebrationhub-mongo celebrationhub-redis celebrationhub-minio
```

### Recreate from Scratch
```bash
# Stop and remove
podman rm -f celebrationhub-mongo celebrationhub-redis celebrationhub-minio

# Remove volumes (WARNING: deletes all data!)
podman volume rm mongodb_data mongodb_config redis_data minio_data

# Recreate network
podman network create celebrationhub-network

# Run the containers again (see RECREATE_PODMAN.bat)
```

## 🆚 Podman vs Docker

### Why Podman?
- ✅ No daemon required (rootless by default)
- ✅ Better security (runs as regular user)
- ✅ Compatible with Docker CLI commands
- ✅ Lightweight (no Docker Desktop overhead)
- ✅ Native integration with WSL on Windows

### Differences
- `docker ps` → `podman ps`
- `docker-compose` → `podman-compose` (optional)
- No Docker Desktop GUI (use Podman Desktop if needed)

## 🐛 Troubleshooting

### Services won't start
```bash
# Check Podman machine status
podman machine list

# Start Podman machine if stopped
podman machine start podman-machine-default

# Check for port conflicts
netstat -an | findstr "27017 6379 9000"
```

### Can't connect to MongoDB
```bash
# Check if container is running
podman ps | grep mongo

# Check logs for errors
podman logs celebrationhub-mongo

# Verify port is exposed
podman port celebrationhub-mongo
```

### Can't connect to Redis
```bash
# Test connection from container
podman exec celebrationhub-redis redis-cli ping

# Should return: PONG
```

### MinIO console not accessible
```bash
# Check if both ports are exposed
podman ps | grep minio

# Should show: 0.0.0.0:9000-9001->9000-9001/tcp
```

### Reset everything
```bash
# Nuclear option - removes everything including data
podman rm -f celebrationhub-mongo celebrationhub-redis celebrationhub-minio
podman volume rm mongodb_data mongodb_config redis_data minio_data
podman network rm celebrationhub-network

# Then run START_PODMAN_SERVICES.bat to recreate
```

## 📚 Additional Resources

- Podman Documentation: https://docs.podman.io/
- Podman Desktop: https://podman-desktop.io/
- MongoDB with Podman: https://www.mongodb.com/compatibility/docker
- Redis with Podman: https://redis.io/docs/getting-started/

## 🎯 Next Steps

1. ✅ Services are running
2. Start your backend: `cd backend && npm run dev`
3. Start your web app: `cd web && npm run dev`
4. Start mobile: `cd mobile && npm start`

**Happy coding! 🎉**

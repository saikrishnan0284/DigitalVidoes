# CelebrationHub - Production Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Infrastructure Setup](#infrastructure-setup)
4. [Docker Deployment](#docker-deployment)
5. [Database Setup](#database-setup)
6. [Application Deployment](#application-deployment)
7. [Nginx Configuration](#nginx-configuration)
8. [SSL/HTTPS Setup](#sslhttps-setup)
9. [Environment Variables](#environment-variables)
10. [PM2 Process Management](#pm2-process-management)
11. [Monitoring & Logging](#monitoring--logging)
12. [Backups](#backups)
13. [CI/CD Pipeline](#cicd-pipeline)
14. [Scaling](#scaling)
15. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers deploying CelebrationHub to a production environment using Docker, Nginx, and PM2.

### Deployment Architecture

```
Internet
    │
    ▼
[DNS] → celebrationhub.com
    │
    ▼
[Cloudflare CDN/DDoS Protection]
    │
    ▼
[Load Balancer / Nginx]
    │
    ├──► [Web App - Static Files]
    │
    ├──► [API Server - Node.js/PM2]
    │     │
    │     ├──► [MongoDB Replica Set]
    │     ├──► [Redis Cluster]
    │     ├──► [MinIO/S3 Storage]
    │     └──► [Bull Queue Workers]
    │
    └──► [Socket.IO Server]
```

---

## Prerequisites

### Server Requirements

**Minimum (Development/Staging):**
- CPU: 2 vCPUs
- RAM: 4GB
- Storage: 50GB SSD
- OS: Ubuntu 22.04 LTS

**Recommended (Production):**
- CPU: 4+ vCPUs
- RAM: 8GB+
- Storage: 100GB+ SSD
- OS: Ubuntu 22.04 LTS

### Software Requirements

- Node.js 20+ LTS
- MongoDB 6+
- Redis 7+
- Docker 24+ & Docker Compose
- Nginx 1.24+
- PM2 (Process Manager)
- Git

### Domain & SSL

- Domain name configured with DNS
- SSL certificate (Let's Encrypt recommended)

---

## Infrastructure Setup

### 1. Server Provisioning

Choose a cloud provider:
- **AWS**: EC2, RDS, ElastiCache, S3
- **DigitalOcean**: Droplets, Managed Databases
- **Azure**: VMs, Cosmos DB, Redis Cache
- **Google Cloud**: Compute Engine, Cloud SQL

### 2. Initial Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git build-essential

# Create application user
sudo adduser celebrationhub
sudo usermod -aG sudo celebrationhub

# Switch to application user
sudo su - celebrationhub
```

### 3. Install Node.js

```bash
# Install Node.js 20 LTS via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node --version  # Should output v20.x.x
npm --version
```

### 4. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 5. Install PM2

```bash
npm install -g pm2

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/home/celebrationhub/.nvm/versions/node/v20.x.x/bin pm2 startup systemd -u celebrationhub --hp /home/celebrationhub
```

---

## Docker Deployment

### 1. Project Structure

```
CelebrationHub/
├── docker/
│   ├── backend.Dockerfile
│   ├── web.Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── docker-compose.prod.yml
└── .env.production
```

### 2. Backend Dockerfile

Create `docker/backend.Dockerfile`:

```dockerfile
# Multi-stage build for smaller image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY backend/ .

# Build TypeScript (if using)
# RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy dependencies and code from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 5000

CMD ["node", "src/server.js"]
```

### 3. Web Dockerfile

Create `docker/web.Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY web/package*.json ./
RUN npm ci

COPY web/ .

# Build production bundle
RUN npm run build

# Production stage - Nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx-web.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 4. Docker Compose Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  # MongoDB
  mongodb:
    image: mongo:6
    container_name: celebrationhub-mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_DATABASE}
    volumes:
      - mongodb_data:/data/db
      - mongodb_config:/data/configdb
    ports:
      - "27017:27017"
    networks:
      - celebrationhub-network
    command: mongod --replSet rs0 --bind_ip_all

  # Redis
  redis:
    image: redis:7-alpine
    container_name: celebrationhub-redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - celebrationhub-network

  # MinIO (S3-compatible storage)
  minio:
    image: minio/minio:latest
    container_name: celebrationhub-minio
    restart: always
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    networks:
      - celebrationhub-network
    command: server /data --console-address ":9001"

  # Backend API
  backend:
    build:
      context: .
      dockerfile: docker/backend.Dockerfile
    container_name: celebrationhub-backend
    restart: always
    env_file:
      - .env.production
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
      - redis
      - minio
    networks:
      - celebrationhub-network
    volumes:
      - ./backend/logs:/app/logs

  # Web Application
  web:
    build:
      context: .
      dockerfile: docker/web.Dockerfile
    container_name: celebrationhub-web
    restart: always
    ports:
      - "3000:80"
    networks:
      - celebrationhub-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: celebrationhub-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - backend
      - web
    networks:
      - celebrationhub-network

volumes:
  mongodb_data:
  mongodb_config:
  redis_data:
  minio_data:

networks:
  celebrationhub-network:
    driver: bridge
```

### 5. Deploy with Docker Compose

```bash
# Clone repository
git clone <repository-url>
cd CelebrationHub

# Copy environment variables
cp .env.example .env.production
nano .env.production  # Edit with production values

# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

---

## Database Setup

### MongoDB Configuration

#### 1. Initialize Replica Set

```bash
# Connect to MongoDB container
docker exec -it celebrationhub-mongodb mongosh -u admin -p <password>

# Initialize replica set
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongodb:27017" }
  ]
})

# Verify replica set status
rs.status()
```

#### 2. Create Application Database

```javascript
// Switch to application database
use celebrationhub

// Create application user
db.createUser({
  user: "celebrationhub_user",
  pwd: "<strong-password>",
  roles: [
    { role: "readWrite", db: "celebrationhub" }
  ]
})
```

#### 3. Create Indexes

```bash
# Run index creation script
cd backend
node scripts/create-indexes.js
```

Example `scripts/create-indexes.js`:

```javascript
const mongoose = require('mongoose');

async function createIndexes() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const db = mongoose.connection.db;
  
  // Users indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
  await db.collection('users').createIndex({ phone: 1 }, { unique: true });
  await db.collection('users').createIndex({ role: 1, isActive: 1 });
  
  // Events indexes
  await db.collection('events').createIndex({ creator: 1, createdAt: -1 });
  await db.collection('events').createIndex({ status: 1, startDate: 1 });
  await db.collection('events').createIndex({ 'location.coordinates': '2dsphere' });
  
  // Add more indexes...
  
  console.log('Indexes created successfully');
  process.exit(0);
}

createIndexes().catch(console.error);
```

### Redis Configuration

```bash
# Connect to Redis
docker exec -it celebrationhub-redis redis-cli -a <password>

# Test connection
PING
# Should return PONG

# Set max memory policy
CONFIG SET maxmemory-policy allkeys-lru
CONFIG SET maxmemory 2gb

# Save configuration
CONFIG REWRITE
```

---

## Application Deployment

### Method 1: Docker (Recommended)

Already covered in [Docker Deployment](#docker-deployment) section.

### Method 2: Manual Deployment with PM2

#### 1. Clone and Setup

```bash
# Clone repository
cd /home/celebrationhub
git clone <repository-url> app
cd app

# Install dependencies
cd backend
npm ci --only=production

cd ../web
npm ci
npm run build
```

#### 2. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'celebrationhub-api',
      script: 'backend/src/server.js',
      instances: 'max',  // Use all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: 'logs/api-error.log',
      out_file: 'logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10
    },
    {
      name: 'celebrationhub-worker',
      script: 'backend/src/workers/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      error_file: 'logs/worker-error.log',
      out_file: 'logs/worker-out.log',
      autorestart: true
    }
  ]
};
```

#### 3. Start with PM2

```bash
# Start applications
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# View status
pm2 status

# View logs
pm2 logs

# Monitor
pm2 monit
```

---

## Nginx Configuration

### Main Configuration

Create `/etc/nginx/nginx.conf`:

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;

    # Include virtual hosts
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### Site Configuration

Create `/etc/nginx/sites-available/celebrationhub.conf`:

```nginx
# Upstream servers
upstream api_backend {
    least_conn;
    server localhost:5000;
    # Add more backend servers for load balancing
    # server localhost:5001;
    # server localhost:5002;
}

upstream socket_backend {
    ip_hash;  # Sticky sessions for WebSockets
    server localhost:5000;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name celebrationhub.com www.celebrationhub.com;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name celebrationhub.com www.celebrationhub.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Maximum upload size
    client_max_body_size 100M;

    # Root for web application
    root /home/celebrationhub/app/web/dist;
    index index.html;

    # API endpoints
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Auth endpoints (stricter rate limiting)
    location /api/v1/auth/ {
        limit_req zone=auth_limit burst=3 nodelay;
        
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket for Socket.IO
    location /socket.io/ {
        proxy_pass http://socket_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket timeouts
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }

    # Static files with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Web app - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/celebrationhub.conf /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Enable on boot
sudo systemctl enable nginx
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Recommended)

#### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

#### 2. Obtain Certificate

```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Obtain certificate
sudo certbot certonly --standalone -d celebrationhub.com -d www.celebrationhub.com --email admin@celebrationhub.com --agree-tos

# Start Nginx
sudo systemctl start nginx
```

#### 3. Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Setup auto-renewal cron job
sudo crontab -e

# Add this line (runs twice daily)
0 0,12 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

### Using Custom SSL Certificate

```bash
# Copy certificate files
sudo cp fullchain.pem /etc/nginx/ssl/
sudo cp privkey.pem /etc/nginx/ssl/

# Set permissions
sudo chmod 600 /etc/nginx/ssl/privkey.pem
sudo chmod 644 /etc/nginx/ssl/fullchain.pem

# Reload Nginx
sudo systemctl reload nginx
```

---

## Environment Variables

### Production Environment File

Create `.env.production`:

```bash
# Application
NODE_ENV=production
PORT=5000
APP_NAME=CelebrationHub
APP_URL=https://celebrationhub.com

# Database
MONGODB_URI=mongodb://celebrationhub_user:password@localhost:27017/celebrationhub?replicaSet=rs0&authSource=admin
MONGODB_MAX_POOL_SIZE=100

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OTP
OTP_EXPIRY=300
OTP_LENGTH=6

# Email (AWS SES)
EMAIL_FROM=noreply@celebrationhub.com
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY_ID=your_access_key
AWS_SES_SECRET_ACCESS_KEY=your_secret_key

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Storage (MinIO/S3)
STORAGE_TYPE=s3
S3_ENDPOINT=https://minio.celebrationhub.com
S3_ACCESS_KEY=your_minio_access_key
S3_SECRET_KEY=your_minio_secret_key
S3_BUCKET=celebrationhub-media
S3_REGION=us-east-1

# CDN
CDN_URL=https://cdn.celebrationhub.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=/home/celebrationhub/app/logs

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Monitoring
SENTRY_DSN=https://your-sentry-dsn

# CORS
CORS_ORIGIN=https://celebrationhub.com,https://www.celebrationhub.com
```

### Secure Environment Variables

```bash
# Set restrictive permissions
chmod 600 .env.production

# Use environment variable management tools
# Option 1: dotenv-vault
npm install -g dotenv-vault
dotenv-vault login
dotenv-vault push

# Option 2: AWS Systems Manager Parameter Store
# Option 3: HashiCorp Vault
```

---

## PM2 Process Management

### Common Commands

```bash
# Start application
pm2 start ecosystem.config.js

# Stop application
pm2 stop celebrationhub-api

# Restart application
pm2 restart celebrationhub-api

# Reload (zero-downtime)
pm2 reload celebrationhub-api

# Delete from PM2
pm2 delete celebrationhub-api

# View logs
pm2 logs celebrationhub-api
pm2 logs celebrationhub-api --lines 100

# Monitor resources
pm2 monit

# List processes
pm2 list

# Save process list
pm2 save

# Resurrect saved processes
pm2 resurrect

# Update PM2
pm2 update
```

### Zero-Downtime Deployment

```bash
# Pull latest code
git pull origin main

# Install dependencies
cd backend
npm ci --only=production

# Reload with zero downtime
pm2 reload ecosystem.config.js

# Or use deployment script
pm2 deploy production update
```

### PM2 Web Dashboard

```bash
# Install PM2 Plus
pm2 plus

# Or use PM2 web interface
pm2 web
```

---

## Monitoring & Logging

### Application Logging

#### Winston Logger Setup

`backend/src/utils/logger.js`:

```javascript
const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(process.env.LOG_FILE_PATH, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(process.env.LOG_FILE_PATH, 'combined.log'),
      maxsize: 10485760,
      maxFiles: 10
    })
  ]
});

// Console logging for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### Log Rotation

```bash
# Install logrotate
sudo apt install logrotate

# Create logrotate configuration
sudo nano /etc/logrotate.d/celebrationhub

# Add configuration
/home/celebrationhub/app/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}

# Test logrotate
sudo logrotate -d /etc/logrotate.d/celebrationhub
```

### Monitoring with PM2

```bash
# Install PM2 metrics
npm install -g pm2-metrics

# Setup custom metrics
pm2 install pm2-server-monit

# View metrics
pm2 metrics
```

### External Monitoring

#### Sentry Error Tracking

```javascript
// backend/src/config/sentry.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
});

module.exports = Sentry;
```

#### Health Check Endpoint

```javascript
// backend/src/routes/health.js
router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK'
  };

  try {
    // Check database
    await mongoose.connection.db.admin().ping();
    health.database = 'Connected';

    // Check Redis
    await redis.ping();
    health.redis = 'Connected';

    res.json(health);
  } catch (error) {
    health.status = 'ERROR';
    health.error = error.message;
    res.status(503).json(health);
  }
});
```

### Uptime Monitoring

Use external services:
- **UptimeRobot** (Free tier available)
- **Pingdom**
- **StatusCake**

Configure to check `https://celebrationhub.com/health` every 5 minutes.

---

## Backups

### Database Backups

#### Automated MongoDB Backup Script

Create `scripts/backup-mongodb.sh`:

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/home/celebrationhub/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="celebrationhub_$DATE"
RETENTION_DAYS=14

# Create backup directory
mkdir -p $BACKUP_DIR

# Perform backup
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$BACKUP_NAME" --gzip

# Compress backup
cd $BACKUP_DIR
tar -czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"

# Remove old backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/$BACKUP_NAME.tar.gz" s3://celebrationhub-backups/mongodb/

echo "Backup completed: $BACKUP_NAME.tar.gz"
```

#### Setup Cron Job

```bash
# Make script executable
chmod +x scripts/backup-mongodb.sh

# Add to crontab (daily at 2 AM)
crontab -e

# Add line
0 2 * * * /home/celebrationhub/app/scripts/backup-mongodb.sh >> /home/celebrationhub/logs/backup.log 2>&1
```

### Redis Backups

Redis automatically creates RDB snapshots. Configure backup:

```bash
# Edit Redis configuration
docker exec -it celebrationhub-redis redis-cli -a <password>

# Configure snapshot frequency
CONFIG SET save "900 1 300 10 60 10000"
CONFIG REWRITE
```

### Media Backups

```bash
# Sync MinIO/S3 to backup location
aws s3 sync s3://celebrationhub-media s3://celebrationhub-backups/media/ --storage-class GLACIER
```

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run tests
        run: |
          cd backend
          npm test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/celebrationhub/app
            git pull origin main
            cd backend
            npm ci --only=production
            pm2 reload ecosystem.config.js
```

---

## Scaling

### Horizontal Scaling

#### 1. Multiple Backend Instances

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'celebrationhub-api',
    script: 'backend/src/server.js',
    instances: 4,  // Or 'max' for all CPU cores
    exec_mode: 'cluster'
  }]
};
```

#### 2. Load Balancer Configuration

Update Nginx upstream:

```nginx
upstream api_backend {
    least_conn;
    server 10.0.1.10:5000;  # Server 1
    server 10.0.1.11:5000;  # Server 2
    server 10.0.1.12:5000;  # Server 3
}
```

### Database Scaling

#### MongoDB Replica Set

```bash
# Add replica members
rs.add("mongodb-2:27017")
rs.add("mongodb-3:27017")
```

#### Read Replicas

```javascript
// Use read preference
mongoose.connect(MONGODB_URI, {
  readPreference: 'secondaryPreferred'
});
```

### Redis Scaling

#### Redis Cluster

Use Redis Cluster for horizontal scaling:

```bash
# Create Redis cluster
redis-cli --cluster create \
  10.0.1.10:6379 10.0.1.11:6379 10.0.1.12:6379 \
  --cluster-replicas 1
```

---

## Troubleshooting

### Common Issues

#### 1. Application Not Starting

```bash
# Check logs
pm2 logs celebrationhub-api --lines 50

# Check port availability
sudo lsof -i :5000

# Check environment variables
pm2 env 0
```

#### 2. Database Connection Issues

```bash
# Test MongoDB connection
mongosh "mongodb://localhost:27017/celebrationhub"

# Check MongoDB logs
docker logs celebrationhub-mongodb

# Verify network connectivity
telnet localhost 27017
```

#### 3. High Memory Usage

```bash
# Check memory usage
pm2 monit

# Restart with memory limit
pm2 restart celebrationhub-api --max-memory-restart 1G

# Check for memory leaks
node --inspect backend/src/server.js
```

#### 4. Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Reload configuration
sudo systemctl reload nginx
```

#### 5. SSL Certificate Expired

```bash
# Renew certificate
sudo certbot renew

# Check expiry
sudo certbot certificates
```

### Performance Optimization

```bash
# Enable Nginx caching
# Add to nginx.conf http block
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

# Monitor performance
pm2 install pm2-server-monit

# Database query optimization
# Enable MongoDB profiling
db.setProfilingLevel(1, { slowms: 100 })
```

---

**Production Checklist:**

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Database indexes created
- [ ] Backups automated
- [ ] Monitoring setup
- [ ] Logs rotation configured
- [ ] Firewall configured
- [ ] Rate limiting enabled
- [ ] Health checks working
- [ ] CI/CD pipeline tested

---

**Next**: See [MVP_ROADMAP.md](./MVP_ROADMAP.md) for development roadmap

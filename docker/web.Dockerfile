FROM node:20-alpine as builder

WORKDIR /app

# Install dependencies
COPY web/package*.json ./
RUN npm ci

# Copy application files
COPY web/ ./

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx-web.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

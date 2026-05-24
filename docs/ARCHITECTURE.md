# CelebrationHub - System Architecture

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Architecture](#database-architecture)
6. [Real-time Architecture](#real-time-architecture)
7. [Security Architecture](#security-architecture)
8. [Scalability & Performance](#scalability--performance)

## Overview

CelebrationHub is built as a microservices-inspired monolithic architecture with clear separation of concerns, designed to scale horizontally when needed.

### Core Principles
- **Mobile-first**: Optimized for mobile experience
- **Real-time**: Live updates using WebSockets
- **Scalable**: Horizontal scaling ready
- **Secure**: Industry-standard security practices
- **Performance**: Optimized for speed and efficiency

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Load Balancer                         │
│                        (Nginx/HAProxy)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
        ┌────────▼────────┐       ┌───────▼────────┐
        │   Web Server    │       │  API Gateway   │
        │   (Static)      │       │   (Node.js)    │
        └─────────────────┘       └───────┬────────┘
                                          │
                            ┌─────────────┼─────────────┐
                            │             │             │
                   ┌────────▼────┐  ┌────▼─────┐  ┌───▼────────┐
                   │   Express    │  │  Socket  │  │  Worker    │
                   │   Backend    │  │    IO    │  │   Queue    │
                   └────────┬─────┘  └────┬─────┘  └───┬────────┘
                            │             │             │
                     ┌──────┴──────┬──────┴──────┬──────┴─────┐
                     │             │             │            │
              ┌──────▼─────┐ ┌────▼────┐  ┌────▼────┐  ┌───▼────┐
              │  MongoDB   │ │  Redis  │  │  MinIO  │  │  Bull  │
              │  Primary   │ │  Cache  │  │ Storage │  │  Queue │
              └────────────┘ └─────────┘  └─────────┘  └────────┘
```

### Key Components

1. **Frontend Layer**
   - Web App (React + Vite)
   - Mobile App (React Native/Expo)
   - Progressive Web App (PWA)

2. **API Gateway Layer**
   - Express.js REST API
   - GraphQL API (optional)
   - Socket.IO WebSocket server

3. **Business Logic Layer**
   - Controllers
   - Services
   - Validators
   - Middlewares

4. **Data Layer**
   - MongoDB (Primary Database)
   - Redis (Cache & Session Store)
   - MinIO (Object Storage)

5. **Background Jobs**
   - Bull Queue
   - Email notifications
   - Push notifications
   - Media processing

## Frontend Architecture

### Web Application (React)

```
web/
├── src/
│   ├── app/
│   │   ├── App.jsx                 # Root component
│   │   ├── store.js                # Redux store
│   │   └── routes.jsx              # Route configuration
│   │
│   ├── components/
│   │   ├── common/                 # Reusable components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Card/
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── Navigation/
│   │   │
│   │   └── features/               # Feature-specific components
│   │       ├── EventCard/
│   │       ├── MediaFeed/
│   │       ├── ChatBox/
│   │       └── VendorCard/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── OTPVerify.jsx
│   │   ├── Events/
│   │   │   ├── EventList.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   └── CreateEvent.jsx
│   │   ├── Marketplace/
│   │   │   ├── VendorList.jsx
│   │   │   └── VendorProfile.jsx
│   │   └── Profile/
│   │
│   ├── store/                      # Redux state management
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── eventsSlice.js
│   │   │   ├── chatSlice.js
│   │   │   └── vendorSlice.js
│   │   └── middleware/
│   │       └── socketMiddleware.js
│   │
│   ├── services/                   # API services
│   │   ├── api.js                  # Axios instance
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   ├── chatService.js
│   │   └── vendorService.js
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   ├── useInfiniteScroll.js
│   │   └── useMediaUpload.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── styles/
```

### Mobile Application (React Native)

```
mobile/
├── src/
│   ├── App.js
│   │
│   ├── navigation/
│   │   ├── AppNavigator.js         # Main navigator
│   │   ├── AuthStack.js            # Auth screens
│   │   ├── MainStack.js            # Main app screens
│   │   └── TabNavigator.js         # Bottom tabs
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── OTPScreen.js
│   │   ├── home/
│   │   │   └── HomeScreen.js
│   │   ├── events/
│   │   │   ├── EventListScreen.js
│   │   │   ├── EventDetailScreen.js
│   │   │   └── CreateEventScreen.js
│   │   ├── marketplace/
│   │   │   ├── VendorListScreen.js
│   │   │   └── VendorProfileScreen.js
│   │   └── profile/
│   │       └── ProfileScreen.js
│   │
│   ├── components/                 # Same structure as web
│   ├── store/                      # Redux (shared logic)
│   ├── services/                   # API services
│   ├── hooks/                      # Custom hooks
│   └── utils/                      # Utilities
```

### State Management Strategy

Using **Redux Toolkit** for global state:

```javascript
// Store structure
{
  auth: {
    user: {},
    token: '',
    isAuthenticated: false
  },
  events: {
    list: [],
    current: {},
    loading: false
  },
  chat: {
    conversations: [],
    messages: {},
    onlineUsers: []
  },
  vendors: {
    list: [],
    current: {},
    filters: {}
  },
  ui: {
    theme: 'light',
    notifications: []
  }
}
```

## Backend Architecture

### Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js             # MongoDB connection
│   │   ├── redis.js                # Redis connection
│   │   ├── storage.js              # MinIO/S3 config
│   │   └── socket.js               # Socket.IO setup
│   │
│   ├── models/                     # Mongoose models
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── SubEvent.js
│   │   ├── Invitation.js
│   │   ├── Message.js
│   │   ├── Vendor.js
│   │   └── Booking.js
│   │
│   ├── controllers/                # Route controllers
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── chatController.js
│   │   └── vendorController.js
│   │
│   ├── routes/                     # API routes
│   │   ├── index.js                # Main router
│   │   ├── auth.routes.js
│   │   ├── event.routes.js
│   │   ├── chat.routes.js
│   │   └── vendor.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── validation.middleware.js # Input validation
│   │   ├── rateLimit.middleware.js # Rate limiting
│   │   ├── upload.middleware.js    # File upload
│   │   └── error.middleware.js     # Error handler
│   │
│   ├── services/                   # Business logic
│   │   ├── authService.js
│   │   ├── otpService.js
│   │   ├── emailService.js
│   │   ├── smsService.js
│   │   ├── eventService.js
│   │   ├── chatService.js
│   │   └── vendorService.js
│   │
│   ├── validators/                 # Joi validation schemas
│   │   ├── auth.validator.js
│   │   ├── event.validator.js
│   │   └── vendor.validator.js
│   │
│   ├── sockets/                    # Socket.IO handlers
│   │   ├── chatSocket.js
│   │   ├── eventSocket.js
│   │   └── notificationSocket.js
│   │
│   ├── utils/
│   │   ├── logger.js               # Winston logger
│   │   ├── jwt.js                  # JWT utilities
│   │   ├── helpers.js
│   │   └── constants.js
│   │
│   ├── jobs/                       # Background jobs
│   │   ├── emailQueue.js
│   │   ├── notificationQueue.js
│   │   └── mediaProcessing.js
│   │
│   ├── app.js                      # Express app setup
│   └── server.js                   # Server entry point
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── package.json
```

### API Design Pattern

Following RESTful principles with resource-based URLs:

```
/api/v1/
├── /auth
│   ├── POST   /register
│   ├── POST   /send-otp
│   ├── POST   /verify-otp
│   ├── POST   /refresh-token
│   └── POST   /logout
│
├── /users
│   ├── GET    /me
│   ├── PUT    /me
│   ├── GET    /:id
│   └── POST   /avatar
│
├── /events
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── DELETE /:id
│   ├── POST   /:id/sub-events
│   ├── POST   /:id/invitations
│   ├── POST   /:id/media
│   └── GET    /:id/rsvp
│
├── /chat
│   ├── GET    /conversations
│   ├── POST   /conversations
│   ├── GET    /conversations/:id/messages
│   └── POST   /messages
│
└── /vendors
    ├── GET    /
    ├── POST   /
    ├── GET    /:id
    ├── PUT    /:id
    ├── POST   /:id/reviews
    └── POST   /:id/bookings
```

## Database Architecture

### MongoDB Collections

1. **users**
   - User profiles
   - Authentication data
   - Preferences

2. **events**
   - Event details
   - Metadata
   - Settings

3. **sub_events**
   - Sub-event details
   - Timeline
   - Media references

4. **invitations**
   - Invitation records
   - RSVP status
   - Guest lists

5. **messages**
   - Chat messages
   - Media attachments
   - Read receipts

6. **vendors**
   - Business profiles
   - Services
   - Pricing

7. **bookings**
   - Booking records
   - Payment status
   - Confirmation details

8. **reviews**
   - Vendor reviews
   - Ratings
   - Comments

9. **media**
   - File metadata
   - Storage references
   - Access permissions

### Data Relationships

```
User ─┬─► Event (creator)
      ├─► Invitation (invitee)
      ├─► Message (sender)
      ├─► Vendor (owner)
      └─► Booking (customer)

Event ─┬─► SubEvent (parent)
       ├─► Invitation (event)
       ├─► Message (conversation)
       └─► Media (gallery)

Vendor ─┬─► Booking (service)
        └─► Review (subject)
```

### Indexing Strategy

```javascript
// Users
{ email: 1 }
{ phone: 1 }
{ createdAt: -1 }

// Events
{ creator: 1, createdAt: -1 }
{ status: 1, date: 1 }
{ 'location.coordinates': '2dsphere' }

// Messages
{ conversation: 1, createdAt: -1 }
{ sender: 1, createdAt: -1 }

// Vendors
{ 'location.coordinates': '2dsphere' }
{ category: 1, rating: -1 }
{ verified: 1, createdAt: -1 }
```

## Real-time Architecture

### Socket.IO Implementation

```javascript
// Connection flow
Client ─► [Authenticate] ─► [Join Rooms] ─► [Listen to Events]

// Room structure
- user:{userId}              // Personal notifications
- event:{eventId}            // Event updates
- chat:{conversationId}      // Chat messages
- vendor:{vendorId}          // Vendor updates
```

### Event Types

```javascript
// Client → Server
'message:send'
'event:update'
'typing:start'
'typing:stop'
'presence:online'
'presence:offline'

// Server → Client
'message:new'
'message:delivered'
'message:read'
'event:updated'
'notification:new'
'user:online'
'user:offline'
'typing:user'
```

### Presence System

```javascript
// Redis-based presence
SET user:{userId}:online timestamp EX 60

// Heartbeat every 30 seconds
// Expired keys = offline users
```

## Security Architecture

### Authentication Flow

```
1. User enters phone/email
   ↓
2. Backend generates OTP (6-digit)
   ↓
3. OTP stored in Redis (5 min expiry)
   ↓
4. SMS/Email sent to user
   ↓
5. User submits OTP
   ↓
6. Backend verifies OTP
   ↓
7. JWT Access Token issued (15 min)
   ↓
8. JWT Refresh Token issued (7 days)
   ↓
9. Tokens stored securely
```

### JWT Token Structure

```javascript
// Access Token
{
  userId: '...',
  role: 'user|vendor|admin',
  exp: '15m'
}

// Refresh Token
{
  userId: '...',
  tokenVersion: 1,
  exp: '7d'
}
```

### Security Layers

1. **Transport Security**
   - HTTPS only
   - TLS 1.3
   - Certificate pinning (mobile)

2. **Application Security**
   - Helmet.js headers
   - CORS configuration
   - CSRF protection
   - XSS prevention
   - SQL injection prevention (Mongoose)

3. **API Security**
   - Rate limiting (100 req/15min)
   - Input validation (Joi)
   - Output sanitization
   - API key authentication (vendors)

4. **Data Security**
   - Encryption at rest
   - Encryption in transit
   - Sensitive data hashing
   - PII protection

## Scalability & Performance

### Horizontal Scaling Strategy

```
┌──────────────────┐
│  Load Balancer   │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│ API-1 │ │ API-2 │ ... API-N
└───┬───┘ └──┬────┘
    │        │
    └────┬───┘
         │
    ┌────▼────┐
    │  Redis  │
    │ Cluster │
    └────┬────┘
         │
    ┌────▼────┐
    │ MongoDB │
    │ Replica │
    │   Set   │
    └─────────┘
```

### Caching Strategy

```javascript
// Multi-level caching
1. Browser Cache (static assets)
2. CDN Cache (media files)
3. Redis Cache (API responses)
4. Application Cache (in-memory)

// Cache invalidation
- Time-based (TTL)
- Event-based (real-time updates)
- Manual (admin actions)
```

### Performance Optimizations

1. **Frontend**
   - Code splitting
   - Lazy loading
   - Image optimization
   - PWA caching
   - Service Workers

2. **Backend**
   - Database query optimization
   - Connection pooling
   - Response compression
   - Pagination
   - Background jobs

3. **Database**
   - Proper indexing
   - Query optimization
   - Aggregation pipelines
   - Read replicas

4. **Media**
   - Image compression
   - Video transcoding
   - Thumbnail generation
   - CDN distribution
   - Lazy loading

### Monitoring & Logging

```javascript
// Logging levels
- ERROR: Critical errors
- WARN: Warning messages
- INFO: General info
- DEBUG: Debug messages

// Metrics tracked
- API response times
- Error rates
- Active users
- Database queries
- Cache hit rates
- Socket connections
```

## Disaster Recovery

### Backup Strategy

```
Database:
- Automated daily backups
- Point-in-time recovery
- Geo-redundant storage

Media:
- S3/MinIO replication
- Version control
- Lifecycle policies

Code:
- Git version control
- CI/CD pipelines
- Container registry
```

### High Availability

- Multi-zone deployment
- Automated failover
- Health checks
- Circuit breakers
- Graceful degradation

---

**Next**: See [DATABASE.md](./DATABASE.md) for detailed schema design

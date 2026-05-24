# CelebrationHub

> A production-grade full-stack celebration and event management platform for mobile and web.

## 🎉 Overview

CelebrationHub is a modern, scalable, real-time platform for managing weddings, ceremonies, parties, celebrations, family functions, and community events. The platform connects event hosts with service providers and creates an engaging social experience for all invitees.

## ✨ Key Features

### For Event Hosts
- Create unlimited events and sub-events
- Real-time media feed (images, videos, stories)
- Live group chat for invitees
- RSVP management
- Timeline and schedules
- Polls and announcements
- Location maps
- One-time registration for invitees

### For Service Providers
- Business profile management
- Service listings with portfolios
- Booking management
- Customer reviews and ratings
- Availability calendar
- Pricing packages
- Direct chat with customers

### Event Types Supported
- Weddings (Haldi, Mehendi, Reception, etc.)
- Birthday parties
- Engagements
- Housewarming
- Religious functions
- Corporate celebrations
- Custom events

## 🛠 Technology Stack

### Frontend
- **Web**: React 18 + Vite
- **Mobile**: React Native / Expo
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **UI Components**: Custom components
- **Real-time**: Socket.IO Client

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.IO
- **Authentication**: JWT + OTP
- **Caching**: Redis
- **Search**: MongoDB Atlas Search
- **Storage**: MinIO (S3-compatible)
- **Queue**: Bull

### DevOps
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx
- **Process Manager**: PM2
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston + Morgan

## 📁 Project Structure

```
CelebrationHub/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── sockets/        # Socket.IO handlers
│   │   └── validators/     # Input validation
│   ├── tests/              # Test files
│   └── package.json
│
├── web/                    # React web app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets
│   └── package.json
│
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── screens/        # Screen components
│   │   ├── components/     # Reusable components
│   │   ├── navigation/     # Navigation config
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md     # System architecture
│   ├── API.md              # API documentation
│   ├── DATABASE.md         # Database schema
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── MVP_ROADMAP.md      # Development roadmap
│
├── docker/                 # Docker configurations
│   ├── backend.Dockerfile
│   ├── web.Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml      # Docker Compose setup
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 6+
- Redis 7+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd CelebrationHub
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Web
cd ../web
npm install

# Mobile
cd ../mobile
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development servers**
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Web (Terminal 2)
cd web
npm run dev

# Mobile (Terminal 3)
cd mobile
npm start
```

### Using Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📱 Platform URLs

- **Web App**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs
- **Admin Panel**: http://localhost:5173/admin

## 🔐 Authentication

CelebrationHub uses OTP-based authentication:

1. User enters mobile number or email
2. OTP is sent via SMS/Email
3. User verifies OTP
4. JWT token is issued
5. Refresh token for session management

**One-time registration**: Users register once and automatically appear in future event invitations.

## 📚 Documentation

Detailed documentation is available in the `/docs` folder:

- [Architecture](./docs/ARCHITECTURE.md) - System design and architecture
- [API Documentation](./docs/API.md) - Complete API reference
- [Database Schema](./docs/DATABASE.md) - MongoDB collections and relationships
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment steps
- [MVP Roadmap](./docs/MVP_ROADMAP.md) - Development phases

## 🎨 Design Philosophy

CelebrationHub combines the best of:
- **Instagram**: Visual feed and stories
- **WhatsApp**: Real-time chat experience
- **Eventbrite**: Event management features

### UI/UX Principles
- Mobile-first design
- Real-time updates
- Smooth animations
- Premium feel
- Intuitive navigation
- Dark/light theme support

## 🏗 Architecture Highlights

### Real-time Features
- Live event updates using Socket.IO
- Instant messaging
- Presence indicators
- Typing indicators
- Real-time RSVP updates

### Scalability
- Horizontal scaling ready
- Redis caching
- CDN-ready assets
- Lazy loading
- Pagination
- Background job processing

### Security
- JWT authentication
- Rate limiting
- CSRF protection
- Input validation
- XSS prevention
- Helmet.js security headers
- API throttling

## 📊 Dual User System

### 1. Event Users
Regular users who create and manage celebrations.

**Capabilities**:
- Create events
- Invite people
- Share media
- Chat with invitees
- Manage RSVPs
- Search vendors

### 2. Business Users
Service providers and vendors.

**Capabilities**:
- Business profile
- Service listings
- Portfolio management
- Booking management
- Customer reviews
- Availability calendar

## 🛍 Vendor Marketplace

Categories:
- Function/Wedding Halls
- Decorators
- Makeup Artists
- Mehendi Artists
- Caterers
- Bands & Music
- DJs
- Event Planners
- Photographers
- Videographers
- Florists
- Travel Services
- Priests/Pandits
- Rental Services

Features:
- Nearby search with maps
- Ratings and reviews
- Portfolio galleries
- Pricing packages
- Direct booking
- Chat with vendors
- Call integration

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd web
npm test

# E2E tests
npm run test:e2e
```

## 📦 Building for Production

```bash
# Backend
cd backend
npm run build

# Web
cd web
npm run build

# Mobile
cd mobile
npm run build:android
npm run build:ios
```

## 🚀 Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed production deployment instructions.

### Quick Deploy with Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

This is a production-grade project. Follow these guidelines:

1. Follow the existing code structure
2. Write clean, documented code
3. Add tests for new features
4. Follow Git commit conventions
5. Update documentation

## 📄 License

MIT License - See LICENSE file for details

## 👥 Support

For support and queries:
- Email: support@celebrationhub.com
- Documentation: [docs](./docs)

## 🗺 Roadmap

See [MVP_ROADMAP.md](./docs/MVP_ROADMAP.md) for the complete development roadmap.

### Phase 1 (MVP)
- User authentication
- Event creation
- Basic chat
- Media upload
- Invitations

### Phase 2
- Vendor marketplace
- Booking system
- Reviews & ratings
- Advanced search

### Phase 3
- Mobile apps
- Push notifications
- Analytics dashboard
- Payment integration

---

**Built with ❤️ for celebrating life's special moments**

# CelebrationHub - Web Application

React-based web application for CelebrationHub event management platform.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **React Icons** - Icon library

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=CelebrationHub
```

## Project Structure

```
web/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   └── PrivateRoute.jsx
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── auth/
│   │   ├── events/
│   │   └── vendors/
│   ├── store/          # Redux store
│   │   ├── index.js
│   │   └── slices/
│   ├── services/       # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   ├── vendorService.js
│   │   └── socketService.js
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── assets/         # Static assets
│   ├── App.jsx         # Root component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Public assets
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json
```

## Available Scripts

```bash
# Development server with HMR
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Run tests
npm test

# Run tests with UI
npm run test:ui
```

## Features Implemented

### Authentication
- ✅ OTP-based login/register
- ✅ JWT token management
- ✅ Protected routes
- ✅ Auto-redirect on auth state

### State Management
- ✅ Redux Toolkit setup
- ✅ Auth slice (login, register, logout)
- ✅ Event slice (CRUD operations)
- ✅ Vendor slice (listing, details)
- ✅ Chat slice (messages, conversations)
- ✅ Notification slice (real-time alerts)

### API Integration
- ✅ Axios instance with interceptors
- ✅ Auto token injection
- ✅ Error handling
- ✅ Auth service
- ✅ Event service
- ✅ Vendor service

### Real-time Features
- ✅ Socket.IO client setup
- ✅ Auto-connect on auth
- ✅ Chat events
- ✅ Typing indicators
- ✅ Online presence
- ✅ Notifications

### UI Components
- ✅ Layout with header
- ✅ Responsive navigation
- ✅ Mobile menu
- ✅ Home page
- ✅ Login/Register pages
- ✅ Dashboard page
- ✅ 404 page
- ✅ Toast notifications

### Styling
- ✅ Tailwind CSS setup
- ✅ Custom color palette
- ✅ Reusable utility classes
- ✅ Responsive design
- ✅ Custom animations
- ✅ Dark scrollbar

## Routing

| Route | Component | Protected |
|-------|-----------|-----------|
| `/` | HomePage | No |
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |
| `/dashboard` | DashboardPage | Yes |
| `/events` | EventsPage | Yes |
| `/events/create` | CreateEventPage | Yes |
| `/events/:id` | EventDetailPage | Yes |
| `/vendors` | VendorsPage | Yes |
| `/vendors/:id` | VendorDetailPage | Yes |
| `/profile` | ProfilePage | Yes |

## API Endpoints Used

### Auth
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP & login/register
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Events
- `GET /api/events` - List events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/media` - Upload media
- `POST /api/events/:id/rsvp` - RSVP to event

### Vendors
- `GET /api/vendors` - List vendors
- `GET /api/vendors/:id` - Get vendor details
- `GET /api/vendors/search` - Search vendors
- `GET /api/vendors/categories` - Get categories
- `POST /api/vendors/:id/bookings` - Create booking
- `POST /api/vendors/:id/reviews` - Add review

## Socket.IO Events

### Emit
- `message:send` - Send message
- `user:typing` - Start typing
- `user:stop-typing` - Stop typing
- `conversation:join` - Join conversation
- `conversation:leave` - Leave conversation
- `event:join` - Join event room
- `event:leave` - Leave event room

### Listen
- `message:new` - New message received
- `user:typing` - User is typing
- `user:stop-typing` - User stopped typing
- `users:online` - Online users list
- `notification:new` - New notification

## Build & Deployment

### Development Build
```bash
npm run build
```

Output: `dist/` directory

### Docker Build
```bash
docker build -f ../docker/web.Dockerfile -t celebrationhub-web .
```

### Nginx Configuration
The app is served via Nginx with:
- Static file caching
- Gzip compression
- Security headers
- SPA routing fallback

## Next Steps

1. **Implement remaining pages:**
   - Full event listing with filters
   - Event detail with media feed
   - Event creation form
   - Vendor listing with search
   - Vendor detail with bookings
   - Profile management

2. **Add features:**
   - Image/video upload
   - Chat UI components
   - Notification dropdown
   - Search functionality
   - Filters and sorting

3. **Enhance UX:**
   - Loading states
   - Empty states
   - Error boundaries
   - Optimistic updates
   - Skeleton loaders

4. **Testing:**
   - Unit tests for components
   - Integration tests for Redux
   - E2E tests for user flows

5. **Performance:**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Service worker
   - PWA features

## Contributing

See main repository [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License

MIT - See [LICENSE](../../LICENSE)

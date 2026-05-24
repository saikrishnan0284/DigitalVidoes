# CelebrationHub - Mobile App

React Native mobile application for CelebrationHub event management platform, built with Expo.

## Tech Stack

- **Expo SDK 54** - Development framework
- **React Native 0.81** - Mobile UI framework
- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Navigation** - Navigation library
- **Socket.IO Client** - Real-time communication
- **Expo SecureStore** - Secure token storage
- **Axios** - HTTP client

## Getting Started

### Prerequisites
- Node.js 20+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run android      # Android
npm run ios         # iOS (requires Mac)
npm run web         # Web browser
```

### Using Expo Go App

1. Install Expo Go on your phone
2. Scan the QR code from `npm start`
3. App will load on your device

## Project Structure

```
mobile/
├── src/
│   ├── navigation/         # Navigation configuration
│   │   ├── RootNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   ├── screens/           # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── events/
│   │   ├── vendors/
│   │   ├── profile/
│   │   ├── HomeScreen.js
│   │   ├── ChatScreen.js
│   │   └── LoadingScreen.js
│   ├── components/        # Reusable components
│   ├── store/            # Redux store
│   │   ├── index.js
│   │   └── slices/
│   ├── services/         # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── eventService.js
│   ├── utils/            # Utility functions
│   └── assets/           # Images, fonts
├── App.js               # Root component
├── index.js             # Entry point
├── app.json            # Expo configuration
├── babel.config.js     # Babel configuration
└── package.json
```

## Navigation Structure

```
RootNavigator
├── AuthNavigator (Unauthenticated)
│   ├── LoginScreen
│   └── RegisterScreen
└── MainNavigator (Authenticated)
    ├── HomeScreen (Tab)
    ├── EventsScreen (Tab)
    ├── VendorsScreen (Tab)
    ├── ChatScreen (Tab)
    └── ProfileScreen (Tab)
```

## Features Implemented

### Authentication
- ✅ OTP-based login/register
- ✅ Secure token storage (Expo SecureStore)
- ✅ Auto-load stored auth on app start
- ✅ Protected route navigation

### State Management
- ✅ Redux Toolkit setup
- ✅ Auth slice with SecureStore integration
- ✅ Event slice
- ✅ Vendor slice
- ✅ Chat slice
- ✅ Notification slice

### API Integration
- ✅ Axios instance with interceptors
- ✅ Auto token injection
- ✅ Error handling with auto-logout on 401
- ✅ Auth service
- ✅ Event service

### Navigation
- ✅ Stack navigation for auth flow
- ✅ Tab navigation for main app
- ✅ Conditional rendering based on auth
- ✅ Loading screen during auth check

### UI Screens
- ✅ Login screen with OTP
- ✅ Register screen with OTP
- ✅ Home screen
- ✅ Events screen (placeholder)
- ✅ Vendors screen (placeholder)
- ✅ Chat screen (placeholder)
- ✅ Profile screen with logout

## Expo Configuration

**app.json** includes:
- App name, slug, version
- Platform-specific configs (iOS, Android)
- Permissions (camera, storage, notifications)
- Plugins configuration
- Splash screen and icons

## Environment Variables

Create `.env` file:

```env
API_URL=http://localhost:5000
SOCKET_URL=http://localhost:5000
APP_NAME=CelebrationHub
```

Note: Use your machine's IP address instead of localhost when testing on physical devices.

## Building for Production

### Development Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android --profile development

# Build for iOS (requires Mac)
eas build --platform ios --profile development
```

### Production Build

```bash
# Android APK/AAB
eas build --platform android --profile production

# iOS IPA
eas build --platform ios --profile production
```

## Permissions Required

### Android
- Camera
- Read/Write External Storage
- Notifications
- Internet

### iOS
- Camera
- Photo Library
- Notifications

## Next Steps

1. **Complete screens:**
   - Full events listing
   - Event details with media
   - Create event form
   - Vendor listing
   - Vendor details
   - Chat interface

2. **Add features:**
   - Camera integration
   - Image picker
   - Push notifications
   - Deep linking
   - Offline storage

3. **Real-time:**
   - Socket.IO integration
   - Live chat
   - Typing indicators
   - Online presence

4. **Native features:**
   - Biometric authentication
   - Share functionality
   - Calendar integration
   - Maps integration

5. **Performance:**
   - Image caching
   - Lazy loading
   - Optimistic updates
   - Background tasks

6. **Testing:**
   - Unit tests
   - Integration tests
   - E2E tests with Detox

## Debugging

### View logs
```bash
# Expo logs
npx expo start

# Android logs
adb logcat

# iOS logs
xcrun simctl spawn booted log stream
```

### Clear cache
```bash
npx expo start --clear
```

## Common Issues

**Metro bundler issues:**
```bash
npx expo start --clear
rm -rf node_modules && npm install
```

**Build errors:**
```bash
cd android && ./gradlew clean
cd ios && pod install
```

## Contributing

See main repository [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License

MIT - See [LICENSE](../../LICENSE)

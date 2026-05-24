# Mobile & Web React App

A cross-platform application built with **Expo (React Native)** that runs on:
- 📱 Android mobile devices
- 🍎 iOS mobile devices  
- 🌐 Web browsers

## Tech Stack

- **Expo SDK** - Latest version with React Native New Architecture
- **React** - Latest version
- **TypeScript** - Type-safe development
- **React Native** - Cross-platform mobile framework

## Getting Started

### Install Dependencies

```bash
cd mobile-web-app
npm install
```

### Run the App

```bash
# Start development server with interactive menu
npm start

# Run on specific platforms
npm run android      # Launch on Android device/emulator
npm run ios         # Launch on iOS device/simulator (requires macOS)
npm run web         # Launch web version in browser
```

### Alternative: Use Expo CLI Directly

```bash
npx expo start              # Development server
npx expo start --clear      # Clear cache and start
npx expo start --tunnel     # Enable tunnel for remote device testing
```

## Project Structure

```
mobile-web-app/
├── App.tsx              # Main application entry point
├── index.ts             # Expo entry file
├── app.json            # Expo configuration
├── assets/             # Images, fonts, and static resources
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Development Tips

### Platform-Specific Code

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web-specific code
} else if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
}
```

### Adding Dependencies

```bash
# For Expo-compatible packages
npx expo install <package-name>

# For standard npm packages
npm install <package-name>
```

## Recommended Project Organization

As your app grows, organize code like this:

```
src/
├── components/      # Reusable UI components
├── screens/        # Screen/page components
├── navigation/     # Navigation configuration
├── services/       # API calls, business logic
├── utils/          # Helper functions
├── types/          # TypeScript type definitions
└── constants/      # App constants, colors, sizes
```

## State Management

- Start with React hooks (`useState`, `useContext`)
- Add Redux, Zustand, or Jotai when complexity increases

## Navigation

Use `@react-navigation/native` for screen navigation:
- Stack navigation
- Tab navigation
- Drawer navigation

## Building for Production

### Development Builds

```bash
npx eas build --platform android --profile development
npx eas build --platform ios --profile development
```

### Production Builds

```bash
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
```

### Web Deployment

```bash
npx expo export:web
# Deploy the web-build/ directory to your hosting service
```

> **Note:** Requires EAS CLI and Expo account. Install with: `npm install -g eas-cli`

## License

MIT

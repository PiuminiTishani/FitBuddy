# FitBuddy - Your Personal Fitness Companion 💪

A comprehensive fitness tracking mobile application built with React Native and Expo, designed to help users achieve their fitness goals through exercise tracking, workout logging, and personalized recommendations.

## 📱 Features

### Core Functionality
- **User Authentication** - Secure login and registration with DummyJSON API integration
- **Exercise Library** - Browse hundreds of exercises with difficulty filters (Beginner, Intermediate, Expert)
- **Workout Tracking** - Log exercises with sets, reps, and weights
- **Workout History** - View your complete workout history with timestamps
- **Favorites System** - Save your favorite exercises for quick access
- **Search & Filter** - Find exercises easily with search and category filters
- **Theme Support** - Dark/Light mode with smooth transitions

### Dashboard Features
- **Weekly Challenge** - Stay motivated with weekly fitness challenges
- **Daily Fitness Tips** - Get dynamic fitness tips powered by API-Ninjas
- **Hydration Tracker** - Monitor daily water intake with quick-add buttons
- **Recommended Exercises** - Personalized exercise recommendations on home screen

### User Experience
- **Responsive Design** - Optimized for various screen sizes
- **Smooth Animations** - Gradient cards and interactive UI elements
- **Offline Support** - Local storage with AsyncStorage for favorites and workouts
- **Pull to Refresh** - Keep your exercise data up to date

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Bottom Tabs)
- **Storage**: AsyncStorage
- **UI Components**: 
  - expo-linear-gradient
  - @expo/vector-icons (Feather)
- **APIs**:
  - DummyJSON API (Authentication)
  - API-Ninjas Exercise API
  - API-Ninjas Quotes API

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for mobile testing)
- Android Studio (for Android development) or Xcode (for iOS development)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PiuminiTishani/FitBuddy.git
   cd FitBuddy
   ```

2. **Navigate to app directory**
   ```bash
   cd FitBuddyApp
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device**
   - Scan the QR code with Expo Go app (Android/iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 🔑 Test Credentials

The app uses DummyJSON API for authentication. You can login with these test accounts:

| Email | Password | User Name |
|-------|----------|-----------|
| emilys@demo.com | emilyspass | Emily Johnson |
| michaelw@demo.com | michaelwpass | Michael Williams |
| sophiab@demo.com | sophiabpass | Sophia Brown |

For more test credentials, see [TEST_CREDENTIALS.md](./FitBuddyApp/TEST_CREDENTIALS.md)

## 📁 Project Structure

```
FitBuddyApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── ExerciseCard.tsx
│   │   ├── InputField.tsx
│   │   ├── LogExerciseModal.tsx
│   │   └── WaterIntakeCard.tsx
│   ├── context/            # React Context providers
│   │   └── ThemeContext.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/           # App screens
│   │   ├── HomeScreen.tsx
│   │   ├── ExercisesScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   ├── WorkoutHistoryScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── services/          # API services
│   │   ├── authService.ts
│   │   ├── exerciseService.ts
│   │   └── tipsService.ts
│   ├── store/            # Redux store
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   ├── middleware/
│   │   │   └── workoutPersist.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── favoritesSlice.ts
│   │       └── workoutSlice.ts
│   └── utils/            # Utility functions
│       ├── secureStorage.ts
│       └── validation.ts
├── android/              # Android native code
├── assets/              # Images and static files
├── App.tsx              # Root component
├── app.json            # Expo configuration
└── package.json        # Dependencies

```

## 🎨 Theme Configuration

The app supports both light and dark modes with custom color schemes:

**Light Mode**
- Primary: `#8B5CF6` (Purple)
- Secondary: `#EC4899` (Pink)
- Background: `#F8F9FA`

**Dark Mode**
- Primary: `#A78BFA` (Light Purple)
- Secondary: `#F472B6` (Light Pink)
- Background: `#1A1A1A`

## 🔌 API Integration

### Exercise API (API-Ninjas)
- Provides exercise data with muscle groups and difficulty levels
- Fallback to mock data if API is unavailable

### Authentication API (DummyJSON)
- Real authentication with JWT tokens
- Fallback demo mode for offline use

### Quotes API (API-Ninjas)
- Dynamic daily fitness tips
- 10 curated fallback tips for offline use

## 📱 Screens Overview

1. **Landing Screen** - Welcome screen with app introduction
2. **Login/Register** - User authentication
3. **Home** - Dashboard with challenges, tips, and recommendations
4. **Exercises** - Browse and search all exercises
5. **Favorites** - Quick access to saved exercises
6. **Workouts** - View workout history
7. **Profile** - User settings and logout

## 🔧 Configuration

### Environment Setup
API keys are configured in the service files:
- `src/services/exerciseService.ts` - Exercise API key
- `src/services/tipsService.ts` - Quotes API key

### Android Build Configuration
- Minimum SDK: 21
- Target SDK: 34
- Build Tools: 34.0.0

## 🚧 Known Issues

- Expo update notifications may appear during development (can be disabled in app.json)

## 📄 License

This project is part of a Mobile Application Development course (L3S1).

## 🙏 Acknowledgments

- [DummyJSON](https://dummyjson.com/) - Authentication and user data
- [API-Ninjas](https://api-ninjas.com/) - Exercise and quotes data
- [Expo](https://expo.dev/) - Development framework
- [React Navigation](https://reactnavigation.org/) - Navigation library


Made with ❤️ for fitness enthusiasts

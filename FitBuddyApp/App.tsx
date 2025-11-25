import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppDispatch } from './src/store/hooks';
import { loginSuccess } from './src/store/slices/authSlice';
import { setFavorites } from './src/store/slices/favoritesSlice';
import { setWorkouts, loadWorkoutsFromStorage } from './src/store/slices/workoutSlice';
import { secureStorage } from './src/utils/secureStorage';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

const AppContent = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await secureStorage.getToken();
      const userData = await secureStorage.getUserData();

      if (token && userData) {
        dispatch(loginSuccess({ user: userData, token }));
      }

      // Load favorites from AsyncStorage
      const favoritesData = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favoritesData) {
        dispatch(setFavorites(JSON.parse(favoritesData)));
      }

      // Load workout history from AsyncStorage
      const workouts = await loadWorkoutsFromStorage();
      if (workouts.length > 0) {
        dispatch(setWorkouts(workouts));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

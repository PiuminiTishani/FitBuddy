import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ColorScheme;
}

interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  gradient1: string;
  gradient2: string;
}

const lightColors: ColorScheme = {
  primary: '#7c3aed', // Vibrant purple
  secondary: '#ec4899', // Pink accent
  background: '#fafafa',
  card: '#ffffff',
  text: '#18181b',
  textSecondary: '#71717a',
  border: '#e4e4e7',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  gradient1: '#7c3aed',
  gradient2: '#ec4899',
};

const darkColors: ColorScheme = {
  primary: '#a78bfa', // Lighter purple for dark mode
  secondary: '#f472b6', // Lighter pink
  background: '#09090b',
  card: '#18181b',
  text: '#fafafa',
  textSecondary: '#a1a1aa',
  border: '#27272a',
  error: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
  gradient1: '#a78bfa',
  gradient2: '#f472b6',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

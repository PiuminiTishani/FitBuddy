import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 56,
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, backgroundColor: colors.primary };
      case 'secondary':
        return { ...baseStyle, backgroundColor: colors.secondary };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      default:
        return { ...baseStyle, backgroundColor: colors.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 16,
      fontWeight: '600',
    };

    if (variant === 'outline') {
      return { ...baseStyle, color: colors.primary };
    }
    return { ...baseStyle, color: '#ffffff' };
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && { opacity: 0.6 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#ffffff'} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

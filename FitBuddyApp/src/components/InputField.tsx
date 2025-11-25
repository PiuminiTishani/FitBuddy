import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
  icon?: keyof typeof Feather.glyphMap;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  isPassword = false,
  icon,
  ...props
}) => {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[
        styles.inputContainer,
        { 
          backgroundColor: colors.card,
          borderColor: error ? colors.error : colors.border,
        }
      ]}>
        {icon && (
          <Feather
            name={icon}
            size={20}
            color={colors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
  },
});

export default InputField;

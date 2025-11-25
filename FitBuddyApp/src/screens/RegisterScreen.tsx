import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/slices/authSlice';
import { authAPI } from '../services/authService';
import { secureStorage } from '../utils/secureStorage';
import { registerSchema } from '../utils/validation';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = async () => {
    try {
      await registerSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const validationErrors: { [key: string]: string } = {};
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleRegister = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);
    try {
      const { name, username, email, password } = formData;
      const response = await authAPI.register({ name, username, email, password });
      
      // Store auth data securely
      await secureStorage.setToken(response.token);
      await secureStorage.setUserData(response.user);
      
      // Update Redux state
      dispatch(loginSuccess(response));
      
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join FitBuddy and start your fitness journey
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(value) => updateField('name', value)}
            error={errors.name}
            icon="user"
          />

          <InputField
            label="Username"
            placeholder="Choose a username"
            value={formData.username}
            onChangeText={(value) => updateField('username', value)}
            error={errors.username}
            autoCapitalize="none"
            icon="at-sign"
          />

          <InputField
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => updateField('email', value)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
          />

          <InputField
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            error={errors.password}
            isPassword
            icon="lock"
          />

          <InputField
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(value) => updateField('confirmPassword', value)}
            error={errors.confirmPassword}
            isPassword
            icon="lock"
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;

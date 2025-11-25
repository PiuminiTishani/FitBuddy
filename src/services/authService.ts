import axios from 'axios';
import { User } from '../store/slices/authSlice';

// Using DummyJSON API for authentication
// API Docs: https://dummyjson.com/docs/auth

const AUTH_BASE_URL = 'https://dummyjson.com/auth';
const USERS_BASE_URL = 'https://dummyjson.com/users';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// DummyJSON Auth Response
interface DummyJSONAuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

export const authAPI = {
  // Login using DummyJSON API
  // Test credentials: username: 'emilys', password: 'emilyspass'
  // More users at: https://dummyjson.com/users
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // DummyJSON uses username for login, not email
      // So we'll try username first, or use demo users
      const username = credentials.email.split('@')[0]; // Extract username from email

      const response = await axios.post<DummyJSONAuthResponse>(
        `${AUTH_BASE_URL}/login`,
        {
          username: username,
          password: credentials.password,
          expiresInMins: 60,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      const user: User = {
        id: data.id.toString(),
        name: `${data.firstName} ${data.lastName}`,
        username: data.username,
        email: data.email,
      };

      return {
        user,
        token: data.token,
      };
    } catch (error) {
      // Fallback: If DummyJSON auth fails, create a demo user
      console.log('DummyJSON auth failed, using demo mode');
      
      const emailName = credentials.email.split('@')[0];
      const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

      const user: User = {
        id: `demo_${Date.now()}`,
        name: displayName,
        username: emailName,
        email: credentials.email,
      };

      const token = `demo_token_${Date.now()}`;

      return { user, token };
    }
  },

  // Register new user using DummyJSON API
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // DummyJSON doesn't actually create users, but we'll simulate it
      const response = await axios.post(
        `${USERS_BASE_URL}/add`,
        {
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ')[1] || '',
          username: data.username,
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const userData = response.data;

      const user: User = {
        id: userData.id.toString(),
        name: data.name,
        username: data.username,
        email: data.email,
      };

      // Generate a token (DummyJSON add endpoint doesn't return token)
      const token = `registered_token_${Date.now()}`;

      return {
        user,
        token,
      };
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  },

  // Validate token by fetching current user
  async validateToken(token: string): Promise<boolean> {
    try {
      // For demo tokens, always validate as true
      if (token.startsWith('demo_token_') || token.startsWith('registered_token_')) {
        return true;
      }

      // Validate real DummyJSON token
      await axios.get(`${AUTH_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  // Get current user info using token
  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const response = await axios.get<DummyJSONAuthResponse>(
        `${AUTH_BASE_URL}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      return {
        id: data.id.toString(),
        name: `${data.firstName} ${data.lastName}`,
        username: data.username,
        email: data.email,
      };
    } catch (error) {
      return null;
    }
  },
};

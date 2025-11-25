import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { secureStorage } from '../utils/secureStorage';
import WaterIntakeCard from '../components/WaterIntakeCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WATER_INTAKE_KEY = 'water_intake';
const WATER_GOAL = 2000; // 2000ml daily goal
const WATER_INCREMENT = 250; // 250ml per glass

const ProfileScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const workouts = useAppSelector((state) => state.workout.workouts);

  const [waterIntake, setWaterIntake] = useState(0);

  // Calculate workout stats
  const totalWorkouts = workouts.length;
  const thisWeekWorkouts = workouts.filter((w) => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  }).length;

  useEffect(() => {
    loadWaterIntake();
  }, []);

  useEffect(() => {
    saveWaterIntake();
  }, [waterIntake]);

  const loadWaterIntake = async () => {
    try {
      const stored = await AsyncStorage.getItem(WATER_INTAKE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Check if it's today's data
        const today = new Date().toDateString();
        if (data.date === today) {
          setWaterIntake(data.amount);
        } else {
          // Reset for new day
          setWaterIntake(0);
        }
      }
    } catch (error) {
      console.error('Error loading water intake:', error);
    }
  };

  const saveWaterIntake = async () => {
    try {
      const data = {
        amount: waterIntake,
        date: new Date().toDateString(),
      };
      await AsyncStorage.setItem(WATER_INTAKE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving water intake:', error);
    }
  };

  const handleAddWater = () => {
    setWaterIntake((prev) => Math.min(prev + WATER_INCREMENT, WATER_GOAL * 2));
  };

  const handleResetWater = async () => {
    Alert.alert(
      'Reset Water Intake',
      'Are you sure you want to reset your water intake for today?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setWaterIntake(0);
            // Immediately save to AsyncStorage
            try {
              const data = {
                amount: 0,
                date: new Date().toDateString(),
              };
              await AsyncStorage.setItem(WATER_INTAKE_KEY, JSON.stringify(data));
            } catch (error) {
              console.error('Error resetting water intake:', error);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await secureStorage.clearAuthData();
          dispatch(logout());
        },
      },
    ]);
  };

  const StatCard = ({ icon, label, value, color }: any) => (
    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <View
        style={[
          styles.statIconContainer,
          { backgroundColor: `${color}20` },
        ]}
      >
        <Feather name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );

  const MenuItem = ({
    icon,
    label,
    onPress,
    showArrow = true,
    rightElement,
  }: any) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.menuIconContainer,
            { backgroundColor: `${colors.primary}20` },
          ]}
        >
          <Feather name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={[styles.menuItemText, { color: colors.text }]}>
          {label}
        </Text>
      </View>
      {rightElement || (showArrow && (
        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            @{user?.username || 'username'}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            icon="heart"
            label="Favorites"
            value={favorites.length}
            color={colors.error}
          />
          <StatCard
            icon="activity"
            label="Total Workouts"
            value={totalWorkouts}
            color={colors.success}
          />
          <StatCard
            icon="zap"
            label="This Week"
            value={thisWeekWorkouts}
            color={colors.primary}
          />
        </View>

        <WaterIntakeCard
          currentIntake={waterIntake}
          goal={WATER_GOAL}
          onAddWater={handleAddWater}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Wellness
          </Text>
          <MenuItem
            icon="droplet"
            label="Reset Water Intake"
            onPress={handleResetWater}
          />
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                backgroundColor: `${colors.error}20`,
                borderColor: colors.error,
              },
            ]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Feather name="log-out" size={20} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;

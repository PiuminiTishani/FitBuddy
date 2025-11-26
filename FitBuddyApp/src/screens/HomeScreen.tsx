import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { Exercise } from '../store/slices/favoritesSlice';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { addWater, resetWater, loadWaterIntakeFromStorage, saveWaterIntakeToStorage } from '../store/slices/waterSlice';
import ExerciseCard from '../components/ExerciseCard';
import { exerciseAPI } from '../services/exerciseService';
import { tipsAPI } from '../services/tipsService';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state) => state.favorites.favorites);
  const { intake: waterIntake, goal: waterGoal } = useAppSelector((state) => state.water);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dailyTip, setDailyTip] = useState({ tip: 'Loading tip...', category: 'Fitness' });
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    loadDailyTip();
    loadRecommendedExercises();
    dispatch(loadWaterIntakeFromStorage() as any);
  }, []);

  const loadDailyTip = async () => {
    try {
      const tipData = await tipsAPI.getDailyTip();
      setDailyTip(tipData);
    } catch (error) {
      console.error('Error loading daily tip:', error);
    }
  };

  const loadRecommendedExercises = async () => {
    try {
      const data = await exerciseAPI.getExercises();
      // Get 4 random exercises for recommendations
      const shuffled = data.sort(() => 0.5 - Math.random());
      setRecommendedExercises(shuffled.slice(0, 4));
    } catch (error) {
      console.error('Error loading recommended exercises:', error);
    }
  };

  const isFavorite = (exercise: Exercise) => {
    return favorites.some((fav) => fav.name === exercise.name);
  };

  const handleFavoritePress = (exercise: Exercise) => {
    if (isFavorite(exercise)) {
      dispatch(removeFavorite(exercise.name));
    } else {
      dispatch(addFavorite(exercise));
    }
  };

  const handleExercisePress = (exercise: Exercise) => {
    navigation.navigate('ExerciseDetails', { exercise });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadDailyTip(), loadRecommendedExercises()]);
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.topBar}>
            <View>
              <Text style={[styles.greeting, { color: colors.text }]}>
                Hello, {user?.name || 'John'}!
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Ready to be fit?
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.themeToggle, { backgroundColor: colors.card }]}
              onPress={toggleTheme}
              activeOpacity={0.7}
            >
              <Feather
                name={isDark ? 'moon' : 'sun'}
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Challenge Card */}
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.challengeCard}
        >
          <Text style={styles.challengeTitle}>Weekly Challenge</Text>
          <Text style={styles.challengeSubtitle}>Complete 5 Beginner exercises</Text>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Now</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Daily Tip Card */}
        <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
          <View style={styles.tipHeader}>
            <View style={[styles.tipIcon, { backgroundColor: '#10B981' + '20' }]}>
              <Feather name="zap" size={20} color="#10B981" />
            </View>
            <Text style={[styles.tipTitle, { color: colors.text }]}>
              Wellness Tip: {dailyTip.category}
            </Text>
          </View>
          <Text style={[styles.tipDescription, { color: colors.textSecondary }]}>
            {dailyTip.tip}
          </Text>
        </View>

        {/* Hydration Card */}
        <View style={[styles.hydrationCard, { backgroundColor: colors.card }]}>
          <View style={styles.hydrationHeader}>
            <View style={styles.hydrationTitleRow}>
              <View style={[styles.waterIcon, { backgroundColor: colors.primary + '20' }]}>
                <Feather name="droplet" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.hydrationTitle, { color: colors.text }]}>
                Hydration
              </Text>
            </View>
            <Text style={[styles.hydrationGoal, { color: colors.textSecondary }]}>
              {waterIntake} / {waterGoal} ml
            </Text>
          </View>

          <View style={styles.waterButtons}>
            <TouchableOpacity
              style={[styles.waterButton, { borderColor: colors.primary }]}
              onPress={() => {
                dispatch(addWater(250));
                dispatch(saveWaterIntakeToStorage(waterIntake + 250) as any);
              }}
            >
              <Text style={[styles.waterButtonText, { color: colors.primary }]}>
                + 250ml
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.waterButton, { borderColor: colors.primary }]}
              onPress={() => {
                dispatch(addWater(500));
                dispatch(saveWaterIntakeToStorage(waterIntake + 500) as any);
              }}
            >
              <Text style={[styles.waterButtonText, { color: colors.primary }]}>
                + 500ml
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                dispatch(resetWater());
                dispatch(saveWaterIntakeToStorage(0) as any);
              }}
            >
              <Feather name="rotate-ccw" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended Exercises Section */}
        {recommendedExercises.length > 0 && (
          <View style={styles.recommendedSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recommended for You
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Exercises')}>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.exercisesGrid}>
              {recommendedExercises.map((exercise, index) => (
                <View key={`${exercise.name}-${index}`} style={styles.exerciseCardWrapper}>
                  <TouchableOpacity
                    style={styles.exerciseCardTouchable}
                    onPress={() => handleExercisePress(exercise)}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={isDark ? ['#1e1e2e', '#27273a'] : ['#ffffff', '#f9fafb']}
                      style={[
                        styles.exerciseCard,
                        {
                          borderColor: colors.border,
                          shadowColor: colors.primary,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.exerciseIcon,
                          {
                            backgroundColor: `${colors.primary}20`,
                          },
                        ]}
                      >
                        <Feather name="activity" size={24} color={colors.primary} />
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.favoriteButtonSmall,
                          { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)' },
                        ]}
                        onPress={() => handleFavoritePress(exercise)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Feather
                          name="heart"
                          size={16}
                          color={isFavorite(exercise) ? '#ef4444' : colors.textSecondary}
                          fill={isFavorite(exercise) ? '#ef4444' : 'transparent'}
                        />
                      </TouchableOpacity>

                      <Text
                        style={[styles.exerciseTitle, { color: colors.text }]}
                        numberOfLines={2}
                      >
                        {exercise.name}
                      </Text>

                      <View
                        style={[
                          styles.difficultyBadge,
                          {
                            backgroundColor: exercise.difficulty === 'beginner' ? '#10b98120' :
                              exercise.difficulty === 'intermediate' ? '#f59e0b20' : '#ef444420',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.difficultyText,
                            {
                              color: exercise.difficulty === 'beginner' ? '#10b981' :
                                exercise.difficulty === 'intermediate' ? '#f59e0b' : '#ef4444',
                            },
                          ]}
                        >
                          {exercise.difficulty}
                        </Text>
                      </View>

                      <View style={styles.muscleInfo}>
                        <Feather name="target" size={12} color={colors.textSecondary} />
                        <Text
                          style={[styles.muscleLabel, { color: colors.textSecondary }]}
                          numberOfLines={1}
                        >
                          {exercise.muscle}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
  },
  themeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  challengeCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 20,
    borderRadius: 20,
    minHeight: 140,
    justifyContent: 'center',
  },
  challengeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  challengeSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  tipCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  hydrationCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
  },
  hydrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hydrationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  hydrationTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  hydrationGoal: {
    fontSize: 14,
  },
  waterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  waterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  waterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendedSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  exerciseCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  exercisesScroll: {
    paddingHorizontal: 20,
  },
  exercisesScrollView: {
    marginHorizontal: -20,
  },
  exerciseCardContainer: {
    width: 160,
    marginRight: 12,
  },
  exerciseCardTouchable: {
    flex: 1,
  },
  exerciseCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    minHeight: 200,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  favoriteButtonSmall: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  exerciseTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    minHeight: 36,
    lineHeight: 18,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  muscleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  muscleLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
    flex: 1,
  },
});

export default HomeScreen;

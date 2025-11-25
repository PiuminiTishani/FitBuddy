import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppDispatch } from '../store/hooks';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { logWorkout } from '../store/slices/workoutSlice';
import { Exercise } from '../store/slices/favoritesSlice';
import Button from '../components/Button';
import LogExerciseModal from '../components/LogExerciseModal';

interface ExerciseDetailsScreenProps {
  route: any;
  navigation: any;
}

const ExerciseDetailsScreen: React.FC<ExerciseDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { exercise, isFavorite } = route.params as {
    exercise: Exercise;
    isFavorite?: boolean;
  };

  const [favorite, setFavorite] = useState(isFavorite || false);
  const [showLogModal, setShowLogModal] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    const colorMap: { [key: string]: string } = {
      beginner: colors.success,
      intermediate: colors.warning,
      expert: colors.error,
    };
    return colorMap[difficulty.toLowerCase()] || colors.success;
  };

  const handleFavoriteToggle = () => {
    if (favorite) {
      dispatch(removeFavorite(exercise.name));
      setFavorite(false);
    } else {
      dispatch(addFavorite(exercise));
      setFavorite(true);
    }
  };

  const handleLogWorkout = (data: {
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    notes?: string;
  }) => {
    const workoutLog = {
      id: Date.now().toString(),
      exerciseName: exercise.name,
      exerciseType: exercise.type,
      muscle: exercise.muscle,
      difficulty: exercise.difficulty,
      date: new Date().toISOString(),
      ...data,
    };

    dispatch(logWorkout(workoutLog));
    setShowLogModal(false);
    
    Alert.alert(
      'Workout Logged!',
      `${exercise.name} has been added to your workout history.`,
      [
        {
          text: 'View History',
          onPress: () => navigation.navigate('WorkoutHistory'),
        },
        { text: 'OK' },
      ]
    );
  };

  const DetailItem = ({
    icon,
    label,
    value,
  }: {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value: string;
  }) => (
    <View style={[styles.detailItem, { backgroundColor: colors.card }]}>
      <View style={styles.detailIconContainer}>
        <Feather name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.detailContent}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              {
                backgroundColor: favorite
                  ? `${colors.error}20`
                  : `${colors.textSecondary}20`,
              },
            ]}
            onPress={handleFavoriteToggle}
          >
            <Feather
              name="heart"
              size={24}
              color={favorite ? colors.error : colors.textSecondary}
              fill={favorite ? colors.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            {exercise.name}
          </Text>

          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor:
                  getDifficultyColor(exercise.difficulty) + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: getDifficultyColor(exercise.difficulty) },
              ]}
            >
              {exercise.difficulty.toUpperCase()}
            </Text>
          </View>

          <View style={styles.detailsGrid}>
            <DetailItem
              icon="activity"
              label="Type"
              value={exercise.type}
            />
            <DetailItem
              icon="target"
              label="Muscle"
              value={exercise.muscle}
            />
            <DetailItem
              icon="tool"
              label="Equipment"
              value={exercise.equipment.replace(/_/g, ' ')}
            />
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Instructions
            </Text>
            <Text style={[styles.instructions, { color: colors.textSecondary }]}>
              {exercise.instructions}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Log This Workout"
              onPress={() => setShowLogModal(true)}
            />
          </View>
        </View>
      </ScrollView>

      <LogExerciseModal
        visible={showLogModal}
        exercise={exercise}
        onClose={() => setShowLogModal(false)}
        onSubmit={handleLogWorkout}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  instructionsContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtons: {
    marginTop: 24,
  },
});

export default ExerciseDetailsScreen;

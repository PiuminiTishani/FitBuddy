import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Exercise } from '../store/slices/favoritesSlice';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Map exercise types to icons
const getExerciseIcon = (type: string): keyof typeof Feather.glyphMap => {
  const iconMap: { [key: string]: keyof typeof Feather.glyphMap } = {
    strength: 'activity',
    cardio: 'heart',
    stretching: 'wind',
    powerlifting: 'zap',
    strongman: 'award',
    plyometrics: 'trending-up',
    olympic_weightlifting: 'target',
  };
  return iconMap[type.toLowerCase()] || 'activity';
};

// Map difficulty to colors
const getDifficultyColor = (difficulty: string) => {
  const colorMap: { [key: string]: string } = {
    beginner: '#10b981',
    intermediate: '#f59e0b',
    expert: '#ef4444',
  };
  return colorMap[difficulty.toLowerCase()] || '#10b981';
};

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPress,
  onFavoritePress,
  isFavorite = false,
}) => {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={isDark ? ['#1e1e2e', '#27273a'] : ['#ffffff', '#f9fafb']}
        style={[
          styles.cardGradient,
          {
            borderColor: colors.border,
            shadowColor: colors.primary,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${colors.primary}20`,
            },
          ]}
        >
          <Feather
            name={getExerciseIcon(exercise.type)}
            size={28}
            color={colors.primary}
          />
        </View>

      {onFavoritePress && (
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)' },
          ]}
          onPress={onFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather
            name={isFavorite ? 'heart' : 'heart'}
            size={18}
            color={isFavorite ? '#ef4444' : colors.textSecondary}
            fill={isFavorite ? '#ef4444' : 'transparent'}
          />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={2}
        >
          {exercise.name}
        </Text>

        <View style={styles.details}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: getDifficultyColor(exercise.difficulty) + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getDifficultyColor(exercise.difficulty) },
              ]}
            >
              {exercise.difficulty}
            </Text>
          </View>
        </View>

        <View style={styles.muscleRow}>
          <Feather name="target" size={14} color={colors.textSecondary} />
          <Text
            style={[styles.muscleText, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {exercise.muscle}
          </Text>
        </View>
      </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    minHeight: 40,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  muscleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  muscleText: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
    flex: 1,
  },
});

export default ExerciseCard;

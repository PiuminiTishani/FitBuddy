import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface WaterIntakeCardProps {
  currentIntake: number;
  goal: number;
  onAddWater: () => void;
}

const { width } = Dimensions.get('window');

const WaterIntakeCard: React.FC<WaterIntakeCardProps> = ({
  currentIntake,
  goal,
  onAddWater,
}) => {
  const { colors, isDark } = useTheme();
  const percentage = Math.min((currentIntake / goal) * 100, 100);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="droplet" size={24} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Water Intake
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={onAddWater}
          activeOpacity={0.7}
        >
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.stats}>
          <Text style={[styles.currentIntake, { color: colors.text }]}>
            {currentIntake}ml
          </Text>
          <Text style={[styles.goalText, { color: colors.textSecondary }]}>
            of {goal}ml
          </Text>
        </View>

        <View
          style={[
            styles.progressBarBackground,
            { backgroundColor: isDark ? colors.border : '#e2e8f0' },
          ]}
        >
          <View
            style={[
              styles.progressBar,
              {
                width: `${percentage}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>

        <Text style={[styles.percentage, { color: colors.textSecondary }]}>
          {percentage.toFixed(0)}% of daily goal
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  currentIntake: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  goalText: {
    fontSize: 16,
  },
  progressBarBackground: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  percentage: {
    fontSize: 14,
  },
});

export default WaterIntakeCard;

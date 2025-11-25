import React, { useState, useMemo } from 'react';
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
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteWorkout } from '../store/slices/workoutSlice';
import type { WorkoutLog } from '../store/slices/workoutSlice';

const WorkoutHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const workouts = useAppSelector((state) => state.workout.workouts);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group workouts by date
  const workoutsByDate = useMemo(() => {
    const grouped: { [key: string]: WorkoutLog[] } = {};
    workouts.forEach((workout) => {
      const date = new Date(workout.date).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(workout);
    });
    return grouped;
  }, [workouts]);

  const dates = Object.keys(workoutsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Get stats
  const totalWorkouts = workouts.length;
  const thisWeekWorkouts = workouts.filter((w) => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  }).length;

  const handleDelete = (workoutId: string) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteWorkout(workoutId)),
        },
      ]
    );
  };

  const WorkoutCard = ({ workout }: { workout: WorkoutLog }) => (
    <View
      style={[
        styles.workoutCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.workoutHeader}>
        <View style={styles.workoutInfo}>
          <Text style={[styles.workoutName, { color: colors.text }]}>
            {workout.exerciseName}
          </Text>
          <View style={styles.workoutMeta}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    workout.difficulty === 'beginner'
                      ? `${colors.success}20`
                      : workout.difficulty === 'intermediate'
                      ? `${colors.warning}20`
                      : `${colors.error}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color:
                      workout.difficulty === 'beginner'
                        ? colors.success
                        : workout.difficulty === 'intermediate'
                        ? colors.warning
                        : colors.error,
                  },
                ]}
              >
                {workout.difficulty}
              </Text>
            </View>
            <Text style={[styles.muscle, { color: colors.textSecondary }]}>
              {workout.muscle}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(workout.id)}
          style={styles.deleteButton}
        >
          <Feather name="trash-2" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.workoutDetails}>
        <View style={styles.detailItem}>
          <Feather name="repeat" size={16} color={colors.primary} />
          <Text style={[styles.detailText, { color: colors.text }]}>
            {workout.sets} sets × {workout.reps} reps
          </Text>
        </View>
        {workout.weight && (
          <View style={styles.detailItem}>
            <Feather name="activity" size={16} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {workout.weight} kg
            </Text>
          </View>
        )}
        {workout.duration && (
          <View style={styles.detailItem}>
            <Feather name="clock" size={16} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {workout.duration} min
            </Text>
          </View>
        )}
      </View>

      {workout.notes && (
        <Text style={[styles.notes, { color: colors.textSecondary }]}>
          {workout.notes}
        </Text>
      )}

      <Text style={[styles.time, { color: colors.textSecondary }]}>
        {new Date(workout.date).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Workout History
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {totalWorkouts}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Total
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {thisWeekWorkouts}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              This Week
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {dates.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather
              name="calendar"
              size={64}
              color={colors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No workouts logged yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Start tracking your exercises from the Home screen
            </Text>
          </View>
        ) : (
          dates.map((date) => (
            <View key={date} style={styles.dateSection}>
              <View style={styles.dateHeader}>
                <Text style={[styles.dateText, { color: colors.text }]}>
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    { backgroundColor: `${colors.primary}20` },
                  ]}
                >
                  <Text style={[styles.countText, { color: colors.primary }]}>
                    {workoutsByDate[date].length}
                  </Text>
                </View>
              </View>
              {workoutsByDate[date].map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  scrollContent: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
  },
  workoutCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  muscle: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: 8,
  },
  workoutDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
  },
  notes: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WorkoutHistoryScreen;

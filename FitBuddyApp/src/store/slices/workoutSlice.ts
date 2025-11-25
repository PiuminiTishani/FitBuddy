import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WorkoutLog {
  id: string;
  exerciseName: string;
  exerciseType: string;
  muscle: string;
  difficulty: string;
  date: string; // ISO date string
  sets: number;
  reps: number;
  weight?: number; // in kg
  duration?: number; // in minutes
  notes?: string;
}

interface WorkoutState {
  workouts: WorkoutLog[];
}

const initialState: WorkoutState = {
  workouts: [],
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    logWorkout: (state, action: PayloadAction<WorkoutLog>) => {
      state.workouts.unshift(action.payload);
    },
    deleteWorkout: (state, action: PayloadAction<string>) => {
      state.workouts = state.workouts.filter(
        (workout) => workout.id !== action.payload
      );
    },
    setWorkouts: (state, action: PayloadAction<WorkoutLog[]>) => {
      state.workouts = action.payload;
    },
    clearWorkouts: (state) => {
      state.workouts = [];
    },
  },
});

export const { logWorkout, deleteWorkout, setWorkouts, clearWorkouts } =
  workoutSlice.actions;

// Async storage helpers
const WORKOUTS_KEY = 'workout_logs';

export const saveWorkoutsToStorage = async (workouts: WorkoutLog[]) => {
  try {
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Error saving workouts:', error);
  }
};

export const loadWorkoutsFromStorage = async (): Promise<WorkoutLog[]> => {
  try {
    const stored = await AsyncStorage.getItem(WORKOUTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading workouts:', error);
    return [];
  }
};

export default workoutSlice.reducer;

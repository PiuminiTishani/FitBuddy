import { Middleware } from '@reduxjs/toolkit';
import { saveWorkoutsToStorage } from '../slices/workoutSlice';
import { RootState } from '../index';

// Middleware to persist workouts to AsyncStorage
export const workoutPersistMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    // Save workouts to storage whenever workout state changes
    if (action.type?.startsWith('workout/')) {
      const state = store.getState();
      saveWorkoutsToStorage(state.workout.workouts);
    }

    return result;
  };

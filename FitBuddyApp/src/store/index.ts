import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import workoutReducer from './slices/workoutSlice';
import waterReducer from './slices/waterSlice';
import { workoutPersistMiddleware } from './middleware/workoutPersist';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    workout: workoutReducer,
    water: waterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(workoutPersistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

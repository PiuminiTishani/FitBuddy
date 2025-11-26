import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WATER_INTAKE_KEY = 'water_intake';

interface WaterState {
  intake: number;
  goal: number;
  lastUpdated: string;
}

const initialState: WaterState = {
  intake: 0,
  goal: 2500,
  lastUpdated: new Date().toDateString(),
};

const waterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    setWaterIntake: (state, action: PayloadAction<number>) => {
      state.intake = action.payload;
      state.lastUpdated = new Date().toDateString();
    },
    addWater: (state, action: PayloadAction<number>) => {
      state.intake = Math.min(state.intake + action.payload, state.goal * 2);
      state.lastUpdated = new Date().toDateString();
    },
    resetWater: (state) => {
      state.intake = 0;
      state.lastUpdated = new Date().toDateString();
    },
    setWaterGoal: (state, action: PayloadAction<number>) => {
      state.goal = action.payload;
    },
    loadWaterData: (state, action: PayloadAction<{ amount: number; date: string }>) => {
      const today = new Date().toDateString();
      if (action.payload.date === today) {
        state.intake = action.payload.amount;
        state.lastUpdated = action.payload.date;
      } else {
        // Reset for new day
        state.intake = 0;
        state.lastUpdated = today;
      }
    },
  },
});

export const { setWaterIntake, addWater, resetWater, setWaterGoal, loadWaterData } = waterSlice.actions;

// Async thunks
export const loadWaterIntakeFromStorage = () => async (dispatch: any) => {
  try {
    const stored = await AsyncStorage.getItem(WATER_INTAKE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      dispatch(loadWaterData(data));
    }
  } catch (error) {
    console.error('Error loading water intake:', error);
  }
};

export const saveWaterIntakeToStorage = (amount: number) => async () => {
  try {
    const data = {
      amount,
      date: new Date().toDateString(),
    };
    await AsyncStorage.setItem(WATER_INTAKE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving water intake:', error);
  }
};

export default waterSlice.reducer;

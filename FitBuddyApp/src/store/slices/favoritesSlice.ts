import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

interface FavoritesState {
  favorites: Exercise[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Exercise>) => {
      const exists = state.favorites.some(
        (fav) => fav.name === action.payload.name
      );
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (fav) => fav.name !== action.payload
      );
    },
    setFavorites: (state, action: PayloadAction<Exercise[]>) => {
      state.favorites = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

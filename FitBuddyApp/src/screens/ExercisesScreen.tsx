import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { Exercise } from '../store/slices/favoritesSlice';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import ExerciseCard from '../components/ExerciseCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { exerciseAPI } from '../services/exerciseService';

const FAVORITES_STORAGE_KEY = 'favorites';

interface ExercisesScreenProps {
  navigation: any;
}

const ExercisesScreen: React.FC<ExercisesScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { label: 'All', value: 'all', icon: 'grid' },
    { label: 'Beginner', value: 'beginner', icon: 'play' },
    { label: 'Intermediate', value: 'intermediate', icon: 'trending-up' },
    { label: 'Expert', value: 'expert', icon: 'award' },
  ];

  useEffect(() => {
    loadExercises();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, selectedFilter, searchQuery]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        parsedFavorites.forEach((fav: Exercise) => {
          dispatch(addFavorite(fav));
        });
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await exerciseAPI.getExercises();
      setExercises(data);
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadExercises();
    setRefreshing(false);
  }, []);

  const filterExercises = () => {
    let filtered = exercises;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(
        (ex) => ex.difficulty.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(query) ||
          ex.muscle.toLowerCase().includes(query) ||
          ex.type.toLowerCase().includes(query)
      );
    }

    setFilteredExercises(filtered);
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

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Exercises</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {filteredExercises.length} exercises available
          </Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Feather name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search exercises..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterPill,
                {
                  backgroundColor:
                    selectedFilter === filter.value
                      ? colors.primary
                      : colors.card,
                },
              ]}
              onPress={() => setSelectedFilter(filter.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      selectedFilter === filter.value
                        ? '#ffffff'
                        : colors.text,
                  },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Exercises Grid */}
        {filteredExercises.length > 0 ? (
          <View style={styles.exercisesSection}>
            <View style={styles.exercisesGrid}>
              {filteredExercises.map((item, index) => (
                <View key={`${item.name}-${index}`} style={styles.exerciseCardWrapper}>
                  <ExerciseCard
                    exercise={item}
                    onPress={() => handleExercisePress(item)}
                    onFavoritePress={() => handleFavoritePress(item)}
                    isFavorite={isFavorite(item)}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              {searchQuery ? 'No exercises found' : 'No exercises available'}
            </Text>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exercisesSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exerciseCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ExercisesScreen;

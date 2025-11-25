import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../Health App/src/context/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../../Health App/src/store/hooks';
import { exerciseAPI, ExerciseQueryParams } from '../../../Health App/src/services/exerciseService';
import { Exercise } from '../../../Health App/src/store/slices/favoritesSlice';
import { addFavorite, removeFavorite } from '../../../Health App/src/store/slices/favoritesSlice';
import ExerciseCard from '../../../Health App/src/components/ExerciseCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = 'favorites';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state) => state.favorites.favorites);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Expert', value: 'expert' },
  ];

  useEffect(() => {
    loadExercises();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, selectedFilter, searchQuery]);

  useEffect(() => {
    saveFavorites();
  }, [favorites]);

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

  const saveFavorites = async () => {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error('Error saving favorites:', error);
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

    // Filter by difficulty
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(
        (ex) => ex.difficulty.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    // Filter by search query
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

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <ExerciseCard
      exercise={item}
      onPress={() => handleExercisePress(item)}
      onFavoritePress={() => handleFavoritePress(item)}
      isFavorite={isFavorite(item)}
    />
  );

  if (loading) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Fixed Header with Gradient */}
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#16213e'] : [colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        {/* Top Bar with Greeting and Dark Mode Toggle */}
        <View style={styles.topBar}>
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: 'rgba(255, 255, 255, 0.8)' }]}>
              Hello, {user?.name || 'User'}!
            </Text>
            <Text style={[styles.subtitle, { color: 'rgba(255, 255, 255, 0.9)' }]}>
              Ready to workout?
            </Text>
          </View>
          <TouchableOpacity
            style={styles.darkModeToggle}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <Feather
              name={isDark ? 'moon' : 'sun'}
              size={22}
              color='#ffffff'
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            },
          ]}
        >
          <Feather name="search" size={20} color={colors.primary} />
          <TextInput
            style={[styles.searchInput, { color: '#000' }]}
            placeholder="Search workouts..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    selectedFilter === filter.value
                      ? colors.primary
                      : colors.card,
                  borderColor:
                    selectedFilter === filter.value
                      ? colors.primary
                      : colors.border,
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
                    fontWeight: selectedFilter === filter.value ? '600' : '500',
                  },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </LinearGradient>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.resultHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {searchQuery ? 'Search Results' : 'Exercises for You'}
          </Text>
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>
              {filteredExercises.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  darkModeToggle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
  },
  badge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;

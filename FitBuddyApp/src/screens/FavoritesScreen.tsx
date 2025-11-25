import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeFavorite } from '../store/slices/favoritesSlice';
import ExerciseCard from '../components/ExerciseCard';

interface FavoritesScreenProps {
  navigation: any;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);

  const handleExercisePress = (exercise: any) => {
    navigation.navigate('ExerciseDetails', { exercise });
  };

  const handleRemoveFavorite = (exerciseName: string) => {
    dispatch(removeFavorite(exerciseName));
  };

  const renderExerciseItem = ({ item }: { item: any }) => (
    <ExerciseCard
      exercise={item}
      onPress={() => handleExercisePress(item)}
      onFavoritePress={() => handleRemoveFavorite(item.name)}
      isFavorite={true}
    />
  );

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No Favorites Yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Start adding exercises to your favorites!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {favorites.length} {favorites.length === 1 ? 'exercise' : 'exercises'}
        </Text>
      </View>
      <FlatList
        data={favorites}
        renderItem={renderExerciseItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  count: {
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FavoritesScreen;

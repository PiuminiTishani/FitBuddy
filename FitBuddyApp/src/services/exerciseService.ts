import axios from 'axios';
import { Exercise } from '../store/slices/favoritesSlice';

const API_KEY = 'pdmtKrTBy8rCaeeZSBVcxg==4w7azMkOWXlvzimD'; // Replace with actual API key from api-ninjas.com
const BASE_URL = 'https://api.api-ninjas.com/v1/exercises';

// API client configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Api-Key': API_KEY,
  },
});

export interface ExerciseQueryParams {
  muscle?: string;
  type?: string;
  difficulty?: string;
  name?: string;
  offset?: number;
}

export const exerciseAPI = {
  // Fetch exercises based on parameters
  async getExercises(params: ExerciseQueryParams = {}): Promise<Exercise[]> {
    try {
      const response = await apiClient.get('', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      
      // Return mock data if API fails (for development/testing)
      return getMockExercises(params);
    }
  },

  // Get exercises by muscle group
  async getExercisesByMuscle(muscle: string): Promise<Exercise[]> {
    return this.getExercises({ muscle });
  },

  // Get exercises by difficulty
  async getExercisesByDifficulty(difficulty: string): Promise<Exercise[]> {
    return this.getExercises({ difficulty });
  },
};

// Mock data for development/testing
function getMockExercises(params: ExerciseQueryParams): Exercise[] {
  const mockData: Exercise[] = [
    {
      name: 'Push-ups',
      type: 'strength',
      muscle: 'chest',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Start in a plank position with your hands shoulder-width apart. Lower your body until your chest nearly touches the floor. Push yourself back up to the starting position.',
    },
    {
      name: 'Squats',
      type: 'strength',
      muscle: 'quadriceps',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Stand with feet hip-width apart. Bend your knees and lower your body as if sitting back into a chair. Keep your chest up and weight in your heels. Return to standing position.',
    },
    {
      name: 'Pull-ups',
      type: 'strength',
      muscle: 'lats',
      equipment: 'pull-up bar',
      difficulty: 'intermediate',
      instructions: 'Hang from a pull-up bar with hands slightly wider than shoulder-width. Pull yourself up until your chin clears the bar. Lower yourself back down with control.',
    },
    {
      name: 'Plank',
      type: 'strength',
      muscle: 'abdominals',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Start in a push-up position, then lower onto your forearms. Keep your body in a straight line from head to heels. Hold this position.',
    },
    {
      name: 'Lunges',
      type: 'strength',
      muscle: 'quadriceps',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Stand with feet hip-width apart. Step forward with one leg and lower your hips until both knees are bent at 90 degrees. Push back to starting position.',
    },
    {
      name: 'Deadlift',
      type: 'strength',
      muscle: 'lower_back',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Stand with feet hip-width apart, barbell over mid-foot. Bend at hips and knees to grip the bar. Lift by extending hips and knees. Lower the bar by bending at the hips.',
    },
    {
      name: 'Bench Press',
      type: 'strength',
      muscle: 'chest',
      equipment: 'barbell',
      difficulty: 'intermediate',
      instructions: 'Lie on a bench with feet flat on the floor. Grip the barbell slightly wider than shoulder-width. Lower the bar to your chest, then press it back up.',
    },
    {
      name: 'Bicycle Crunches',
      type: 'strength',
      muscle: 'abdominals',
      equipment: 'body_only',
      difficulty: 'beginner',
      instructions: 'Lie on your back with hands behind your head. Bring opposite elbow to opposite knee while extending the other leg. Alternate sides in a pedaling motion.',
    },
    {
      name: 'Burpees',
      type: 'cardio',
      muscle: 'quadriceps',
      equipment: 'body_only',
      difficulty: 'intermediate',
      instructions: 'Start standing, drop into a squat with hands on ground. Kick feet back into plank. Do a push-up, jump feet to hands, and jump up with arms overhead.',
    },
    {
      name: 'Mountain Climbers',
      type: 'cardio',
      muscle: 'abdominals',
      equipment: 'body_only',
      difficulty: 'intermediate',
      instructions: 'Start in a plank position. Alternate bringing your knees toward your chest in a running motion. Keep your core engaged throughout.',
    },
  ];

  // Filter based on params
  let filtered = mockData;
  
  if (params.muscle) {
    filtered = filtered.filter(ex => ex.muscle.toLowerCase() === params.muscle?.toLowerCase());
  }
  
  if (params.difficulty) {
    filtered = filtered.filter(ex => ex.difficulty.toLowerCase() === params.difficulty?.toLowerCase());
  }
  
  if (params.type) {
    filtered = filtered.filter(ex => ex.type.toLowerCase() === params.type?.toLowerCase());
  }

  if (params.name) {
    filtered = filtered.filter(ex => 
      ex.name.toLowerCase().includes(params.name?.toLowerCase() || '')
    );
  }

  return filtered;
}

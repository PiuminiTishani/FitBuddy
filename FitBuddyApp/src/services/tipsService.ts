import axios from 'axios';

const API_KEY = 'pdmtKrTBy8rCaeeZSBVcxg==4w7azMkOWXlvzimD';
const BASE_URL = 'https://api.api-ninjas.com/v1/quotes';

interface Quote {
  quote: string;
  author: string;
  category: string;
}

// API client configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Api-Key': API_KEY,
  },
});

export const tipsAPI = {
  // Fetch a random fitness/motivational tip
  async getDailyTip(): Promise<{ tip: string; category: string }> {
    try {
      const response = await apiClient.get('', {
        params: { category: 'fitness' }
      });
      
      if (response.data && response.data.length > 0) {
        const quote = response.data[0];
        return {
          tip: quote.quote,
          category: 'Fitness Motivation'
        };
      }
      
      // Fallback to mock data
      return getRandomMockTip();
    } catch (error) {
      console.error('Error fetching daily tip:', error);
      return getRandomMockTip();
    }
  },
};

// Mock fitness tips for fallback
function getRandomMockTip(): { tip: string; category: string } {
  const mockTips = [
    {
      tip: 'Protein is essential for muscle repair and growth after workouts.',
      category: 'Nutrition'
    },
    {
      tip: 'Stay hydrated! Drink water before, during, and after your workout.',
      category: 'Hydration'
    },
    {
      tip: 'Warm up for 5-10 minutes before exercising to prevent injuries.',
      category: 'Safety'
    },
    {
      tip: 'Get 7-9 hours of sleep each night for optimal muscle recovery.',
      category: 'Recovery'
    },
    {
      tip: 'Consistency beats intensity. Show up every day, even if just for 10 minutes.',
      category: 'Motivation'
    },
    {
      tip: 'Mix cardio and strength training for balanced fitness.',
      category: 'Training'
    },
    {
      tip: 'Listen to your body. Rest when you need it to avoid burnout.',
      category: 'Recovery'
    },
    {
      tip: 'Eat a balanced meal with carbs and protein within 2 hours after working out.',
      category: 'Nutrition'
    },
    {
      tip: 'Stretch after your workout to improve flexibility and reduce soreness.',
      category: 'Flexibility'
    },
    {
      tip: 'Set realistic goals and track your progress to stay motivated.',
      category: 'Motivation'
    },
  ];
  
  const randomIndex = Math.floor(Math.random() * mockTips.length);
  return mockTips[randomIndex];
}

export default tipsAPI;

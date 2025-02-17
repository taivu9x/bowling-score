import axios, { AxiosResponse, AxiosError } from 'axios';
import { GameState } from '@/types/bowling';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.request);
      return Promise.reject({ message: 'Network error', status: 500 });
    }
    console.error('Request Error:', error.message);
    return Promise.reject({ message: error.message, status: 500 });
  }
);

// Game API endpoints
export const gameAPI = {
  // Get all games
  getAllGames: async (): Promise<GameState[]> => {
    const response = await api.get('/games');
    return response.data.data;
  },

  // Get single game
  getGame: async (gameId: string): Promise<GameState> => {
    const response = await api.get(`/games/${gameId}`);
    return response.data.data;
  },

  // Create new game
  createGame: async (): Promise<GameState> => {
    const response = await api.post('/games');
    return response.data.data;
  },

  // Complete game
  completeGame: async (gameId: string): Promise<GameState> => {
    const response = await api.post(`/games/${gameId}/complete`);
    return response.data.data;
  },

  // Start game
  startGame: async (gameId: string): Promise<GameState> => {
    const response = await api.post(`/games/${gameId}/start`);
    return response.data.data;
  },

  // add player
  addPlayer: async (gameId: string, playerId: string, playerName?: string): Promise<GameState> => {
    const response = await api.post(`/games/${gameId}/join`, { playerId, playerName });
    return response.data.data;
  },

  // remove player
  removePlayer: async (gameId: string, playerId: string): Promise<GameState> => {
    const response = await api.delete(`/games/${gameId}/leave`, { data: { playerId } });
    return response.data.data;
  },

  // roll
  roll: async (gameId: string, playerId: string, rolls: number[][]): Promise<GameState> => {
    const response = await api.post(`/games/${gameId}/roll`, { playerId, rolls });
    return response.data.data;
  }
};

// Types
export interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface APIError {
  message: string;
  status: number;
}

export default api; 
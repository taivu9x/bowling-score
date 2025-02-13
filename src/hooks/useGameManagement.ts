import { Game, Scores } from '@/types/bowling';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
export const useGameManagement = () => {
  const [games, setGames] = useLocalStorage<Game[]>("games", []);
  const [currentGame, setCurrentGame] = useLocalStorage<Game | null>("currentGame", null);

  const startNewGame = (players: string[], scores: Scores) => {
    const newGame: Game = {
      id: uuidv4(),
      date: new Date().toISOString(),
      players,
      scores,
      completed: false
    };
    setCurrentGame(newGame);
    setGames(prev => [...prev, newGame]);
  };

  const saveGame = (game: Game) => {
    setGames(prev => 
      prev.map(g => g.id === game.id ? game : g)
    );
  };

  const loadGame = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      setCurrentGame(game);
    }
  };

  const completeGame = (scores: Scores, players: string[]) => {
    if (currentGame) {
      const completedGame = { 
        ...currentGame, 
        completed: true, 
        scores, 
        players 
      };
      setCurrentGame(completedGame);
      saveGame(completedGame);
    }
  };

  return {
    games,
    currentGame,
    startNewGame,
    loadGame,
    completeGame,
    saveGame,
    setCurrentGame
  };
}; 
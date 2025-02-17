'use client'

import { gameAPI } from '@/services/api';
import { GameState, GameStatus } from '@/types/bowling';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const GameHistoryClient = () => {
  const router = useRouter();
  const [games, setGames] = useState<GameState[]>([]);

  const handleLoadGame = (gameId: string) => {
    router.push(`/${gameId}`);
  };

  useEffect(() => {
    gameAPI.getAllGames().then((games) => {
      console.log(games);
      setGames(games);
    });
  }, []);
  
  return (
    <div className="mt-4" suppressHydrationWarning>
      <h2 className="text-xl font-bold mb-2">Game History</h2>
      <div className="space-y-2">
        {games.map(game => (
          <div 
            key={game.gameId} 
            className="p-4 bg-gray-800 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-bold" suppressHydrationWarning>
                {game.gameId} {game.status === GameStatus.COMPLETED ? "(Completed)" : "(In Progress)"}
              </p>
              <p className="text-sm text-gray-400">
                Players: {game.playerStates.map(player => player.name).join(', ')}
              </p>
            </div>
            <button
              onClick={() => handleLoadGame(game.gameId)}
              className="px-4 py-2 bg-blue-500 rounded"
            >
              Load Game
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistoryClient; 
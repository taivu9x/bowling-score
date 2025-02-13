'use client'

import { Game } from '@/types/bowling';

interface GameHistoryProps {
  games: Game[];
  onLoadGame: (gameId: string) => void;
}

const GameHistoryClient = ({ games, onLoadGame }: GameHistoryProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="mt-4" suppressHydrationWarning>
      <h2 className="text-xl font-bold mb-2">Game History</h2>
      <div className="space-y-2">
        {games.map(game => (
          <div 
            key={game.id} 
            className="p-4 bg-gray-800 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-bold" suppressHydrationWarning>
                {formatDate(game.date)}
              </p>
              <p className="text-sm text-gray-400">
                Players: {game.players.join(', ')}
              </p>
            </div>
            <button
              onClick={() => onLoadGame(game.id)}
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
'use client'

import { GameState } from '@/types/bowling';
import { useState } from 'react';

interface PlayerSetupProps {
  game: GameState;
  onAddPlayer: (playerId: string, playerName?: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onStartGame: () => void;
}

export const PlayerSetup = ({ game, onAddPlayer, onStartGame }: PlayerSetupProps) => {
  const [playerName, setPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      onAddPlayer(crypto.randomUUID(), playerName.trim());
      setPlayerName('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Players</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="flex-1 p-2 bg-gray-800 rounded"
          placeholder="Player name"
        />
        <button
          onClick={handleAddPlayer}
          className="px-4 py-2 bg-blue-500 rounded"
        >
          Add
        </button>
      </div>
      <div className="mb-4">
        {game.playerStates.map((player) => (
          <div key={player.playerId} className="p-2 bg-gray-800 rounded mb-2">
            {player.name}
          </div>
        ))}
      </div>
      <button
        onClick={onStartGame}
        disabled={game.playerStates.length === 0}
        className="w-full px-4 py-2 bg-green-500 rounded disabled:opacity-50"
      >
        Start Game
      </button>
    </div>
  );
}; 
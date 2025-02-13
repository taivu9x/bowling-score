'use client'

import { useState } from 'react';

interface PlayerSetupProps {
  onStartGame: () => void;
}

export const PlayerSetup = ({ onStartGame }: PlayerSetupProps) => {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      setPlayers([...players, playerName.trim()]);
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
        {players.map((player, index) => (
          <div key={index} className="p-2 bg-gray-800 rounded mb-2">
            {player}
          </div>
        ))}
      </div>
      <button
        onClick={onStartGame}
        disabled={players.length === 0}
        className="w-full px-4 py-2 bg-green-500 rounded disabled:opacity-50"
      >
        Start Game
      </button>
    </div>
  );
}; 
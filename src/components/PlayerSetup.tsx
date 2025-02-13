'use client'

import { useState } from 'react';

interface PlayerSetupProps {
  players: string[];
  onAddPlayer: (name: string) => void;
  onStartGame: () => void;
  onDeletePlayer: (name: string) => void;
}

export const PlayerSetup = ({ players, onAddPlayer, onStartGame, onDeletePlayer }: PlayerSetupProps) => {
  const [newPlayer, setNewPlayer] = useState("");
  const handleAddPlayer = () => {
    if (newPlayer.trim() && players.length < 5) {
      onAddPlayer(newPlayer.trim());
      setNewPlayer("");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Bowling Score Tracker</h1>
      <input
        type="text"
        value={newPlayer}
        onChange={(e) => setNewPlayer(e.target.value)}
        placeholder="Enter player name"
        className="w-full p-2 rounded bg-gray-700 mb-2"
      />
      <button
        onClick={handleAddPlayer}
        className="w-full bg-blue-500 py-2 rounded mb-4 disabled:opacity-50"
        disabled={players.length >= 5}
      >
        Add Player
      </button>
      <ul className="mb-4">
        {players.map((player, index) => (
          <li key={index} className="p-2 bg-gray-700 rounded mb-2">
            {player}
            <button
              onClick={() => onDeletePlayer(player)}
              className="ml-2 text-red-500"
            >
              X
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={onStartGame}
        className="w-full bg-green-500 py-2 rounded disabled:opacity-50"
        disabled={players.length === 0}
      >
        Start Game
      </button>
    </div>
  );
}; 
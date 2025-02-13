'use client'

import { useState, useEffect } from "react";
import { PlayerSetup } from "@/components/PlayerSetup";
import { ScoreTable } from "@/components/ScoreTable";
import { useScoring } from "@/hooks/useScoring";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const { scores, addPlayerScore, updateScore, calculateScore, getFrameScore } = useScoring();

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddPlayer = (playerName: string) => {
    setPlayers([...players, playerName]);
    addPlayerScore(playerName);
  };

  const startGame = () => {
    if (players.length > 0) {
      setGameStarted(true);
    }
  };

  // Show nothing until client-side code is ready
  if (!isClient) {
    return null;
  }

  return (
    <div>
      <main className="min-h-screen bg-gray-900 text-white p-4">
        {!gameStarted ? (
          <PlayerSetup
            players={players}
            onAddPlayer={handleAddPlayer}
            onStartGame={startGame}
          />
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Game Started!</h1>
            <ScoreTable
              players={players}
              scores={scores}
              onUpdateScore={updateScore}
              calculateScore={calculateScore}
              getFrameScore={getFrameScore}
            />
          </div>
        )}
      </main>
    </div>
  );
}

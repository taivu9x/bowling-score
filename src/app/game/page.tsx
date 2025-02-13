'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useScoring } from "@/hooks/useScoring";
import { useGameManagement } from "@/hooks/useGameManagement";
import ScoreTable from "@/components/ScoreTable";
export default function Game() {
  const router = useRouter();
  const { currentGame, completeGame } = useGameManagement();
  const { scores, updateScore, calculateScore, getFrameScore, resetScores, setScores, setPlayers } = useScoring();

  useEffect(() => {
    if (!currentGame) {
      router.push('/');
      resetScores();
      return;
    }

    setScores(currentGame.scores);
    setPlayers(currentGame.players);
    
  }, [currentGame, router]);

  const handleCompleteGame = () => {
    completeGame(scores, currentGame?.players || []);
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Game In Progress</h1>
        <ScoreTable
          players={currentGame?.players || []}
          scores={scores}
          onUpdateScore={updateScore}
          calculateScore={calculateScore}
          getFrameScore={getFrameScore}
          onCompleteGame={handleCompleteGame}
        />
      </div>
    </main>
  );
} 
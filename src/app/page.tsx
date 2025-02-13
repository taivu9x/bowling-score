'use client'

import GameHistory from "@/components/GameHistory";
import { PlayerSetup } from "@/components/PlayerSetup";
import { useGameManagement } from "@/hooks/useGameManagement";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { games, startNewGame, loadGame } = useGameManagement();

  const handleStartGame = () => {
    startNewGame([], {});
    router.push('/game');
  };

  const handleLoadGame = (gameId: string) => {
    loadGame(gameId);
    router.push('/game');
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <PlayerSetup
        onStartGame={handleStartGame}
      />
      <GameHistory 
        games={games} 
        onLoadGame={handleLoadGame}
      />
    </main>
  );
}

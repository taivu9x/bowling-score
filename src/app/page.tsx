'use client'

import GameHistory from "@/components/GameHistory";
import { gameAPI } from "@/services/api";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const handleStartGame = () => {
    gameAPI.createGame().then((game) => {
      router.push(`/${game.gameId}`);
    });
  };
 

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Bowling Game</h1>
        <button onClick={handleStartGame}>Start Game</button>
      </div>
      <GameHistory />
    </main>
  );
}

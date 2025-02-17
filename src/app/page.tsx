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
        <div className="flex justify-end">
        <button className="space-x-2 cursor-pointer bg-green-500 p-2 rounded-md flex items-center w-[200px]" onClick={handleStartGame}>
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Start New Game</span>
        </button>
        </div>
      </div>
      <GameHistory />
    </main>
  );
}

'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScoreTable from "@/components/ScoreTable";
import { gameAPI } from '@/services/api';
import { wsService } from '@/services/websocket';
import { GameState, GameStatus } from '@/types/bowling';
import { PlayerSetup } from '@/components/PlayerSetup';

export default function Game() {
  const { id } = useParams();
  const router = useRouter();
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial game load and WebSocket setup
  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true);
        const gameData = await gameAPI.getGame(id as string);
        setGame(gameData);

        // Setup WebSocket connection
        wsService.connect(id as string, async (update) => {
          if (update.type === 'gameUpdate') {
            // fetch the game again
            console.log('Game updated:', update);
            const gameData = await gameAPI.getGame(id as string);
            setGame(gameData);
          }
        });
      } catch (err) {
        setError('Failed to load game');
        console.error('Error loading game:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGame();

    // Cleanup WebSocket on unmount
    return () => {
      wsService.disconnect();
    };
  }, [id, router]);

  const handleCompleteGame = async () => {
    try {
      await gameAPI.completeGame(id as string);
      router.push('/');
    } catch (err) {
      setError('Failed to complete game');
      console.error('Error completing game:', err);
    }
  };

  const handleAddPlayer = async (playerId: string, playerName?: string) => {
    try {
      await gameAPI.addPlayer(id as string, playerId, playerName);
    } catch (err) {
      setError('Failed to add player');
      console.error('Error adding player:', err);
    }
  };

  const handleRemovePlayer = async (player: string) => {
    try {
      await gameAPI.removePlayer(id as string, player);
    } catch (err) {
      setError('Failed to remove player');
      console.error('Error removing player:', err);
    }
  };

  const handleStartGame = async () => {
    try {
      await gameAPI.startGame(id as string);
    } catch (err) {
      setError('Failed to start game');
      console.error('Error starting game:', err);
    }
  };

  const handleRoll = async (playerId: string, rolls: number[][]) => {
    try {
      await gameAPI.roll(id as string, playerId, rolls);
    } catch (err) {
      setError('Failed to roll');
      console.error('Error rolling:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div>Game not found</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Game {id}</h1>
        {!wsService.isConnected() && (
          <div className="text-yellow-500 mb-4">
            Reconnecting to game...
          </div>
        )}

        {game.status === GameStatus.IN_PROGRESS && (
          <ScoreTable
            game={game}
            onCompleteGame={handleCompleteGame}
            onRoll={handleRoll}
          />
        )}

        {game.status === GameStatus.WAITING && (
          <PlayerSetup
            game={game}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            onStartGame={handleStartGame}
          />
        )}
        
        
      </div>
    </main>
  );
} 
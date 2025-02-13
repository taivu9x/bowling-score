'use client'

import { useCallback, useEffect, useState } from "react";
import { PlayerSetup } from "@/components/PlayerSetup";
import { ScoreTable } from "@/components/ScoreTable";
import { useScoring } from "@/hooks/useScoring";
import { useGameManagement } from "@/hooks/useGameManagement";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GameHistory from "@/components/GameHistory";

export default function Home() {
  const { games, currentGame, startNewGame, loadGame, completeGame, setCurrentGame } = useGameManagement();
  const { scores, players, addPlayerScore, updateScore, calculateScore, getFrameScore, setScores, setPlayers, deletePlayerScore, resetScores } = useScoring();
  const [gameStarted, setGameStarted] = useState(currentGame?.completed);

  useEffect(() => {
    if (currentGame) {
      setScores(currentGame.scores);
      setPlayers(currentGame.players);
    } else {
      resetScores();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGame]);

  const handleAddPlayer = (playerName: string) => {
    addPlayerScore(playerName);
  };

  const handleDeletePlayer = (playerName: string) => {
    deletePlayerScore(playerName);
  };

  const handleStartGame = useCallback(() => {
    startNewGame(players, scores);
    setGameStarted(true);
  }, [players, scores, startNewGame]);

  const handleLoadGame = (gameId: string) => {
    loadGame(gameId);
    setGameStarted(true);
  };

  const handleCompleteGame = useCallback(() => {
    completeGame(
      scores,
      players
    );
    setCurrentGame(null);
    setGameStarted(false);
  }, [completeGame, players, scores, setCurrentGame]);

  return (
    <div>
      <main className="min-h-screen bg-gray-900 text-white p-4">
        <ErrorBoundary>
          {!gameStarted ? (
            <>
              <PlayerSetup
                players={players}
                onAddPlayer={handleAddPlayer}
                onDeletePlayer={handleDeletePlayer}
                onStartGame={handleStartGame}
              />
              <GameHistory 
                games={games} 
                onLoadGame={handleLoadGame}
              />
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Game Started!</h1>
              <ScoreTable
                players={players}
                scores={scores}
                onUpdateScore={updateScore}
                calculateScore={calculateScore}
                getFrameScore={getFrameScore}
                onCompleteGame={handleCompleteGame}
              />
            </div>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}

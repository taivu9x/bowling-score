'use client'

import { Roll } from '@/types/bowling';
import { useMemo } from 'react';

interface ScoreTableProps {
  players: string[];
  scores: { [key: string]: string[][] };
  onUpdateScore: (player: string, frame: number, index: number, value: Roll) => void;
  calculateScore: (player: string) => number;
  getFrameScore: (frame: number, rolls: string[][]) => number;
}

export const ScoreTable = ({ players, scores, onUpdateScore, calculateScore, getFrameScore }: ScoreTableProps) => {
  // Cache frame scores for each player
  const playerFrameScores = useMemo(() => {
    return players.reduce((acc, player) => {
      acc[player] = calculateScore(player);
      return acc;
    }, {} as Record<string, number>);
  }, [players, calculateScore]);

  // Cache running totals using progressive sum
  const runningTotals = useMemo(() => {
    return players.reduce((acc, player) => {
      const frameScores = Array(10).fill(0).map((_, frame) => {
        let total = 0;
        for (let i = 0; i <= frame; i++) {
          total += getFrameScore(i, scores[player]) - getFrameScore(i - 1, scores[player]);
        }
        return total;
      });
      acc[player] = frameScores;
      return acc;
    }, {} as Record<string, number[]>);
  }, [players, getFrameScore, scores]);

  const validateInput = (player: string, value: string, frame: number, index: number, previousValue: string): boolean => {
    // Allow empty input
    if (value === "") return true;
    
    // Allow "X" only on first throw (except in frame 10)
    if (value === "X" && index === 0) return true;
    // Allow "X" in frame 10 second throw if first was "X"
    if (frame === 9 && index === 1 && previousValue === "X" && value === "X") return true;
    // Allow "X" in frame 10 third throw if second was "X" or "/"
    if (frame === 9 && index === 2 && (scores[player][frame][1] === "X" || scores[player][frame][1] === "/") && value === "X") return true;
    // Allow "/" only on second throw or frame 10 third throw
    if (value === "/" && index > 0) {
      return true;
    }

    // Validate numeric input
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 9) return false;

    // First throw can be 0-9
    if (index === 0) return true;

    // Second throw validation (ensure sum doesn't exceed 10)
    if (index === 1) {
      const firstThrow = parseInt(previousValue) || 0;
      return firstThrow + numValue < 10;
    }

    // Third throw in frame 10
    if (frame === 9 && index === 2) {
      const secondThrow = scores[player][frame][1];
      if (secondThrow === "/") return true;
      if (secondThrow === "X") return true;
      return +secondThrow + numValue < 10;
    }

    return false;
  };

  const isInputDisabled = (player: string, frame: number, index: number): boolean => {
    if (!scores[player]?.[frame]) return false;
    
    // If not the last frame, disable second throw after a strike
    if (frame !== 9 && index === 1 && scores[player][frame][0] === "X") {
      return true;
    }

    // In frame 10
    if (frame === 9) {
      // Disable third throw unless second is strike or spare
      if (index === 2) {
        const firstThrow = scores[player][frame][0];
        const secondThrow = scores[player][frame][1];
        if (firstThrow !== "X" && secondThrow !== "X" && secondThrow !== "/") {
          return true;
        }
      }
    }

    return false;
  };

  const clearSubsequentThrows = (player: string, frame: number, index: number) => {
    // For 10th frame
    if (frame === 9) {
      // If clearing first throw, clear second and third
      if (index === 0) {
        onUpdateScore(player, frame, 1, "");
        onUpdateScore(player, frame, 2, "");
      }
      // If clearing second throw, clear third
      else if (index === 1) {
        onUpdateScore(player, frame, 2, "");
      }
    }
    // For frames 1-9
    else {
      // If clearing first throw, clear second
      if (index === 0) {
        onUpdateScore(player, frame, 1, "");
      }
    }
  };

  const handleScoreChange = (player: string, frame: number, index: number, value: string) => {
    const previousValue = index === 1 ? scores[player][frame][0] : scores[player][frame][1];
    const normalizedValue = value.toUpperCase();

    if (!validateInput(player, normalizedValue, frame, index, previousValue)) {
      return;
    }

    onUpdateScore(player, frame, index, normalizedValue as Roll);
    if (normalizedValue === "") {
      clearSubsequentThrows(player, frame, index);
      return;
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="text-sm text-gray-400 mb-2">
        0-9, / (spare), X (strike)
      </div>
      <table className="w-full border-collapse border border-gray-700">
        <thead>
          <tr>
            <th className="border border-gray-700 p-2">Player</th>
            {[...Array(10)].map((_, frame) => (
              <th key={frame} className="border border-gray-700 p-2">
                Frame {frame + 1}
              </th>
            ))}
            <th className="border border-gray-700 p-2">Total Score</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player}>
              <td className="border border-gray-700 p-2 font-bold">{player}</td>
              {[...Array(10)].map((_, frame) => (
                <td key={frame} className="border border-gray-700 p-2 text-center">
                  <div className="flex flex-col">
                    <div className="flex justify-center space-x-1">
                      {scores[player]?.[frame].map((score, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          className={`w-8 bg-gray-800 text-white text-center rounded 
                            ${isInputDisabled(player, frame, index) ? 'opacity-50' : ''}`}
                          value={score || ""}
                          disabled={isInputDisabled(player, frame, index)}
                          onChange={(e) => handleScoreChange(player, frame, index, e.target.value)}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {runningTotals[player]?.[frame]}
                    </div>
                  </div>
                </td>
              ))}
              <td className="border border-gray-700 p-2 font-bold">
                {playerFrameScores[player]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 
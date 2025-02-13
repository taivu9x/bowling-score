import { useState, useCallback } from 'react';
import { Roll, Frame, Scores } from '@/types/bowling';

export const useScoring = () => {
  const [scores, setScores] = useState<Scores>({})
  const [players, setPlayers] = useState<string[]>([]);
  const addPlayerScore = (playerName: string) => {
    setPlayers([...players, playerName]);
    setScores(prev => ({
      ...prev,
      [playerName]: Array(9).fill(['', ''] as Frame).concat([['', '', ''] as Frame])
    }));
  };

  const deletePlayerScore = (playerName: string) => {
    setPlayers(prev => prev.filter(player => player !== playerName));
    setScores(prev => {
      const newScores = { ...prev };
      delete newScores[playerName];
      return newScores;
    });
  };

  const updateScore = (player: string, frame: number, index: number, value: Roll) => {
    setScores(prev => {
      const newScores = { ...prev };
      newScores[player] = [...newScores[player]];
      newScores[player][frame] = [...newScores[player][frame]] as Frame;
      newScores[player][frame][index] = value;
      return newScores;
    });
  };

  // Memoize the getValueFromRoll function
  const getValueFromRoll = useCallback((roll: string, previousRoll: number = 0): number => {
    if (roll === "X") return 10;
    if (roll === "/") return 10 - previousRoll;
    return parseInt(roll) || 0;
  }, []);

  const getFrameScore = useCallback((frame: number, rolls: string[][]): number => {
    if (!rolls?.[frame]) {
      return 0;
    }

    const [first, second, third] = rolls[frame] || ["", "", ""];
    const firstVal = getValueFromRoll(first);
    
    if (frame === 9) {
      if (first === "X") {
        const secondVal = getValueFromRoll(second);
        const thirdVal = getValueFromRoll(third, secondVal);
        return 10 + secondVal + thirdVal;
      } else if (second === "/") {
        return 10 + getValueFromRoll(third);
      } else {
        return firstVal + getValueFromRoll(second, firstVal);
      }
    }

    const nextFrame = rolls[frame + 1] || ["", ""];
    
    if (first === "X") {
      const nextFirstVal = getValueFromRoll(nextFrame[0]);
      if (nextFrame[0] === "X" && frame < 8) {
        const nextNextFirstVal = getValueFromRoll(rolls[frame + 2]?.[0]);
        return 10 + nextFirstVal + nextNextFirstVal;
      }
      const nextSecondVal = getValueFromRoll(nextFrame[1], nextFirstVal);
      return 10 + nextFirstVal + nextSecondVal;
    }
    
    if (second === "/") {
      const nextFirstVal = getValueFromRoll(nextFrame[0]);
      return 10 + nextFirstVal;
    }
    
    return firstVal + getValueFromRoll(second, firstVal);
  }, [getValueFromRoll]);

  const calculateScore = useCallback((player: string) => {
    let totalScore = 0;
    const playerScores = scores[player] || [];
    
    for (let frame = 0; frame < 10; frame++) {
      totalScore += getFrameScore(frame, playerScores);
    }
    
    return totalScore;
  }, [getFrameScore, scores]);

  const resetScores = () => {
    setScores({});
    setPlayers([]);
  }

  return {
    scores,
    players,
    addPlayerScore,
    updateScore,
    calculateScore,
    getFrameScore,
    setScores,
    setPlayers,
    resetScores,
    deletePlayerScore
  };
}; 
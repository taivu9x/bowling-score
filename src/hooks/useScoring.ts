import { useState } from 'react';

type Scores = { [key: string]: string[][] };

export const useScoring = () => {
  const [scores, setScores] = useState<Scores>({});

  const addPlayerScore = (playerName: string) => {
    setScores((prevScores) => ({
      ...prevScores,
      [playerName]: Array(9).fill(["", ""]).concat([["", "", ""]]),
    }));
  };

  const updateScore = (player: string, frame: number, index: number, value: string) => {
    setScores((prev) => {
      const newScores = { ...prev };
      newScores[player] = [...newScores[player]];
      newScores[player][frame] = [...newScores[player][frame]];
      newScores[player][frame][index] = value;
      return newScores;
    });
  };

  const getValueFromRoll = (roll: string, previousRoll: number = 0): number => {
    if (roll === "X") return 10;
    if (roll === "/") return 10 - previousRoll;
    return parseInt(roll) || 0;
  };

  const getFrameScore = (frame: number, rolls: string[][]): number => {
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
  };

  const calculateScore = (player: string) => {
    let totalScore = 0;
    const playerScores = scores[player] || [];
    
    for (let frame = 0; frame < 10; frame++) {
      totalScore += getFrameScore(frame, playerScores);
    }
    
    return totalScore;
  };

  return {
    scores,
    addPlayerScore,
    updateScore,
    calculateScore,
  };
}; 
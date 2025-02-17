'use client'

import { GameState } from '@/types/bowling';
import { useMemo } from 'react';
interface ScoreTableProps {
  game: GameState;
  onCompleteGame: () => void;
  onRoll: (playerId: string, rolls: number[][]) => void;
}

const ScoreTableClient = ({ game, onCompleteGame, onRoll }: ScoreTableProps) => {
  const playerStates = useMemo(() => {
    return game.playerStates.map((player) => {
      return {
        ...player,
        frames: [...Array(10)].map((_, frame) => {
          const rolls = frame === 9 ? [0, 0, 0] : [0, 0];
          return {
            ...player.frames[frame],
            rolls: rolls.map((roll, index) => {
              return player.frames[frame]?.rolls[index] || roll;
            })
          }
        })
      };
    });
  }, [game.playerStates]);
  
  // validate input
  const validateInput = (playerId: string, frame: number, roll: number, pins: string) => {
    const pinsInt = parseInt(pins);
    if (isNaN(pinsInt)) return false;

    if (pinsInt > 10) return false;

    const player = playerStates.find(p => p.playerId === playerId);
    if (!player) return false;

    const frameRolls = player.frames[frame].rolls;
    const totalPins = frameRolls.reduce((acc, curr, index) => {
      if (index === roll) {
        return acc + pinsInt;
      }

      return acc + curr;
    }, 0);
    console.log(totalPins);
    if (totalPins > 10 && frame !== 9) return false;
    return true;
  }
  

  const handleRoll = (playerId: string, frame: number, roll: number, pins: string) => {
    const player = playerStates.find(p => p.playerId === playerId);

    if (!player) {
      return;
    }

    if (!validateInput(playerId, frame, roll, pins)) {
      console.log("invalid input");
      return;
    }

    const newFrames: number[][] = player.frames.map((f, i) => {
      let newRolls: number[] = [];
      if (i === frame) {
        newRolls = f.rolls.map((r, j) => j === roll ? (+pins) : r)
      } else {
        newRolls = f.rolls;
      }
      return newRolls;
    })
  
    onRoll(playerId, newFrames);
  }


  return (
    <div className="overflow-x-auto">
      <div className="text-sm text-gray-400 mb-2">
        0-9 or 10
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
          {playerStates.map((player) => (
            <tr key={player.playerId}>
              <td className="border border-gray-700 p-2 font-bold">{player.name}</td>
              {player.frames.map((frame, iFrame) => (
                <td key={iFrame} className="border border-gray-700 p-2 text-center">
                  <div className="flex flex-col">
                    <div className="flex justify-center space-x-1">
                      {frame.rolls.map((roll, iRoll) => (
                        <input
                          key={iRoll}
                          type="text"
                          maxLength={2}
                          className={`w-8 bg-gray-800 text-white text-center rounded`}
                          value={roll || ""}
                          onChange={(e) => handleRoll(player.playerId, iFrame, iRoll, e.target.value)}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {frame.score}
                    </div>
                  </div>
                </td>
              ))}
              {/* // total score */}
              <td className="border border-gray-700 p-2 font-bold">
                {player.score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={onCompleteGame}
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Complete Game
      </button>
    </div>
  );
};

export default ScoreTableClient;
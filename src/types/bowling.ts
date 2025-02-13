export type Roll = '' | 'X' | '/' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type Frame = [Roll, Roll] | [Roll, Roll, Roll];
export type Scores = Record<string, Frame[]>;

export interface Player {
  name: string;
  frames: Frame[];
  totalScore: number;
}

export interface GameState {
  players: Player[];
  currentFrame: number;
  isComplete: boolean;
} 
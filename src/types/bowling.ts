export type Roll = '' | 'X' | '/' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export interface Frame {
  rolls: number[];
  score: number;
}
export interface PlayerState {
  playerId: string;
  name: string;
  frames: Frame[];
  score: number;
  isComplete: boolean;
}

export enum GameStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  WAITING = 'WAITING',
}

export interface GameState {
  gameId: string;
  status: GameStatus;
  playerStates: PlayerState[];
  score: number;
}

export interface playerPayload {
  playerId: string;
  playerName?: string;
}
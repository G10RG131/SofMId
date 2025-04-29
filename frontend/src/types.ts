export interface Flashcard {
  front: string;
  back: string;
  hint?: string;
}

export type GestureType = 'easy' | 'medium' | 'hard' | 'none';

export interface GestureResult {
  gesture: GestureType;
  timestamp: number;
}
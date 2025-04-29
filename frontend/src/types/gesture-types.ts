export type GestureType = 'easy' | 'medium' | 'hard' | 'none';
export interface GestureResult { gesture: GestureType; timestamp: number; }
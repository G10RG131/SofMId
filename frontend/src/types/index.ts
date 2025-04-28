
export interface Flashcard {
    front: string;
    back: string;
    hint?: string;
  }
  
  export enum AnswerDifficulty {
    Easy = 0,
    Medium = 1,
    Hard = 2,
  }
  
  export interface PracticeSession {
    cards: Flashcard[];
    day: number;
  }
  
  export interface UpdateRequest {
    cardFront: string;
    cardBack: string;
    difficulty: AnswerDifficulty;
  }
  
  export interface ProgressStats {
    totalReviewed: number;
    accuracy: number;
    bucketDistribution: Record<number, number>;
  }
  
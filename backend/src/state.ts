import { Flashcard, BucketMap, AnswerDifficulty } from "./logic/flashcards";
import { PracticeRecord } from "./types";

const flashcards: Flashcard[] = [];

/**
 * Checks if a flashcard with the given back text already exists.
 * @param backText - The back text to check.
 * @returns True if a flashcard with the back text exists, false otherwise.
 */
export function doesCardBackExist(backText: string): boolean {
  return flashcards.some((card) => card.back === backText);
}

// Export flashcards for testing or other modules
export { flashcards };


// Initial Flashcards data
const initialCards: Flashcard[] = [
  new Flashcard("der Tisch", "the table", "Starts with T", ["noun", "german"]),
  new Flashcard("la silla", "the chair", "Starts with S", ["noun", "spanish"]),
  new Flashcard("bonjour", "hello", "Greeting", ["phrase", "french"]),
  new Flashcard("arigato", "thank you", "Expression of gratitude", [
    "phrase",
    "japanese",
  ]),
  new Flashcard("der Hund", "the dog", "Common pet", ["noun", "german"]),
  new Flashcard("el gato", "the cat", "Common pet", ["noun", "spanish"]),
];

// State variables
let currentBuckets: BucketMap = new Map();
currentBuckets.set(0, new Set(initialCards));

let practiceHistory: PracticeRecord[] = [];
let currentDay: number = 0;

// State Accessors & Mutators
export function getBuckets(): BucketMap {
  return currentBuckets;
}

export function setBuckets(newBuckets: BucketMap): void {
  currentBuckets = newBuckets;
}

export function getHistory(): PracticeRecord[] {
  return practiceHistory;
}

export function addHistoryRecord(record: PracticeRecord): void {
  practiceHistory.push(record);
}

export function getCurrentDay(): number {
  return currentDay;
}

export function incrementDay(): void {
  currentDay++;
}

// Helper Functions
export function findCard(front: string, back: string): Flashcard | undefined {
  for (const bucket of currentBuckets.values()) {
    for (const card of bucket) {
      if (card.front === front && card.back === back) {
        return card;
      }
    }
  }
  return undefined;
}

export function findCardBucket(cardToFind: Flashcard): number | undefined {
  for (const [bucketNumber, bucket] of currentBuckets.entries()) {
    if (bucket.has(cardToFind)) {
      return bucketNumber;
    }
  }
  return undefined;
}

// Log initial state for verification
console.log("Initial state loaded:", {
  currentBuckets,
  practiceHistory,
  currentDay,
});

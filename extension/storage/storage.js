import { makeFlashcard } from './flashcard.js';

export async function saveFlashcard(cardOrPayload) {
  const { flashcards = [] } = await chrome.storage.local.get('flashcards');
  let card;
  if (cardOrPayload.id && cardOrPayload.front) {
    card = cardOrPayload;
  } else {
    card = makeFlashcard(cardOrPayload.text);
    card.timestamp = cardOrPayload.timestamp;
  }
  flashcards.push(card);
  await chrome.storage.local.set({ flashcards });
}

export async function getFlashcards() {
  const { flashcards = [] } = await chrome.storage.local.get('flashcards');
  return flashcards;
}

export function clearFlashcards() {
  return chrome.storage.local.remove('flashcards');
}

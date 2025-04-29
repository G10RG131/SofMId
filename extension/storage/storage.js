import { makeFlashcard } from "./flashcard.js";

export const saveFlashcard = async (payload) => {
  try {
    const { flashcards = [] } = await chrome.storage.local.get("flashcards");
    const card = makeFlashcard(payload.text, payload.back || "");
    flashcards.push({ id: crypto.randomUUID(), ...card });
    await chrome.storage.local.set({ flashcards });
  } catch (e) {
    console.error("storage.saveFlashcard:", e);
  }
};

export const getFlashcards = async () => {
  try {
    const { flashcards = [] } = await chrome.storage.local.get("flashcards");
    return flashcards;
  } catch (e) {
    console.error("storage.getFlashcards:", e);
    return [];
  }
};

export const clearFlashcards = async () => {
  try {
    await chrome.storage.local.remove("flashcards");
  } catch (e) {
    console.error("storage.clearFlashcards:", e);
  }
};

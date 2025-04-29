// Wrapper around chrome.storage.local
export const saveFlashcard = async (flashcard) => {
    const { flashcards = [] } = await chrome.storage.local.get("flashcards");
    flashcards.push(flashcard);
    await chrome.storage.local.set({ flashcards });
  };
  
  export const getFlashcards = async () => {
    const { flashcards = [] } = await chrome.storage.local.get("flashcards");
    return flashcards;
  };
  
  export const clearFlashcards = () =>
    chrome.storage.local.remove("flashcards");
  
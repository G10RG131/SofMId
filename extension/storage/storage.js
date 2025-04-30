// extension/storage/storage.js

export async function saveFlashcard(data) {
  const { flashcards = [] } = await chrome.storage.local.get("flashcards");
  const card = data.id && data.front
    ? data
    : {
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        front: data.front.trim(),
        back:  data.back?.trim()  ?? "",
        hint:  data.hint?.trim()  ?? "",
        tags:  (data.tags || "")
                  .split(",")
                  .map(s => s.trim())
                  .filter(Boolean),
        timestamp: data.timestamp || Date.now(),
      };
  flashcards.push(card);
  await chrome.storage.local.set({ flashcards });
}

export async function getFlashcards() {
  const { flashcards = [] } = await chrome.storage.local.get("flashcards");
  return flashcards;
}

export async function clearFlashcards() {
  await chrome.storage.local.remove("flashcards");
}

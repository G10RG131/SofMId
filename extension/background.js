importScripts("storage/storage.js");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "NEW_FLASHCARD") {
    saveFlashcard(msg.payload).then(() => sendResponse({ status: "ok" }));
    return true; // keep channel open for async response
  }
});

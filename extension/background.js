// extension/background.js
import { saveFlashcard } from "./storage/storage.js";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "NEW_FLASHCARD") {
    saveFlashcard(msg.payload).then(() => {
      sendResponse({ status: "saved" });
    });
    return true; // keep the channel open for async sendResponse
  }
});

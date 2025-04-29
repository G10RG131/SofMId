import { saveFlashcard } from "./storage/storage.js";

// Register context-menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ADD_FLASHCARD",
    title: "Add to Flashcards",
    contexts: ["selection"]
  });
});

// Handle right-click “Add to Flashcards”
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "ADD_FLASHCARD" && info.selectionText) {
    saveFlashcard({ text: info.selectionText });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "NEW_FLASHCARD") {
    saveFlashcard(msg.payload).then(() => sendResponse({ status: "ok" }));
    return true;
  }
});

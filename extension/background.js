// extension/background.js

// Listen for SYNC_FLASHCARD messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SYNC_FLASHCARD') {
    // POST the new card to your backend
    fetch('http://localhost:3001/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message.payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server responded ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('✅ Synced flashcard:', data);
      })
      .catch(err => {
        console.error('❌ Failed to sync flashcard:', err);
      });
  }
});

// Listen for text selection and send to background
document.addEventListener("mouseup", () => {
    const selection = window.getSelection().toString().trim();
    if (!selection) return;
    chrome.runtime.sendMessage({
      type: "NEW_FLASHCARD",
      payload: { text: selection, timestamp: Date.now() }
    });
  });
  
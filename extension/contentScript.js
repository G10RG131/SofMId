// extension/contentScript.js

// 1) inject our CSS file
const link = document.createElement('link');
link.rel = 'stylesheet';
try {
  link.href = chrome.runtime.getURL('contentStyle.css');
} catch (e) {
  // in tests there is no chrome.runtime
  link.href = 'contentStyle.css';
}
document.head.appendChild(link);

// 2) create our “Add” button
const addBtn = document.createElement('button');
addBtn.id = 'flashcard-add-btn';
addBtn.textContent = 'Add';
document.body.appendChild(addBtn);

// helper to hide the button
function hide() {
  addBtn.style.display = 'none';
}

// helper to send the flashcard
function sendFlashcard() {
  const text = window.getSelection().toString().trim();
  if (!text) return;
  chrome.runtime.sendMessage({
    type: 'NEW_FLASHCARD',
    payload: { text, timestamp: Date.now() }
  });
}

// only send when Add is clicked
addBtn.addEventListener('click', () => {
  sendFlashcard();
  hide();
});

// whenever the user mouse-ups on the page: show or hide & position the button
document.addEventListener('mouseup', () => {
  const text = window.getSelection().toString().trim();
  if (!text) {
    hide();
    return;
  }
  // position the button at end of selection
  const sel = window.getSelection();
  if (sel.rangeCount > 0 && typeof sel.getRangeAt === 'function') {
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    addBtn.style.top = `${rect.bottom + window.scrollY}px`;
    addBtn.style.left = `${rect.right + window.scrollX - addBtn.offsetWidth}px`;
    addBtn.style.display = 'block';
  }
});

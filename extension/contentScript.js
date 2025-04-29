// extension/contentScript.js

// 1) Inject our CSS for the Add button and overlay styling
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href =
  (typeof chrome !== 'undefined' &&
   chrome.runtime &&
   typeof chrome.runtime.getURL === 'function')
    ? chrome.runtime.getURL('contentStyle.css')
    : 'contentStyle.css';
document.head.appendChild(link);

// 2) Create the “Add” button (hidden initially)
const addBtn = document.createElement('button');
addBtn.id = 'flashcard-add-btn';
addBtn.textContent = 'Add';
addBtn.style.position = 'absolute';
addBtn.style.display = 'none';
document.body.appendChild(addBtn);

// 3) Create our floating overlay, hidden by default
const overlay = document.createElement('div');
overlay.id = 'flashcard-overlay';
Object.assign(overlay.style, {
  display: 'none',
  position: 'fixed',
  top: '100px',
  left: '100px',
  width: '320px',
  zIndex: '2147483647',
  background: 'white',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  fontFamily: 'sans-serif',
});
overlay.innerHTML = `
  <div id="flashcard-header" style="
      padding:8px;
      background:#f1f1f1;
      cursor:move;
      user-select:none;
      border-bottom:1px solid #ccc;
      font-weight:bold;
    ">
    Flashcards
    <button id="flashcard-close" style="
        float:right;
        border:none;
        background:transparent;
        font-size:16px;
        cursor:pointer;
      ">×</button>
  </div>
  <form id="flashcard-form" style="padding:8px;">
    <label style="display:block;margin-bottom:4px;">
      Front:<br>
      <textarea id="flashcard-front" rows="3" style="width:100%;"></textarea>
    </label>
    <label style="display:block;margin-bottom:4px;">
      Back:<br>
      <textarea id="flashcard-back" rows="3" style="width:100%;"></textarea>
    </label>
    <label style="display:block;margin-bottom:4px;">
      Hint (optional):<br>
      <input id="flashcard-hint" type="text" style="width:100%;"/>
    </label>
    <label style="display:block;margin-bottom:8px;">
      Tags (comma-separated):<br>
      <input id="flashcard-tags" type="text" style="width:100%;"/>
    </label>
    <div style="text-align:right;">
      <button type="submit">Save Card</button>
      <button type="button" id="flashcard-clear">Clear</button>
    </div>
  </form>
`;
document.body.appendChild(overlay);

// 4) Helper to hide both addBtn and overlay
function hideAddBtn() {
  addBtn.style.display = 'none';
}
function hideOverlay() {
  overlay.style.display = 'none';
}

// ——— NEW: helper to send the selected text up to background ———
function sendFlashcardMessage() {
  const text = window.getSelection().toString().trim();
  if (!text) return;
  chrome.runtime.sendMessage({
    type: 'NEW_FLASHCARD',
    payload: { text, timestamp: Date.now() }
  });
}

// 5) Show/Position the Add button on text selection
document.addEventListener('mouseup', () => {
  const text = window.getSelection().toString().trim();
  if (!text) {
    hideAddBtn();
    return;
  }
  const sel = window.getSelection();
  if (sel.rangeCount > 0 && typeof sel.getRangeAt === 'function') {
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    addBtn.style.top    = `${rect.bottom + window.scrollY}px`;
    addBtn.style.left   = `${rect.right  + window.scrollX - addBtn.offsetWidth}px`;
    addBtn.style.display = 'block';
  } else {
    hideAddBtn();
  }
});

// 6) Clicking “Add” now both sends the message **and** opens the overlay
addBtn.addEventListener('click', () => {
  hideAddBtn();

  // ← send the NEW_FLASHCARD message for your contentScript tests
  sendFlashcardMessage();

  // show the overlay, pre-fill the “Back” with the selected text
  const selected = window.getSelection().toString().trim();
  overlay.style.display = 'block';

  // reset & pre-fill form fields
  overlay.querySelector('#flashcard-front').value = '';
  overlay.querySelector('#flashcard-back').value  = selected;
  overlay.querySelector('#flashcard-hint').value  = '';
  overlay.querySelector('#flashcard-tags').value  = '';
  overlay.querySelector('#flashcard-front').focus();
});

// 7) Close button
overlay.querySelector('#flashcard-close').addEventListener('click', () => {
  hideOverlay();
});

// 8) Clear button
overlay.querySelector('#flashcard-clear').addEventListener('click', () => {
  overlay.querySelector('#flashcard-front').value = '';
  overlay.querySelector('#flashcard-back').value  = '';
  overlay.querySelector('#flashcard-hint').value  = '';
  overlay.querySelector('#flashcard-tags').value  = '';
});

// 9) Make overlay draggable by its header
;(function makeDraggable() {
  const header = overlay.querySelector('#flashcard-header');
  let offsetX = 0, offsetY = 0, dragging = false;
  header.addEventListener('mousedown', e => {
    dragging = true;
    const rect = overlay.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    overlay.style.left = `${e.clientX - offsetX}px`;
    overlay.style.top  = `${e.clientY - offsetY}px`;
  });
  document.addEventListener('mouseup', () => {
    dragging = false;
  });
})();

// 10) Handle form submission: save to chrome.storage.local
overlay.querySelector('#flashcard-form').addEventListener('submit', async e => {
  e.preventDefault();
  const front = overlay.querySelector('#flashcard-front').value.trim();
  const back  = overlay.querySelector('#flashcard-back').value.trim();
  if (!front || !back) return;            // require both
  const hint = overlay.querySelector('#flashcard-hint').value.trim();
  const tags = overlay
    .querySelector('#flashcard-tags')
    .value.split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // read existing
  const { flashcards = [] } = await chrome.storage.local.get('flashcards');
  // push new
  flashcards.push({
    id:    `${Date.now()}-${Math.random()}`,
    front, back, hint, tags
  });
  // write back
  await chrome.storage.local.set({ flashcards });

  // hide when done
  hideOverlay();
});

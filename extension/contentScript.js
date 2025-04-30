// extension/contentScript.js

// helper for chrome.runtime.getURL in tests & real
function getURL(path) {
  return (window.chrome?.runtime?.getURL)
    ? chrome.runtime.getURL(path)
    : path;
}

// 1) Inject CSS
['contentStyle.css','overlay.css'].forEach(file => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = getURL(file);
  document.head.appendChild(link);
});

// 2) Create “Add” button
const addBtn = document.createElement('button');
addBtn.id = 'flashcard-add-btn';
addBtn.textContent = 'Add';
Object.assign(addBtn.style, {
  position: 'absolute',
  display: 'none',
  zIndex: 2147483647,
});
document.body.appendChild(addBtn);

// 3) Build overlay
const overlay = document.createElement('div');
overlay.id = 'flashcard-overlay';
overlay.style.width = '320px';
overlay.innerHTML = `
  <div id="flashcard-header">
    <span>Flashcards</span>
    <button id="flashcard-close">×</button>
  </div>
  <form id="flashcard-form">
    <label>Front:<br><textarea id="flashcard-front" rows="3"></textarea></label>
    <label>Back:<br><textarea id="flashcard-back" rows="3"></textarea></label>
    <label>Hint (optional):<br><input id="flashcard-hint" type="text"></label>
    <label>Tags (comma-separated):<br><input id="flashcard-tags" type="text"></label>
    <div class="actions">
      <button type="submit">Save Card</button>
      <button type="button" id="flashcard-clear">Clear</button>
    </div>
    <div id="flashcard-msg"></div>
  </form>
`;
document.body.appendChild(overlay);

// universal box-sizing
const styleAll = document.createElement('style');
styleAll.textContent = `
  #flashcard-overlay, #flashcard-overlay * { box-sizing: border-box; }
`;
document.head.appendChild(styleAll);

// helpers
const showOverlay = () => overlay.classList.add('show');
const hideOverlay = () => overlay.classList.remove('show');
const hideAddBtn = () => addBtn.style.display = 'none';

// 5) track last selection rect
let lastRect = null;

// 6) On mouseup → show Add button
document.addEventListener('mouseup', () => {
  const sel = window.getSelection();
  const txt = sel.toString().trim();
  if (!txt || sel.rangeCount === 0) {
    hideAddBtn();
    lastRect = null;
    return;
  }
  lastRect = sel.getRangeAt(0).getBoundingClientRect();
  const { right, bottom } = lastRect;
  const { scrollX, scrollY } = window;
  const bw = addBtn.offsetWidth, bh = addBtn.offsetHeight;
  let x = right + scrollX - bw;
  let y = bottom + scrollY + 4;
  x = Math.min(Math.max(x, scrollX + 8), scrollX + innerWidth - bw - 8);
  const maxY = scrollY + innerHeight - bh - 8;
  if (y > maxY) y = lastRect.top + scrollY - bh - 4;
  addBtn.style.setProperty('left', `${x}px`, 'important');
  addBtn.style.setProperty('top', `${y}px`, 'important');
  addBtn.style.display = 'block';
});

// 7) On Add click → send & show overlay
addBtn.addEventListener('click', () => {
  hideAddBtn();
  const text = window.getSelection().toString().trim();

  // notify background to create a NEW_FLASHCARD (back empty)
  chrome.runtime.sendMessage({
    type: 'NEW_FLASHCARD',
    payload: { text, timestamp: Date.now() }
  });

  const rect = lastRect || addBtn.getBoundingClientRect();
  const { scrollX, scrollY } = window;
  const oh = overlay.offsetHeight;
  let x = rect.left + scrollX;
  let y = rect.bottom + scrollY + 6;
  x = Math.min(Math.max(x, scrollX + 8), scrollX + innerWidth - overlay.offsetWidth - 8);
  const maxY = scrollY + innerHeight - oh - 8;
  if (y > maxY) y = rect.top + scrollY - oh - 4;
  overlay.style.setProperty('left', `${x}px`, 'important');
  overlay.style.setProperty('top', `${y}px`, 'important');

  // reset & prefill form
  overlay.querySelector('#flashcard-front').value = '';
  overlay.querySelector('#flashcard-back').value = text;
  overlay.querySelector('#flashcard-hint').value = '';
  overlay.querySelector('#flashcard-tags').value = '';
  overlay.querySelector('#flashcard-msg').textContent = '';
  showOverlay();
  overlay.querySelector('#flashcard-front').focus();
});

// 8) Close & Clear
overlay.querySelector('#flashcard-close').addEventListener('click', hideOverlay);
overlay.querySelector('#flashcard-clear').addEventListener('click', () => {
  ['front','back','hint','tags'].forEach(id => {
    overlay.querySelector(`#flashcard-${id}`).value = '';
  });
  overlay.querySelector('#flashcard-msg').textContent = '';
});

// 9) Draggable header
(function(){
  const hdr = overlay.querySelector('#flashcard-header');
  let drag = false, ox = 0, oy = 0;
  hdr.style.cursor = 'move';
  hdr.addEventListener('mousedown', e => {
    drag = true;
    const r = overlay.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!drag) return;
    overlay.style.left = `${e.clientX - ox}px`;
    overlay.style.top  = `${e.clientY - oy}px`;
  });
  document.addEventListener('mouseup', () => { drag = false; });
})();

// 10) Save & show success then auto-close
overlay.querySelector('#flashcard-form').addEventListener('submit', async e => {
  e.preventDefault();
  const f = overlay.querySelector('#flashcard-front').value.trim();
  const b = overlay.querySelector('#flashcard-back').value.trim();
  if (!f || !b) return;
  const h = overlay.querySelector('#flashcard-hint').value.trim();
  const t = overlay.querySelector('#flashcard-tags')
    .value.split(',').map(s=>s.trim()).filter(Boolean);

  // save locally
  const data = await chrome.storage.local.get('flashcards');
  const flashcards = data.flashcards || [];
  const card = {
    id: `${Date.now()}-${Math.random()}`,
    front: f, back: b, hint: h, tags: t
  };
  flashcards.push(card);
  await chrome.storage.local.set({ flashcards });

  // ─── NEW: also sync this card with backend ────────────────────────────────
  chrome.runtime.sendMessage(
    { type: "SYNC_FLASHCARD", payload: card },
    resp => console.log("✨ overlay sync response:", resp)
  );
  // ───────────────────────────────────────────────────────────────────────────

  // show success & auto-close
  const msg = overlay.querySelector('#flashcard-msg');
  msg.textContent = 'Card saved successfully!';
  msg.style.color = '#0b8043';
  setTimeout(hideOverlay, 1000);
});

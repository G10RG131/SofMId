// extension/popup/popup.js
;(async function() {
  // 1) Mount root
  let root = document.getElementById('root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  }

  // 2) Header
  const h1 = document.createElement('h1');
  h1.textContent = 'Flashcards';
  root.appendChild(h1);

  // 3) Form
  const form = document.createElement('form');
  form.id = 'card-form';
  form.innerHTML = `
    <label>Front:<br><input id="front" type="text"></label>
    <label>Back:<br><input id="back" type="text"></label>
    <label>Hint:<br><input id="hint" type="text"></label>
    <label>Tags:<br><input id="tags" type="text"></label>
    <div class="actions">
      <button type="button" id="clear-btn">Clear All</button>
      <button type="submit">Save Card</button>
    </div>
  `;
  root.appendChild(form);

  // 4) List container
  const list = document.createElement('ul');
  list.id = 'list';
  root.appendChild(list);

  // 5) Load existing flashcards on open
  const { flashcards = [] } = await chrome.storage.local.get('flashcards');
  flashcards.forEach(card => {
    const li = document.createElement('li');
    let html = `<strong>Front:</strong> ${card.front}<br><strong>Back:</strong> ${card.back}`;
    if (card.hint) html += `<br><em>Hint: ${card.hint}</em>`;
    if (card.tags.length) html += `<br>Tags: ${card.tags.join(', ')}`;
    li.innerHTML = html;
    list.appendChild(li);
  });

  // 6) Clear All handler
  document.getElementById('clear-btn').addEventListener('click', async () => {
    await chrome.storage.local.set({ flashcards: [] });
    list.innerHTML = '';
  });

  // 7) Submit handler
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const front = document.getElementById('front').value.trim();
    const back  = document.getElementById('back').value.trim();
    const hint  = document.getElementById('hint').value.trim();
    const tags  = document.getElementById('tags').value
                    .split(',').map(s=>s.trim()).filter(Boolean);
    if (!front || !back) return;

    // save to storage
    const { flashcards = [] } = await chrome.storage.local.get('flashcards');
    const card = { id:`${Date.now()}-${Math.random()}`, front, back, hint, tags };
    flashcards.push(card);
    await chrome.storage.local.set({ flashcards });

    // append to list
    const li = document.createElement('li');
    let html = `<strong>Front:</strong> ${front}<br><strong>Back:</strong> ${back}`;
    if (hint) html += `<br><em>Hint: ${hint}</em>`;
    if (tags.length) html += `<br>Tags: ${tags.join(', ')}`;
    li.innerHTML = html;
    list.appendChild(li);

    // reset form
    form.reset();
  });
})();

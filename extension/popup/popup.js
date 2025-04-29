import { getFlashcards, clearFlashcards } from '../storage/storage.js';

const listEl = document.getElementById('list');
const clearBtn = document.getElementById('clear');

async function render() {
  const cards = await getFlashcards();
  if (!cards.length) {
    listEl.textContent = 'No flashcards saved.';
    return;
  }
  listEl.innerHTML = cards
    .map((c,i) => `<div class="card"><strong>${i+1}.</strong> ${c.front}</div>`)
    .join('');
}

clearBtn.addEventListener('click', async () => {
  await clearFlashcards();
  render();
});

render();

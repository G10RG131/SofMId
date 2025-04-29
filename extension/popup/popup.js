// extension/popup/popup.js
import { saveFlashcard, getFlashcards, clearFlashcards } from "../storage/storage.js";

const form      = document.getElementById("card-form");
const frontEl   = document.getElementById("front");
const backEl    = document.getElementById("back");
const hintEl    = document.getElementById("hint");
const tagsEl    = document.getElementById("tags");
const clearBtn  = document.getElementById("clear");
const listEl    = document.getElementById("list");

async function renderList() {
  const cards = await getFlashcards();
  if (!cards.length) {
    listEl.textContent = "No flashcards saved.";
    return;
  }
  listEl.innerHTML = cards.map(c => `
    <div class="card">
      <div><strong>Front:</strong> ${c.front}</div>
      <div><strong>Back:</strong> ${c.back}</div>
      ${c.hint ? `<div class="hint">Hint: ${c.hint}</div>` : ""}
      ${c.tags?.length ? `<div class="tags">Tags: ${c.tags.join(", ")}</div>` : ""}
    </div>
  `).join("");
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  await saveFlashcard({
    front: frontEl.value,
    back:  backEl.value,
    hint:  hintEl.value,
    tags:  tagsEl.value
  });
  form.reset();
  renderList();
});

clearBtn.addEventListener("click", async () => {
  await clearFlashcards();
  renderList();
});

(async function init() {
  // If background set a pendingBack, load it
  const { pendingBack = "" } = await chrome.storage.local.get("pendingBack");
  if (pendingBack) {
    backEl.value = pendingBack;
    await chrome.storage.local.remove("pendingBack");
  }
  renderList();
})();

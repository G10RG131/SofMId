import { getFlashcards, clearFlashcards } from "../storage/storage.js";
import { initHandPose } from "./handpose.js";

const listEl = document.getElementById("list");
const clearBtn = document.getElementById("clear");
const videoEl = document.getElementById("webcam");

async function render() {
  const cards = await getFlashcards();
  if (!cards.length) {
    listEl.textContent = "No flashcards saved.";
    return;
  }
  listEl.innerHTML = cards.map(c => `
    <div class="card" data-id="${c.id}">
      <span>${c.front}</span>
      <button class="del">×</button>
    </div>`).join("");
  document.querySelectorAll(".del").forEach(btn =>
    btn.addEventListener("click", async e => {
      const id = e.target.closest(".card").dataset.id;
      const all = await getFlashcards();
      await chrome.storage.local.set({ flashcards: all.filter(c => c.id !== id) });
      render();
    })
  );
}

clearBtn.addEventListener("click", async () => {
  await clearFlashcards();
  render();
});

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  videoEl.srcObject = stream;
  initHandPose(videoEl, g => console.log("Gesture:", g));
});

render();

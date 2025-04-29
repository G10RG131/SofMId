// Listen for text selection, inject a floating “Add” button
document.addEventListener("mouseup", () => {
  const sel = window.getSelection();
  const text = sel.toString().trim();
  removeButton();
  if (!text) return;

  const rect = sel.getRangeAt(0).getBoundingClientRect();
  const btn = document.createElement("button");
  btn.id = "fc-add-btn";
  btn.textContent = "Add";
  btn.style.top = `${rect.bottom + window.scrollY}px`;
  btn.style.left = `${rect.right + window.scrollX}px`;

  btn.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      type: "NEW_FLASHCARD",
      payload: { text, timestamp: Date.now() }
    });
    removeButton();
  });

  document.body.appendChild(btn);
  document.addEventListener("scroll", removeButton, { once: true });
  document.addEventListener("mousedown", removeButton, { once: true });
});

function removeButton() {
  const old = document.getElementById("fc-add-btn");
  if (old) old.remove();
}

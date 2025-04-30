// extension/background.js

console.log("🛠 background.js service-worker starting");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("⚡ background received message:", message);

  // only handle our two flashcard events
  if (message.type !== "NEW_FLASHCARD" && message.type !== "SYNC_FLASHCARD") {
    return;
  }

  // normalize payload into the shape { front, back, hint, tags }
  let card;
  if (message.type === "SYNC_FLASHCARD") {
    // popup already built a full card object
    card = {
      front: message.payload.front,
      back:  message.payload.back,
      hint:  message.payload.hint,
      tags:  message.payload.tags
    };
  } else {
    // content-script only gave us text; treat that as front
    card = {
      front: message.payload.text,
      back:  "",      // no back yet
      hint:  "",
      tags:  []
    };
  }

  (async () => {
    try {
      const resp = await fetch("http://localhost:3001/api/cards", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(card),
      });

      console.log(`✔ POST /api/cards status: ${resp.status}`);
      const json = await resp.json();
      console.log("✔ Backend response JSON:", json);

      sendResponse({ success: resp.ok, data: json });
    } catch (err) {
      console.error("✖ Sync error:", err);
      sendResponse({ success: false, error: err.message });
    }
  })();

  // return true to indicate we’ll call sendResponse asynchronously
  return true;
});

export function makeFlashcard(front, back = "") {
    const card = { front, back, timestamp: Date.now() };
    checkRep(card);
    return card;
  }
  function checkRep(c) {
    if (typeof c.front !== "string" || !c.front.trim()) {
      throw new Error("Flashcard.front must be a nonempty string");
    }
  }
  
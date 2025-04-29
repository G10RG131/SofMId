export function makeFlashcard(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Flashcard text must be a nonempty string');
  }
  const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return { id, front: text.trim() };
}

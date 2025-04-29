import { saveFlashcard, getFlashcards, clearFlashcards } from "../storage/storage.js";

beforeEach(() => chrome.storage.local.clear());

test("save and retrieve flashcard", async () => {
  await saveFlashcard({ text: "A" });
  const all = await getFlashcards();
  expect(all.length).toBe(1);
  expect(all[0].front).toBe("A");
});

test("clearFlashcards empties", async () => {
  await saveFlashcard({ text: "X" });
  await clearFlashcards();
  expect(await getFlashcards()).toEqual([]);
});

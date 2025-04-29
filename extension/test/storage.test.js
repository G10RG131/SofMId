/**
 * @jest-environment jsdom
 */
import { saveFlashcard, getFlashcards, clearFlashcards } from "../storage/storage";

beforeEach(async () => await clearFlashcards());

test("save and retrieve flashcard", async () => {
  const card = { text: "Hello", timestamp: 1 };
  await saveFlashcard(card);
  expect(await getFlashcards()).toEqual([card]);
});

test("clear flashcards", async () => {
  await saveFlashcard({ text: "A", timestamp: 2 });
  await clearFlashcards();
  expect(await getFlashcards()).toEqual([]);
});

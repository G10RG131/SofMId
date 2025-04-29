import { makeFlashcard } from "../storage/flashcard.js";

test("makeFlashcard enforces nonempty front", () => {
  expect(() => makeFlashcard("")).toThrow(/nonempty/);
  const c = makeFlashcard("Hello");
  expect(c.front).toBe("Hello");
});

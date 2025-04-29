/**
 * @jest-environment jsdom
 */
import { makeFlashcard } from "../storage/flashcard.js";

test("makeFlashcard generates trimmed front and UUID", () => {
  const f = makeFlashcard("  hello ");
  expect(typeof f.id).toBe("string");
  expect(f.front).toBe("hello");
});

test("makeFlashcard throws on empty string", () => {
  expect(() => makeFlashcard("")).toThrow();
});

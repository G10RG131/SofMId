/**
 * @jest-environment jsdom
 */
global.chrome = {
  storage: {
    local: {
      _data: {},
      get()   { return Promise.resolve({ flashcards: this._data.flashcards }); },
      set(obj){ this._data.flashcards = obj.flashcards; return Promise.resolve(); },
      remove(){ this._data = {}; return Promise.resolve(); }
    }
  }
};

import { saveFlashcard, getFlashcards, clearFlashcards } from "../storage/storage.js";

beforeEach(() => global.chrome.storage.local.remove());

test("save and retrieve flashcard", async () => {
  await saveFlashcard({ id:"1", front:"A" });
  expect(await getFlashcards()).toEqual([{ id:"1", front:"A" }]);
});

test("clearFlashcards empties", async () => {
  await saveFlashcard({ id:"1", front:"A" });
  await clearFlashcards();
  expect(await getFlashcards()).toEqual([]);
});

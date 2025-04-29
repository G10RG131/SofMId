/**
 * @jest-environment jsdom
 */
import fs from 'fs';
import path from 'path';

// ---- override chrome.storage.local with promise-based stubs ----
global.chrome = {
  storage: {
    local: {
      _data: { flashcards: [] },
      get(key) {
        return Promise.resolve({ flashcards: this._data.flashcards });
      },
      set(obj) {
        this._data.flashcards = obj.flashcards;
        return Promise.resolve();
      },
      remove(key) {
        this._data.flashcards = [];
        return Promise.resolve();
      },
    },
  },
};

beforeEach(async () => {
  // reset in-memory storage
  chrome.storage.local._data.flashcards = [];

  // load the popup HTML into jsdom
  document.body.innerHTML = fs.readFileSync(
    path.resolve(__dirname, '../popup/popup.html'),
    'utf8'
  );

  // import the popup logic so it wires up handlers and renders
  await import('../popup/popup.js');
});

test('form saves a card and it appears in list', async () => {
  // fill out the form fields
  document.getElementById('front').value = 'Q1';
  document.getElementById('back').value = 'A1';
  document.getElementById('hint').value = 'h1';
  document.getElementById('tags').value = 't1, t2';

  // submit the form
  document
    .getElementById('card-form')
    .dispatchEvent(new Event('submit', { bubbles: true }));

  // wait a tick for async storage operations
  await new Promise(r => setTimeout(r, 0));

  // verify it was saved into chrome.storage.local
  const stored = chrome.storage.local._data.flashcards;
  expect(stored).toHaveLength(1);
  expect(stored[0]).toMatchObject({
    front: 'Q1',
    back:  'A1',
    hint:  'h1',
    tags: ['t1', 't2'],
  });

  // verify it rendered in the DOM with <strong> tags
  const html = document.getElementById('list').innerHTML;
  expect(html).toContain('<strong>Front:</strong> Q1');
  expect(html).toContain('<strong>Back:</strong> A1');
  expect(html).toContain('Hint: h1');
  expect(html).toContain('Tags: t1, t2');
});

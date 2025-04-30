Flashcards Extension (MV3)

Highlight text on any webpage → save as flashcards → review via popup or hand-pose gestures.

---
Extension Folder Structure

extension/
├── manifest.json
├── background.js
├── contentScript.js
├── contentStyle.css
├── overlay.css
├── storage/
│   └── storage.js
├── popup/
│   ├── popup.html
│   ├── popup.js  
│   └── popup.css
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── styleMock.js
├── package.json
├── rollup.config.js
└── test/
    ├── contentScript.test.js
    ├── flashcard.test.js
    ├── popup.test.js
    └── storage.test.js

---
File Descriptions

manifest.json
- manifest_version: 3
- permissions: storage, activeTab, scripting
- host_permissions: <all_urls>, http://localhost:3001/*
- background: service_worker → background.js
- content_scripts: inject contentScript.js, contentStyle.css, overlay.css on all pages
- action: popup UI at popup/popup.html, default icons

contentScript.js
- Injects CSS & overlay HTML
- Shows floating “Add” button on text selection
- On click, sends NEW_FLASHCARD to background, pre-fills overlay form
- Saves new card to chrome.storage.local and sends SYNC_FLASHCARD

background.js
- Listens for NEW_FLASHCARD & SYNC_FLASHCARD messages
- POSTs card data to backend at /api/cards
- Logs status & relays response back to sender

storage/storage.js
- Wraps chrome.storage.local calls
- getFlashcards(), setFlashcards([...]), clearFlashcards()
- Ensures flashcards array invariant

popup/
- popup.html: form + list container
- popup.js:
  - Loads stored flashcards on open
  - Handles “Save Card” (local + sync) and “Clear All”
  - Renders list of cards

CSS (contentStyle.css, overlay.css, popup.css)
- Styles for overlay form and popup UI

Tests (test/*.test.js)
- Unit tests for contentScript, storage ADT, flashcard model, popup logic

---
Usage

1. Start backend (if using sync API):
   cd backend
   npm install
   npm run dev

2. Load extension in Chrome:
   - Go to chrome://extensions/
   - Enable Developer mode
   - Click “Load unpacked” → select extension/ folder

3. Use:
   - Select text → click “Add” → edit front/back/hint/tags → Save
   - Open extension icon to review saved cards

---
Testing

cd extension
npm install
npm test

All four test suites must pass.

---
CI (GitHub Actions)

Add this badge to your README after you merge CI:

![CI](https://github.com/<YOUR-ORG>/<YOUR-REPO>/actions/workflows/ci.yml/badge.svg)

Ensure .github/workflows/ci.yml runs:
- npm test in extension/
- (optional) npm test in backend/

---
Next Steps

- Integrate TF.js hand-pose gestures for “review” controls
- Add practice UI calling /api/practice, /api/update, /api/progress
- E2E tests (Puppeteer or Playwright)

# Extension Code Overview

This README provides an overview of all source files in the `extension/` folder, explaining their purpose and interactions.

## File Structure

```
extension/
├── manifest.json
├── background.js
├── contentScript.js
├── storage/
│   └── storage.js
├── popup/
│   ├── popup.html
│   └── popup.js
└── tests/
    ├── storage.test.js
    └── contentScript.test.js
```

## Description of Files

### `manifest.json`
Defines Chrome MV3 configuration:
- **permissions**: `storage`, `activeTab`, `scripting`
- **host_permissions**: matches all URLs
- **background.service_worker**: `background.js`
- **content_scripts**: inject `contentScript.js` on all pages
- **action**: sets `popup/popup.html` as the UI

### `contentScript.js`
- Listens for `mouseup` events.
- Extracts selected text.
- Sends a message `NEW_FLASHCARD` with the text and timestamp to the background script.

### `background.js`
- Registers a listener for Chrome runtime messages.
- On `NEW_FLASHCARD`, calls `saveFlashcard` from `storage/storage.js`.
- Responds asynchronously to confirm saving.

### `storage/storage.js`
Provides an API for persistent storage via `chrome.storage.local`:
- `saveFlashcard(flashcard)`: appends a flashcard object.
- `getFlashcards()`: retrieves the array of saved cards.
- `clearFlashcards()`: removes all saved cards.

### `popup/popup.html`
Defines the popup UI:
- Displays a heading and a container for the flashcards list.
- Includes a "Clear All" button.
- Loads `popup.js` for interaction.

### `popup/popup.js`
Controls popup behavior:
- Calls `getFlashcards()` on open to render saved cards.
- Maps each card to a list item showing index and text.
- Adds click handler on "Clear All" to remove all cards and re-render.

### Tests (`tests/`)
- `storage.test.js`: verifies `saveFlashcard`, `getFlashcards`, and `clearFlashcards`.
- `contentScript.test.js`: ensures no message is sent when no selection exists.

## How It Works Together

1. **User selects text** → `contentScript.js` detects selection and messages background.
2. **Background script** receives the message → calls storage util to save it.
3. **Popup UI** fetches stored cards and displays them.
4. **Tests** validate storage logic and content script behavior in isolation.

## Development & Testing

1. **Load extension** in Chrome:
   - `chrome://extensions/` → Developer mode → Load unpacked → `extension/`
2. **Run tests**:
   ```bash
   npm install --save-dev jest
   npm test
   ```
3. **Git workflow**: use feature branches for each file/module, small commits, and PR reviews.

## Next Steps

- Integrate hand-pose gesture library in `popup.js` or `contentScript.js`.
- Add end-to-end tests (e.g., Puppeteer) for UI interactions.
- Polish UI/UX and error handling.

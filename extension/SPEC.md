
---

### SPEC.md

```markdown
# SPEC: Flashcards with Hand Gestures

## Components

1. **ContentScript**  
   - Detects text selection, shows “Add” button  
   - Opens overlay form to edit Front/Back/Hint/Tags  
   - Saves locally & messages background  

2. **Background (service worker)**  
   - Handles `NEW_FLASHCARD` / `SYNC_FLASHCARD`  
   - POSTs to `http://localhost:3001/api/cards`  
   - Returns success/failure  

3. **Storage ADT** (`storage/storage.js`)  
   - `getFlashcards()`, `setFlashcards([...])`, `clearFlashcards()`  
   - Invariants:  
     - Flashcards is an array of valid Flashcard objects  

4. **Popup UI** (`popup/`)  
   - Renders stored flashcards list  
   - Form to add new card (sync + local)  
   - Clear all button  

## Data Flow

1. **Select text** → ContentScript → send `NEW_FLASHCARD` → Background  
2. **Overlay form** → save to `chrome.storage.local` + send `SYNC_FLASHCARD` → Background → `/api/cards`  
3. **Popup open** → read `chrome.storage.local` → render cards  

## ADT Invariants

- **Flashcard**  
  - `id`: unique non-empty string  
  - `front`: non-empty string  
  - `back`: string (may be empty initially)  
  - `hint`: string  
  - `tags`: array of non-empty strings  

- **Storage**  
  - Always store an array under key `flashcards`  
  - No duplicate `id`s  


# SPEC: Flashcards with Hand Gestures

## Components
- **ContentScript**: detects selection, shows “Add” button.
- **Background**: persists cards, context-menu.
- **Storage ADT**: Flashcard type with invariant.
- **Popup**: lists cards, deletion, clear-all, webcam + handpose.

## Data Flow
1. Select text → ContentScript → Background → Storage.
2. Popup fetches storage, renders cards.
3. Hand-pose gestures via TF.js → gesture events.

## ADT Invariants
- front: nonempty string
- back: string


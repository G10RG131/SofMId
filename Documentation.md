# Algorithm Module

## Overview
This module implements core logic for managing flashcards using the Leitner system. It provides functions to organize flashcards into buckets, determine which cards to practice, update buckets based on user performance, retrieve hints, and compute progress statistics.

---

## Abstract Functions (AF)

### `toBucketSets`
---

## Representation Invariants (RI)

1. Buckets (`BucketMap`):
    - Keys are non-negative integers representing bucket numbers.
    - Values are sets of unique `Flashcard` objects.
2. Flashcards:
    - Each flashcard belongs to exactly one bucket.
3. Practice history (`PracticeRecord[]`):
    - Each record contains valid `Flashcard` data and a valid `AnswerDifficulty`.

---

## Functions

### `toBucketSets(buckets: BucketMap): Array<Set<Flashcard>>`
- **Purpose**: Converts a `BucketMap` into an array of sets, where the index corresponds to the bucket number.
- **Input**: 
  - `buckets`: A `BucketMap` where keys are bucket numbers and values are sets of flashcards.
- **Output**: An array of sets of flashcards.
- **Behavior**:
  - Initializes an array of empty sets up to the highest bucket number.
  - Populates the array with flashcards from the `BucketMap`.

---

### `practice(buckets: Array<Set<Flashcard>>, day: number): Set<Flashcard>`
- **Purpose**: Determines which flashcards should be practiced on a given day based on the Leitner system.
- **Input**:
  - `buckets`: An array of sets of flashcards.
  - `day`: The current day number.
- **Output**: A set of flashcards to practice.
- **Behavior**:
  - Always includes cards from bucket 0.
  - Includes cards from other buckets if the day is divisible by `2^(bucket number)`.

---

### `update(buckets: BucketMap, card: Flashcard, difficulty: AnswerDifficulty): BucketMap`
- **Purpose**: Updates the buckets based on the user's answer difficulty.
- **Input**:
  - `buckets`: A `BucketMap` representing the current state of buckets.
  - `card`: The flashcard being updated.
  - `difficulty`: The difficulty of the user's answer (`Easy`, `Medium`, or `Hard`).
- **Output**: A new `BucketMap` with the updated state.
- **Behavior**:
  - Moves the card to a new bucket based on the difficulty:
    - `Easy`: Move to the next bucket.
    - `Medium`: Move to bucket 0.
    - `Hard`: Stay in the current bucket.

---

### `getHint(card: Flashcard): string`
- **Purpose**: Retrieves a hint for a given flashcard.
- **Input**:
  - `card`: A `Flashcard` object.
- **Output**: A string containing the hint or a default message if no hint is available.
- **Behavior**:
  - Returns the `hint` property of the flashcard if it exists, otherwise returns "No hint available for this card."

---

### `computeProgress(buckets: BucketMap, history: PracticeRecord[]): ProgressStats`
- **Purpose**: Computes progress statistics based on the current state of buckets and practice history.
- **Input**:
  - `buckets`: A `BucketMap` representing the current state of buckets.
  - `history`: An array of `PracticeRecord` objects representing past practice sessions.
- **Output**: A `ProgressStats` object containing:
  - `totalCards`: Total number of flashcards.
  - `cardsPerBucket`: A record of the number of cards in each bucket.
  - `accuracyRate`: Percentage of correct answers.
  - `averageMovesPerCard`: Average number of moves per card.
  - `totalPracticeEvents`: Total number of practice events.
- **Behavior**:
  - Aggregates data from buckets and history to compute statistics.


---

## Enum: `AnswerDifficulty`
The `AnswerDifficulty` enum represents the difficulty level of a user's answer during a flashcard practice session. It is used to determine how the flashcard's bucket is updated.

### Values:
- **`Easy` (0)**: Indicates that the user found the flashcard easy. The card is moved to the next bucket.
- **`Medium` (1)**: Indicates that the user found the flashcard moderately difficult. The card is moved back to bucket 0.
- **`Hard` (2)**: Indicates that the user found the flashcard hard. The card remains in the current bucket.

### Usage:
The `AnswerDifficulty` enum is used in the `update` function to decide how to adjust the flashcard's bucket based on the user's performance.

---

## Notes
- The module assumes that flashcards are unique and properly assigned to buckets.
- The `PracticeRecord` and `ProgressStats` types must be correctly defined in `../types`.
- The `AnswerDifficulty` enum must include `Easy`, `Medium`, and `Hard` values.


# API Specification for `server.ts`

## Overview
This document provides the API specification for the backend server implemented in `server.ts`. The server manages flashcards using the Leitner system and provides endpoints for practicing, updating, retrieving hints, tracking progress, and managing flashcards.

---

## Base URL


---

## Endpoints

### 1. **GET /api/practice**
Retrieve the flashcards to practice for the current day.

- **Request**:
  - Method: `GET`
  - URL: `/api/practice`

- **Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "cards": [
        {
          "front": "Card Front",
          "back": "Card Back",
          "hint": "Hint",
          "tags": ["tag1", "tag2"]
        }
      ],
      "day": 1
    }
    ```
  - Status: `500 Internal Server Error` (if an error occurs)

- **Description**:
  - Retrieves the flashcards to practice for the current day based on the Leitner system.

---

### 2. **POST /api/update**
Update a flashcard's bucket after a practice session.

- **Request**:
  - Method: `POST`
  - URL: `/api/update`
  - Body:
    ```json
    {
      "cardFront": "Card Front",
      "cardBack": "Card Back",
      "difficulty": 0
    }
    ```
    - [difficulty](http://_vscodecontentref_/0): Must be one of `0` (Easy), `1` (Medium), or `2` (Hard).

- **Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "message": "Card updated successfully"
    }
    ```
  - Status: [400 Bad Request](http://_vscodecontentref_/1) (if difficulty is invalid)
  - Status: `404 Not Found` (if the card is not found)
  - Status: `500 Internal Server Error` (if an error occurs)

- **Description**:
  - Updates the bucket of a flashcard based on the user's answer difficulty and logs the update in the practice history.

---

### 3. **GET /api/hint**
Retrieve a hint for a specific flashcard.

- **Request**:
  - Method: `GET`
  - URL: `/api/hint`
  - Query Parameters:
    - [cardFront](http://_vscodecontentref_/2) (string): The front text of the flashcard.
    - [cardBack](http://_vscodecontentref_/3) (string): The back text of the flashcard.

- **Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "hint": "Hint text"
    }
    ```
  - Status: [400 Bad Request](http://_vscodecontentref_/4) (if query parameters are missing or invalid)
  - Status: `404 Not Found` (if the card is not found)
  - Status: `500 Internal Server Error` (if an error occurs)

- **Description**:
  - Retrieves the hint associated with a specific flashcard.

---

### 4. **GET /api/progress**
Retrieve learning progress statistics.

- **Request**:
  - Method: `GET`
  - URL: `/api/progress`

- **Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "totalCards": 10,
      "cardsPerBucket": {
        "0": 3,
        "1": 5,
        "2": 2
      },
      "accuracyRate": 80,
      "averageMovesPerCard": 2.5,
      "totalPracticeEvents": 20
    }
    ```
  - Status: `500 Internal Server Error` (if an error occurs)

- **Description**:
  - Computes and returns statistics about the user's learning progress.

---

### 5. **POST /api/day/next**
Advance the simulation to the next day.

- **Request**:
  - Method: `POST`
  - URL: `/api/day/next`

- **Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "message": "Advanced to day 2",
      "currentDay": 2
    }
    ```
  - Status: `500 Internal Server Error` (if an error occurs)

- **Description**:
  - Advances the simulation to the next day and updates the current day in the state.

---

### 6. **POST /api/cards**
Add a new flashcard to the system.

- **Request**:
  - Method: `POST`
  - URL: `/api/cards`
  - Body:
    ```json
    {
      "front": "Card Front",
      "back": "Card Back",
      "hint": "Hint text",
      "tags": ["tag1", "tag2"]
    }
    ```

- **Response**:
  - Status: `201 Created`
  - Body:
    ```json
    {
      "message": "Card added successfully",
      "card": {
        "front": "Card Front",
        "back": "Card Back",
        "hint": "Hint text",
        "tags": ["tag1", "tag2"]
      }
    }
    ```
  - Status: [400 Bad Request](http://_vscodecontentref_/5) (if required fields are missing)
  - Status: `500 Internal Server Error` (if an error occurs)

- **Description**:
  - Adds a new flashcard to the system and places it in bucket 0.

---

## Notes
- The server uses the [AnswerDifficulty](http://_vscodecontentref_/6) enum to validate difficulty levels (`0` for Easy, `1` for Medium, `2` for Hard).
- Flashcards are uniquely identified by their [front](http://_vscodecontentref_/7) and [back](http://_vscodecontentref_/8) text.
- All endpoints return appropriate error messages and HTTP status codes for invalid requests or server errors.
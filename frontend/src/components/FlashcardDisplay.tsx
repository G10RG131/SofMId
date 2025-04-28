
import React, { useState } from "react";
import { Flashcard } from "../types";
import { fetchHint } from "../services/api";

interface FlashcardDisplayProps {
  card: Flashcard;
  showBack: boolean;
}

const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({ card, showBack }) => {
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState<boolean>(false);
  const [hintError, setHintError] = useState<string | null>(null);

  const handleGetHint = async () => {
    setLoadingHint(true);
    setHintError(null);
    try {
      const hintResponse = await fetchHint(card);
      setHint(hintResponse);
    } catch (error) {
      setHintError("Failed to fetch hint");
    } finally {
      setLoadingHint(false);
    }
  };

  return (
    <div className="flashcard-container">
      <div className="flashcard">
        <p className="flashcard-front">{card.front}</p>
        {showBack ? (
          <p className="flashcard-back">{card.back}</p>
        ) : (
          <p className="flashcard-back">???</p>
        )}
      </div>
      {!showBack && (
        <button onClick={handleGetHint} disabled={loadingHint}>
          {loadingHint ? "Loading..." : "Get Hint"}
        </button>
      )}
      {hint && <p className="flashcard-hint">Hint: {hint}</p>}
      {hintError && <p className="flashcard-error">{hintError}</p>}
    </div>
  );
};

export default FlashcardDisplay;

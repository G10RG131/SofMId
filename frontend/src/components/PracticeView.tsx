import React, { useEffect, useState } from 'react';
import FlashcardDisplay from './FlashcardDisplay';
import { Flashcard, GestureType } from '../types';
import { AnswerDifficulty } from '../types/index'; // Import AnswerDifficulty
import { fetchPracticeCards, submitAnswer, fetchHint } from '../services/api'; // Import fetchHint API

interface PracticeViewProps {
  selectedGesture: GestureType | null;
  showAnswer: boolean;
  setShowAnswer: (show: boolean) => void;
  countdown: number;
  phase: 'waiting' | 'detecting' | 'showing';
}

const PracticeView: React.FC<PracticeViewProps> = ({ 
  selectedGesture, 
  showAnswer,
  setShowAnswer
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null); // State for the hint
  const [loadingHint, setLoadingHint] = useState(false); // State for hint loading

  // Fetch flashcards from the API
  useEffect(() => {
    const loadFlashcards = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const session = await fetchPracticeCards();
        setFlashcards(session.cards);
      } catch (err) {
        console.error('Failed to fetch flashcards:', err);
        setError('Could not load flashcards. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFlashcards();
  }, []);
  
  // Detect gesture and move to the next card
  useEffect(() => {
    if (selectedGesture !== null && selectedGesture !== 'none') {
      console.log(`Gesture detected: ${selectedGesture}`);
      selectedGesture = 'none'; // Reset the gesture to null after processing
      handleNextCard(); // Move to the next card
    }
  }, [selectedGesture]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleDifficultySelection = async (difficulty: AnswerDifficulty) => {
    if (currentCardIndex >= flashcards.length) return;

    const currentCard = flashcards[currentCardIndex];
    try {
      await submitAnswer(currentCard.front, currentCard.back, difficulty); // Submit the answer with difficulty
      setCurrentCardIndex(prev => (prev + 1) % flashcards.length); // Move to the next card
      setShowAnswer(false); // Reset the answer view
      setHint(null); // Clear the hint for the next card
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError('Could not save your answer. Please try again.');
    }
  };

  const handleGetHint = async () => {
    if (currentCardIndex >= flashcards.length) return;

    if (hint) {
      setHint(null);
      return;
    }

    const currentCard = flashcards[currentCardIndex];
    setLoadingHint(true);
    try {
      const fetchedHint = await fetchHint(currentCard); // Fetch hint for the current card
      setHint(fetchedHint);
    } catch (err) {
      console.error('Failed to fetch hint:', err);
      setHint('Could not load hint. Please try again.');
    } finally {
      setLoadingHint(false);
    }
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    setShowAnswer(false); // Reset the answer view
    setHint(null); // Clear the hint for the next card
  };

  if (isLoading) {
    return <div>Loading flashcards...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      {flashcards.length > 0 ? (
        <>
          <FlashcardDisplay 
          card={flashcards[currentCardIndex]} 
          showBack={showAnswer} // Pass showAnswer to control answer visibility
          hint={hint} // Pass hint to control hint visibility
          selectedGesture={selectedGesture} 
          onNextCard={handleNextCard} 
        />
          {!showAnswer ? (
            <div>
              <button 
                onClick={handleShowAnswer}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  marginTop: '15px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Show Answer
              </button>
              <button 
                onClick={handleGetHint}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  marginTop: '15px',
                  marginLeft: '10px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                disabled={loadingHint}
              >
                {loadingHint ? 'Loading Hint...' : 'Get Hint'}
              </button>
              {hint && <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#666' }}>Hint: {hint}</p>}
            </div>
          ) : (
            <div style={{ marginTop: '15px', color: '#666' }}>
              <p>How difficult was this card?</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleDifficultySelection(AnswerDifficulty.Easy)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Easy
                </button>
                <button 
                  onClick={() => handleDifficultySelection(AnswerDifficulty.Medium)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#FFC107',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Medium
                </button>
                <button 
                  onClick={() => handleDifficultySelection(AnswerDifficulty.Hard)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#F44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Hard
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>No flashcards available.</div>
      )}
    </div>
  );
};

export default PracticeView;
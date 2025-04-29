// // // // import { useState, useEffect } from "react";
// // // // import { Flashcard, AnswerDifficulty } from "../types";
// // // // import {
// // // //   fetchPracticeCards,
// // // //   submitAnswer,
// // // //   advanceDay,
// // // //   fetchHint,
// // // // } from "../services/api";

// // // // const PracticeView = () => {
// // // //   const [practiceCards, setPracticeCards] = useState<Flashcard[]>([]);
// // // //   const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
// // // //   const [showBack, setShowBack] = useState<boolean>(false);
// // // //   const [isLoading, setIsLoading] = useState<boolean>(true);
// // // //   const [error, setError] = useState<string | null>(null);
// // // //   const [day, setDay] = useState<number>(0);
// // // //   const [sessionFinished, setSessionFinished] = useState<boolean>(false);

// // // //   const [hint, setHint] = useState<string | null>(null);
// // // //   const [loadingHint, setLoadingHint] = useState(false);
// // // //   const [hintError, setHintError] = useState<string | null>(null);

// // // //   const loadPracticeCards = async () => {
// // // //     setIsLoading(true);
// // // //     setError(null);
// // // //     setSessionFinished(false);
// // // //     setCurrentCardIndex(0);
// // // //     setShowBack(false);
// // // //     try {
// // // //       const session = await fetchPracticeCards();
// // // //       setPracticeCards(session.cards);
// // // //       setDay(session.day);
// // // //       if (session.cards.length === 0) {
// // // //         setSessionFinished(true); // No cards to practice today
// // // //       }
// // // //     } catch (err) {
// // // //       console.error("Failed to fetch practice cards:", err);
// // // //       setError("Could not load cards. Is the backend running?");
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     loadPracticeCards();
// // // //   }, []); // Load cards on component mount

// // // //   const handleShowBack = () => {
// // // //     setShowBack(true);
// // // //   };

// // // //   const handleAnswer = async (difficulty: AnswerDifficulty) => {
// // // //     if (currentCardIndex >= practiceCards.length) return;

// // // //     const currentCard = practiceCards[currentCardIndex];
// // // //     try {
// // // //       await submitAnswer(currentCard.front, currentCard.back, difficulty);
// // // //       // Move to the next card
// // // //       const nextIndex = currentCardIndex + 1;
// // // //       if (nextIndex < practiceCards.length) {
// // // //         setCurrentCardIndex(nextIndex);
// // // //         setHint(null);
// // // //         setShowBack(false); // Hide back for the new card
// // // //       } else {
// // // //         // Finished practicing all cards for this session
// // // //         setSessionFinished(true);
// // // //         console.log("Practice session finished for Day", day);
// // // //       }
// // // //     } catch (err) {
// // // //       console.error("Failed to submit answer:", err);
// // // //       setError("Failed to save progress. Please try again.");
// // // //     }
// // // //   };

// // // //   const handleNextDay = async () => {
// // // //     try {
// // // //       const response = await advanceDay();
// // // //       setDay(response.day);
// // // //       await loadPracticeCards();
// // // //     } catch (err) {
// // // //       console.error("Failed to advance day:", err);
// // // //       setError("Could not advance to the next day.");
// // // //     }
// // // //   };

// // // //   if (isLoading) {
// // // //     return <div className="loading">Loading practice cards...</div>;
// // // //   }

// // // //   if (error) {
// // // //     return <div className="error-message">Error: {error}</div>;
// // // //   }

// // // //   if (sessionFinished) {
// // // //     return (
// // // //       <div className="session-finished">
// // // //         <div className="day-counter">Day {day}</div>
// // // //         <p>No more cards to practice today!</p>
// // // //         <button className="btn btn-primary" onClick={handleNextDay}>
// // // //           Go to Next Day
// // // //         </button>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   const currentCard = practiceCards[currentCardIndex];

// // // //   const handleGetHint = async () => {
// // // //     if (!currentCard) return;
// // // //     setLoadingHint(true);
// // // //     setHintError(null);
// // // //     setHint(null);
// // // //     try {
// // // //       const fetchedHint = await fetchHint(currentCard);
// // // //       setHint(fetchedHint);
// // // //     } catch (err) {
// // // //       console.error("Failed to fetch hint:", err);
// // // //       setHintError("Could not load hint.");
// // // //     } finally {
// // // //       setLoadingHint(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="practice-container">
// // // //       <div className="day-counter">Day {day}</div>
// // // //       <p className="card-counter">
// // // //         Card {currentCardIndex + 1} of {practiceCards.length}
// // // //       </p>
// // // //       {currentCard ? (
// // // //         <div className={`flashcard ${showBack ? "flashcard-back" : ""}`}>
// // // //           {showBack ? currentCard.back : currentCard.front}
// // // //         </div>
// // // //       ) : (
// // // //         <p>Something went wrong, no card to display.</p>
// // // //       )}

// // // //       {!showBack && (
// // // //         <div style={{ marginTop: "15px" }}>
// // // //           <button onClick={handleGetHint} disabled={loadingHint}>
// // // //             {loadingHint ? "Loading Hint..." : "Get Hint"}
// // // //           </button>
// // // //           {hint && (
// // // //             <p style={{ color: "gray", fontStyle: "italic" }}>Hint: {hint}</p>
// // // //           )}
// // // //           {hintError && <p style={{ color: "red" }}>{hintError}</p>}
// // // //         </div>
// // // //       )}

// // // //       {!showBack ? (
// // // //         <button className="btn btn-primary" onClick={handleShowBack}>
// // // //           Show Answer
// // // //         </button>
// // // //       ) : (
// // // //         <div>
// // // //           <p className="difficulty-text">How difficult was this card?</p>
// // // //           <div>
// // // //             <button
// // // //               className="btn btn-easy"
// // // //               onClick={() => handleAnswer(AnswerDifficulty.Easy)}
// // // //             >
// // // //               Easy
// // // //             </button>
// // // //             <button
// // // //               className="btn btn-medium"
// // // //               onClick={() => handleAnswer(AnswerDifficulty.Medium)}
// // // //             >
// // // //               Medium
// // // //             </button>
// // // //             <button
// // // //               className="btn btn-hard"
// // // //               onClick={() => handleAnswer(AnswerDifficulty.Hard)}
// // // //             >
// // // //               Hard
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default PracticeView;
// // // import React, { useState, useEffect } from 'react';
// // // import FlashcardDisplay from './FlashcardDisplay';
// // // import { Flashcard, GestureType } from '../types';

// // // interface PracticeViewProps {
// // //   activeGesture: GestureType | null;
// // //   onShowAnswer: (show: boolean) => void;
// // // }

// // // const PracticeView: React.FC<PracticeViewProps> = ({ activeGesture, onShowAnswer }) => {
// // //   const [currentCardIndex, setCurrentCardIndex] = useState(0);
// // //   const [showAnswer, setShowAnswer] = useState(false);
  
// // //   const flashcards: Flashcard[] = [
// // //     { front: "der Tisch", back: "the table", hint: "A piece of furniture" },
// // //     { front: "das Buch", back: "the book", hint: "Something you read" },
// // //     { front: "die Stadt", back: "the city", hint: "Opposite of countryside" },
// // //   ];

// // //   useEffect(() => {
// // //     onShowAnswer(showAnswer);
    
// // //     if (showAnswer && activeGesture) {
// // //       console.log(`Card marked as ${activeGesture}`);
// // //       setTimeout(() => {
// // //         setShowAnswer(false);
// // //         setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
// // //       }, 1000);
// // //     }
// // //   }, [showAnswer, activeGesture, flashcards.length, onShowAnswer]);

// // //   return (
// // //     <div style={{
// // //       background: 'white',
// // //       padding: '20px',
// // //       borderRadius: '8px',
// // //       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
// // //     }}>
// // //       <FlashcardDisplay 
// // //         card={flashcards[currentCardIndex]} 
// // //         showBack={showAnswer}
// // //       />
// // //       {!showAnswer ? (
// // //         <button 
// // //           onClick={() => setShowAnswer(true)}
// // //           style={{
// // //             padding: '10px 20px',
// // //             fontSize: '16px',
// // //             marginTop: '15px',
// // //             backgroundColor: '#4CAF50',
// // //             color: 'white',
// // //             border: 'none',
// // //             borderRadius: '4px',
// // //             cursor: 'pointer'
// // //           }}
// // //         >
// // //           Show Answer
// // //         </button>
// // //       ) : (
// // //         <div style={{ marginTop: '15px', color: '#666' }}>
// // //           Show gesture to rate difficulty
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default PracticeView;
// // import React, { useEffect, useState } from 'react';
// // import FlashcardDisplay from './FlashcardDisplay';
// // import { Flashcard, GestureType } from '../types';

// // interface PracticeViewProps {
// //   activeGesture: GestureType | null;
// //   onShowAnswer: (show: boolean) => void;
// //   countdown: number | null;
// // }

// // const PracticeView: React.FC<PracticeViewProps> = ({ 
// //   activeGesture, 
// //   onShowAnswer,
// //   countdown
// // }) => {
// //   const [currentCardIndex, setCurrentCardIndex] = useState(0);
// //   const [showAnswer, setShowAnswer] = useState(false);
  
// //   const flashcards: Flashcard[] = [
// //     { front: "der Tisch", back: "the table", hint: "A piece of furniture" },
// //     { front: "das Buch", back: "the book", hint: "Something you read" },
// //     { front: "die Stadt", back: "the city", hint: "Opposite of countryside" },
// //   ];

// //   useEffect(() => {
// //     onShowAnswer(showAnswer);
    
// //     if (showAnswer && activeGesture && countdown === 0) {
// //       setShowAnswer(false);
// //       setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
// //     }
// //   }, [showAnswer, activeGesture, countdown, flashcards.length, onShowAnswer]);

// //   return (
// //     <div style={{
// //       background: 'white',
// //       padding: '20px',
// //       borderRadius: '8px',
// //       boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
// //       marginBottom: '20px'
// //     }}>
// //       <FlashcardDisplay 
// //         card={flashcards[currentCardIndex]} 
// //         showBack={showAnswer}
// //         selectedGesture={activeGesture}
// //       />
      
// //       {!showAnswer ? (
// //         <button 
// //           onClick={() => setShowAnswer(true)}
// //           style={{
// //             padding: '10px 20px',
// //             fontSize: '16px',
// //             marginTop: '15px',
// //             backgroundColor: '#4CAF50',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '4px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           Show Answer
// //         </button>
// //       ) : (
// //         <div style={{ marginTop: '15px', color: '#666' }}>
// //           {activeGesture ? (
// //             <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>
// //               Answer recorded: {activeGesture}
// //             </div>
// //           ) : (
// //             <div>Show your gesture to answer</div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default PracticeView;
// import React, { useEffect, useState } from 'react';
// import FlashcardDisplay from './FlashcardDisplay';
// import { Flashcard, GestureType } from '../types';

// interface PracticeViewProps {
//   selectedGesture: GestureType | null;
//   onShowAnswer: (show: boolean) => void;
//   countdown: number;
//   phase: 'waiting' | 'detecting' | 'showing';
// }

// const PracticeView: React.FC<PracticeViewProps> = ({ 
//   selectedGesture, 
//   onShowAnswer,
//   countdown,
//   phase
// }) => {
//   const [currentCardIndex, setCurrentCardIndex] = useState(0);
//   const [showAnswer, setShowAnswer] = useState(false);
  
//   const flashcards: Flashcard[] = [
//     { front: "der Tisch", back: "the table", hint: "A piece of furniture" },
//     { front: "das Buch", back: "the book", hint: "Something you read" },
//     { front: "die Stadt", back: "the city", hint: "Opposite of countryside" },
//   ];

//   useEffect(() => {
//     if (phase === 'waiting' && countdown === 5) {
//       setShowAnswer(false);
//     }
//   }, [phase, countdown]);

//   const handleShowAnswer = () => {
//     setShowAnswer(true);
//     onShowAnswer(true);
//   };

//   return (
//     <div style={{
//       background: 'white',
//       padding: '20px',
//       borderRadius: '8px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//       marginBottom: '20px'
//     }}>
//       <FlashcardDisplay 
//         card={flashcards[currentCardIndex]} 
//         showBack={showAnswer}
//         selectedGesture={selectedGesture}
//       />
      
//       {!showAnswer ? (
//         <button 
//           onClick={handleShowAnswer}
//           style={{
//             padding: '10px 20px',
//             fontSize: '16px',
//             marginTop: '15px',
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           Show Answer
//         </button>
//       ) : (
//         <div style={{ marginTop: '15px', color: '#666' }}>
//           {selectedGesture && selectedGesture !== 'none' ? (
//             <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>
//               Answer recorded: {selectedGesture}
//             </div>
//           ) : phase === 'detecting' ? (
//             <div>Show your gesture to answer</div>
//           ) : (
//             <div>Preparing next question...</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PracticeView;
import React, { useEffect, useState } from 'react';
import FlashcardDisplay from './FlashcardDisplay';
import { Flashcard, GestureType } from '../types';

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
  setShowAnswer,
  countdown,
  phase
}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  const flashcards: Flashcard[] = [
    { front: "der Tisch", back: "the table", hint: "A piece of furniture" },
    { front: "das Buch", back: "the book", hint: "Something you read" },
    { front: "die Stadt", back: "the city", hint: "Opposite of countryside" },
  ];

  useEffect(() => {
    if (phase === 'waiting' && countdown === 5 && selectedGesture !== null) {
      setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
      setShowAnswer(false);
    }
  }, [phase, countdown, selectedGesture, flashcards.length, setShowAnswer]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <FlashcardDisplay 
        card={flashcards[currentCardIndex]} 
        showBack={showAnswer}
        selectedGesture={selectedGesture}
      />
      
      {!showAnswer ? (
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
      ) : (
        <div style={{ marginTop: '15px', color: '#666' }}>
          {selectedGesture && selectedGesture !== 'none' ? (
            <div style={{ color: '#4CAF50', fontWeight: 'bold' }}>
              Answer recorded: {selectedGesture}
            </div>
          ) : phase === 'detecting' ? (
            <div>Show your gesture to answer</div>
          ) : (
            <div>Preparing next question...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeView;
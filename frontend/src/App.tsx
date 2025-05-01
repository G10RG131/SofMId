import React, { useState, useCallback, useEffect } from "react";
import PracticeView from "./components/PracticeView";
import GestureDisplay from './components/GestureDisplay';
import { GestureType } from "./types/gesture-types";


const App: React.FC = () => {
  const [selectedGesture, setSelectedGesture] = useState<GestureType | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const [phase, setPhase] = useState<'waiting' | 'detecting' | 'showing'>('waiting');
  const [showAnswer, setShowAnswer] = useState(false);

  const startDetectionPhase = useCallback(() => {
    setPhase('detecting');
    setCountdown(5);
    setSelectedGesture(null);
  }, []);

  const handleGestureDetected = useCallback((gesture: GestureType) => {
    if (phase !== 'detecting' || selectedGesture) return;
    
    setSelectedGesture(gesture);
    setPhase('showing');
    setCountdown(5);
  }, [phase, selectedGesture]);

  useEffect(() => {
    if (!showAnswer) return;

    startDetectionPhase();
  }, [showAnswer, startDetectionPhase]);


  return (
    <div style={{ 
      maxWidth: '700px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center' }}>Flashcard Learner</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <PracticeView 
            selectedGesture={selectedGesture} 
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            countdown={countdown}
            phase={phase}
          />
        </div>

        <div style={{ flex: 1 }}>
          <GestureDisplay
            onGestureDetected={handleGestureDetected} 
            active={phase === 'detecting'}
          />
        </div>
      </div>
      <div style={{
        marginTop: '30px',
        padding: '15px',
        border: '2px solid #4CAF50',
        borderRadius: '8px'
      }}>
        <h3>Gesture Controls</h3>
                
        <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
          <li>👍 Thumbs Up = Easy</li>
          <li>✋ Open Hand = Medium</li>
          <li>👎 Thumbs Down = Hard</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
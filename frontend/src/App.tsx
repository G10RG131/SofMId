// // // import React, { useState } from "react";
// // // import PracticeView from "./components/PracticeView";
// // // import GestureDisplay from './components/GestureDisplay';
// // // import HandLandmarkTest from './components/HandLandmarkTest';
// // // import { GestureType } from "./types";

// // // const App: React.FC = () => {
// // //   const [activeGesture, setActiveGesture] = useState<GestureType | null>(null);
// // //   const [showGestureUI, setShowGestureUI] = useState(false);

// // //   const handleGestureDetected = (gesture: GestureType) => {
// // //     setActiveGesture(gesture);
// // //     setTimeout(() => setActiveGesture(null), 1500);
// // //   };

// // //   return (
// // //     <div style={{ 
// // //       maxWidth: '700px', 
// // //       margin: '0 auto', 
// // //       padding: '20px',
// // //       fontFamily: 'Arial, sans-serif'
// // //     }}>
// // //       <h1 style={{ textAlign: 'center' }}>Flashcard Learner</h1>

// // //       {/* Hand Landmark Debugging */}
// // //       <div style={{
// // //         border: '2px solid blue',
// // //         padding: '20px',
// // //         margin: '20px 0',
// // //         borderRadius: '8px',
// // //         backgroundColor: '#f0f8ff'
// // //       }}>
// // //         <HandLandmarkTest />
// // //       </div>

// // //       {/* Main Practice Area */}
// // //       <PracticeView 
// // //         activeGesture={activeGesture}
// // //         onShowAnswer={setShowGestureUI}
// // //       />

// // //       {/* Gesture Detection (only show when needed) */}
// // //       {showGestureUI && (
// // //         <div style={{
// // //           marginTop: '30px',
// // //           padding: '15px',
// // //           border: '2px solid #4CAF50',
// // //           borderRadius: '8px'
// // //         }}>
// // //           <h3>Gesture Controls</h3>
// // //           <p>Show your hand to answer:</p>
// // //           <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
// // //             <li>👍 Thumbs Up = Easy</li>
// // //             <li>✋ Open Hand = Medium</li>
// // //             <li>👎 Thumbs Down = Hard</li>
// // //           </ul>
// // //           <GestureDisplay onGestureDetected={handleGestureDetected} />
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default App;
// // import React, { useState, useCallback } from "react";
// // import PracticeView from "./components/PracticeView";
// // import GestureDisplay from './components/GestureDisplay';
// // import { GestureType } from "./types";

// // const App: React.FC = () => {
// //   const [showGestureUI, setShowGestureUI] = useState(false);
// //   const [selectedGesture, setSelectedGesture] = useState<GestureType | null>(null);
// //   const [countdown, setCountdown] = useState<number | null>(null);

// //   const handleGestureDetected = useCallback((gesture: GestureType) => {
// //     if (!showGestureUI || selectedGesture) return;
    
// //     setSelectedGesture(gesture);
// //     let seconds = 5;
// //     setCountdown(seconds);
    
// //     const timer = setInterval(() => {
// //       seconds -= 1;
// //       setCountdown(seconds);
      
// //       if (seconds <= 0) {
// //         clearInterval(timer);
// //         setSelectedGesture(null);
// //         setCountdown(null);
// //       }
// //     }, 1000);
    
// //     return () => clearInterval(timer);
// //   }, [showGestureUI, selectedGesture]);

// //   return (
// //     <div style={{ 
// //       maxWidth: '700px', 
// //       margin: '0 auto', 
// //       padding: '20px',
// //       fontFamily: 'Arial, sans-serif'
// //     }}>
// //       <h1 style={{ textAlign: 'center' }}>Flashcard Learner</h1>

// //       <PracticeView 
// //         activeGesture={selectedGesture}
// //         onShowAnswer={setShowGestureUI}
// //         countdown={countdown}
// //       />

// //       {showGestureUI && (
// //         <div style={{
// //           marginTop: '30px',
// //           padding: '15px',
// //           border: '2px solid #4CAF50',
// //           borderRadius: '8px'
// //         }}>
// //           <h3>Gesture Controls</h3>
// //           <p>Show your hand to answer:</p>
// //           <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
// //             <li>👍 Thumbs Up = Easy</li>
// //             <li>✋ Open Hand = Medium</li>
// //             <li>👎 Thumbs Down = Hard</li>
// //           </ul>
          
// //           {selectedGesture && (
// //             <div style={{
// //               margin: '10px 0',
// //               padding: '10px',
// //               backgroundColor: '#4CAF50',
// //               color: 'white',
// //               borderRadius: '4px',
// //               textAlign: 'center'
// //             }}>
// //               Selected: {selectedGesture} ({countdown}s)
// //             </div>
// //           )}
          
// //           <GestureDisplay 
// //             onGestureDetected={handleGestureDetected} 
// //             disabled={!!selectedGesture}
// //           />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default App;
// import React, { useState, useCallback, useEffect } from "react";
// import PracticeView from "./components/PracticeView";
// import GestureDisplay from './components/GestureDisplay';
// import { GestureType } from "./types";

// const App: React.FC = () => {
//   const [showGestureUI, setShowGestureUI] = useState(false);
//   const [selectedGesture, setSelectedGesture] = useState<GestureType | null>(null);
//   const [countdown, setCountdown] = useState<number>(5);
//   const [phase, setPhase] = useState<'waiting' | 'detecting' | 'showing'>('waiting');

//   const startDetectionPhase = useCallback(() => {
//     setPhase('detecting');
//     setCountdown(5);
//     setSelectedGesture(null);
//   }, []);

//   const handleGestureDetected = useCallback((gesture: GestureType) => {
//     if (phase !== 'detecting' || selectedGesture) return;
    
//     setSelectedGesture(gesture);
//     setPhase('showing');
//     setCountdown(5);
//   }, [phase, selectedGesture]);

//   useEffect(() => {
//     if (!showGestureUI) return;

//     startDetectionPhase();
//   }, [showGestureUI, startDetectionPhase]);

//   useEffect(() => {
//     if (phase === 'waiting') return;

//     const timer = setInterval(() => {
//       setCountdown(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           if (phase === 'detecting') {
//             // Time's up without answer
//             setSelectedGesture('none');
//           }
//           setPhase('waiting');
//           return 5;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [phase]);

//   return (
//     <div style={{ 
//       maxWidth: '700px', 
//       margin: '0 auto', 
//       padding: '20px',
//       fontFamily: 'Arial, sans-serif'
//     }}>
//       <h1 style={{ textAlign: 'center' }}>Flashcard Learner</h1>

//       <PracticeView 
//         selectedGesture={selectedGesture}
//         onShowAnswer={setShowGestureUI}
//         countdown={countdown}
//         phase={phase}
//       />

//       {showGestureUI && (
//         <div style={{
//           marginTop: '30px',
//           padding: '15px',
//           border: '2px solid #4CAF50',
//           borderRadius: '8px'
//         }}>
//           <h3>Gesture Controls</h3>
          
//           {phase === 'detecting' ? (
//             <p>Show your gesture in: {countdown}s</p>
//           ) : (
//             <p>Next question in: {countdown}s</p>
//           )}
          
//           <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
//             <li>👍 Thumbs Up = Easy</li>
//             <li>✋ Open Hand = Medium</li>
//             <li>👎 Thumbs Down = Hard</li>
//           </ul>
          
//           {selectedGesture && selectedGesture !== 'none' && (
//             <div style={{
//               margin: '10px 0',
//               padding: '10px',
//               backgroundColor: '#4CAF50',
//               color: 'white',
//               borderRadius: '4px',
//               textAlign: 'center'
//             }}>
//               Selected: {selectedGesture}
//             </div>
//           )}
          
//           <GestureDisplay 
//             onGestureDetected={handleGestureDetected} 
//             active={phase === 'detecting'}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
import React, { useState, useCallback, useEffect } from "react";
import PracticeView from "./components/PracticeView";
import GestureDisplay from './components/GestureDisplay';
import { GestureType } from "./types";

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

  useEffect(() => {
    if (phase === 'waiting') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (phase === 'detecting') {
            setSelectedGesture('none');
          }
          setPhase('waiting');
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div style={{ 
      maxWidth: '700px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center' }}>Flashcard Learner</h1>

      <PracticeView 
        selectedGesture={selectedGesture}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
        countdown={countdown}
        phase={phase}
      />

      <div style={{
        marginTop: '30px',
        padding: '15px',
        border: '2px solid #4CAF50',
        borderRadius: '8px'
      }}>
        <h3>Gesture Controls</h3>
        
        {phase === 'detecting' ? (
          <p>Show your gesture in: {countdown}s</p>
        ) : (
          <p>Next question in: {countdown}s</p>
        )}
        
        <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
          <li>👍 Thumbs Up = Easy</li>
          <li>✋ Open Hand = Medium</li>
          <li>👎 Thumbs Down = Hard</li>
        </ul>
        
        {selectedGesture && selectedGesture !== 'none' && (
          <div style={{
            margin: '10px 0',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            Selected: {selectedGesture}
          </div>
        )}
        
        <GestureDisplay 
          onGestureDetected={handleGestureDetected} 
          active={phase === 'detecting'}
        />
      </div>
    </div>
  );
};

export default App;
import React from "react";
import PracticeView from "./components/PracticeView";
import GestureDisplay from './components/GestureDisplay';
import HandLandmarkTest from './components/HandLandmarkTest';

const App: React.FC = () => {
  return (
    <div style={{ 
      maxWidth: '700px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center' }}>Flashcard Learner</h1>

      {/* Hand Landmark Debugging */}
      <div style={{
        border: '2px solid blue',
        padding: '20px',
        margin: '20px 0',
        borderRadius: '8px',
        backgroundColor: '#f0f8ff'
      }}>
        <HandLandmarkTest />
      </div>
      <PracticeView />
      <GestureDisplay />
    </div>
  );
};

export default App;

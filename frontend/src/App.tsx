// import React from "react";
// import PracticeView from "./components/PracticeView";
// import GestureDisplay  from './components/GestureDisplay';

// const App: React.FC = () => {
//   return (
//     <div className="app-container">
//       <h1>Flashcard Learner</h1>
//       <PracticeView />
//       <GestureDisplay />
//     </div>
//   );
// };

// export default App;
import React from "react";
import PracticeView from "./components/PracticeView";
import GestureDisplay from './components/GestureDisplay';
import CameraTest from './components/CameraTest'; // Add this import
import HandLandmarkTest from './components/HandLandmarkTest';


  

const App: React.FC = () => {
  return (
    <div className="App">
      <HandLandmarkTest />
    </div>
  );
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center' }}>Flashcard Learner</h1>
      
      {/* Temporary Camera Test - will appear above your existing components */}
      <div style={{
        border: '2px solid red',
        padding: '20px',
        margin: '20px 0',
        borderRadius: '8px',
        backgroundColor: '#fff0f0'
      }}>
        <h2 style={{ color: 'red', marginTop: 0 }}>Camera Test Mode</h2>
        <CameraTest />
      </div>
      
      <PracticeView />
      <GestureDisplay />
    </div>
  );
 

};

export default App;
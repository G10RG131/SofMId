import React from "react";
import PracticeView from "./components/PracticeView";
//import "./styles.css";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>Flashcard Learner</h1>
      <PracticeView />
    </div>
  );
};

export default App;
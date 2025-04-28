import React from "react";
import PracticeView from "./components/PracticeView";
import "./index.css";

const App: React.FC = () => {
  return (
    <div>
      <div className="app-header">
        <h1>Practice App</h1>
      </div>
      <div className="app-container">
        <PracticeView />
      </div>
    </div>
  );
};

export default App;
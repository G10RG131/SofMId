import { useEffect, useState } from 'react';
import { GestureService } from '../services/gesture-service';
import { GestureType } from '../types/gesture-types';
import React from "react";

const GestureDisplay: React.FC = () => {
  return (
    <div>
      {/* Component content here */}
      <p>Gesture Display Component</p>
    </div>
  );
};

export default GestureDisplay;
// export const GestureDisplay = () => {
//     const [gesture, setGesture] = useState<GestureType>('none');
//     // ... rest of the component ...
// };
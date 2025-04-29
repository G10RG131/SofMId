// // // import React from "react";
// // // import { Flashcard } from "../types";

// // // interface FlashcardDisplayProps {
// // //   card: Flashcard;
// // //   showBack: boolean;
// // // }

// // // const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({ card, showBack }) => {
// // //   return (
// // //     <div style={{
// // //       minHeight: '200px',
// // //       display: 'flex',
// // //       flexDirection: 'column',
// // //       justifyContent: 'center',
// // //       alignItems: 'center',
// // //       margin: '20px 0',
// // //       padding: '20px',
// // //       border: '1px solid #ddd',
// // //       borderRadius: '8px',
// // //       backgroundColor: '#f9f9f9'
// // //     }}>
// // //       <p style={{ 
// // //         fontSize: '24px', 
// // //         fontWeight: 'bold',
// // //         marginBottom: '20px'
// // //       }}>
// // //         {card.front}
// // //       </p>
// // //       <p style={{ 
// // //         fontSize: '20px',
// // //         color: showBack ? '#333' : '#ccc'
// // //       }}>
// // //         {showBack ? card.back : '???'}
// // //       </p>
// // //       {showBack && card.hint && (
// // //         <p style={{ 
// // //           marginTop: '15px',
// // //           fontStyle: 'italic',
// // //           color: '#666'
// // //         }}>
// // //           Hint: {card.hint}
// // //         </p>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default FlashcardDisplay;
// // import React from "react";
// // import { Flashcard } from "../types";

// // interface FlashcardDisplayProps {
// //   card: Flashcard;
// //   showBack: boolean;
// // }

// // const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({ card, showBack }) => {
// //   return (
// //     <div style={{
// //       minHeight: '200px',
// //       display: 'flex',
// //       flexDirection: 'column',
// //       justifyContent: 'center',
// //       alignItems: 'center',
// //       margin: '20px 0',
// //       padding: '20px',
// //       border: '1px solid #ddd',
// //       borderRadius: '8px',
// //       backgroundColor: '#f9f9f9'
// //     }}>
// //       <p style={{ 
// //         fontSize: '24px', 
// //         fontWeight: 'bold',
// //         marginBottom: '20px'
// //       }}>
// //         {card.front}
// //       </p>
// //       <p style={{ 
// //         fontSize: '20px',
// //         color: showBack ? '#333' : '#ccc'
// //       }}>
// //         {showBack ? card.back : '???'}
// //       </p>
// //       {showBack && card.hint && (
// //         <p style={{ 
// //           marginTop: '15px',
// //           fontStyle: 'italic',
// //           color: '#666'
// //         }}>
// //           Hint: {card.hint}
// //         </p>
// //       )}
// //     </div>
// //   );
// // };

// // export default FlashcardDisplay;
// import React from "react";
// import { Flashcard, GestureType } from "../types";

// interface FlashcardDisplayProps {
//   card: Flashcard;
//   showBack: boolean;
//   selectedGesture?: GestureType | null;
// }

// const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({ 
//   card, 
//   showBack,
//   selectedGesture
// }) => {
//   return (
//     <div style={{
//       minHeight: '200px',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       margin: '20px 0',
//       padding: '20px',
//       border: '1px solid #ddd',
//       borderRadius: '8px',
//       backgroundColor: '#f9f9f9'
//     }}>
//       <p style={{ 
//         fontSize: '24px', 
//         fontWeight: 'bold',
//         marginBottom: '20px'
//       }}>
//         {card.front}
//       </p>
//       <p style={{ 
//         fontSize: '20px',
//         color: showBack ? '#333' : '#ccc'
//       }}>
//         {showBack ? card.back : '???'}
//       </p>
//       {showBack && card.hint && (
//         <p style={{ 
//           marginTop: '15px',
//           fontStyle: 'italic',
//           color: '#666'
//         }}>
//           Hint: {card.hint}
//         </p>
//       )}
//       {showBack && selectedGesture && (
//         <div style={{
//           marginTop: '15px',
//           padding: '10px',
//           backgroundColor: '#4CAF50',
//           color: 'white',
//           borderRadius: '4px',
//           textAlign: 'center'
//         }}>
//           Selected: {selectedGesture}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FlashcardDisplay;
import React from "react";
import { Flashcard, GestureType } from "../types";

interface FlashcardDisplayProps {
  card: Flashcard;
  showBack: boolean;
  selectedGesture?: GestureType | null;
}

const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({ 
  card, 
  showBack,
  selectedGesture
}) => {
  return (
    <div style={{
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '20px 0',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <p style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        {card.front}
      </p>
      <p style={{ 
        fontSize: '20px',
        color: showBack ? '#333' : '#ccc'
      }}>
        {showBack ? card.back : '???'}
      </p>
      {showBack && card.hint && (
        <p style={{ 
          marginTop: '15px',
          fontStyle: 'italic',
          color: '#666'
        }}>
          Hint: {card.hint}
        </p>
      )}
      {showBack && selectedGesture && selectedGesture !== 'none' && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          Selected: {selectedGesture}
        </div>
      )}
    </div>
  );
};

export default FlashcardDisplay;
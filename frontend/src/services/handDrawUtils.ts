// // // export function drawHand(ctx: CanvasRenderingContext2D, landmarks: Array<[number, number, number]>) {
// // //     // Draw landmarks
// // //     ctx.fillStyle = 'red';
// // //     for (let i = 0; i < landmarks.length; i++) {
// // //       const [x, y] = landmarks[i];
// // //       ctx.beginPath();
// // //       ctx.arc(x, y, 5, 0, 2 * Math.PI);
// // //       ctx.fill();
// // //     }
  
// // //     // Draw connections
// // //     ctx.strokeStyle = 'white';
// // //     ctx.lineWidth = 2;
  
// // //     // Thumb
// // //     drawConnection(ctx, landmarks, [0, 1, 2, 3, 4]);
// // //     // Index finger
// // //     drawConnection(ctx, landmarks, [0, 5, 6, 7, 8]);
// // //     // Middle finger
// // //     drawConnection(ctx, landmarks, [0, 9, 10, 11, 12]);
// // //     // Ring finger
// // //     drawConnection(ctx, landmarks, [0, 13, 14, 15, 16]);
// // //     // Pinky
// // //     drawConnection(ctx, landmarks, [0, 17, 18, 19, 20]);
// // //     // Palm
// // //     drawConnection(ctx, landmarks, [0, 5, 9, 13, 17, 0]);
// // //   }
  
// // //   function drawConnection(
// // //     ctx: CanvasRenderingContext2D,
// // //     landmarks: Array<[number, number, number]>,
// // //     indices: number[]
// // //   ) {
// // //     ctx.beginPath();
// // //     for (let i = 0; i < indices.length; i++) {
// // //       const [x, y] = landmarks[indices[i]];
// // //       if (i === 0) {
// // //         ctx.moveTo(x, y);
// // //       } else {
// // //         ctx.lineTo(x, y);
// // //       }
// // //     }
// // //     ctx.stroke();
// // //   }
// // import { AnnotatedPrediction } from '@tensorflow-models/handpose';

// // export const drawHand = (
// //   ctx: CanvasRenderingContext2D,
// //   landmarks: Array<[number, number, number]>
// // ) => {
// //   ctx.strokeStyle = 'cyan';
// //   ctx.lineWidth = 2;

// //   // Draw connections between landmarks
// //   const connections = [
// //     [0, 1, 2, 3, 4],         // Thumb
// //     [0, 5, 6, 7, 8],         // Index finger
// //     [0, 9, 10, 11, 12],      // Middle finger
// //     [0, 13, 14, 15, 16],     // Ring finger
// //     [0, 17, 18, 19, 20],     // Pinky
// //     [5, 9, 13, 17, 0]        // Palm base
// //   ];

// //   connections.forEach(connection => {
// //     ctx.beginPath();
// //     connection.forEach((jointIdx, i) => {
// //       const [x, y] = landmarks[jointIdx];
// //       if (i === 0) {
// //         ctx.moveTo(x, y);
// //       } else {
// //         ctx.lineTo(x, y);
// //       }
// //     });
// //     ctx.stroke();
// //   });

// //   // Draw landmarks as circles
// //   ctx.fillStyle = 'red';
// //   landmarks.forEach(landmark => {
// //     const [x, y] = landmark;
// //     ctx.beginPath();
// //     ctx.arc(x, y, 3, 0, 2 * Math.PI);
// //     ctx.fill();
// //   });
// // };
// import { AnnotatedPrediction } from '@tensorflow-models/handpose';

// export const drawHand = (
//   ctx: CanvasRenderingContext2D,
//   landmarks: Array<[number, number, number]>
// ) => {
//   if (!ctx) return;

//   // Draw connections
//   const fingerConnections = [
//     [0, 1, 2, 3, 4],       // Thumb
//     [0, 5, 6, 7, 8],       // Index
//     [0, 9, 10, 11, 12],    // Middle
//     [0, 13, 14, 15, 16],   // Ring
//     [0, 17, 18, 19, 20]    // Pinky
//   ];

//   // Set drawing styles
//   ctx.strokeStyle = '#00FFFF';
//   ctx.fillStyle = '#FF0000';
//   ctx.lineWidth = 2;

//   // Draw connections
//   fingerConnections.forEach(connection => {
//     ctx.beginPath();
//     connection.forEach((jointIdx, i) => {
//       const [x, y] = landmarks[jointIdx];
//       if (i === 0) {
//         ctx.moveTo(x, y);
//       } else {
//         ctx.lineTo(x, y);
//       }
//     });
//     ctx.stroke();
//   });

//   // Draw landmarks
//   landmarks.forEach(landmark => {
//     const [x, y] = landmark;
//     ctx.beginPath();
//     ctx.arc(x, y, 4, 0, 2 * Math.PI);
//     ctx.fill();
//   });
// };
import { AnnotatedPrediction } from '@tensorflow-models/handpose';

export const drawHand = (
  ctx: CanvasRenderingContext2D,
  landmarks: Array<[number, number, number]>
) => {
  if (!ctx) return;

  // Draw connections
  const fingerConnections = [
    [0, 1, 2, 3, 4],       // Thumb
    [0, 5, 6, 7, 8],       // Index
    [0, 9, 10, 11, 12],    // Middle
    [0, 13, 14, 15, 16],   // Ring
    [0, 17, 18, 19, 20]    // Pinky
  ];

  // Set drawing styles
  ctx.strokeStyle = '#00FFFF';
  ctx.fillStyle = '#FF0000';
  ctx.lineWidth = 2;

  // Draw connections
  fingerConnections.forEach(connection => {
    ctx.beginPath();
    connection.forEach((jointIdx, i) => {
      const [x, y] = landmarks[jointIdx];
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  });

  // Draw landmarks
  landmarks.forEach(landmark => {
    const [x, y] = landmark;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
};
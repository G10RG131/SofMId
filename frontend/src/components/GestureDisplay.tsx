// // // // // import React from "react";

// // // // // const GestureDisplay: React.FC = () => {
// // // // //   return (
// // // // //     <div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default GestureDisplay;
// // // // import React, { useEffect, useRef } from 'react';
// // // // import { GestureClassifier } from '../services/gesture-classifier';
// // // // import * as handpose from '@tensorflow-models/handpose';
// // // // import * as tf from '@tensorflow/tfjs';
// // // // import { GestureType } from '../types';
// // // // import { drawHand } from '../services/handDrawUtils';

// // // // interface GestureDisplayProps {
// // // //   onGestureDetected: (gesture: GestureType) => void;
// // // // }

// // // // const GestureDisplay: React.FC<GestureDisplayProps> = ({ onGestureDetected }) => {
// // // //   const videoRef = useRef<HTMLVideoElement>(null);
// // // //   const canvasRef = useRef<HTMLCanvasElement>(null);

// // // //   useEffect(() => {
// // // //     let model: handpose.HandPose;
// // // //     let animationFrameId: number;
// // // //     const classifier = new GestureClassifier();

// // // //     const init = async () => {
// // // //       await tf.ready();
// // // //       model = await handpose.load();
// // // //       const stream = await navigator.mediaDevices.getUserMedia({ 
// // // //         video: { width: 640, height: 480 } 
// // // //       });
      
// // // //       if (videoRef.current) {
// // // //         videoRef.current.srcObject = stream;
// // // //         videoRef.current.onloadedmetadata = () => {
// // // //           if (canvasRef.current && videoRef.current) {
// // // //             canvasRef.current.width = videoRef.current.videoWidth;
// // // //             canvasRef.current.height = videoRef.current.videoHeight;
// // // //           }
// // // //         };
// // // //       }

// // // //       const detect = async () => {
// // // //         if (videoRef.current && canvasRef.current) {
// // // //           const predictions = await model.estimateHands(videoRef.current);
// // // //           const ctx = canvasRef.current.getContext('2d');
          
// // // //           if (ctx) {
// // // //             ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
// // // //             if (predictions.length > 0) {
// // // //               drawHand(ctx, predictions[0].landmarks);
// // // //               const gesture = classifier.classify(predictions);
// // // //               if (gesture !== 'none') {
// // // //                 onGestureDetected(gesture);
// // // //               }
// // // //             }
// // // //           }
// // // //         }
// // // //         animationFrameId = requestAnimationFrame(detect);
// // // //       };
// // // //       detect();
// // // //     };

// // // //     init();

// // // //     return () => {
// // // //       cancelAnimationFrame(animationFrameId);
// // // //       if (videoRef.current?.srcObject) {
// // // //         (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
// // // //       }
// // // //     };
// // // //   }, [onGestureDetected]);

// // // //   return (
// // // //     <div style={{ position: 'relative', width: '100%' }}>
// // // //       <video
// // // //         ref={videoRef}
// // // //         autoPlay
// // // //         playsInline
// // // //         muted
// // // //         style={{ 
// // // //           width: '100%', 
// // // //           borderRadius: '4px',
// // // //           transform: 'scaleX(-1)' // Mirror the camera
// // // //         }}
// // // //       />
// // // //       <canvas
// // // //         ref={canvasRef}
// // // //         style={{
// // // //           position: 'absolute',
// // // //           top: 0,
// // // //           left: 0,
// // // //           width: '100%',
// // // //           height: '100%',
// // // //           pointerEvents: 'none',
// // // //           transform: 'scaleX(-1)' // Match video mirroring
// // // //         }}
// // // //       />
// // // //     </div>
// // // //   );
// // // // };

// // // // export default GestureDisplay;
// // // import React, { useEffect, useRef, useState } from 'react';
// // // import { GestureClassifier } from '../services/gesture-classifier';
// // // import * as handpose from '@tensorflow-models/handpose';
// // // import * as tf from '@tensorflow/tfjs';
// // // import { GestureType } from '../types';
// // // import { drawHand } from '../services/handDrawUtils';

// // // interface GestureDisplayProps {
// // //   onGestureDetected: (gesture: GestureType) => void;
// // // }

// // // const GestureDisplay: React.FC<GestureDisplayProps> = ({ onGestureDetected }) => {
// // //   const videoRef = useRef<HTMLVideoElement>(null);
// // //   const canvasRef = useRef<HTMLCanvasElement>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);

// // //   useEffect(() => {
// // //     let model: handpose.HandPose;
// // //     let animationFrameId: number;
// // //     const classifier = new GestureClassifier();

// // //     const init = async () => {
// // //       try {
// // //         await tf.ready();
// // //         model = await handpose.load();
        
// // //         const stream = await navigator.mediaDevices.getUserMedia({ 
// // //           video: { 
// // //             width: 640, 
// // //             height: 480,
// // //             facingMode: 'user'
// // //           } 
// // //         });

// // //         if (videoRef.current) {
// // //           videoRef.current.srcObject = stream;
          
// // //           // Wait for video to be ready
// // //           await new Promise<void>((resolve) => {
// // //             videoRef.current!.onloadedmetadata = () => resolve();
// // //           });

// // //           if (canvasRef.current) {
// // //             canvasRef.current.width = videoRef.current.videoWidth;
// // //             canvasRef.current.height = videoRef.current.videoHeight;
// // //           }
// // //         }

// // //         const detect = async () => {
// // //           if (!videoRef.current || !canvasRef.current) return;
          
// // //           const ctx = canvasRef.current.getContext('2d');
// // //           if (!ctx) return;

// // //           try {
// // //             const predictions = await model.estimateHands(videoRef.current);
// // //             ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
// // //             if (predictions.length > 0) {
// // //               drawHand(ctx, predictions[0].landmarks);
// // //               const gesture = classifier.classify(predictions);
// // //               if (gesture !== 'none') {
// // //                 onGestureDetected(gesture);
// // //               }
// // //             }
// // //           } catch (err) {
// // //             console.error('Detection error:', err);
// // //           }
          
// // //           animationFrameId = requestAnimationFrame(detect);
// // //         };

// // //         setLoading(false);
// // //         detect();
// // //       } catch (err) {
// // //         console.error('Initialization error:', err);
// // //         setError('Failed to initialize camera and hand detection');
// // //         setLoading(false);
// // //       }
// // //     };

// // //     init();

// // //     return () => {
// // //       cancelAnimationFrame(animationFrameId);
// // //       if (videoRef.current?.srcObject) {
// // //         (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
// // //       }
// // //     };
// // //   }, [onGestureDetected]);

// // //   return (
// // //     <div style={{ 
// // //       position: 'relative', 
// // //       width: '100%',
// // //       minHeight: '300px',
// // //       border: '2px solid #4CAF50',
// // //       borderRadius: '8px',
// // //       overflow: 'hidden'
// // //     }}>
// // //       {loading && (
// // //         <div style={{
// // //           position: 'absolute',
// // //           top: 0,
// // //           left: 0,
// // //           right: 0,
// // //           bottom: 0,
// // //           display: 'flex',
// // //           alignItems: 'center',
// // //           justifyContent: 'center',
// // //           backgroundColor: 'rgba(0,0,0,0.5)',
// // //           color: 'white'
// // //         }}>
// // //           Loading hand detection...
// // //         </div>
// // //       )}

// // //       {error && (
// // //         <div style={{
// // //           padding: '20px',
// // //           color: 'red',
// // //           textAlign: 'center'
// // //         }}>
// // //           {error}
// // //         </div>
// // //       )}

// // //       <video
// // //         ref={videoRef}
// // //         autoPlay
// // //         playsInline
// // //         muted
// // //         style={{ 
// // //           width: '100%',
// // //           display: loading || error ? 'none' : 'block',
// // //           transform: 'scaleX(-1)'
// // //         }}
// // //       />
      
// // //       <canvas
// // //         ref={canvasRef}
// // //         style={{
// // //           position: 'absolute',
// // //           top: 0,
// // //           left: 0,
// // //           width: '100%',
// // //           height: '100%',
// // //           pointerEvents: 'none',
// // //           transform: 'scaleX(-1)',
// // //           display: loading || error ? 'none' : 'block'
// // //         }}
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default GestureDisplay;
// // import React, { useEffect, useRef, useState  } from 'react';
// // import { GestureClassifier } from '../services/gesture-classifier';
// // import * as handpose from '@tensorflow-models/handpose';
// // import * as tf from '@tensorflow/tfjs';
// // import { GestureType } from '../types';
// // import { drawHand } from '../services/handDrawUtils';

// // interface GestureDisplayProps {
// //   onGestureDetected: (gesture: GestureType) => void;
// //   disabled?: boolean;
// // }

// // const GestureDisplay: React.FC<GestureDisplayProps> = ({ 
// //   onGestureDetected,
// //   disabled = false
// // }) => {
// //   const videoRef = useRef<HTMLVideoElement>(null);
// //   const canvasRef = useRef<HTMLCanvasElement>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     let model: handpose.HandPose;
// //     let animationFrameId: number;
// //     const classifier = new GestureClassifier();

// //     const init = async () => {
// //       try {
// //         await tf.ready();
// //         model = await handpose.load();
        
// //         const stream = await navigator.mediaDevices.getUserMedia({ 
// //           video: { 
// //             width: 640, 
// //             height: 480,
// //             facingMode: 'user'
// //           } 
// //         });

// //         if (videoRef.current) {
// //           videoRef.current.srcObject = stream;
          
// //           await new Promise<void>((resolve) => {
// //             videoRef.current!.onloadedmetadata = () => resolve();
// //           });

// //           if (canvasRef.current) {
// //             canvasRef.current.width = videoRef.current.videoWidth;
// //             canvasRef.current.height = videoRef.current.videoHeight;
// //           }
// //         }

// //         const detect = async () => {
// //           if (disabled || !videoRef.current || !canvasRef.current) return;
          
// //           const ctx = canvasRef.current.getContext('2d');
// //           if (!ctx) return;

// //           try {
// //             const predictions = await model.estimateHands(videoRef.current);
// //             ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
// //             if (predictions.length > 0) {
// //               drawHand(ctx, predictions[0].landmarks);
// //               const gesture = classifier.classify(predictions);
// //               if (gesture !== 'none') {
// //                 onGestureDetected(gesture);
// //               }
// //             }
// //           } catch (err) {
// //             console.error('Detection error:', err);
// //           }
          
// //           animationFrameId = requestAnimationFrame(detect);
// //         };

// //         setLoading(false);
// //         detect();
// //       } catch (err) {
// //         console.error('Initialization error:', err);
// //         setError('Failed to initialize camera and hand detection');
// //         setLoading(false);
// //       }
// //     };

// //     init();

// //     return () => {
// //       cancelAnimationFrame(animationFrameId);
// //       if (videoRef.current?.srcObject) {
// //         (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
// //       }
// //     };
// //   }, [onGestureDetected, disabled]);

// //   return (
// //     <div style={{ 
// //       position: 'relative', 
// //       width: '100%',
// //       minHeight: '300px',
// //       border: '2px solid #4CAF50',
// //       borderRadius: '8px',
// //       overflow: 'hidden'
// //     }}>
// //       {loading && (
// //         <div style={{
// //           position: 'absolute',
// //           top: 0,
// //           left: 0,
// //           right: 0,
// //           bottom: 0,
// //           display: 'flex',
// //           alignItems: 'center',
// //           justifyContent: 'center',
// //           backgroundColor: 'rgba(0,0,0,0.5)',
// //           color: 'white'
// //         }}>
// //           Loading hand detection...
// //         </div>
// //       )}

// //       {error && (
// //         <div style={{
// //           padding: '20px',
// //           color: 'red',
// //           textAlign: 'center'
// //         }}>
// //           {error}
// //         </div>
// //       )}

// //       <video
// //         ref={videoRef}
// //         autoPlay
// //         playsInline
// //         muted
// //         style={{ 
// //           width: '100%',
// //           display: loading || error ? 'none' : 'block',
// //           transform: 'scaleX(-1)'
// //         }}
// //       />
      
// //       <canvas
// //         ref={canvasRef}
// //         style={{
// //           position: 'absolute',
// //           top: 0,
// //           left: 0,
// //           width: '100%',
// //           height: '100%',
// //           pointerEvents: 'none',
// //           transform: 'scaleX(-1)',
// //           display: loading || error ? 'none' : 'block'
// //         }}
// //       />

// //       {disabled && (
// //         <div style={{
// //           position: 'absolute',
// //           top: 0,
// //           left: 0,
// //           right: 0,
// //           bottom: 0,
// //           backgroundColor: 'rgba(0,0,0,0.3)',
// //           display: 'flex',
// //           alignItems: 'center',
// //           justifyContent: 'center',
// //           color: 'white',
// //           fontSize: '24px'
// //         }}>
// //           Next question loading...
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default GestureDisplay;
// import React, { useEffect, useRef, useState } from 'react';
// import { GestureClassifier } from '../services/gesture-classifier';
// import * as handpose from '@tensorflow-models/handpose';
// import * as tf from '@tensorflow/tfjs';
// import { GestureType } from '../types';
// import { drawHand } from '../services/handDrawUtils';

// interface GestureDisplayProps {
//   onGestureDetected: (gesture: GestureType) => void;
//   active: boolean;
// }

// const GestureDisplay: React.FC<GestureDisplayProps> = ({ 
//   onGestureDetected,
//   active
// }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let model: handpose.HandPose;
//     let animationFrameId: number;
//     const classifier = new GestureClassifier();

//     const init = async () => {
//       try {
//         await tf.ready();
//         model = await handpose.load();
        
//         const stream = await navigator.mediaDevices.getUserMedia({ 
//           video: { 
//             width: 640, 
//             height: 480,
//             facingMode: 'user'
//           } 
//         });

//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
          
//           await new Promise<void>((resolve) => {
//             videoRef.current!.onloadedmetadata = () => resolve();
//           });

//           if (canvasRef.current) {
//             canvasRef.current.width = videoRef.current.videoWidth;
//             canvasRef.current.height = videoRef.current.videoHeight;
//           }
//         }

//         const detect = async () => {
//           if (!active || !videoRef.current || !canvasRef.current) return;
          
//           const ctx = canvasRef.current.getContext('2d');
//           if (!ctx) return;

//           try {
//             const predictions = await model.estimateHands(videoRef.current);
//             ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
//             if (predictions.length > 0) {
//               drawHand(ctx, predictions[0].landmarks);
//               const gesture = classifier.classify(predictions);
//               if (gesture !== 'none') {
//                 onGestureDetected(gesture);
//               }
//             }
//           } catch (err) {
//             console.error('Detection error:', err);
//           }
          
//           animationFrameId = requestAnimationFrame(detect);
//         };

//         setLoading(false);
//         detect();
//       } catch (err) {
//         console.error('Initialization error:', err);
//         setError('Failed to initialize camera and hand detection');
//         setLoading(false);
//       }
//     };

//     init();

//     return () => {
//       cancelAnimationFrame(animationFrameId);
//       if (videoRef.current?.srcObject) {
//         (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [onGestureDetected, active]);

//   return (
//     <div style={{ 
//       position: 'relative', 
//       width: '100%',
//       minHeight: '300px',
//       border: '2px solid #4CAF50',
//       borderRadius: '8px',
//       overflow: 'hidden'
//     }}>
//       {loading && (
//         <div style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: 'rgba(0,0,0,0.5)',
//           color: 'white'
//         }}>
//           Loading hand detection...
//         </div>
//       )}

//       {error && (
//         <div style={{
//           padding: '20px',
//           color: 'red',
//           textAlign: 'center'
//         }}>
//           {error}
//         </div>
//       )}

//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted
//         style={{ 
//           width: '100%',
//           display: loading || error ? 'none' : 'block',
//           transform: 'scaleX(-1)'
//         }}
//       />
      
//       <canvas
//         ref={canvasRef}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           pointerEvents: 'none',
//           transform: 'scaleX(-1)',
//           display: loading || error ? 'none' : 'block'
//         }}
//       />

//       {!active && !loading && !error && (
//         <div style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0,0,0,0.3)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           color: 'white',
//           fontSize: '24px'
//         }}>
//           Camera paused
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestureDisplay;
import React, { useEffect, useRef, useState } from 'react';
import { GestureClassifier } from '../services/gesture-classifier';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import { GestureType } from '../types';
import { drawHand } from '../services/handDrawUtils';

interface GestureDisplayProps {
  onGestureDetected: (gesture: GestureType) => void;
  active: boolean;
}

const GestureDisplay: React.FC<GestureDisplayProps> = ({ 
  onGestureDetected,
  active
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let model: handpose.HandPose;
    let animationFrameId: number;
    const classifier = new GestureClassifier();

    const init = async () => {
      try {
        await tf.ready();
        model = await handpose.load();
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'user'
          } 
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          await new Promise<void>((resolve) => {
            videoRef.current!.onloadedmetadata = () => resolve();
          });

          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        }

        const detect = async () => {
          if (!videoRef.current || !canvasRef.current) return;
          
          const ctx = canvasRef.current.getContext('2d');
          if (!ctx) return;

          try {
            const predictions = await model.estimateHands(videoRef.current);
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
            if (predictions.length > 0) {
              drawHand(ctx, predictions[0].landmarks);
              if (active) {
                const gesture = classifier.classify(predictions);
                if (gesture !== 'none') {
                  onGestureDetected(gesture);
                }
              }
            }
          } catch (err) {
            console.error('Detection error:', err);
          }
          
          animationFrameId = requestAnimationFrame(detect);
        };

        setLoading(false);
        detect();
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize camera and hand detection');
        setLoading(false);
      }
    };

    init();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [onGestureDetected, active]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%',
      minHeight: '300px',
      border: '2px solid #4CAF50',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white'
        }}>
          Loading hand detection...
        </div>
      )}

      {error && (
        <div style={{
          padding: '20px',
          color: 'red',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ 
          width: '100%',
          display: loading || error ? 'none' : 'block',
          transform: 'scaleX(-1)'
        }}
      />
      
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          transform: 'scaleX(-1)',
          display: loading || error ? 'none' : 'block'
        }}
      />
    </div>
  );
};

export default GestureDisplay;
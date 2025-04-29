
import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { GestureClassifier } from '../services/gesture-classifier';
import { drawHand } from '../services/handDrawUtils';

export default function GestureDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gesture, setGesture] = useState<string>('none');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const gestureClassifier = new GestureClassifier();

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;
    let handposeModel: handpose.HandPose;

    const init = async () => {
      try {
        // 1. Load TensorFlow and handpose model
        await tf.ready();
        handposeModel = await handpose.load();

        // 2. Start camera
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
          };
        }

        // 3. Detection loop
        const detectHands = async () => {
          if (videoRef.current && canvasRef.current) {
            const predictions = await handposeModel.estimateHands(videoRef.current);
            
            // Draw landmarks
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              
              if (predictions.length > 0) {
                drawHand(ctx, predictions[0].landmarks);
                const gestureResult = gestureClassifier.classify(predictions);
                setGesture(gestureResult);
              } else {
                setGesture('none');
              }
            }
          }
          animationFrameId = requestAnimationFrame(detectHands);
        };

        detectHands();

      } catch (err) {
        setCameraError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    init();

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '640px' }}>
      <h2>Gesture Detector</h2>
      {cameraError ? (
        <div style={{ color: 'red' }}>{cameraError}</div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', display: 'block' }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          />
          <div style={{ marginTop: '10px' }}>
            Current gesture: <strong>{gesture}</strong>
          </div>
        </>
      )}
    </div>
  );
}
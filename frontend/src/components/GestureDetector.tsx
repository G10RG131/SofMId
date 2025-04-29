import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { GestureClassifier } from '../services/gesture-classifier';
import { drawHand } from '../services/handDrawUtils';
import { GestureService } from '../services/gesture-service';

interface GestureDetectorProps {
  onGestureDetected: (gesture: string) => void;
  active: boolean;
}

export default function GestureDetector({ onGestureDetected, active }: GestureDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gesture, setGesture] = useState<string>('none');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const gestureClassifier = new GestureClassifier();
  const gestureService = new GestureService();

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;
    let handposeModel: handpose.HandPose;

    const init = async () => {
      try {
        await tf.ready();
        handposeModel = await handpose.load();

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

        const detectHands = async () => {
          if (videoRef.current && canvasRef.current && active) {
            const predictions = await handposeModel.estimateHands(videoRef.current);
            
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              
              if (predictions.length > 0) {
                drawHand(ctx, predictions[0].landmarks);
                const gestureResult = gestureClassifier.classify(predictions);
                setGesture(gestureResult);
                
                if (gestureResult !== 'none') {
                  gestureService.socket.emit('gesture', { 
                    gesture: gestureResult,
                    timestamp: Date.now()
                  });
                  onGestureDetected(gestureResult);
                }
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
      gestureService.disconnect();
    };
  }, [active]);

  return (
    <div style={{ position: 'relative', width: '640px' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ 
          width: '100%', 
          display: 'block',
          opacity: active ? 1 : 0.5
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
          display: active ? 'block' : 'none'
        }}
      />
      {active && (
        <div style={{ marginTop: '10px' }}>
          Current gesture: <strong>{gesture}</strong>
        </div>
      )}
    </div>
  );
}
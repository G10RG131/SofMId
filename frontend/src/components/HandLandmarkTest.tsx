import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

export default function HandLandmarkTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;
    let model: handpose.HandPose;

    const init = async () => {
      try {
        // 1. Set backend and load model
        await tf.setBackend('webgl');
        await tf.ready();
        model = await handpose.load();

        // 2. Start camera with proper ready check
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise((resolve) => {
            videoRef.current!.onloadedmetadata = resolve;
          });
          
          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        }

        // 3. Safe detection loop
        const detect = async () => {
          if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) {
            return requestAnimationFrame(detect);
          }

          try {
            const predictions = await model.estimateHands(videoRef.current);
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              if (predictions.length > 0) {
                // Draw landmarks
                ctx.fillStyle = 'red';
                predictions[0].landmarks.forEach(([x, y]) => {
                  ctx.beginPath();
                  ctx.arc(x, y, 5, 0, 2 * Math.PI);
                  ctx.fill();
                });
              }
            }
          } catch (err) {
            console.error('Frame error:', err);
          }
          animationFrameId = requestAnimationFrame(detect);
        };

        detect();
        setLoading(false);

      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setLoading(false);
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
      <h2>Hand Landmark Test</h2>
      {loading && <div>Loading model...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
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
    </div>
  );
}
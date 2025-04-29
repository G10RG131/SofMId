import { useEffect, useRef, useState } from 'react';
import { GestureService } from '../services/gesture-service';

export default function GestureDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [gesture, setGesture] = useState<string>('none');
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const gestureService = new GestureService();
    let stream: MediaStream | null = null;

    const init = async () => {
      try {
        // 1. Start camera
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;

        // 2. Test gesture detection
        gestureService.onGestureUpdate((result) => {
          console.log("Gesture detected:", result.gesture);
          setGesture(result.gesture);
        });
      } catch (err) {
        setCameraError(`Camera/gesture init failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    init();

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      gestureService.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Gesture Detector Test</h2>
      {cameraError ? (
        <div style={{ color: 'red' }}>{cameraError}</div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '640px' }}
          />
          <div>Current gesture: <strong>{gesture}</strong></div>
        </>
      )}
    </div>
  );
}
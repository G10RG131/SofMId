import { useEffect, useRef, useState } from 'react';

export default function CameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 1280, 
            height: 720,
            facingMode: 'user' // Front camera (use 'environment' for rear)
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError(`Camera error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error("Camera failed:", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ padding: '20px', border: '2px solid #ccc' }}>
      <h2>Camera Test Component</h2>
      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '640px', border: '2px solid green' }}
        />
      )}
      <p>If you see video, your browser camera works.</p>
    </div>
  );
}
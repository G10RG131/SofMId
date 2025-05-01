import React, { useEffect, useRef, useState } from 'react';
import { GestureClassifier } from '../services/gesture-classifier';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import { GestureType, Flashcard } from '../types';
import { drawHand } from '../services/handDrawUtils';
import { AnswerDifficulty } from '../types/index';
import { fetchPracticeCards, submitAnswer } from '../services/api';

interface GestureDisplayProps {
  onGestureDetected: (gesture: GestureType) => void;
  active: boolean;
}

const GestureDisplay: React.FC<GestureDisplayProps> = ({ onGestureDetected, active }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const animationFrameRef = useRef<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [gestureProcessed, setGestureProcessed] = useState(false); // New state

  const handleDifficultySelection = async (difficulty: AnswerDifficulty) => {
    if (currentCardIndex >= flashcards.length) return;

    const currentCard = flashcards[currentCardIndex];
    try {
      await submitAnswer(currentCard.front, currentCard.back, difficulty); // Submit the answer with difficulty
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length); // Move to the next card
      setGestureProcessed(false); // Reset gestureProcessed for the next card
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError('Could not save your answer. Please try again.');
    }
  };

  useEffect(() => {
    const loadFlashcards = async () => {
      setError(null);
      try {
        const session = await fetchPracticeCards();
        setFlashcards(session.cards);
      } catch (err) {
        console.error('Failed to fetch flashcards:', err);
        setError('Could not load flashcards. Please try again later.');
      }
    };

    loadFlashcards();
  }, []);

  useEffect(() => {
    let model: handpose.HandPose;

    const init = async () => {
      try {
        setDebugInfo('Initializing TensorFlow.js...');
        await tf.ready();
        model = await handpose.load();
        setDebugInfo('Handpose model loaded.');

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          await new Promise<void>((resolve) => {
            videoRef.current!.onloadedmetadata = () => {
              if (videoRef.current!.videoWidth > 0 && videoRef.current!.videoHeight > 0) {
                resolve();
              }
            };
          });

          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        }

        setLoading(false);
        setDebugInfo('Starting detection...');
        detect();
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize camera and hand detection');
        setDebugInfo('Initialization failed.');
        setLoading(false);
      }
    };

    const detect = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      if (videoRef.current.readyState < 2 || videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        setDebugInfo('Video not ready or dimensions are invalid. Retrying...');
        animationFrameRef.current = requestAnimationFrame(detect);
        return;
      }

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      try {
        const predictions = await model.estimateHands(videoRef.current);
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (predictions.length > 0) {
          drawHand(ctx, predictions[0].landmarks);
          setDebugInfo(`Detected ${predictions.length} hand(s).`);

          if (active && !gestureProcessed) { // Check if gesture has already been processed
            const gesture = new GestureClassifier().classify(predictions);
            if (gesture !== 'none') {
              onGestureDetected(gesture);
              setGestureProcessed(true); // Mark gesture as processed
              if (gesture === 'easy') {
                await handleDifficultySelection(AnswerDifficulty.Easy);
              } else if (gesture === 'medium') {
                await handleDifficultySelection(AnswerDifficulty.Medium);
              } else if (gesture === 'hard') {
                await handleDifficultySelection(AnswerDifficulty.Hard);
              }
            }
          }
        } else {
          setDebugInfo('No hands detected.');
        }
      } catch (err) {
        console.error('Detection error:', err);
        setDebugInfo('Detection error occurred.');
      }

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    init();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, [onGestureDetected, active, gestureProcessed]); // Add gestureProcessed to dependencies

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '300px',
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
          }}
        >
          Loading hand detection...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '20px',
            color: 'red',
            textAlign: 'center',
          }}
        >
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
          transform: 'scaleX(-1)',
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
          display: loading || error ? 'none' : 'block',
        }}
      />

      {debugInfo && (
        <div
          style={{
            position: 'absolute',
            bottom: '5px',
            left: '5px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {debugInfo}
        </div>
      )}
    </div>
  );
};

export default GestureDisplay;
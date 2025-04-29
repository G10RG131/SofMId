import { GestureClassifier } from './gesture-classifier';
import { AnnotatedPrediction } from '@tensorflow-models/handpose';

// 1. Type-safe test data creator
class TestHandCreator {
    static createThumbUp(): AnnotatedPrediction {
        // Create landmarks - explicitly typed as array of [number, number, number]
        const landmarks: Array<[number, number, number]> = [
            // Wrist (landmark 0)
            [160, 120, 0],
            // Thumb (landmarks 1-4)
            [170, 110, 0], [180, 100, 0], [190, 90, 0], [200, 80, 0],
            // Index finger (landmarks 5-8)
            [150, 130, 0], [145, 150, 0], [140, 170, 0], [135, 190, 0],
            // Middle finger (landmarks 9-12)
            [140, 130, 0], [140, 150, 0], [140, 170, 0], [140, 190, 0],
            // Ring finger (landmarks 13-16)
            [150, 130, 0], [155, 150, 0], [160, 170, 0], [165, 190, 0],
            // Pinky (landmarks 17-20)
            [160, 130, 0], [170, 140, 0], [180, 150, 0], [190, 160, 0]
        ];

        // Create annotations in exact format handpose expects
        const annotations: Record<string, Array<[number, number, number]>> = {
            thumb: [
                [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]
            ],
            indexFinger: [
                [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]
            ],
            middleFinger: [
                [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]
            ],
            ringFinger: [
                [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]
            ],
            pinky: [
                [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]
            ],
            palmBase: [
                [0, 0, 0] // Note: wrapped in array to match expected type
            ]
        };

        return {
            landmarks,
            handInViewConfidence: 1,
            boundingBox: {
                topLeft: [0, 0],
                bottomRight: [100, 100]
            },
            annotations
        };
    }
}

// 2. Execute the test
const classifier = new GestureClassifier();
const testHand = TestHandCreator.createThumbUp();

// Should correctly log "easy" for thumb-up gesture
console.log("Test result:", classifier.classify([testHand]));
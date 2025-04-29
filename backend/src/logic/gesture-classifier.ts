import { AnnotatedPrediction } from '@tensorflow-models/handpose';

export type GestureType = 'easy' | 'medium' | 'hard' | 'none';

export class GestureClassifier {
    classify(predictions: AnnotatedPrediction[]): GestureType {
        if (!predictions || predictions.length === 0) return 'none';

        const landmarks = predictions[0].landmarks;
        
        // Get key points
        const thumbTip = landmarks[4];
        const thumbIP = landmarks[3];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        
        // Thumb up detection (👍)
        if (thumbTip[1] < thumbIP[1] && 
            indexTip[1] > landmarks[5][1] && 
            middleTip[1] > landmarks[9][1]) {
            return 'easy';
        }
        
        // Thumb down detection (👎)
        if (thumbTip[1] > thumbIP[1] && 
            thumbTip[1] > landmarks[2][1]) {
            return 'hard';
        }
        
        // Open hand detection (✋)
        const fingersExtended = [8, 12, 16, 20].every(tip => 
            landmarks[tip][1] < landmarks[tip-2][1]
        );
        if (fingersExtended) {
            return 'medium';
        }
        
        return 'none';
    }
}
export type GestureType = 'easy' | 'medium' | 'hard' | 'none';

export class GestureClassifier {
    classify(predictions: any): GestureType {
        if (!predictions || predictions.length === 0) return 'none';

        const landmarks = predictions[0].landmarks;
        
        if (this.isThumbUp(landmarks)) {
            return 'easy';
        }
        
        if (this.isThumbDown(landmarks)) {
            return 'hard';
        }
        
        if (this.isOpenHand(landmarks)) {
            return 'medium';
        }
        
        // Default return if none of the conditions match
        return 'none';
    }

    private isThumbUp(landmarks: any): boolean {
        const thumbTip = landmarks[4];
        const thumbIP = landmarks[3];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        
        return thumbTip[1] < thumbIP[1] && 
               indexTip[1] > landmarks[5][1] && 
               middleTip[1] > landmarks[9][1];
    }

    private isThumbDown(landmarks: any): boolean {
        const thumbTip = landmarks[4];
        const thumbIP = landmarks[3];
        return thumbTip[1] > thumbIP[1];
    }

    private isOpenHand(landmarks: any): boolean {
        const fingerTips = [8, 12, 16, 20]; // index, middle, ring, pinky
        const fingerPIPs = [6, 10, 14, 18]; // corresponding PIP joints
        
        return fingerTips.every((tip, i) => 
            landmarks[tip][1] < landmarks[fingerPIPs[i]][1]
        );
    }
}
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';

export class HandPoseService {
    private model: handpose.HandPose | null = null;
    
    async initialize(): Promise<void> {
        await tf.ready();
        this.model = await handpose.load();
    }
    // ... rest of your code
}
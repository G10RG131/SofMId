import * as handpose from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";

export async function initHandPose(videoEl, onGesture) {
  const detector = await handpose.createDetector(
    handpose.SupportedModels.MediaPipeHands,
    { runtime: "tfjs" }
  );
  async function frame() {
    const hands = await detector.estimateHands(videoEl);
    if (hands.length) {
      const kp = hands[0].keypoints3D;
      if (kp && kp[4].y < kp[3].y) onGesture("easy");
    }
    requestAnimationFrame(frame);
  }
  frame();
}

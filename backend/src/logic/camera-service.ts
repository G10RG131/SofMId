import nodeWebcam from 'node-webcam';
import { promisify } from 'util';

// Type assertion for the module
const webcamModule = nodeWebcam as any;

interface WebcamOptions {
  width: number;
  height: number;
  quality: number;
  delay: number;
  saveShots: boolean;
  output: string;
  device: boolean | string;
  callbackReturn: string;
  verbose: boolean;
}

interface WebcamInstance {
  capture: (file: string, callback: (err: Error | null, data: string) => void) => void;
}

export class CameraService {
  private webcam: WebcamInstance;
  private opts: WebcamOptions = {
    width: 640,
    height: 480,
    quality: 100,
    delay: 0,
    saveShots: false,
    output: 'jpeg',
    device: false,
    callbackReturn: 'base64',
    verbose: false
  };

  constructor() {
    this.webcam = webcamModule.create(this.opts);
  }

  async capture(): Promise<string> {
    const captureAsync = promisify(this.webcam.capture.bind(this.webcam));
    try {
      const data = await captureAsync('temp');
      return data;
    } catch (err) {
      throw new Error(`Failed to capture image: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  // Add this temporary test to your CameraService
async testCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const video = document.createElement('video');
  video.srcObject = stream;
  document.body.appendChild(video);
  video.play();
  return 'Camera working';
}
}

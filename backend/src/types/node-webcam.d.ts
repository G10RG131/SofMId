declare module 'node-webcam' {
    interface WebcamOptions {
      width?: number;
      height?: number;
      quality?: number;
      delay?: number;
      saveShots?: boolean;
      output?: 'jpeg' | 'png' | 'bmp';
      device?: string | false;  // Key fix: changed from boolean to string|false
      callbackReturn?: 'location' | 'buffer' | 'base64';
      verbose?: boolean;
    }
  
    interface WebcamInstance {
      capture: (file: string, callback: (err: Error | null, data: string | Buffer) => void) => void;
    }
  
    function create(options: WebcamOptions): WebcamInstance;
  
    const Webcam: {
      create: typeof create;
    };
  
    export = Webcam;
  }
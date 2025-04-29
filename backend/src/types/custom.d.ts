declare module 'node-webcam' {
    interface Options {
        width?: number;
        height?: number;
        quality?: number;
        delay?: number;
        saveShots?: boolean;
        output?: string;
        device?: string | boolean;
        callbackReturn?: string;
        verbose?: boolean;
    }

    interface Webcam {
        capture: (file: string, callback: (err: Error | null, data: string) => void) => void;
    }

    function create(options: Options): Webcam;
    
    export = { create };
}
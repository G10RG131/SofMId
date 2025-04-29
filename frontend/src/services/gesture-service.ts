// gesture-service.ts
import { io, Manager } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { GestureResult } from '../types/gesture-types';

export class GestureService {
    public socket: Socket;
    
    constructor() {
        try {
            // Initialize the socket connection
            this.socket = io('http://localhost:3001', {
                transports: ['websocket'],
                withCredentials: true,
                reconnectionAttempts: 3,
                reconnectionDelay: 1000,
                timeout: 20000
            });

            this.socket.on('connect', () => {
                console.log('Connected to gesture server');
            });

            this.socket.on('connect_error', (err: Error) => {
                console.error('Connection error:', err.message);
            });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Failed to initialize socket:', errorMessage);
            throw new Error(`Socket initialization failed: ${errorMessage}`);
        }
    }

    onGestureUpdate(callback: (result: GestureResult) => void): void {
        this.socket.on('gesture', callback);
    }

    disconnect(): void {
        if (this.socket?.connected) {
            this.socket.disconnect();
        }
    }

    get isConnected(): boolean {
        return this.socket?.connected ?? false;
    }
}
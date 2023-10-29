import * as WebSocket from 'ws';
import * as http from 'http';  // Import the 'http' module
import { handleMessage } from './commands';

export const handleConnections = (ws: WebSocket, req: http.IncomingMessage): void => {
    console.log('Client connected');

    ws.on('message', (message: string) => {
        handleMessage(ws, message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
};

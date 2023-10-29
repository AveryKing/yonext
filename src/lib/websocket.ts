import * as WebSocket from 'ws';
import * as http from 'http';  // Import the 'http' module
import { handleMessage } from '../commands/util/handleMessage';

export const handleConnections = (ws: WebSocket, req: http.IncomingMessage): void => {
    console.log('Client connected');

    ws.on('message', (message: Buffer) => {
        console.log(message);
        handleMessage(ws, message.toString('utf-8'));
        console.log(message.toString('utf-8'));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
};

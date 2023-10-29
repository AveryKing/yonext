import * as WebSocket from 'ws';
import { handleMakePurchase } from '../makePurchase';
import { handleActivatePlayer } from '../activatePlayer';

export const handleMessage = (ws: WebSocket, message: string): void => {
    try {
        const parsedMessage = JSON.parse(message);
        console.log('Received command:', parsedMessage._cmd);

        switch (parsedMessage._cmd) {
            case 'activatePlayer_YOWO5!':
                handleActivatePlayer(ws, parsedMessage);
                break;
            case 'makePurchase':
                handleMakePurchase(ws, parsedMessage);
                break;
            // Add cases for other commands...
            default:
                console.log('Unknown command:', parsedMessage._cmd);
        }
    } catch (error) {
        console.error('Error decoding JSON:', error);
    }
};

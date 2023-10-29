import * as WebSocket from 'ws';
import { log } from 'util';

// ActivatePlayerCommand represents the structure of the "activatePlayer" command
interface ActivatePlayerCommand {
    playerId: string;
    sn_uid: string;
    ck: number;
    mode: number;
    versionMinor: string;
    referral: string;
    sessionId: string;
    _cmd: string;
}

export const handleActivatePlayerCommand = (ws: WebSocket, properties: any): void => {
    // Type assertion to get the properties as an ActivatePlayerCommand
    const activatePlayerCmd = properties as ActivatePlayerCommand;

    if (!activatePlayerCmd) {
        console.log('Invalid ActivatePlayerCommand format');
        return;
    }

    // Handle the ActivatePlayer command
    console.log(`ActivatePlayerCommand received. PlayerID: ${activatePlayerCmd.playerId}`);
};

export const handleMessage = (ws: WebSocket, message: string): void => {
    try {
        const parsedMessage = JSON.parse(message);
        console.log('Received command:', parsedMessage._cmd);

        switch (parsedMessage._cmd) {
            case 'activatePlayer_YOWO5!':
                handleActivatePlayerCommand(ws, parsedMessage.properties);
                break;
            // Add cases for other commands...
            default:
                console.log('Unknown command:', parsedMessage._cmd);
        }
    } catch (error) {
        console.error('Error decoding JSON:', error);
    }
};

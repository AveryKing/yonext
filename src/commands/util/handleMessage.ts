import * as WebSocket from 'ws';
import { handleMakePurchase } from '../makePurchase';
import { handleActivatePlayer } from '../activatePlayer';
import { getInventory, getPageInventoryByFilter, getTabInventoryByFilter } from '../getInventory';

export const handleMessage = (ws: WebSocket, message: string): void => {
    try {
        const msg = JSON.parse(message);
        console.log('Received command:', msg._cmd);

        switch (msg._cmd) {
            case 'activatePlayer_YOWO5!':
                handleActivatePlayer(ws, msg);
                break;
            case 'makePurchase':
                handleMakePurchase(ws, msg);
                break;
            case 'InventoryManager.getTabInventoryByFilter':
                getTabInventoryByFilter(ws, msg);
                break;
            case 'InventoryManager.getPageInventoryByFilter':
                getPageInventoryByFilter(ws, msg);
                break;
            case 'InventoryManager.getInventory':
                getInventory(ws, msg)
                break;

            // Add cases for other commands...
            default:
                console.log('Unknown command:', msg._cmd);
        }
    } catch (error) {
        console.error('Error decoding JSON:', error);
    }
};

import * as WebSocket from 'ws';
import { handleMakePurchase } from '../makePurchase';
import { handleActivatePlayer } from '../activatePlayer';
import { getInventory, getItemPiidsForDelete, getPageInventoryByFilter, getTabInventoryByFilter } from '../getInventory';
import { getGameItemList } from '../getGameItemList';
import { joinRoom } from '../../services/websocket';
import { sellInventoryItem } from '../sellInventoryItem';

interface MessageHandlerParams {
    socketService: { rooms: Map<string, Set<WebSocket>> };
    ws: WebSocket;
    message: string;
}

function handleMessage({ socketService, ws, message }: MessageHandlerParams): void {
    try {
        const msg = JSON.parse(message);
        console.log('Received command:', msg._cmd);

        switch (msg._cmd) {
            case 'activatePlayer_YOWO5!':
                handleActivatePlayer(ws, msg);
                break;
            case 'joinRoom':
                joinRoom(ws, socketService.rooms, 'your_room_name');
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
                getInventory(ws, msg);
                break;
            case 'InventoryManager.getItemPiidsForDelete':
                getItemPiidsForDelete(ws, msg);
                break;
            case 'ItemManager.getGameItemList':
                getGameItemList(ws, msg);
                break;
            case 'sellInventoryItem':
                sellInventoryItem(ws, msg);
                break;

            // Add cases for other commands...
            default:
                console.log('Unknown command:', msg._cmd);
        }
    } catch (error) {
        console.error('Error decoding JSON:', error);
    }
}

export { handleMessage };

import * as WebSocket from 'ws';
import { handleMessage } from '../commands/util/handleMessage';

interface SocketServiceParams {
    socket: WebSocket;
    rooms: Map<string, Set<WebSocket>>;
}

/**
 * Initialize websocket service
 * @param params: SocketServiceParams
 */
export const socketService = ({ socket, rooms }: SocketServiceParams): void => {
    socket.on('message', (message: Buffer) => {
        console.log(message);
        handleMessage(socket, message.toString('utf-8'));
        console.log(message.toString('utf-8'));
    });

    socket.on('close', () => handleDisconnect());

    const joinRoom = (room: string) => {
        // Create the room if it doesn't exist
        if (!rooms.has(room)) {
            rooms.set(room, new Set());
        }

        // Add the socket to the room
        const roomSet = rooms.get(room);
        roomSet?.add(socket);

        console.log(`Player joined room ${room}`);
    };

    const leaveRoom = (room: string) => {
        // Remove the socket from the room
        const roomSet = rooms.get(room);
        roomSet?.delete(socket);

        console.log(`Player left room ${room}`);
    };

    const broadcastToRoom = (sender: WebSocket, room: string, message: string) => {
        const roomSet = rooms.get(room);

        if (roomSet) {
            roomSet.forEach((player) => {
                if (player !== sender && player.readyState === WebSocket.OPEN) {
                    player.send(message);
                }
            });
        }
    };

    const handleDisconnect = () => {
        // Remove the socket from all rooms
        Object.values(rooms).forEach((roomSet) => {
            roomSet.delete(socket);
        });

        console.log('Player disconnected');
    };
};

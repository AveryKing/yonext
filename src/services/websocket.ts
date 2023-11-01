import * as WebSocket from 'ws';
import { handleMessage } from '../commands/util/handleMessage';

interface SocketServiceParams {
    socket: WebSocket;
    rooms: Map<string, Set<WebSocket>>;
}

function joinRoom(socket: WebSocket, rooms: Map<string, Set<WebSocket>>, room: string) {
    // Create the room if it doesn't exist
    if (!rooms.has(room)) {
        rooms.set(room, new Set());
    }

    // Add the socket to the room
    const roomSet = rooms.get(room);
    roomSet?.add(socket);

    console.log(`Player joined room ${room}`);
}

function leaveRoom(socket: WebSocket, rooms: Map<string, Set<WebSocket>>, room: string) {
    // Remove the socket from the room
    const roomSet = rooms.get(room);
    roomSet?.delete(socket);

    console.log(`Player left room ${room}`);
}

function broadcastToRoom(
    socket: WebSocket,
    rooms: Map<string, Set<WebSocket>>,
    sender: WebSocket,
    room: string,
    message: string
) {
    const roomSet = rooms.get(room);

    if (roomSet) {
        roomSet.forEach((player) => {
            if (player !== sender && player.readyState === WebSocket.OPEN) {
                player.send(message);
            }
        });
    }
}

function getCurrentRoom(socket: WebSocket, rooms: Map<string, Set<WebSocket>>): string | undefined {
    const foundRoomEntry = Array.from(
        rooms.entries()).find(([room, roomSet]) => roomSet.has(socket)
        );
    return foundRoomEntry ? foundRoomEntry[0] : undefined;
}

function handleDisconnect(socket: WebSocket, rooms: Map<string, Set<WebSocket>>) {
    // Remove the socket from all rooms
    rooms.forEach((roomSet) => {
        roomSet.delete(socket);
    });

    console.log('Player disconnected');
}

function createSocketService({ socket, rooms }: SocketServiceParams) {
    joinRoom(socket, rooms, 'default');

    socket.on('message', (message) => handleMessage({ socketService: { rooms }, ws: socket, message: message.toString('utf-8') }));
    socket.on('close', () => handleDisconnect(socket, rooms));
}

export { createSocketService, joinRoom, leaveRoom, broadcastToRoom, getCurrentRoom, handleDisconnect };

import * as https from 'https';
import * as fs from 'fs';
import express from 'express';
import * as WebSocket from 'ws';  // Correct import
import { initDB } from './services/database';
import * as path from 'path';
import cors from 'cors';
import { createSocketService } from './services/websocket';

function handleConnection(socket: WebSocket, rooms: Map<string, Set<WebSocket>>) {
    createSocketService({ socket, rooms });
}

function startServer() {
    const app = express();
    const server = https.createServer({
        cert: fs.readFileSync('keys/server.crt'),
        key: fs.readFileSync('keys/server.key'),
    }, app);

    app.use(cors());
    app.use(express.static(path.join(__dirname, 'public')));

    const rooms = new Map<string, Set<WebSocket>>();
    initDB(); // Initialize the database

    server.listen(process.env.PORT || 8443, () => {
        console.log(`Server started on port ${process.env.PORT || 8443} :)`);
    });

    const wss = new WebSocket.Server({ server });
    wss.on('connection', (socket: WebSocket) => handleConnection(socket, rooms));  // Add type annotation

    // Continue with your WebSocket server setup
}

// Start the server
startServer();

import * as https from 'https';
import * as fs from 'fs';
import express from 'express';
import * as WebSocket from 'ws';
import { socketService } from './services/websocket'; // Updated import
import { initDB } from './services/database';
import * as path from 'path';
import cors from 'cors';

const app = express();
const server = https.createServer({
    cert: fs.readFileSync('keys/server.crt'),
    key: fs.readFileSync('keys/server.key'),
}, app);

// Serve static files from the 'public' folder
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8443;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });
const rooms = new Map<string, Set<WebSocket>>();

initDB(); // Initialize the database

wss.on('connection', (socket: WebSocket) => socketService({ socket, rooms })); 

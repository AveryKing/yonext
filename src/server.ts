import * as https from 'https';
import * as fs from 'fs';
import express from 'express';
import * as WebSocket from 'ws';
import { handleConnections } from './lib/websocket';
import { initDB } from './lib/database';
import * as path from 'path';
import cors from 'cors';

const app = express();
const server = https.createServer({
    cert: fs.readFileSync('keys/server.crt'),
    key: fs.readFileSync('keys/server.key'),
}, app);

const wss = new WebSocket.Server({ server });

initDB(); // Initialize the database

wss.on('connection', handleConnections);

// Serve static files from the 'public' folder
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8443;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

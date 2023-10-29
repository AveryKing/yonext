import * as WebSocket from 'ws';

export const sendError = (ws: WebSocket, message: string): void => {
    const response = {
        _cmd: 'ynError',
        message,
    };
    console.log(JSON.stringify(response));
    ws.send(JSON.stringify(response));
};

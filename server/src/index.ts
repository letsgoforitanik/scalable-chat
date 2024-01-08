import http, { IncomingMessage, ServerResponse } from "http";
import { messageRepository } from "@shared/db";
import SocketService from "./socket-service";

async function fetchMessages(req: IncomingMessage, res: ServerResponse) {
    if (req.method === 'GET' && req.url === '/messages') {
        const messages = await messageRepository.getMessages();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(messages));
    }
}

function main() {
    const httpServer = http.createServer(fetchMessages);
    const socketService = new SocketService();
    socketService.attachServer(httpServer);
    const port = process.env.PORT || 8000;
    httpServer.listen(port, () => console.log(`Http server running at port ${port}`));
}

main();

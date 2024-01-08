import { Server as HttpServer } from "http";
import os from "os";
import { Server, Socket } from "socket.io";
import RedisService from "./redis-service";
import KafkaProducer from "./kafka-service";

export default class SocketService {
    private readonly io: Server;
    private readonly redisService: RedisService;
    private readonly kafkaProducer: KafkaProducer;

    constructor() {
        const cors = { allowedHeaders: ['*'], origin: '*' };
        this.io = new Server({ cors });
        this.io.on('connection', socket => this.onNewSocketConnected(socket));
        this.redisService = new RedisService();
        this.redisService.onReceiveMessage((message) => this.onMessageReceivedFromRedis(message));
        this.kafkaProducer = new KafkaProducer();
        this.kafkaProducer.connect();
    }

    attachServer(httpServer: HttpServer) {
        this.io.attach(httpServer);
        console.log('Socket.IO is successfully attached');
    }

    onNewSocketConnected(socket: Socket) {
        console.log(`New socket is connected to ${os.hostname()}. Socket Id -> ${socket.id}`);
        socket.on('message', ({ user, message }) => this.onMessageReceivedFromSocket(socket, user, message));
    }

    onMessageReceivedFromSocket(socket: Socket, user: string, message: string) {
        console.log('Message received on socket', socket.id);
        console.log('Received message :', message);
        this.redisService.publishMessage(JSON.stringify({ user, message }));
        this.kafkaProducer.sendMessage(user, message);
    }

    onMessageReceivedFromRedis(message: string) {
        this.io.emit('message', JSON.parse(message));
    }
}
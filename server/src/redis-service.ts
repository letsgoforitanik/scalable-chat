import { Redis } from "ioredis";

export default class RedisService {
    private readonly pub: Redis;
    private readonly sub: Redis;

    constructor() {
        const uri = process.env.REDIS_URI!;
        this.pub = new Redis(uri);
        this.sub = new Redis(uri);
        console.log('Successfully connected to redis server');
    }

    publishMessage(message: string) {
        this.pub.publish('message', message);
        console.log('Message published to redis channel [message]');
    }

    onReceiveMessage(listener: (msg: string) => void) {
        this.sub.subscribe('message');
        this.sub.on('message', (_, message) => {
            console.log('Message received from redis channel [message]');
            listener(message);
        });
    }
}
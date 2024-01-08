import fs from "fs";
import { Consumer, Kafka } from "kafkajs";

export default class KafkaConsumer {

    private readonly consumer: Consumer;

    constructor() {

        const projectRoot = process.cwd();

        const client = new Kafka({
            clientId: 'chat-kafka-consumer',
            brokers: [process.env.KAFKA_URI!],
            ssl: {
                rejectUnauthorized: false,
                ca: [fs.readFileSync(`${projectRoot}/certs/kafka-ca.pem`, 'utf-8')],
                key: fs.readFileSync(`${projectRoot}/certs/kafka-service.key`, 'utf-8'),
                cert: fs.readFileSync(`${projectRoot}/certs/kafka-service.cert`, 'utf-8')
            },
        });

        this.consumer = client.consumer({ groupId: 'default' });
    }

    async connect() {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: 'message', fromBeginning: true });
        console.log('Kafka consumer successfully connected to kafka topic [message]');
    }

    async disconnect() {
        await this.consumer.disconnect();
        console.log('Kafka consumer is successfully disconnected');
    }

    onMessageReceived(listener: (msg: any) => void) {
        this.consumer.run({
            eachMessage: async ({ message }) => {
                listener(JSON.parse(message.value?.toString() ?? ''));
            },
        });
    }
}
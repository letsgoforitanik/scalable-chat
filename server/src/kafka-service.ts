import fs from "fs";
import { Kafka, Producer } from "kafkajs";

export default class KafkaProducer {

    private readonly producer: Producer;

    constructor() {

        const projectRoot = process.cwd();

        const client = new Kafka({
            clientId: 'chat-kafka-producer',
            brokers: [process.env.KAFKA_URI!],
            ssl: {
                rejectUnauthorized: false,
                ca: [fs.readFileSync(`${projectRoot}/certs/kafka-ca.pem`, 'utf-8')],
                key: fs.readFileSync(`${projectRoot}/certs/kafka-service.key`, 'utf-8'),
                cert: fs.readFileSync(`${projectRoot}/certs/kafka-service.cert`, 'utf-8')
            },
        });

        this.producer = client.producer();
    }

    async connect() {
        await this.producer.connect();
        console.log('Kafka producer is successfully connected to server');
    }

    async disconnect() {
        await this.producer.disconnect();
        console.log('Kafka producer is successfully disconnected');
    }

    async sendMessage(user: string, message: string) {
        await this.producer.send({
            topic: 'message',
            messages: [{
                value: JSON.stringify({ user, message }),
                partition: user.charCodeAt(0) < 109 ? 0 : 1
            }]
        });

        console.log('Message successfully sent to kafka topic [message]');
    }
}
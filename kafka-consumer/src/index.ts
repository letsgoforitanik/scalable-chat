import KafkaConsumer from "./kafka-consumer";
import { messageRepository } from "@shared/db";


interface ChatMessage {
    user: string;
    message: string;
}

async function main() {

    const kafkaConsumer = new KafkaConsumer();
    await kafkaConsumer.connect();

    async function processMessage({ user, message }: ChatMessage) {
        console.log(`User : ${user} | Message : ${message}`);
        await messageRepository.addMessage(user, message);
    }

    kafkaConsumer.onMessageReceived(processMessage);

}

main();
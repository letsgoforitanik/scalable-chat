import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({ log: ['query', 'info'] });

export async function addMessage(user: string, message: string) {
    return await prismaClient.chatMessage.create({ data: { user, message } });
}

export async function getMessages() {
    return await prismaClient.chatMessage.findMany();
}
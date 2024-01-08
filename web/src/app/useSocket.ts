import React from "react";
import { Socket, io } from "socket.io-client";

type MessageListener = (user: string, message: string) => void

export default function useSocket(listener: MessageListener) {

    const [socket, setSocket] = React.useState<Socket | null>(null);

    function sendMessage(user: string, message: string) {
        socket?.emit("message", { user, message });
    }

    function setupSocket() {
        const socket = io('http://localhost:80', { transports: ['websocket'] });
        socket.on("connect", () => console.log("Socket connected, Id :", socket.id));
        socket.on("message", ({ user, message }) => listener(user, message));
        setSocket(socket);
        return () => socket.disconnect() && undefined;
    }

    React.useEffect(setupSocket, []);

    return { sendMessage };

}
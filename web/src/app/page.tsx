"use client";

import React from "react";
import classes from "./page.module.css";
import useSocket from "./useSocket";

interface Message {
    user: string;
    message: string;
}

export default function Home() {
    const [messages, setMessages] = React.useState<string[]>([]);
    const [message, setMessage] = React.useState<string>("");
    const [user, setUser] = React.useState<string | null>(null);

    const { sendMessage } = useSocket((user, msg) => setMessages((prev) => [...prev, `${user} : ${msg}`]));

    function fetchUser() {
        let user = localStorage.getItem("user");
        while (!user) user = prompt("Enter username");
        localStorage.setItem("user", user);
        setUser(user);
    }

    async function fetchMessages() {
        const response = await fetch("http://localhost:80/messages");
        const messages = await response.json();
        setMessages(messages.map(({ user, message }: Message) => `${user} : ${message}`));
    }

    function init() {
        fetchUser();
        fetchMessages();
    }

    React.useEffect(init, []);

    return (
        <div>
            <div>
                <h1>All Messages</h1>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
            </div>
            <div className={classes["controls"]}>
                <input
                    type="text"
                    placeholder="Message..."
                    onChange={(e) => setMessage(e.target.value)}
                    className={classes["chat-input"]}
                />
                <button type="button" onClick={() => sendMessage(user!, message)} className={classes["button"]}>
                    Send
                </button>
            </div>
        </div>
    );
}

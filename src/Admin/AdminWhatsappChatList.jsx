import React, { useEffect, useState } from "react";
import http from "../api/http";
import "./Styles/AdminWhatsappChats.css";

export default function AdminWhatsappChatList({ onSelect }) {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            const res = await http.get("/api/whatsapp/chats");
            setChats(res.data?.data || []);
        };
        fetchChats();
    }, []);

    return (
        <div className="chat-list">
            {chats.length === 0 ? (
                <div className="chat-empty">No chats yet</div>
            ) : (
                chats.map((chat) => (
                    <div
                        key={chat._id}
                        className="chat-list-item"
                        onClick={() => onSelect(chat._id)}
                    >
                        <div className="chat-phone">{chat._id}</div>
                        <div className="chat-preview">{chat.lastMessage}</div>
                        <div className="chat-time">
                            {new Date(chat.lastTime).toLocaleTimeString()}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

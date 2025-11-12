import React, { useEffect, useState } from "react";
import { CircularProgress, TextField, Paper, Typography } from "@mui/material";
import http from "../api/http";
import "./Styles/AdminWhatsappChats.css";

export default function AdminWhatsappChats() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // ✅ Load messages
    const fetchMessages = async () => {
        try {
            const res = await http.get("/api/whatsapp/messages");
            setMessages(res.data?.data || []);
        } catch (err) {
            console.error("Failed to load WhatsApp messages", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    if (loading) {
        return (
            <div className="chat-loading">
                <CircularProgress sx={{ color: "#fff" }} />
            </div>
        );
    }

    // ✅ Optional search filter
    const filtered = messages.filter(
        (m) =>
            m.body?.toLowerCase().includes(search.toLowerCase()) ||
            m.from?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="whatsapp-admin">
            <div className="chat-header">
                <Typography variant="h6">💬 WhatsApp Chats</Typography>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search messages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ background: "#fff", borderRadius: 1, width: 250 }}
                />
            </div>

            <Paper className="chat-window">
                {filtered.length === 0 ? (
                    <Typography sx={{ textAlign: "center", mt: 4, color: "#888" }}>
                        No messages yet
                    </Typography>
                ) : (
                    filtered.map((msg) => (
                        <div
                            key={msg._id}
                            className={`chat-bubble ${msg.from === "YOUR_BUSINESS_NUMBER" ? "sent" : "received"
                                }`}
                        >
                            <div className="chat-meta">
                                <span className="chat-from">{msg.from}</span>
                                <span className="chat-time">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="chat-body">{msg.body}</div>
                        </div>
                    ))
                )}
            </Paper>
        </div>
    );
}

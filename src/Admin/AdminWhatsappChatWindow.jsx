import React, { useEffect, useState } from "react";
import http from "../api/http";
import { TextField, Button, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export default function AdminWhatsappChatWindow({ phone }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);

    const fetchMessages = async () => {
        try {
            const res = await http.get(`/api/whatsapp/chats/${phone}`);
            setMessages(res.data?.data || []);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [phone]);

    const sendMessage = async () => {
        if (!text.trim()) return;
        try {
            setSending(true);
            await http.post("/api/whatsapp/send", {
                to: phone,
                message: text.trim(),
            });
            setText("");
            setMessages((prev) => [
                ...prev,
                {
                    _id: Date.now().toString(),
                    from: "you",
                    to: phone,
                    body: text.trim(),
                    createdAt: new Date().toISOString(),
                },
            ]);
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    // ✅ Group messages by date
    const groupByDate = (msgs) => {
        const grouped = {};
        msgs.forEach((msg) => {
            const date = dayjs(msg.createdAt).format("YYYY-MM-DD");
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(msg);
        });
        return grouped;
    };

    const groupedMessages = groupByDate(messages);

    const getDateLabel = (dateString) => {
        const date = dayjs(dateString);
        if (date.isToday()) return "Today";
        if (date.isYesterday()) return "Yesterday";
        return date.format("MMM D, YYYY");
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <strong>{phone}</strong>
            </div>

            <div className="chat-body-container">
                {messages.length === 0 ? (
                    <div className="chat-empty">No messages yet</div>
                ) : (
                    Object.keys(groupedMessages).map((dateKey) => (
                        <div key={dateKey}>
                            {/* ✅ Date Divider */}
                            <div className="chat-date-divider">
                                <Typography variant="caption">{getDateLabel(dateKey)}</Typography>
                            </div>

                            {groupedMessages[dateKey].map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`chat-bubble ${msg.from === phone ? "received" : "sent"
                                        }`}
                                >
                                    <div className="chat-text">{msg.body}</div>
                                    <div className="chat-time">
                                        {dayjs(msg.createdAt).format("h:mm A")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            {/* ✅ Send message input */}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <TextField
                    size="small"
                    fullWidth
                    value={text}
                    placeholder="Type a message..."
                    onChange={(e) => setText(e.target.value)}
                    sx={{ background: "#fff", borderRadius: 1 }}
                />
                <Button
                    variant="contained"
                    color="success"
                    onClick={sendMessage}
                    disabled={sending}
                >
                    {sending ? "Sending..." : "Send"}
                </Button>
            </Stack>
        </div>
    );
}

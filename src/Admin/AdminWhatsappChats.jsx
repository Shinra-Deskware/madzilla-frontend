import React, { useState } from "react";
import AdminWhatsappChatList from "./AdminWhatsappChatList";
import AdminWhatsappChatWindow from "./AdminWhatsappChatWindow";
import "./Styles/AdminWhatsappChats.css";

export default function AdminWhatsappChats() {
    const [selectedPhone, setSelectedPhone] = useState(null);

    return (
        <div className="chat-layout">
            <div className="chat-sidebar">
                <AdminWhatsappChatList onSelect={setSelectedPhone} />
            </div>
            <div className="chat-main">
                {selectedPhone ? (
                    <AdminWhatsappChatWindow phone={selectedPhone} />
                ) : (
                    <div className="chat-placeholder">Select a chat to view messages</div>
                )}
            </div>
        </div>
    );
}

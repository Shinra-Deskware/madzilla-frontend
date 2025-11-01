import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";  // 👈 added
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './main.css';
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <UserProvider>   {/* 👈 wrap everything */}
                <App />
            </UserProvider>
        </BrowserRouter>
    </React.StrictMode>
);

import { createContext, useContext, useEffect, useState } from "react";
import http from "../api/http";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ session-based cart sync (no userId in URL)
    const syncLocalCart = async () => {
        try {
            const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
            if (!localCart.length) return;
            await http.post("/api/users/cart/save", { cart: localCart });
            console.log("✅ Cart synced with DB (session)");
        } catch (err) {
            console.error("Cart sync failed:", err);
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await http.get("/api/users/me");
            setUser(data.user || null);
            if (data.user) await syncLocalCart();
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export function useUser() {
    return useContext(UserContext);
}

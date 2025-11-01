import { createContext, useContext, useEffect, useState } from "react";
import http from "../api/http";  // make sure this points to your axios instance

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const syncLocalCart = async (userId) => {
        try {
            const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
            if (!localCart.length) return;

            const res = await http.post(`/api/users/${userId}/cart/save`, { cart: localCart });

            if (res.data?.success) {
                console.log("✅ Cart synced with DB (latest local cart pushed)");
            }
        } catch (err) {
            console.error("Cart sync failed:", err);
        }
    };



    const fetchUser = async () => {
        try {
            const { data } = await http.get("/api/users/me");
            setUser(data.user || null);
            if (data.user?._id) await syncLocalCart(data.user._id);
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

import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AdminDashboard from "../AdminDashboard";

export default function ProtectedAdmin() {
    const { user, loading } = useUser(); // ✅ make sure your context exposes loading

    // While user info still loading → show nothing OR loader
    if (loading) return null;

    // ✅ After load: if no admin, redirect
    if (!user?.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <AdminDashboard />;
}

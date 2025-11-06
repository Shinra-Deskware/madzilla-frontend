import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Home";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import DetailsPage from "./pages/DetailsPage";
import "./Common/commonStyles.css";
import ProtectedAdmin from "./Admin/routes/ProtectedAdmin";
import ReturnRefundPolicyPage from "./Policies/ReturnRefundPolicy";
import PrivacyPolicyPage from "./Policies/PrivacyPolicy";
import ShippingPolicyPage from "./Policies/ShippingPolicy";
import TermsPolicyPage from "./Policies/TermsPolicy";

function DashboardLayout({ isMobile }) {
    return (
        <>
            <Navbar />
            <main className="dashboard-main">
                <Outlet />
            </main>
        </>
    );
}

export default function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Routes>
            <Route path="" element={<Home />} />
            <Route element={<DashboardLayout isMobile={isMobile} />}>
                <Route path="/dashboard/products" element={<ProductsPage />} />
                <Route path="/dashboard/cart" element={<CartPage />} />
                <Route path="/dashboard/orders" element={<OrdersPage />} />
                <Route path="/dashboard/details" element={<DetailsPage />} />
                <Route path="/dashboard/admin/*" element={<ProtectedAdmin />} />
                {/*  */}
                <Route path="/dashboard/returnrefundpolicy" element={<ReturnRefundPolicyPage />} />
                <Route path="/dashboard/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/dashboard/shipping" element={<ShippingPolicyPage />} />
                <Route path="/dashboard/terms" element={<TermsPolicyPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

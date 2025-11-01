import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminProducts from "./AdminProducts";
import "./Styles/AdminDashboard.css";
import AdminComplaints from "./AdminComplaints";

export default function AdminDashboard() {
    const [tab, setTab] = useState(0);

    return (
        <div className="admin-dashboard">
            <div className="admin-tabs">
                <Tabs
                    value={tab}
                    onChange={(e, val) => setTab(val)}
                    textColor="inherit"
                    TabIndicatorProps={{ className: "tab-indicator" }}
                    className="tab-container"
                >
                    <Tab label="Orders" className="tab-item" />
                    <Tab label="Users" className="tab-item" />
                    <Tab label="Products" className="tab-item" />
                    <Tab label="Complaints" className="tab-item" /> {/* ✅ NEW */}
                </Tabs>

            </div>

            <div className="admin-content">
                {tab === 0 && <AdminOrders />}
                {tab === 1 && <AdminUsers />}
                {tab === 2 && <AdminProducts />}
                {tab === 3 && <AdminComplaints />}
            </div>
        </div>
    );
}

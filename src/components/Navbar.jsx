import React, { useEffect, useState } from "react";
import {
    AppBar, Toolbar, Typography, IconButton, Box,
    Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import http from "../api/http";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width:600px)");
    const { user, setUser, loading } = useUser();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const handleNavigate = (path) => {
        setDrawerOpen(false);
        navigate(path);
    };

    // 🔹 Read Cart Count (UserContext or LocalStorage)
    useEffect(() => {
        const readCountFromStorage = () => {
            try {
                const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                return cart.reduce((sum, item) => sum + (item.count || item.qty || 1), 0);
            } catch {
                return 0;
            }
        };

        const updateCartCount = (e) => {
            if (e?.detail && typeof e.detail.count === "number") {
                setCartCount(e.detail.count); // ✅ handle CustomEvent
                return;
            }
            const count = readCountFromStorage(); // ✅ fallback for storage/others
            setCartCount(count);
        };

        // initial read
        setCartCount(readCountFromStorage());

        // listen CustomEvent (same-tab)
        window.addEventListener("cart-updated", updateCartCount);

        // listen storage (cross-tab)
        window.addEventListener("storage", updateCartCount);

        // cleanup
        return () => {
            window.removeEventListener("cart-updated", updateCartCount);
            window.removeEventListener("storage", updateCartCount);
        };
    }, []);
    const handleLogout = async () => {
        try {
            await http.post("/api/auth/logout");
            setUser(null);
            window.location.reload();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    const menuItems = [
        { label: "Products", icon: <StoreMallDirectoryIcon fontSize="small" />, path: "/dashboard/products" },
        {
            label: "Cart",
            icon: (
                <Badge
                    badgeContent={cartCount > 0 ? cartCount : 0}
                    color="error"
                    overlap="circular"
                    sx={{
                        "& .MuiBadge-badge": {
                            fontSize: "10px",
                            height: "15px",
                            minWidth: "15px",
                            top: "-4px",
                            right: "-6px",
                        },
                    }}
                >
                    <ShoppingCartIcon fontSize="small" />
                </Badge>
            ),
            path: "/dashboard/cart",
        },
        { label: "Orders", icon: <ListAltIcon fontSize="small" />, path: "/dashboard/orders" },
        { label: "Profile", icon: <AccountCircleIcon fontSize="small" />, path: "/dashboard/details" },
    ];

    if (user?.isAdmin) {
        menuItems.push({ label: "Admin", icon: <AdminPanelSettingsIcon fontSize="small" />, path: "/dashboard/admin" });
    }

    const getFontSize = () => (window.innerWidth < 600 ? "16px" : "1.6rem");
    const getStudiosFontSize = () => (window.innerWidth < 600 ? "12px" : "0.9rem");

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "none",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0 1rem",
                    }}
                >
                    {/* 🦖 Logo */}
                    <Box
                        sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "baseline",
                            gap: "0.4rem",
                        }}
                        onClick={() =>
                            location.pathname === "/"
                                ? document.getElementById("home-section")?.scrollIntoView({ behavior: "smooth" })
                                : navigate("/")
                        }
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 900,
                                fontSize: getFontSize(),
                                letterSpacing: "0.2rem",
                                fontFamily: "'Oswald', sans-serif",
                                textTransform: "uppercase",
                                color: "#fff",
                            }}
                        >
                            SHINRA
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 300,
                                fontSize: getStudiosFontSize(),
                                letterSpacing: "0.1rem",
                                color: "#ccc",
                                textTransform: "uppercase",
                            }}
                        >
                            DESKWARE
                        </Typography>
                    </Box>

                    {/* 💻 Desktop Menu */}
                    {!isMobile ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "4rem" }}>
                            {menuItems.map((item) => (
                                <Box
                                    key={item.label}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.6rem",
                                        color: location.pathname === item.path ? "#39c443ff" : "#fff",
                                        fontSize: "0.9rem",
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        "&:hover": { color: "#39c443ff" },
                                    }}
                                >
                                    {item.icon}
                                    <span
                                        style={{
                                            display: "inline-block",
                                            transition: "border-color 0.3s ease",
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <IconButton sx={{ color: "#fff" }} onClick={() => setDrawerOpen(true)}>
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>

            {/* 📱 Mobile Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: { backgroundColor: "#000", color: "#fff", width: 250 },
                }}
            >
                <List>
                    {menuItems.map((item) => (
                        <ListItem disablePadding key={item.label}>
                            <ListItemButton onClick={() => handleNavigate(item.path)}>
                                <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {
                        user &&
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleLogout()}>
                                <ListItemIcon>
                                    <LogoutIcon sx={{ color: "#fff" }} />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    }
                </List>
            </Drawer>
        </>
    );
}

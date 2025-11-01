import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Card,
    CardContent,
    Divider,
    Typography,
    Box,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useUser } from "../context/UserContext";
import http from "../api/http";
import OtpPopup from "../Common/OtpPopup";

export default function DetailsPage() {
    const { user, setUser, loading } = useUser();
    const [loginOpen, setLoginOpen] = useState(false);

    const [personalInfo, setPersonalInfo] = useState({
        fullName: "",
        emailId: "",
        phoneNumber: "",
    });

    const [address, setAddress] = useState({
        country: "",
        state: "",
        city: "",
        pinCode: "",
        addr1: "",
    });

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleLogout = async () => {
        try {
            await http.post("/api/auth/logout");
            setUser(null);
            window.location.reload();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    // 🔸 Check login state
    useEffect(() => {
        if (!loading && !user) setLoginOpen(true);
    }, [loading, user]);

    // 🧭 Load user data when logged in
    useEffect(() => {
        if (user) {
            setPersonalInfo({
                fullName: user.fullName || "",
                emailId: user.emailId || "",
                phoneNumber: user.phoneNumber || "",
            });
            setAddress({
                country: user.address?.country || "",
                state: user.address?.state || "",
                city: user.address?.city || "",
                pinCode: user.address?.pinCode || "",
                addr1: user.address?.addr1 || "",
            });
        }
    }, [user]);

    // 🔸 Auto save function
    const saveChanges = async (updates) => {
        try {
            const { data } = await http.patch("/api/users/me", updates);
            setUser(data.user);
        } catch (err) {
            console.error("Failed to save user:", err);
        }
    };

    // Personal info changes
    const handlePersonalChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    };
    const handlePersonalBlur = () => {
        saveChanges({
            fullName: personalInfo.fullName,
            emailId: personalInfo.emailId,
        });
    };

    // Address changes
    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };
    const handleAddressBlur = () => {
        saveChanges({ address });
    };

    if (loading) return null;

    if (!user) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60vh",
                    color: "#fff",
                    textAlign: "center",
                    gap: 2,
                }}
            >
                <OtpPopup open={loginOpen} onClose={() => setLoginOpen(false)} />
                <Typography variant="h6">Please log in to see the details</Typography>
                <Button
                    variant="contained"
                    onClick={() => setLoginOpen(true)}
                    sx={{
                        background:
                            "linear-gradient(135deg, #7A5CF4 0%, #6A39F6 45%, #8E5AF7 100%)",
                    }}
                >
                    Log in
                </Button>
            </Box>
        );
    }


    return (
        <Box
            sx={{
                width: "95%",
                fontFamily: "Inter, sans-serif",
                mt: { xs: 5, sm: 10 },
                color: "#fff",
            }}
        >
            {/* OTP popup (hidden once logged in) */}
            <OtpPopup open={loginOpen} onClose={() => setLoginOpen(false)} />

            {/* Header Section */}
            <Card
                sx={{
                    background: "#141414",
                    color: "#fff",
                    borderRadius: 2,
                    padding: 2,
                    marginBottom: 2,
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <img
                            src="/assets/shinra-logo.png"
                            alt="Profile"
                            loading="lazy"
                            style={{ width: 80, height: 80, borderRadius: "50%" }}
                        />
                        <Box>
                            {isEditingHeader ? (
                                <>
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={personalInfo.fullName}
                                        onChange={(e) =>
                                            setPersonalInfo({ ...personalInfo, fullName: e.target.value })
                                        }
                                        onBlur={() => {
                                            saveChanges({ fullName: personalInfo.fullName });
                                            setIsEditingHeader(false);
                                        }}
                                        sx={{ mb: 1 }}
                                    />
                                    <Typography variant="body2">{address.city}</Typography>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6">{personalInfo.fullName}</Typography>
                                    <Typography variant="body2" sx={{ color: "#aaa" }}>
                                        {address.city}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Box>

                    <Button
                        variant={isEditingHeader ? "contained" : "outlined"}
                        color={isEditingHeader ? "success" : "inherit"}
                        size="small"
                        startIcon={isEditingHeader ? <SaveIcon /> : <EditIcon />}
                        onClick={() => setIsEditingHeader(!isEditingHeader)}
                        sx={{ borderRadius: "20px", textTransform: "none" }}
                    >
                        {isEditingHeader ? "Save" : "Edit"}
                    </Button>
                </Box>
            </Card>

            {/* Personal Information */}
            <Card sx={{ background: "#141414", color: "#fff", mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="subtitle1">Personal Information</Typography>
                        <Button
                            variant={isEditingPersonal ? "contained" : "outlined"}
                            color={isEditingPersonal ? "success" : "inherit"}
                            size="small"
                            startIcon={isEditingPersonal ? <SaveIcon /> : <EditIcon />}
                            onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                            sx={{ borderRadius: "20px", textTransform: "none" }}
                        >
                            {isEditingPersonal ? "Save" : "Edit"}
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 2, background: "#333" }} />

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {["fullName", "emailId", "phoneNumber"].map((key) => (
                            <Box key={key} sx={{ flex: "1 1 45%" }}>
                                <Typography variant="caption" sx={{ color: "#aaa" }}>
                                    {key === "fullName"
                                        ? "Full Name"
                                        : key === "emailId"
                                            ? "Email"
                                            : "Phone Number"}
                                </Typography>
                                {isEditingPersonal && key !== "phoneNumber" ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name={key}
                                        type={key === "emailId" ? "email" : "text"}
                                        value={personalInfo[key]}
                                        onChange={handlePersonalChange}
                                        onBlur={handlePersonalBlur}
                                        sx={{ mt: 0.5 }}
                                    />
                                ) : (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {personalInfo[key]}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>

            {/* Address */}
            <Card sx={{ background: "#141414", color: "#fff" }}>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="subtitle1">Delivery Address</Typography>
                        <Button
                            variant={isEditingAddress ? "contained" : "outlined"}
                            color={isEditingAddress ? "success" : "inherit"}
                            size="small"
                            startIcon={isEditingAddress ? <SaveIcon /> : <EditIcon />}
                            onClick={() => setIsEditingAddress(!isEditingAddress)}
                            sx={{ borderRadius: "20px", textTransform: "none" }}
                        >
                            {isEditingAddress ? "Save" : "Edit"}
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 2, background: "#333" }} />

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        {[
                            { key: "country", label: "Country" },
                            { key: "state", label: "State" },
                            { key: "city", label: "City" },
                            { key: "pinCode", label: "Pin Code" },
                            { key: "addr1", label: "Full Address" },
                        ].map(({ key, label }) => (
                            <Box
                                key={key}
                                sx={{
                                    flex: key === "addr1" ? "1 1 100%" : "1 1 45%",
                                }}
                            >
                                <Typography variant="caption" sx={{ color: "#aaa" }}>
                                    {label}
                                </Typography>
                                {isEditingAddress ? (
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name={key}
                                        multiline={key === "addr1"}
                                        rows={key === "addr1" ? 2 : 1}
                                        value={address[key]}
                                        onChange={handleAddressChange}
                                        onBlur={handleAddressBlur}
                                        sx={{ mt: 0.5 }}
                                    />
                                ) : (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {address[key]}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>
            <Button
                variant="contained"
                color="error"
                sx={{
                    width: fullScreen ? "100%" : "200px",
                    mt: 3,
                    fontWeight: 600,
                }}
                onClick={() => setOpen(true)}
            >
                Logout
            </Button>

            {/* Confirmation Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                PaperProps={{
                    sx: {
                        maxWidth: 350,
                        mx: "auto",
                        borderRadius: 3,
                    },
                }}
            >
                <Box sx={{ p: 2, textAlign: "center" }}>
                    <DialogTitle sx={{ fontSize: 18, mb: 1, textAlign: "center" }}>
                        Are you sure you want to logout?
                    </DialogTitle>
                    <DialogActions
                        sx={{
                            justifyContent: "space-between",
                            gap: 2,
                            pb: 2,
                        }}
                    >
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleLogout} color="error">
                            Logout
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
}

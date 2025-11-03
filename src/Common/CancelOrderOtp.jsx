import React, { useEffect, useRef, useState } from "react";
import {
    Box, Button, Dialog, DialogContent, IconButton, SwipeableDrawer,
    TextField, Typography, useMediaQuery
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { motion, AnimatePresence } from "framer-motion";
import { sendOtp, verifyOtp } from "../api/auth";

const paperCommonSx = {
    borderRadius: { xs: "20px 20px 0 0", md: 3 },
    boxShadow: 24,
    overflow: "hidden",
    bgcolor: "#000",
    color: "#fff",
};
const gradientBg = {
    background: "linear-gradient(135deg, #FF5252 0%, #FF1744 45%, #E53935 100%)",
};

const StepContainer = ({ children }) => (
    <Box sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        p: { xs: 3, md: 4 },
        minHeight: { xs: "50vh", md: 420 },
        bgcolor: "#000",
        color: "#fff",
        justifyContent: 'center'
    }}>
        {children}
    </Box>
);

const HeaderIcon = ({ children }) => (
    <Box sx={{
        width: 72, height: 72, borderRadius: 3,
        display: "grid", placeItems: "center",
        ...gradientBg,
        color: "#fff",
        boxShadow: "0 10px 30px rgba(255, 82, 82, .35)",
        mt: { xs: 1, md: 0 },
    }}>
        {children}
    </Box>
);

const MotionBox = motion(Box);

function OtpBoxes({ value, onChange, disabled, OTP_LEN }) {
    const inputsRef = useRef([]);
    const handleChange = (index, v) => {
        const clean = v.replace(/\D/g, "").slice(0, 1);
        const next = value.split("");
        next[index] = clean;
        onChange(next.join(""));
        if (clean && index < OTP_LEN - 1) inputsRef.current[index + 1]?.focus();
    };
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !value[index] && index > 0)
            inputsRef.current[index - 1]?.focus();
        if (e.key === "ArrowLeft" && index > 0)
            inputsRef.current[index - 1]?.focus();
        if (e.key === "ArrowRight" && index < OTP_LEN - 1)
            inputsRef.current[index + 1]?.focus();
    };
    return (
        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", mt: 2 }}>
            {Array.from({ length: OTP_LEN }).map((_, i) => (
                <TextField
                    key={i}
                    inputRef={(el) => (inputsRef.current[i] = el)}
                    value={value[i] || ""}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    inputProps={{
                        maxLength: 1, inputMode: "numeric",
                        style: { textAlign: "center", fontSize: "1.2rem", width: "1.2rem", color: "#fff" },
                    }}
                    sx={{
                        input: { color: "#fff" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#555" },
                            "&:hover fieldset": { borderColor: "#888" },
                            "&.Mui-focused fieldset": { borderColor: "#fff" },
                        },
                    }}
                    disabled={disabled}
                />
            ))}
        </Box>
    );
}

export default function CancelOrderOtp({ open, onClose, userEmail, onVerified }) {
    const isMobile = useMediaQuery("(max-width:768px)");
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [requestId, setRequestId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [resendIn, setResendIn] = useState(0);
    const [emailInput, setEmailInput] = useState("");

    useEffect(() => {
        if (!open) {
            // reset when popup closes
            setEmailInput("");
            setStep(1);
            setOtp("");
            setRequestId(null);
            setErrorMsg("");
            setResendIn(0);
        } else {
            // auto-fill when popup opens
            if (userEmail) {
                setEmailInput(userEmail);
            }
        }
    }, [open, userEmail]);


    const OTP_LEN = 6;
    const RESEND_SECONDS = 30;

    const handleSendOtp = async (email) => {
        setLoading(true); setErrorMsg("");
        if (userEmail === email) {
            try {
                const { data } = await sendOtp({ identifier: email, purpose: "cancel_order" });
                setRequestId(data.requestId);
                setStep(2);
                setResendIn(RESEND_SECONDS);
                const t = setInterval(() => {
                    setResendIn((s) => {
                        if (s <= 1) { clearInterval(t); return 0; }
                        return s - 1;
                    });
                }, 1000);
            } catch (e) {
                console.error("Failed to send OTP:", e);
                setErrorMsg("Failed to send OTP. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            setErrorMsg("Please enter registered email");
        }
    };

    const handleVerify = async () => {
        if (!otp || otp.length !== OTP_LEN) return;
        setLoading(true); setErrorMsg("");
        try {
            await verifyOtp({ requestId, otp, purpose: "cancel_order" });
            setStep(3);
            setTimeout(() => {
                onVerified?.(); // ✅ triggers cancel
                onClose();
            }, 1000);
        } catch (e) {
            console.error("OTP verify failed:", e);
            setErrorMsg("Invalid or expired OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendIn > 0 || !userEmail) return;
        await handleSendOtp(userEmail);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <MotionBox>
                        <StepContainer>
                            <HeaderIcon><LockRoundedIcon fontSize="large" /></HeaderIcon>
                            <Typography variant="h6" fontWeight={600} sx={{ my: 2 }}>
                                Cancel Order Confirmation
                            </Typography>
                            <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
                                Enter your email to receive OTP
                            </Typography>

                            <TextField
                                fullWidth
                                placeholder="Enter email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value.trim())}
                                sx={{
                                    input: { color: "#fff" },
                                    "& .MuiOutlinedInput-root fieldset": { borderColor: "#666" },
                                    mb: 2,
                                }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, ...gradientBg }}
                                onClick={() => handleSendOtp(emailInput)}
                                disabled={!emailInput.includes("@") || loading}
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </Button>
                            {errorMsg && (
                                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                    {errorMsg}
                                </Typography>
                            )}
                        </StepContainer>
                    </MotionBox>
                );
            case 2:
                return (
                    <MotionBox>
                        <StepContainer>
                            <HeaderIcon><MarkEmailUnreadRoundedIcon fontSize="large" /></HeaderIcon>
                            <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
                                Enter OTP to Cancel Order
                            </Typography>
                            <Typography variant="body2" color="grey.400">
                                OTP sent to {userEmail}
                            </Typography>
                            <OtpBoxes
                                value={otp}
                                onChange={(v) => {
                                    const clean = v.replace(/\D/g, "").slice(0, OTP_LEN);
                                    setOtp(clean);
                                    if (clean.length === OTP_LEN) handleVerify();
                                }}
                                OTP_LEN={OTP_LEN}
                            />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {resendIn > 0
                                    ? `Resend in ${resendIn}s`
                                    : <span style={{ color: "#FF5252", cursor: "pointer" }} onClick={handleResendOtp}>Resend OTP</span>}
                            </Typography>
                            {errorMsg && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errorMsg}</Typography>}
                            <Button fullWidth variant="contained" sx={{ mt: 3, ...gradientBg }} onClick={handleVerify} disabled={loading}>
                                {loading ? "Verifying..." : "Confirm Cancel"}
                            </Button>
                        </StepContainer>
                    </MotionBox>
                );
            case 3:
                return (
                    <MotionBox>
                        <StepContainer>
                            <HeaderIcon><CancelRoundedIcon fontSize="large" /></HeaderIcon>
                            <Typography variant="h6" fontWeight={600}>Order Cancelled</Typography>
                            <Typography variant="body2" color="grey.400">
                                Your order has been successfully cancelled
                            </Typography>
                            <Button fullWidth variant="contained" sx={{ mt: 3, ...gradientBg }} onClick={onClose}>
                                Done
                            </Button>
                        </StepContainer>
                    </MotionBox>
                );
            default:
                return null;
        }
    };

    return (
        <>{isMobile ? (
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                PaperProps={{
                    sx: {
                        ...paperCommonSx,
                        width: "90%",
                        left: "5%",
                        minHeight: "40vh",
                        maxHeight: "70vh",
                        position: "relative",
                    },
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 10,
                        color: "#fff",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                    }}
                >
                    <CloseRoundedIcon />
                </IconButton>

                <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            </SwipeableDrawer>
        ) : (
            <Dialog
                open={open}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: "#000",
                        borderRadius: 3,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0px 10px 30px rgba(0,0,0,0.6)",
                    },
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 10,
                        color: "#fff",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                    }}
                >
                    <CloseRoundedIcon />
                </IconButton>

                <DialogContent sx={{ p: 0, position: "relative" }}>
                    <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
                </DialogContent>
            </Dialog>
        )}

        </>
    );
}

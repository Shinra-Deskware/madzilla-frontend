import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    SwipeableDrawer,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";
import { motion, AnimatePresence } from "framer-motion";
import { sendOtp, verifyOtp } from "../api/auth";
import { useUser } from "../context/UserContext";

const paperCommonSx = {
    borderRadius: { xs: "20px 20px 0 0", md: 3 },
    boxShadow: 24,
    overflow: "hidden",
    bgcolor: "#000",
    color: "#fff",
};

const gradientBg = {
    background: "linear-gradient(135deg, #7A5CF4 0%, #6A39F6 45%, #8E5AF7 100%)",
};

const MotionBox = motion(Box);

function StepContainer({ children }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: { xs: 3, md: 4 },
                minHeight: { xs: "50vh", md: 420 },
                bgcolor: "#000",
                color: "#fff",
            }}
        >
            {children}
        </Box>
    );
}

function HeaderIcon({ children }) {
    return (
        <Box
            sx={{
                width: 72,
                height: 72,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                ...gradientBg,
                color: "#fff",
                boxShadow: "0 10px 30px rgba(123,90,246,.35)",
                mt: { xs: 1, md: 0 },
            }}
        >
            {children}
        </Box>
    );
}

function OtpBoxes({ value, onChange, disabled, OTP_LEN }) {
    const inputsRef = useRef([]);
    const handleChange = (i, v) => {
        const clean = v.replace(/\D/g, "").slice(0, 1);
        const arr = value.split("");
        arr[i] = clean;
        onChange(arr.join(""));
        if (clean && i < OTP_LEN - 1) inputsRef.current[i + 1]?.focus();
    };
    return (
        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", mt: 2 }}>
            {Array.from({ length: OTP_LEN }).map((_, i) => (
                <TextField
                    key={i}
                    inputRef={(el) => (inputsRef.current[i] = el)}
                    value={value[i] || ""}
                    onChange={(e) => handleChange(i, e.target.value)}
                    inputProps={{
                        maxLength: 1,
                        inputMode: "numeric",
                        style: {
                            textAlign: "center",
                            fontSize: "1.2rem",
                            width: "1.4rem",
                            color: "#fff",
                        },
                    }}
                    sx={{
                        input: { color: "#fff" },
                        "& .MuiOutlinedInput-root fieldset": { borderColor: "#555" },
                    }}
                    disabled={disabled}
                />
            ))}
        </Box>
    );
}

export default function OtpPopup({ open, onClose, onVerified }) {
    const isMobile = useMediaQuery("(max-width:768px)");
    const { fetchUser } = useUser();

    const [step, setStep] = useState(1);
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [requestId, setRequestId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [resendIn, setResendIn] = useState(0);

    const OTP_LEN = 6;
    const RESEND_SECONDS = 30;

    const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_RX = /^[6-9]\d{9}$/;

    const detectMode = (v) => (EMAIL_RX.test(v) ? "email" : PHONE_RX.test(v) ? "phone" : null);

    const handleReset = () => {
        setStep(1);
        setIdentifier("");
        setOtp("");
        setRequestId(null);
        setErrorMsg("");
        setResendIn(0);
        onClose();
    };

    useEffect(() => {
        if (!open) handleReset();
    }, [open]);

    const handleGetOtp = async () => {
        const mode = detectMode(identifier.trim());
        if (!mode) {
            setErrorMsg("Enter valid email or 10-digit mobile number.");
            return;
        }
        setLoading(true);
        setErrorMsg("");
        try {
            const { data } = await sendOtp({ identifier: identifier.trim(), purpose: "login" });
            setRequestId(data.requestId);
            setStep(2);
            setResendIn(RESEND_SECONDS);
            const t = setInterval(() => {
                setResendIn((s) => {
                    if (s <= 1) {
                        clearInterval(t);
                        return 0;
                    }
                    return s - 1;
                });
            }, 1000);
        } catch {
            setErrorMsg("Failed to send OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (otp.length !== OTP_LEN) return;
        setLoading(true);
        setErrorMsg("");
        try {
            await verifyOtp({ requestId, otp, purpose: "login" });
            await fetchUser();
            setStep(3);
            setTimeout(() => {
                onVerified?.();
                onClose();
            }, 1000);
        } catch {
            setErrorMsg("Invalid or expired OTP.");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <StepContainer>
                        <HeaderIcon>
                            <LockRoundedIcon fontSize="large" />
                        </HeaderIcon>
                        <Typography variant="h6" sx={{ my: 2 }}>
                            OTP Verification
                        </Typography>
                        <Typography variant="body2" color="grey.400">
                            Enter your email or phone number
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter Email or Mobile Number"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            error={!!errorMsg}
                            helperText={errorMsg}
                            sx={{
                                mt: 2,
                                input: { color: "#fff" },
                                "& .MuiOutlinedInput-root fieldset": { borderColor: "#555" },
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, ...gradientBg }}
                            onClick={handleGetOtp}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Get OTP"}
                        </Button>
                    </StepContainer>
                );
            case 2:
                return (
                    <StepContainer>
                        <HeaderIcon>
                            <MarkEmailUnreadRoundedIcon fontSize="large" />
                        </HeaderIcon>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Enter OTP
                        </Typography>
                        <Typography variant="body2" color="grey.400">
                            Sent to {identifier}
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
                                : (
                                    <span
                                        style={{ color: "#7A5CF4", cursor: "pointer" }}
                                        onClick={handleGetOtp}
                                    >
                                        Resend OTP
                                    </span>
                                )}
                        </Typography>
                        {errorMsg && (
                            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                {errorMsg}
                            </Typography>
                        )}
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, ...gradientBg }}
                            onClick={handleVerify}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </Button>
                    </StepContainer>
                );
            case 3:
                return (
                    <StepContainer>
                        <HeaderIcon>
                            <CheckCircleRoundedIcon fontSize="large" />
                        </HeaderIcon>
                        <Typography variant="h6">Verified</Typography>
                        <Typography variant="body2" color="grey.400">
                            You have been verified successfully
                        </Typography>
                        <Button fullWidth variant="contained" sx={{ mt: 3, ...gradientBg }} onClick={handleReset}>
                            Done
                        </Button>
                    </StepContainer>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {isMobile ? (
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}
                    onOpen={() => { }}
                    PaperProps={{
                        sx: {
                            ...paperCommonSx,
                            width: "90%",
                            left: "5%",
                            minHeight: "40vh",
                            maxHeight: "70vh",
                        },
                    }}
                >
                    <IconButton
                        onClick={onClose}
                        sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }}
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
                            boxShadow: "0px 10px 30px rgba(0,0,0,0.6)",
                        },
                    }}
                >
                    <DialogContent sx={{ p: 0, position: "relative" }}>
                        <IconButton
                            onClick={onClose}
                            sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }}
                        >
                            <CloseRoundedIcon />
                        </IconButton>
                        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

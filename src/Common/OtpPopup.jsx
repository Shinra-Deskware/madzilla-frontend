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

const StepContainer = ({ children }) => (
    <Box
        sx={{
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
        }}
    >
        {children}
    </Box>
);

const HeaderIcon = ({ children }) => (
    <Box
        sx={{
            width: 72,
            height: 72,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            ...gradientBg,
            color: "#fff",
            boxShadow: "0 10px 30px rgba(123, 90, 246, .35)",
            mt: { xs: 1, md: 0 },
        }}
    >
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
                        maxLength: 1,
                        inputMode: "numeric",
                        autoComplete: "one-time-code",
                        style: {
                            textAlign: "center",
                            fontSize: "1.2rem",
                            width: window.innerWidth < 600 ? "0.6rem" : "1.2rem",
                            height: window.innerWidth < 600 ? "1rem" : "1rem",
                            color: "#fff",
                        },
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

export default function OtpPopup({ open, onClose, onVerified }) {
    const isMobile = useMediaQuery("(max-width:768px)");
    const [step, setStep] = useState(1);
    const [mobile, setMobile] = useState("");
    const [mobileOtp, setMobileOtp] = useState("");
    const { fetchUser } = useUser();

    const [showInputError, setShowInputError] = useState(false);
    const [requestId, setRequestId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [resendIn, setResendIn] = useState(0);

    const OTP_LEN = 6;
    const RESEND_SECONDS = 30;

    const handleResendOtp = async () => {
        if (resendIn > 0) return;
        await handleGetOtp();
    };

    useEffect(() => {
        if (!open) {
            handleReset();
        }
    }, [open])

    const handleGetOtp = async () => {
        const msisdn = mobile.trim();
        if (!msisdn) {
            setShowInputError(true);
            return;
        }
        setLoading(true);
        setErrorMsg("");
        try {
            const { data } = await sendOtp({ identifier: mobile.trim() });
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
        } catch (e) {
            setErrorMsg("Failed to send OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!mobileOtp || mobileOtp.length !== OTP_LEN) return;
        setLoading(true);
        setErrorMsg("");
        try {
            await verifyOtp({ requestId, otp: mobileOtp });
            await fetchUser();             // 👈 instantly refresh user context
            setStep(3);
            setTimeout(() => {
                onVerified?.(); // callback to place order 
                onClose();
            }, 1000); // close popup after success
        } catch (e) {
            setErrorMsg("Invalid or expired OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStep(1);
        setMobile("");
        setMobileOtp("");
        setShowInputError(false);
        setErrorMsg("");
        setResendIn(0);
        onClose();
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <MotionBox>
                        <StepContainer>
                            <HeaderIcon>
                                <LockRoundedIcon fontSize="large" />
                            </HeaderIcon>
                            <Typography variant="h6" fontWeight={600} sx={{ my: 2 }}>
                                OTP Verification
                            </Typography>
                            <Typography variant="body2" color="grey.400">
                                We’ll send you a one-time password on WhatsApp
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter Mobile Number (+91...)"
                                value={mobile}
                                type="tel"
                                onChange={(e) => setMobile(e.target.value)}
                                error={showInputError && !mobile.trim()}
                                helperText={
                                    showInputError && !mobile.trim() ? "Enter your mobile" : ""
                                }
                                sx={{
                                    mt: 2,
                                    input: { color: "#fff" },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "#555" },
                                    },
                                }}
                            />
                            {errorMsg && (
                                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                    {errorMsg}
                                </Typography>
                            )}
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, ...gradientBg }}
                                onClick={handleGetOtp}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Get OTP on WhatsApp"}
                            </Button>
                        </StepContainer>
                    </MotionBox>
                );

            case 2:
                return (
                    <MotionBox>
                        <StepContainer>
                            <HeaderIcon>
                                <MarkEmailUnreadRoundedIcon fontSize="large" />
                            </HeaderIcon>
                            <Typography variant="h6" fontWeight={600} sx={{ mt: 2 }}>
                                Enter OTP
                            </Typography>
                            <Typography variant="body2" color="grey.400">
                                Sent to WhatsApp {mobile}
                            </Typography>
                            <OtpBoxes
                                value={mobileOtp}
                                onChange={(v) => {
                                    const clean = v.replace(/\D/g, "").slice(0, OTP_LEN);
                                    setMobileOtp(clean);
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
                                            onClick={handleResendOtp}
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
                    </MotionBox>
                );

            case 3:
                return (
                    <MotionBox>
                        <StepContainer>
                            <HeaderIcon>
                                <CheckCircleRoundedIcon fontSize="large" />
                            </HeaderIcon>
                            <Typography variant="h6" fontWeight={600}>
                                Verified
                            </Typography>
                            <Typography variant="body2" color="grey.400">
                                Your number has been verified successfully
                            </Typography>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, ...gradientBg }}
                                onClick={handleReset}
                            >
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
                            transform: "translateX(-50%)",
                            minHeight: "40vh",
                            maxHeight: "70vh",
                        },
                    }}
                >
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            color: "#fff",
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
                            boxShadow: "0px 10px 30px rgba(0,0,0,0.6)",
                        },
                    }}
                >
                    <DialogContent sx={{ p: 0, position: "relative" }}>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 1,
                                color: "#fff",
                            }}
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

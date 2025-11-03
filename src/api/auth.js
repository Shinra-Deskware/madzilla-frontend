import http from "./http";

// Accepts either emailId or phoneNumber and purpose
export const sendOtp = ({ identifier, purpose }) =>
    http.post("/api/otp/send", { identifier, purpose });

export const verifyOtp = ({ requestId, otp, purpose }) =>
    http.post("/api/otp/verify", { requestId, otp, purpose });

export const getCurrentUser = () =>
    http.get("/api/users/me");

import http from "./http";

export const sendOtp = ({ identifier }) =>
    http.post("/api/otp/send", { identifier });

export const verifyOtp = ({ requestId, otp }) =>
    http.post("/api/otp/verify", { requestId, otp });
export const getCurrentUser = () => http.get("/api/users/me");
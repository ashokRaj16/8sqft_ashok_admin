import { useState } from "react";
import axios from "..";
import { useAuthStore } from "@/Store/jwtTokenStore";

const useEmailOtp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [otpSentEmail, setOtpSentEmail] = useState(false); // ✅ Add OTP sent state
    // Send OTP to Email
    const token = useAuthStore((state) => state.token);
    const sendOtpMail = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                "/api/v1/front/profile/send_otp_email",
                { email }, // Request Body
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "A8SQFT7767",
                        Authorization: `Bearer ${token}`, // ✅ Use token from store
                    },
                }
            );
    
            if (response?.data?.status) {
                setOtpSentEmail(true); // ✅ Mark OTP as sent
            }
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to send OTP.");
            setOtpSentEmail(false); // ❌ Reset if failed
            return null;
        } finally {
            setLoading(false);
        }
    };
    return { sendOtpMail, loading, error,otpSentEmail  };
};

    // Verify Email OTP
    const useVerifyOtpMail = () => {
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const token = useAuthStore((state) => state.token);
        const verifyOtpMail = async (email: string, otp: number) => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.post(
                    "/api/v1/front/profile/verify_mail",
                    { email, otp }, // ✅ Proper body structure
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": "A8SQFT7767",
                            Authorization: `Bearer ${token}`, // ✅ Fetch token from store
                        },
                    }
                );
                return response.data;
            } catch (err) {
                // setError(err.response?.data?.message || "Verification failed");
            } finally {
                setLoading(false);
            }
        };
    
        return { verifyOtpMail, loading, error };
    };
    
    export { useEmailOtp, useVerifyOtpMail };

import { useState } from "react";
import axios from "..";
import { useAuthStore } from "@/Store/jwtTokenStore";

const useSendOtpWhatsapp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = useAuthStore((state) => state.token);

    const sendOtp = async (mobileNumber: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                "/api/v1/front/profile/send_otp_mobile",
                { mobile: mobileNumber },  // Body content
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "A8SQFT7767",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
                        return response.data;
        } catch (err) {
            // setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return { sendOtp, loading, error };
};


const useVerifyOtpWhatsapp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = useAuthStore((state) => state.token);

    const verifyOtp = async (mobile: number, otp: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                "/api/v1/front/profile/verify_wa",
                { mobile, otp
                    
                 },  // Body content
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "A8SQFT7767",
                        Authorization: `Bearer ${token}`,
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

    return { verifyOtp, loading, error };
};

export { useSendOtpWhatsapp, useVerifyOtpWhatsapp };
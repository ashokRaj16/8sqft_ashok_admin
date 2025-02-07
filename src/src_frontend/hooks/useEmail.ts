import { useMutation } from "@tanstack/react-query";
import axios from "."; // Ensure this path matches your project structure

// Define data types
interface PropertyAgreementData {
    email: string;

}

interface useEmailResponse {
    message?: string;
    // Additional properties if required
}

interface useEmailError {
    message?: string;
    // Additional properties if required
}

interface UseuseEmailOptions {
    onSuccess?: (data: useEmailResponse) => void;
    onError?: (error: useEmailError) => void;
}

const useEmailDetail = ({ onSuccess, onError }: UseuseEmailOptions) => {
    const mutationFn = async (data: PropertyAgreementData) => {
        const response = await axios.post('/api/v1/auth/send-otp-email', data, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        return response.data;

    };

    return useMutation<useEmailResponse, useEmailError, PropertyAgreementData>({
        mutationFn,
        onSuccess,
        onError: (error) => {
            if (onError) {
                onError(error as useEmailError);
            }
        },
    });
};

export default useEmailDetail;
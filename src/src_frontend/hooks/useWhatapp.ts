import { useMutation } from "@tanstack/react-query";
import axios from "."; // Ensure this path matches your project structure

// Define data types
interface useWhatappData {
    mobile: Number;

}

interface useWhatappResponse {
    message?: string;
    // Additional properties if required
}

interface useWhatappError {
    message?: string;
    // Additional properties if required
}

interface UseuseWhatappOptions {
    onSuccess?: (data: useWhatappResponse) => void;
    onError?: (error: useWhatappError) => void;
}

const useWhatappDetail = ({ onSuccess, onError }: UseuseWhatappOptions) => {
    const mutationFn = async (data: useWhatappData) => {
        const response = await axios.post('/api/v1/auth/send-otp-wa', data, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        return response.data;

    };

    return useMutation<useWhatappResponse, useWhatappError, useWhatappData>({
        mutationFn,
        onSuccess,
        onError: (error) => {
            if (onError) {
                onError(error as useWhatappError);
            }
        },
    });
};

export default useWhatappDetail;
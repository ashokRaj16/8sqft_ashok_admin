import { useMutation } from "@tanstack/react-query";
import axios from ".."; // Ensure this path matches your project structure
import { useAuthStore } from "@/Store/jwtTokenStore";
import usePropertyIdStore from "@/Store/propertyid";

// Define data types
interface postpropertyformData {
    step_id: string,
    property_type: string,
    property_rent_buy: string,
    user_type: string
}

interface postpropertyformResponse {
    message?: string;
    id?: number;
}

interface postpropertyformError {
    message?: string;
}

interface postpropertyformOptions {
    onSuccess?: (data: postpropertyformResponse) => void;
    onError?: (error: postpropertyformError) => void;
}

const usePostPropertyform = ({ onSuccess, onError }: postpropertyformOptions) => {
    const { setId } = usePropertyIdStore();
    const token = useAuthStore((state) => state.token);
    const mutationFn = async (data: postpropertyformData) => {
        const response = await axios.post('/api/v1/front/post_property', data ,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        setId(response.data.data.id);
        return response.data;
    };

    return useMutation<postpropertyformResponse, postpropertyformError, postpropertyformData>({
        mutationFn,
        onSuccess,
        onError: (error) => {
            if (onError) {
                onError(error as postpropertyformError);
            }
        },
    });
};

export default usePostPropertyform;

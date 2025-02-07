import { useAuthStore } from "@/Store/jwtTokenStore";
import usePropertyIdStore from "@/Store/propertyid";
import { useMutation } from "@tanstack/react-query";
import axios from "..";





// Define data types
interface useBuilderformData {
    step_id: string,
    property_rent_buy: string,
    user_type: string,
    company_name: string,
}

interface useBuilderformResponse {
    message?: string;
    id?: number;
}

interface useBuilderformError {
    message?: string;
}

interface useBuilderformOptions {
    onSuccess?: (data: useBuilderformResponse) => void;
    onError?: (error: useBuilderformError) => void;
}

const useBuilderform = ({ onSuccess, onError }: useBuilderformOptions) => {
    const { setId } = usePropertyIdStore();
    const token = useAuthStore((state) => state.token);
    const mutationFn = async (data: useBuilderformData) => {
        const response = await axios.post('/api/v1/front/post_property/builder', data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        setId(response.data.data.id);
        return response.data;
    };

    return useMutation<useBuilderformResponse, useBuilderformError, useBuilderformData>({
        mutationFn,
        onSuccess,
        onError: (error) => {
            if (onError) {
                onError(error as useBuilderformError);
            }
        },
    });
};

export default useBuilderform;

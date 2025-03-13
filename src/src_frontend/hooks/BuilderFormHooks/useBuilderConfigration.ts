import { useMutation } from "@tanstack/react-query";
import axios from ".."; // Ensure this path matches your project structure
import usePropertyIdStore from "@/Store/propertyid";
import { useAuthStore } from "@/Store/jwtTokenStore";

// Define data types
interface BuilderData {
    property_id: string;
    carpet_area: string;
    unit_name?:string;
    unit_price_type?:string;
    length: string;
    width: string;
    width_unit: string;
    length_unit: string;
    carpet_price: string;
    images: File;
}

interface Configuration {
    id: string;
    property_id: string;
    carpet_area: string;
    unit_name?:string;
    unit_price_type?:string;
    length: string;
    width: string;
    width_unit: string;
    length_unit: string;
    carpet_price: string;
    imageUrl: string;
}
interface Data{
   data: Configuration[];
}
interface useBuilderResponse {
    message?: string;
    data:Data // Changed to Configuration[] instead of Data[]
}

interface useBuilderError {
    message?: string;
    // Additional properties if required
}

interface UseuseBuilderOptions {
    onSuccess?: (data: useBuilderResponse) => void;
    onError?: (error: useBuilderError) => void;
}

const useBuilderConfigration = ({ onSuccess, onError }: UseuseBuilderOptions) => {
    const token = useAuthStore((state) => state.token);
    // const { id } = usePropertyIdStore();
    const mutationFn = async (data: BuilderData) => {
        // Create FormData and append the property_Builder
        const formData = new FormData();
        formData.append("property_id", data.property_id);
        formData.append("carpet_area", data.carpet_area);
        if (data.unit_name) {
            formData.append("unit_name", data.unit_name);
        }
        if (data.unit_price_type) {
            formData.append("unit_price_type", data.unit_price_type);
        }
        formData.append("length", data.length);
        formData.append("width", data.width);
        formData.append("width_unit", data.width_unit);
        formData.append("length_unit", data.length_unit);
        formData.append("carpet_price", data.carpet_price);
        if (data.images) {
            formData.append("images", data.images);
        }
        formData.forEach((item) => (console.log(item, 'sfdfdsfs')))

        const response = await axios.post("/api/v1/front/post_property/configuration", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Ensure Content-Type is multipart/form-data
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // returning data of type useBuilderResponse
    };

    return useMutation<useBuilderResponse, useBuilderError, BuilderData>({
        mutationFn,
        onSuccess,
        onError: (error) => {
            if (onError) {
                onError(error as useBuilderError);
            }
        },
    });
};

export default useBuilderConfigration;

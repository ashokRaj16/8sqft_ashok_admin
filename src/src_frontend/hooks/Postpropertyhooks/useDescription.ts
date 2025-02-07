import { useMutation } from "@tanstack/react-query";
import axios from ".."; // Ensure this path matches your project structure
import usePropertyIdStore from "@/Store/propertyid";
import { useAuthStore } from "@/Store/jwtTokenStore";

// Define data types
interface PropertyAgreementData {
  property_description: string;
  propertyType: string;

}

interface useDescriptionResponse {
  message?: string;
  // Additional properties if required
}

interface useDescriptionError {
  message?: string;
  // Additional properties if required
}

interface UseuseDescriptionOptions {
  onSuccess?: (data: useDescriptionResponse) => void;
  onError?: (error: useDescriptionError) => void;
}

const useDescriptionDetail = ({ onSuccess, onError }: UseuseDescriptionOptions) => {
  const token = useAuthStore((state) => state.token);
  const { id } = usePropertyIdStore();
  const mutationFn = async (data: PropertyAgreementData) => {
    // Create FormData and append the property_description
    const formData = new FormData();
    formData.append("propertyType", data.propertyType);
    formData.append("property_description", data.property_description);
    formData.append("id", `${id}`);

    // Example IP address as a string
    formData.append("user_agent", "Mozilla/5.0"); // Example user agent as a string
    formData.append("host_name", "example.com");
    formData.append("step_id", '4');
    // Send POST request with form data
    const response = await axios.post("/api/v1/front/post_property", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure Content-Type is multipart/form-data
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  };

  return useMutation<useDescriptionResponse, useDescriptionError, PropertyAgreementData>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as useDescriptionError);
      }
    },
  });
};

export default useDescriptionDetail;

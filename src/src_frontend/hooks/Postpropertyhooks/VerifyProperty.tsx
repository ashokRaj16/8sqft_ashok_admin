import { useMutation } from "@tanstack/react-query";
import axios from ".."; // Ensure this matches your project structure
import usePropertyIdStore from "@/Store/propertyid";
import { useAuthStore } from "@/Store/jwtTokenStore";

// Define data types
interface PropertyAgreementData {
  
  verification_document: File | null; // Selected document for verification
  pan_card?: File | null; // Pan Card file
  addhar_card?: File | null; // Aadhar Card file
  [key: string]: any; // Flexibility for additional fields
}

interface useVerifyPropertyResponse {
  message?: string;
}

interface useVerifyPropertyError {
  message?: string;
}

interface UseuseVerifyPropertyOptions {
  onSuccess?: (data: useVerifyPropertyResponse) => void;
  onError?: (error: useVerifyPropertyError) => void;
}

const useVerifyPropertyDetail = ({ onSuccess, onError }: UseuseVerifyPropertyOptions) => {
  const token = useAuthStore((state) => state.token);
  const { id } = usePropertyIdStore();
  const mutationFn = async (data: PropertyAgreementData) => {
    // Create a new FormData object
    const formData = new FormData();

    // Append the verification document
    if (data.verification_document) {
      formData.append("verification_document", data.verification_document);
    }

    // Append the Pan Card file
    if (data.pan_card) {
      formData.append("pan_card", data.pan_card);
    }

    // Append the Aadhar Card file
    if (data.addhar_card) {
      formData.append("addhar_card", data.addhar_card);
    }

    // Append additional metadata
    
    
    formData.append("id", `${id}`);
    formData.append("step_id", "5");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
  }
    // Send the FormData request
    const response = await axios.post("/api/v1/front/post_property", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  return useMutation<useVerifyPropertyResponse, useVerifyPropertyError, PropertyAgreementData>({
    mutationFn,
    onSuccess,
    onError,
  });
};

export default useVerifyPropertyDetail;

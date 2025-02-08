
import { useMutation } from "@tanstack/react-query";
import axios from ".."; // Ensure this path matches your project structure
import useBuilderPostPropertyIdStore from "@/Store/propertyid";
import { useAuthStore } from "@/Store/jwtTokenStore";

// Define data types
interface PropertyAgreementData {
    id: number;
    step_id: number;
    state_id: number;
    state_name: string;
    city_id: number;
    city_name: string;
    landmark: string;
    locality: string;
    latitude: string;
    longitude: string;
    pincode?: string;
    property_title: string;
    property_type: string;
    property_variety: string;
    property_current_status: string;
    possession_date: string; // Format: "MM/YYYY"
    is_rera_number: string; // "0" for false, "1" for true
    rera_number: string;
    total_units: number;
    width_facing_road: string;
    project_area: string;
    project_area_unit: string; // Add other units if needed
    per_sqft_amount: number;
}

interface useBuilderPostPropertyDetailsResponse {
  message?: string;
  id?: number;
}

interface useBuilderPostPropertyDetailsError {
  message?: string;
}

interface UseBuilderPostPropertyDetailsOptions {
  onSuccess?: (data: useBuilderPostPropertyDetailsResponse) => void;
  onError?: (error: useBuilderPostPropertyDetailsError) => void;
}

const useBuilderPostPropertyDetails = ({ onSuccess, onError }: UseBuilderPostPropertyDetailsOptions) => {
  const token = useAuthStore((state) => state.token);
 

  const { id } = useBuilderPostPropertyIdStore();
  const mutationFn = async (data: PropertyAgreementData) => {


    const response = await axios.post('/api/v1/front/post_property/builder', data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  };

  return useMutation<useBuilderPostPropertyDetailsResponse, useBuilderPostPropertyDetailsError, PropertyAgreementData>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as useBuilderPostPropertyDetailsError);
      }
    },
  });
};

export default useBuilderPostPropertyDetails;

// src/hooks/Postpropertyhooks/useAmenities.ts
import { useMutation } from "@tanstack/react-query";
import usePropertyIdStore from "@/Store/propertyid";
import axios from "..";
import { useAuthStore } from "@/Store/jwtTokenStore";

interface BuilderAmenityData {
  id: number,
  step_id: number,
  water_supply: string, 
  granted_security: string,
  sewage_connection: string,           // 0 | 1
  electricity_connection: string,       // 0 | 1
  description: string,
  other_amenities: string
}



interface useBuilderAmenityResponse {
  message?: string;
}

interface useBuilderAmenityError {
  message?: string;
}

interface UseBuilderAmenityOptions {
  onSuccess?: (data: useBuilderAmenityResponse) => void;
  onError?: (error: useBuilderAmenityError) => void;
}
// API Hook for BuilderAmenity
const useBuilderAmenityDetail = ({ onSuccess, onError }: UseBuilderAmenityOptions) => {
  const token = useAuthStore((state) => state.token);
  

  const mutationFn = async (data: BuilderAmenityData) => {
    
    const response = await axios.post('/api/v1/front/post_property/builder', data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  };

  return useMutation<useBuilderAmenityResponse, useBuilderAmenityError, BuilderAmenityData>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as useBuilderAmenityError);
      }
    },
  });
};

export default useBuilderAmenityDetail;

// src/hooks/Postpropertyhooks/useAmenities.ts
import { useMutation } from "@tanstack/react-query";
import usePropertyIdStore from "@/Store/propertyid";
import axios from "..";
import { useAuthStore } from "@/Store/jwtTokenStore";

interface PropertyAgreementData {
  id: number,
  step_id: number,
  furnishing_status: string,
  parking: string,
  water_supply: string, 
  granted_security: string,
  pet_allowed: string,           // 0 | 1
  non_veg_allowed: string,       // 0 | 1
  description: string,
  other_amenities: string
}



interface useAmenitiesResponse {
  message?: string;
}

interface useAmenitiesError {
  message?: string;
}

interface UseAmenitiesOptions {
  onSuccess?: (data: useAmenitiesResponse) => void;
  onError?: (error: useAmenitiesError) => void;
}

// API Hook for Amenities
const useAmenitiesDetail = ({ onSuccess, onError }: UseAmenitiesOptions) => {
  const token = useAuthStore((state) => state.token);
  

  const mutationFn = async (data: PropertyAgreementData) => {
    
    const response = await axios.post('/api/v1/front/post_property', data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  };

  return useMutation<useAmenitiesResponse, useAmenitiesError, PropertyAgreementData>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as useAmenitiesError);
      }
    },
  });
};

export default useAmenitiesDetail;

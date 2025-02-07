// src/hooks/Postpropertyhooks/usePropertypostDetail.ts
import { useMutation } from "@tanstack/react-query";
import usePropertyIdStore from "@/Store/propertyid";

import { useAuthStore } from "@/Store/jwtTokenStore";
import axios from ".";

interface PropertypostDetail {
  id: number,
  step_id: number,
}



interface usePropertypostDetailResponse {
  message?: string;
}

interface usePropertypostDetailError {
  message?: string;
}

interface usePropertypostDetailOptions {
  onSuccess?: (data: usePropertypostDetailResponse) => void;
  onError?: (error: usePropertypostDetailError) => void;
}

// API Hook for Amenities
const usePropertypostDetailDetail = ({ onSuccess, onError }: usePropertypostDetailOptions) => {
  const token = useAuthStore((state) => state.token);
  

  const mutationFn = async (data: PropertypostDetail) => {
    
    const response = await axios.post('/api/v1/front/post_property', data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  };

  return useMutation<usePropertypostDetailResponse, usePropertypostDetailError, PropertypostDetail>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as usePropertypostDetailError);
      }
    },
  });
};

export default usePropertypostDetailDetail;

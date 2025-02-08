// src/hooks/Postpropertyhooks/useGallary.ts
import { useMutation } from "@tanstack/react-query";
import axios from "..";
import { useAuthStore } from "@/Store/jwtTokenStore";

interface gallaryData {
  id: number,
  step_id: number,
}



interface useGallaryResponse {
  message?: string;
}

interface useGallaryError {
  message?: string;
}

interface useGallaryOptions {
  onSuccess?: (data: useGallaryResponse) => void;
  onError?: (error: useGallaryError) => void;
}

// API Hook for Amenities
const useGallaryDetail = ({ onSuccess, onError }: useGallaryOptions) => {
  const token = useAuthStore((state) => state.token);
  

  const mutationFn = async (data: gallaryData) => {
    
    const response = await axios.post('/api/v1/front/post_property', data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  };

  return useMutation<useGallaryResponse, useGallaryError, gallaryData>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as useGallaryError);
      }
    },
  });
};

export default useGallaryDetail;

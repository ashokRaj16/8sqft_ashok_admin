
import { useMutation } from "@tanstack/react-query";

import axios from "..";
import { useAuthStore } from "@/Store/jwtTokenStore";

interface BuilderBuilderGallaryData {
  id: number,
  step_id: number,
}



interface useBuilderGallaryResponse {
  message?: string;
}

interface useBuilderGallaryError {
  message?: string;
}

interface useBuilderGallaryOptions {
  onSuccess?: (data: useBuilderGallaryResponse) => void;
  onError?: (error: useBuilderGallaryError) => void;
}

// API Hook for Amenities
const useBuilderGallaryDetail = ({ onSuccess, onError }: useBuilderGallaryOptions) => {
  const token = useAuthStore((state) => state.token);
  

  const mutationFn = async (data: BuilderBuilderGallaryData) => {
    
    const response = await axios.post('/api/v1/front/post_property/builder', data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  };

  return useMutation<useBuilderGallaryResponse, useBuilderGallaryError, BuilderBuilderGallaryData>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as useBuilderGallaryError);
      }
    },
  });
};

export default useBuilderGallaryDetail;

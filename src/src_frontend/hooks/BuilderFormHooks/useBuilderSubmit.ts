// src/hooks/Postpropertyhooks/useBuilderSubmit.ts
import { useMutation } from "@tanstack/react-query";
import axios from "..";
import { useAuthStore } from "@/Store/jwtTokenStore";

interface BuilderSubmitData {
  id: number,
  step_id: number,
}



interface useBuilderSubmitResponse {
  message?: string;
}

interface useBuilderSubmitError {
  message?: string;
}

interface useBuilderSubmitOptions {
  onSuccess?: (data: useBuilderSubmitResponse) => void;
  onError?: (error: useBuilderSubmitError) => void;
}

// API Hook for Amenities
const useBuilderSubmitDetail = ({ onSuccess, onError }: useBuilderSubmitOptions) => {
  const token = useAuthStore((state) => state.token);
  

  const mutationFn = async (data: BuilderSubmitData) => {
    
    const response = await axios.post('/api/v1/front/post_property/builder', data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  };

  return useMutation<useBuilderSubmitResponse, useBuilderSubmitError, BuilderSubmitData>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as useBuilderSubmitError);
      }
    },
  });
};

export default useBuilderSubmitDetail;

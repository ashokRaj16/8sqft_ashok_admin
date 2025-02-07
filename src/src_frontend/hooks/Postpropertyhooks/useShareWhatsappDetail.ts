// src/hooks/Postpropertyhooks/useShareWhatsapp.ts
import { useMutation } from "@tanstack/react-query";
import usePropertyIdStore from "@/Store/propertyid";

import { useAuthStore } from "@/Store/jwtTokenStore";
import axios from "..";


interface ShareWhatsappDetail {
  propertyId: number,
}



interface useShareWhatsappResponse {
  message?: string;
}

interface useShareWhatsappError {
  message?: string;
}

interface useShareWhatsappOptions {
  onSuccess?: (data: useShareWhatsappResponse) => void;
  onError?: (error: useShareWhatsappError) => void;
}

// API Hook for Amenities
const useShareWhatsappDetail = ({ onSuccess, onError }: useShareWhatsappOptions) => {
  const token = useAuthStore((state) => state.token);
  

  const mutationFn = async (data: ShareWhatsappDetail) => {
    
    const response = await axios.post('/api/v1/front/send_contact_msg', data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  };

  return useMutation<useShareWhatsappResponse, useShareWhatsappError, ShareWhatsappDetail>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as useShareWhatsappError);
      }
    },
  });
};

export default useShareWhatsappDetail;

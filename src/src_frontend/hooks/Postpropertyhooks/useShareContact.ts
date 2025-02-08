// src/hooks/Postpropertyhooks/useShareContact.ts
import { useMutation } from "@tanstack/react-query";
import usePropertyIdStore from "@/Store/propertyid";

import { useAuthStore } from "@/Store/jwtTokenStore";
import axios from "..";


interface ShareContactDetail {
  propertyId: number,
}



interface useShareContactResponse {
  message?: string;
}

interface useShareContactError {
  message?: string;
}

interface useShareContactOptions {
  onSuccess?: (data: useShareContactResponse) => void;
  onError?: (error: useShareContactError) => void;
}

// API Hook for Amenities
const useShareContactDetail = ({ onSuccess, onError }: useShareContactOptions) => {
  const token = useAuthStore((state) => state.token);
  

  const mutationFn = async (data: ShareContactDetail) => {
    
    const response = await axios.post('/api/v1/front/send_contact_mail', data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  };

  return useMutation<useShareContactResponse, useShareContactError, ShareContactDetail>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as useShareContactError);
      }
    },
  });
};

export default useShareContactDetail;

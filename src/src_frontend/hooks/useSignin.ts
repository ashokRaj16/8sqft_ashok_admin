import { useMutation } from "@tanstack/react-query";
import axios from "."; // Ensure this path matches your project structure

// Define data types
interface PropertyAgreementData {
   name:string;
   email:string;
   phone:string;
   
  }

interface useSigninResponse {
  message?: string;
  // Additional properties if required
}

interface useSigninError {
  message?: string;
  // Additional properties if required
}

interface UseuseSigninOptions {
  onSuccess?: (data: useSigninResponse) => void;
  onError?: (error: useSigninError) => void;
}

const useSigninDetail = ({ onSuccess, onError }: UseuseSigninOptions) => {
  const mutationFn = async (data: PropertyAgreementData) => {
    const response = await axios.post('/api/v1/auth/send-otp-email', data, { headers: {
      "Content-Type": "application/json",
    }

    });
    return response.data;

  };

  return useMutation<useSigninResponse, useSigninError, PropertyAgreementData>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as useSigninError);
      }
    },
  });
};

export default useSigninDetail;
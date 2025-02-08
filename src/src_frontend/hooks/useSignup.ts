import { useMutation } from "@tanstack/react-query";
import axios from "."; // Ensure this path matches your project structure
import { decodeToken } from "@/lib/jwtDecode";
import { useAuthStore } from "@/Store/jwtTokenStore";

interface Datatoken {
  token: string;
}
interface SignupResponse {
  message: string;
  data: Datatoken; // Updated to handle token inside `data`
}

// Define data types
interface PropertyAgreementData {
  first_name: string;
  email: string;
  mobile: string;
  last_name: string;
}



interface useSignupError {
  message?: string;
}

interface UseuseSignupOptions {
  onSuccess?: (data: SignupResponse) => void;
  onError?: (error: useSignupError) => void;
}

// Define useSignupDetail
const useSignupDetail = ({ onSuccess, onError }: UseuseSignupOptions) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutationFn = async (data: PropertyAgreementData) => {
    try {
      // Send request to register user
      const response = await axios.post('/api/v1/auth/register-user', data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const token = response.data.data.token;
      if (!token) {
        throw new Error("Token not found in response");
      }
      
      sessionStorage.setItem("authToken", token);

      // Decode the token to extract user details
      const decoded = decodeToken(token);
      

      if (decoded && decoded.id && decoded.email) {
        setAuth(
          decoded.id,
          decoded.email,
          token,
        );
      } else {
        throw new Error("Failed to decode token or missing fields");
      }

      return response.data; // Successful response

    } catch (error) {
      console.error("Signup error:", error);
      throw error; // Ensure the error is propagated to trigger `onError`
    }
  };

  return useMutation<SignupResponse, useSignupError, PropertyAgreementData>({
    mutationFn,
    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error as useSignupError);
      }
    },
  });
};

export default useSignupDetail;

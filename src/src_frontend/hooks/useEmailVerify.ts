import { useMutation } from "@tanstack/react-query";
import axios from "."; // Ensure this path matches your project structure
import { useAuthStore } from "@/Store/jwtTokenStore";
import { decodeToken } from "@/lib/jwtDecode";

// Define data types
interface Datatoken {
  token: string;
}

interface PropertyAgreementData {
  email: string;
  otp: string;
}

interface LoginResponse {
  message: string;
  data: Datatoken; // Updated to handle token inside `data`
}

interface RegisterResponse {
  message: string;
  mobile: string;
  needToRegister: boolean;
}

type useEmailVerifyResponse = LoginResponse | RegisterResponse; // Union type for both responses

interface useEmailVerifyError {
  message?: string;
}

interface useEmailVerifyOptions {
  onSuccess?: (data: useEmailVerifyResponse) => void;
  onError?: (error: useEmailVerifyError) => void;
}

const useEmailVerifyDetail = ({ onSuccess, onError }: useEmailVerifyOptions) => {
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutationFn = async (data: PropertyAgreementData) => {
    const response = await axios.post("/api/v1/auth/verify-otp-email", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("API response:", response.data);
    return response.data as useEmailVerifyResponse;
  };

  const mutation = useMutation<useEmailVerifyResponse, useEmailVerifyError, PropertyAgreementData>({
    mutationFn,
    onSuccess: (data) => {
      try {
        // Check if response is a LoginResponse (nested data object exists)
        if ("data" in data && data.data) {
          const token = data.data.token;
          console.log(token,'this is the token ')
          // Store token in localStorage
          const tokenName = "authToken";
          sessionStorage.setItem("authToken", token);
          
          console.log(sessionStorage.getItem(tokenName), 'this is the token after setting it in local storage')
          // Decode token and update Zustand
          const decoded = decodeToken(token);
          if (decoded && decoded.id && (decoded.email || decoded.mobile)) {
            const { id, email, mobile } = decoded;
            setAuth(id, email, mobile, token);
          } else {
            console.error("Failed to decode token. Invalid token structure.");
          }
        } else if ("needToRegister" in data) {
          // Handle RegisterResponse
          console.log("User needs to register:", data);
        } else {
          console.error("Unexpected response structure.");
        }

        // Invoke onSuccess callback if provided
        if (onSuccess) {
          onSuccess(data);
        }
      } catch (err) {
        console.error("Error in onSuccess handler:", err);
        if (onError) {
          onError({ message: "An error occurred while processing the response." });
        }
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error);
      }
    },
  });

  return {
    mutateEmailOtp: mutation.mutate,
    errorEmailOtp: mutation.error,
    ...mutation,
  };
};

export default useEmailVerifyDetail;

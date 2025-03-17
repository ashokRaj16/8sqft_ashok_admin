

import { useAuthStore } from "@/Store/jwtTokenStore";
import { useMutation } from "@tanstack/react-query";
import axios from ".";

// ✅ Response interface
interface UpdateViewCountResponse {
  status: boolean;
  message: string;
  data: {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    info: string;
    serverStatus: number;
    warningStatus: number;
    changedRows: number;
  };
}

// ✅ Error interface
interface UpdateViewCountError {
  message?: string;
}

// ✅ Hook for updating view count
const useUpdateViewCount = () => {
  const token = useAuthStore((state) => state.token);

  return useMutation<UpdateViewCountResponse, UpdateViewCountError, number>({
    mutationFn: async (propertyId) => {
      try {
        const response = await axios.put(
          `/api/v1/front/property/view_count/${propertyId}`,
          {}, // Empty payload as per your API
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "A8SQFT7767",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update view count");
      }
    },
  });
};

export default useUpdateViewCount;

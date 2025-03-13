import { useAuthStore } from "@/Store/jwtTokenStore";
import axios from "..";
import { useMutation } from "@tanstack/react-query";

interface DeleteResponse {
  status: string;
  message: string;
}

interface DeleteError {
  status: string;
  message: string;
  error: string;
}

interface DeleteOptions {
  onSuccess?: (data: DeleteResponse) => void;
  onError?: (error: DeleteError) => void;
}

const useShortlistDelete = ({ onSuccess, onError }: DeleteOptions) => {
  const token = useAuthStore((state) => state.token);

  const mutationFn = async (id: number) => {
    const response = await axios.delete(`/api/v1/front/shortlist/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": "A8SQFT7767",
      },
    });

    return response.data;
  };

  return useMutation<DeleteResponse, DeleteError, number>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as DeleteError);
      }
    },
  });
};

export default useShortlistDelete;

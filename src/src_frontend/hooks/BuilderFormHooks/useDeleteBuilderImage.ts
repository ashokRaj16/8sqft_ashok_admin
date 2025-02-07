import { useAuthStore } from "@/Store/jwtTokenStore";
import axios from "..";
import { useMutation } from "@tanstack/react-query";
interface deleteResponse {
  status: string;
  message: string;
}

interface deleteError {
  status: string;
  message: string;
  error: string;
}

interface deleteOptions {
  onSuccess?: (data: deleteResponse) => void;
  onError?: (error: deleteError) => void;
}

const useDeleteBuilderImageDetail = ({ onSuccess, onError }: deleteOptions) => {
  const token = useAuthStore((state) => state.token);

  const mutationFn = async (id: number) => {
    const response = await axios.delete(`/api/v1/front/post_property/configuration/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

   
    return response.data;
  };

  return useMutation<deleteResponse, deleteError, number>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as deleteError);
      }
    },
  });
};

export default useDeleteBuilderImageDetail;

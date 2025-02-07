import { useQuery, QueryKey } from "@tanstack/react-query";
import { useAuthStore } from "@/Store/jwtTokenStore";
import axios from ".";

interface usePreviewModeResponse {
  message?: string;
  data?: any; // Adjust this based on the actual response structure
}

interface usePreviewModeError {
  message?: string;
}

const usePreviewModeDetail = (id: number) => {
  const token = useAuthStore((state) => state.token);

  const fetchPreviewModeData = async () => {
    const response = await axios.get(`/api/v1/front/post_property/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  return useQuery<usePreviewModeResponse, usePreviewModeError>({
    queryKey: ["previewMode", id] as QueryKey,
    queryFn: fetchPreviewModeData,
  });
};

export default usePreviewModeDetail;

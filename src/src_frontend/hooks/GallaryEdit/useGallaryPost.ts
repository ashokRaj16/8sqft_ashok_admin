import { useAuthStore } from "@/Store/jwtTokenStore";
import axios from "..";
import { useMutation } from "@tanstack/react-query";

interface data {
  id: number;
  imageUrl: string;
}

interface gallaryPostImges {
  property_id: number;
  img_title: string;
  image_category?:string
  images: File;
}


interface gallaryPostResponse {
  status: string;
  message: string;
  data: data[]

}
interface useGallaryPostError {
  status: string;
  message: string;
  error: string;

}

interface useGallaryPostOptions {
  onSuccess?: (data: gallaryPostResponse) => void;
  onError?: (error: useGallaryPostError) => void;
}


const useGallaryPostDetail = ({ onSuccess, onError }: useGallaryPostOptions) => {
  const token = useAuthStore((state) => state.token);


  const mutationFn = async (data: gallaryPostImges) => {

    const response = await axios.post('/api/v1/front/property_images', data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    
    return response.data;
  };

  return useMutation<gallaryPostResponse, useGallaryPostError, gallaryPostImges>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as useGallaryPostError);
      }
    },
  });
};

export default useGallaryPostDetail;

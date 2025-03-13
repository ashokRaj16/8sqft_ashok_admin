

import { useAuthStore } from "@/Store/jwtTokenStore";
import { useMutation } from "@tanstack/react-query";
import axios from "..";

// ✅ Response interface
interface UpdateProfileResponse {
  status: boolean;
  message: string;
  data: string;
}

// ✅ Error interface
interface UpdateProfileError {
  message?: string;
}

// ✅ Profile update request payload
interface ProfileData {
  company_name: boolean;
  instagram_url: boolean;
  facebook_url: boolean;
  youtube_url: boolean;
  aadhar: string;
  fname: string;
  email: string;
  mobile: string;
  id: number;
  profile_picture_url: string | null;
  // company_name: string;
  is_company_verified: string;
  password_hash: string | null;
  auth_provider: string | null;
  oauth_token: string | null;
  latitude: number | null;
  longitude: number | null;
  plan_id: number | null;
  role_id: number;
  state_id: number | null;
  city_id: number | null;
  pincode: number | null;
  contact_2: string | null;
  address_1: string | null;
  status: string;
  is_verified: string;
  ip_address: string | null;
  hostname: string | null;
  user_agent: string | null;
  is_deleted: string;
  created_at: string;
  updated_at: string;
  isBuilder: any;
  isowner: any;
  whatsapp_notification: string;
}

// ✅ Hook for updating profile
const useUpdateProfile = () => {
  const token = useAuthStore((state) => state.token);

  return useMutation<UpdateProfileResponse, UpdateProfileError, Partial<ProfileData>>({

    mutationFn: async (profileData) => {

      try {
        const response = await axios.put("/api/v1/front/profile", profileData, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update profile");
      }
    },
  });
};

export default useUpdateProfile;

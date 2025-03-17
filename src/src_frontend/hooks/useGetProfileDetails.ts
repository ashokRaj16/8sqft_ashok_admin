
import axios from ".";
import { create } from 'zustand';
import { persist } from "zustand/middleware";


interface ProfileData {
    id: number;
    fname: string;
    mname: string | null;
    lname: string;
    profile_picture_url: string | null;
    company_name: string;
    mobile: number;
    email: string;
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
    address_1: string | null;
    is_company_verified: string;
    contact_2: string | null;
    is_co_verified: string;
    status: string;
    is_verified: string;
    ip_address: string | null;
    hostname: string | null;
    user_agent: string | null;
    created_at: string;
    updated_at: string;
    is_deleted: string;
    is_mobile_verified: string;
    is_email_verified: string;
  }
interface Profile {
    id: string;
    name: string;
    email: string;
    data:ProfileData;
    // Add more fields based on your API response
  }
  
  // Define Zustand store state & actions
  interface ProfileState {
    profile: Profile | null;
    loading: boolean;
    error: string | null;
    fetchProfile: (token: string) => Promise<void>;
    clearProfile: () => void; // Function to clear stored data on logout
  }

// Create Zustand store with persistence
const useGetProfileDetails = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      loading: false,
      error: null,

      fetchProfile: async (token: string) => {
        set({ loading: true, error: null });

        try {
          const response = await axios.get<Profile>(`/api/v1/front/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "x-api-key": "A8SQFT7767", // Replace with your actual API key
            },
          });

          set({ profile: response.data, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      clearProfile: () => set({ profile: null, error: null }), // Clear stored profile
    }),
    {
      name: 'profile-storage', // Key for localStorage
      // storage: localStorage, // Change to sessionStorage if needed
    }
  )
);

export default useGetProfileDetails;

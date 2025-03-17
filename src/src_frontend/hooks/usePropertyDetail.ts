import { useQuery } from "@tanstack/react-query";
import axios from "."; // Ensure the path matches your project's structure

// Define the property detail response interface
// ✅ Interface for Image Object
interface PropertyImage {
  id: number;
  property_id: number;
  property_img_url: string;
  img_title: string;
  img_type: string;
  img_description: string | null;
  created_at: string;
  updated_at: string;
}

// ✅ Interface for Amenity Object
interface PropertyAmenity {
  id: number;
  property_id: number;
  amenety_id: number;
  amenety_title: string;
  amenety_value: string;
  amenety_description: string | null;
  created_at: string;
  updated_at: string;
}

// ✅ Main Property Interface
interface Property {
  id: number;
  user_id: number;
  property_title: string | null;
  property_description: string;
  property_short_description: string | null;
  building_name: string | null;
  landmark: string;
  locality: string;
  city_id: number;
  state_id: number;
  city_name: string;
  state_name: string;
  pincode: string | null;
  latitude: string | null;
  longitude: string | null;
  flat_type: string;
  area: string;
  area_type: string | null;
  rent: number;
  deposite: number;
  property_type: string;
  bed_rooms: number;
  bath_rooms: number;
  property_floors: number | null;
  total_floors: number | null;
  balcony: number;
  is_wings: string | null;
  wings_count: number | null;
  on_rent_buy: string | null;
  rent_is_nogotiable: string | null;
  deposite_is_negotiable: string;
  availability_date: string;
  property_age: string;
  ip_address: string;
  user_agent: string;
  host_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  property_sub_variant: string;
  is_deleted: string;
  images: PropertyImage[];
  ameneties: PropertyAmenity[];
}


interface PropertyDetailResponse {
  data: Property;
  status: boolean;
  message: string;
}

interface PropertyDetailError {
  message?: string;
}

// Hook to fetch property details by ID
const usePropertyDetail = (id: number) => {
  return useQuery<PropertyDetailResponse, PropertyDetailError>({
    queryKey: ["propertyDetail", id],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/front/property/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    enabled: !!id, // Only run query if ID is valid
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
  });
};

export default usePropertyDetail;

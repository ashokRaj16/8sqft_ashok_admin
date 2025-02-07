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
interface PropertyImage {
  url: string;
}

interface PropertyAmenity {
  name: string;
}

interface PropertyImage {
  id: number;
  property_id: number;
  property_img_url: string;
  img_title: string;
  image_category: string;
  file_type: string;
  image_size: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface PropertyDetails {
  id: number;
  user_id: number;
  form_step_id: string;
  form_status: string;
  user_type: string;
  property_title: string;
  description: string;
  short_description?: string | null;
  building_name?: string | null;
  landmark: string;
  locality: string;
  city_id: number;
  state_id?: number | null;
  city_name?: string | null;
  state_name?: string | null;
  pincode?: string | null;
  latitude: string;
  longitude: string;
  land_area: number;
  land_area_unit: string;
  property_availibility_type: string;
  is_maintenance: string;
  property_variety_type: string;
  builtup_area: number;
  builtup_area_unit: string;
  rent_amount: number;
  deposite_amount: number;
  property_type: string;
  bed_rooms: number;
  washrooms: number;
  floor_number: number;
  total_floors: number;
  property_floors?: string | null;
  balcony: number;
  is_wings?: string | null;
  wings_count?: number | null;
  unit_number: number;
  total_wing: number;
  wing_name: string;
  property_variety: string;
  property_rent_buy: string;
  rent_is_nogotiable: string;
  deposite_is_negotiable: string;
  availability_date: string;
  property_age: string;
  furnishing_status: string;
  parking: string;
  water_supply: string;
  washroom_type?: string | null;
  granted_security: string;
  other_amenities: string;
  door_facing: string;
  preferred_tenent: string;
  pet_allowed: string;
  non_veg_allowed: string;
  expected_amount?: string | null;
  exected_amount_sqft?: string | null;
  monthly_maintenance?: string | null;
  ownership_type?: string | null;
  dimension_length?: string | null;
  dimension_width?: string | null;
  width_facing_road?: string | null;
  sewage_connection?: string | null;
  electricity_connection?: string | null;
  rera_number?: string | null;
  is_rera_number?: string | null;
  property_current_status?: string | null;
  possession_status?: string | null;
  possession_date?: string | null;
  total_towers?: number | null;
  total_units?: number | null;
  project_area?: string | null;
  project_area_unit?: string | null;
  ip_address: string;
  user_agent: string;
  host_name: string;
  status: string;
  status_text: string;
  is_deleted: string;
  added_by?: string | null;
  updated_by?: string | null;
  publish_date?: string | null;
  created_at: string;
  updated_at: string;
  availability_duration?: string | null;
  drink_allowed?: string | null;
  smoke_allowed?: string | null;
  pg_rules?: string | null;
  images: PropertyImage[]; // Array of images linked to the property
}


interface PropertyDetailResponse {
  data: PropertyDetails;
  status: boolean;
  message: string;
}

interface PropertyDetailError {
  message?: string;
}

// Hook to fetch property details by ID
const   usePropertyDetail = (id: number) => {
  return useQuery<PropertyDetailResponse, PropertyDetailError>({
    queryKey: ["propertyDetail", id],
    queryFn: async () => {
      const response = await axios.get(`https://api.8sqft.com/api/v1/front/property/${id}`, {
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

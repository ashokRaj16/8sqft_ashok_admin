import { useQuery } from "@tanstack/react-query";
import axios from "."; // Ensure the path matches your project's structure
import { string } from "yup";

// ✅ Interface for Image Object
interface PropertyImage {
  id: number;
  property_id: number;
  property_img_url: string;
  img_title: string;
  image_category: string;
  file_type: string;
  image_size: string;
  img_description?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}


interface PropertyFaqs {
  faq_question:string;
  faq_answer:string;
}

// ✅ Interface for Configuration Object
interface PropertyConfiguration {
  id: number;
  property_id: number;
  unit_type?: string | null;
  unit_name?: string | null;
  length: number;
  width: number;
  carpet_area: number;
  carpet_price: number;
  width_unit: string;
  length_unit: string;
  unit_length?: string | null;
  unit_width?: string | null;
  unit_img_url: string;
  file_type: string;
  file_size: string;
  status?: string | null;
  created_at: string;
  updated_at: string;
  unit_price_type:string;
}

// ✅ Main Property Interface
interface useBuilderDetails {
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
  land_area?: number | null;
  land_area_unit?: string | null;
  property_availibility_type?: string | null;
  is_maintenance?: string | null;
  property_variety_type?: string | null;
  builtup_area?: number | null;
  builtup_area_unit?: string | null;
  rent_amount?: number | null;
  deposite_amount?: number | null;
  property_type?: string | null;
  bed_rooms?: number | null;
  washrooms?: number | null;
  floor_number?: number | null;
  total_floors?: number | null;
  property_floors?: string | null;
  balcony?: number | null;
  is_wings?: string | null;
  wings_count?: number | null;
  unit_number?: number | null;
  total_wing?: number | null;
  wing_name?: string | null;
  property_variety: string;
  property_rent_buy: string;
  rent_is_nogotiable?: string | null;
  deposite_is_negotiable?: string | null;
  availability_date?: string | null;
  availability_duration?: string | null;
  property_age?: string | null;
  furnishing_status?: string | null;
  parking?: string | null;
  water_supply: string;
  washroom_type?: string | null;
  granted_security: string;
  other_amenities: string;
  door_facing?: string | null;
  preferred_tenent?: string | null;
  pet_allowed?: string | null;
  non_veg_allowed?: string | null;
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
  drink_allowed?: string | null;
  smoke_allowed?: string | null;
  per_sqft_amount?: string | null
  pg_rules?: string | null;
  images: PropertyImage[]; // Array of images linked to the property
  faq:PropertyFaqs[]
  company_name: string;
  intrestedCount: number;
  shortlistedCount: number;
  configuration: PropertyConfiguration[]; // Array of configurations linked to the property
  unique_view_count: number;
  mobile:number;
  unit_price_type:string;
  full_address:string;
  title_slug: string;
  
}

// ✅ Response interface
interface useBuilderDetailResponse {
  data: useBuilderDetails;
  status: boolean;
  message: string;
  content:PropertyConfiguration;
}

// ✅ Error interface
interface useBuilderDetailError {
  message?: string;
}

// ✅ Hook to fetch property details by ID
const useBuilderDetail = (id: number | null) => {
  return useQuery<useBuilderDetailResponse, useBuilderDetailError>({
    queryKey: ["useBuilderDetail", id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/v1/front/property/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    enabled: !!id, // ✅ Runs only if `id` exists
    staleTime: 0, // ✅ Forces a fresh request every time
    // cacheTime: 0, // ✅ Prevents caching, always fetches new data
    refetchOnMount: true, // ✅ Ensures new data when component mounts
    refetchOnWindowFocus: true, // ✅ Refetch when user switches back to the page
    refetchOnReconnect: true, // ✅ Refetch when the network reconnects
  });
};

export default useBuilderDetail;

import { useQuery } from "@tanstack/react-query";
import axios from ".";

// Property interface
interface Property {
  id: number;
  user_id: number;
  form_step_id: string;
  form_status: string;
  user_type: string;
  property_title: string;
  description: string;
  short_description: string | null;
  building_name: string | null;
  landmark: string;
  locality: string;
  city_id: number;
  state_id: number | null;
  city_name: string;
  state_name: string | null;
  pincode: string | null;
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
  property_floors: number | null;
  balcony: number;
  is_wings: string | null;
  wings_count: number | null;
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
  washroom_type: string | null;
  granted_security: string;
  other_amenities: string;
  door_facing: string;
  preferred_tenent: string;
  pet_allowed: string;
  non_veg_allowed: string;
  expected_amount: number | null;
  exected_amount_sqft: number | null;
  monthly_maintenance: number | null;
  ownership_type: string | null;
  dimension_length: number | null;
  dimension_width: number | null;
  width_facing_road: number | null;
  sewage_connection: string | null;
  electricity_connection: string | null;
  rera_number: string | null;
  is_rera_number: string | null;
  property_current_status: string | null;
  possession_status: string | null;
  possession_date: string | null;
  total_towers: number | null;
  total_units: number | null;
  project_area: number | null;
  project_area_unit: string | null;
  ip_address: string;
  user_agent: string;
  host_name: string;
  status: string;
  status_text: string;
  is_deleted: string;
  added_by: string | null;
  updated_by: string | null;
  publish_date: string | null;
  created_at: string;
  updated_at: string;
  availability_duration: string | null;
  drink_allowed: string | null;
  smoke_allowed: string | null;
  pg_rules: string | null;
  property_img_url: string;
  user_email: string;
}


// Response interface
interface PropertyListResponse {
  data: {
    property: Property[];
  };
  status: boolean;
  message: string;
}

// Error interface
interface PropertylistError {
  message?: string;
}

// Query parameter interface
interface PropertylistParams {
  city_name?: string;
  page?: number;
  limit?: number;
  amount_range?: string;
  locality?: string;
  property_variety_type?: string;
  property_variety?: string;
  furnishing?: string;
  availability_date?: string;
  sortOrder?: string;
  sortColumn?: string;
  parking?: string;
  property_type?: string;
  property_rent_buy?: string;
}

// Hook definition
const usePropertylist = (params: PropertylistParams) => {
  return useQuery<PropertyListResponse, PropertylistError>({
    queryKey: ["propertylist", params],
    queryFn: async () => {
      const {
        city_name,
        limit = '100',
        locality,
        property_variety_type,
        property_variety,
        furnishing,
        availability_date,
        sortOrder,
        parking,
        property_type,
        property_rent_buy
      } = params;
      const response = await axios.get(`/api/v1/front/property/list_properties`, {
        params: {
          limit,
          city_name,
          sortOrder,
          furnishing,
          property_variety_type,
          availability_date,
          parking,
          property_variety,
          locality,
          property_type,
          property_rent_buy
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
  });
};

export default usePropertylist;

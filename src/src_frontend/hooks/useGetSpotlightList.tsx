import { useQuery } from "@tanstack/react-query";
import axios from ".";

// Interface for individual state item
interface Property {
    id: number;
    user_id: number;
    form_step_id: string;
    form_status: string;
    user_type: string;
    property_title: string;
    title_slug: string;
    company_name: string;
    description: string;
    short_description: string | null;
    building_name: string | null;
    landmark: string;
    locality: string;
    city_id: number;
    state_id: number;
    city_name: string;
    state_name: string;
    pincode: string | null;
    latitude: string;
    longitude: string;
    land_area: number | null;
    land_area_unit: string | null;
    property_availibility_type: string | null;
    is_maintenance: boolean | null;
    property_variety_type: string | null;
    builtup_area: number | null;
    builtup_area_unit: string | null;
    rent_amount: number | null;
    deposite_amount: number | null;
    property_type: string;
    bed_rooms: number | null;
    washrooms: number | null;
    floor_number: number | null;
    total_floors: number | null;
    property_floors: number | null;
    balcony: number | null;
    is_wings: boolean | null;
    wings_count: number | null;
    unit_number: string | null;
    total_wing: number | null;
    wing_name: string | null;
    property_variety: string;
    property_rent_buy: string;
    rent_is_nogotiable: boolean | null;
    deposite_is_negotiable: boolean | null;
    availability_date: string | null;
    availability_duration: string | null;
    property_age: string | null;
    furnishing_status: string | null;
    parking: string | null;
    water_supply: string;
    washroom_type: string | null;
    granted_security: string;
    other_amenities: string;
    door_facing: string | null;
    preferred_tenent: string | null;
    pet_allowed: boolean | null;
    non_veg_allowed: boolean | null;
    expected_amount: number | null;
    drink_allowed: boolean | null;
    smoke_allowed: boolean | null;
    pg_rules: string | null;
    exected_amount_sqft: number | null;
    per_sqft_amount: number;
    monthly_maintenance: number | null;
    ownership_type: string | null;
    dimension_length: number | null;
    dimension_width: number | null;
    width_facing_road: number;
    sewage_connection: string;
    electricity_connection: string;
    rera_number: string;
    is_rera_number: string;
    property_current_status: string;
    possession_status: string | null;
    possession_date: string;
    total_towers: number | null;
    total_units: number;
    project_area: number;
    project_area_unit: string;
    contact_view_count: number;
    unique_view_count: number;
    ip_address: string;
    user_agent: string;
    host_name: string;
    status: string;
    status_text: string;
    is_deleted: string;
    added_by: number | null;
    updated_by: number;
    publish_date: string;
    created_at: string;
    updated_at: string;
    full_address: string | null;
    property_img_url: string;
    config_dimenssion: string;
    config_carpet_price: number;
    tps_id: number;
  }
  

// Response interface
interface getSpotlightListResponse {
    status: boolean;
    message: string;
    data: Property[];
}

// Hook definition
const useGetSpotlightlist = () => {
    return useQuery<getSpotlightListResponse>({
        queryKey: ["getStateslist"],
        queryFn: async () => {
            console.log("Spotlight::")
            const response = await axios.get(`/api/v1/front/spotlight`, {
                params: {
                    categories: 'SPOTLIGHT'
                  },
                  headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "A8SQFT7767", // Replace with your actual API key
                  },
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
    });
};

export default useGetSpotlightlist;

import { useMutation } from "@tanstack/react-query";
import axios from ".."; // Ensure this path matches your project structure
import usePropertyIdStore from "@/Store/propertyid";
import { useAuthStore } from "@/Store/jwtTokenStore";

// Define data types
interface PropertyAgreementData {
  id: number,
  step_id: number,
  city_id: string,
  city_name: string,
  landmark: string,
  locality: string,
  latitude: number,
  longitude: number,
  property_title: string,
  property_rent_buy: string,
  property_variety_type: string,
  door_facing: string,
  land_area: string,
  land_area_unit: string,
  builtup_area: number,
  builtup_area_unit: string,
  rent_amount: number,
  rent_is_nogotiable: string,
  deposite_amount: number,
  deposite_is_negotiable: string,
  bed_rooms: string,
  balcony: string,
  washrooms: string,
  unit_number: number,
  floor_number: number,
  total_floors: number,
  total_wing: number,
  wing_name: string,
  property_availibility_type: string,
  preferred_tenent: string,
  property_age: string,
  is_maintenance: string,
  availability_date: Date
  property_variety: string,
}

interface usePropertyDetailsResponse {
  message?: string;
  id?: number;
}

interface usePropertyDetailsError {
  message?: string;
}

interface UseusePropertyDetailsOptions {
  onSuccess?: (data: usePropertyDetailsResponse) => void;
  onError?: (error: usePropertyDetailsError) => void;
}

const usePropertyDetails = ({ onSuccess, onError }: UseusePropertyDetailsOptions) => {
  const token = useAuthStore((state) => state.token);
 

  const { id } = usePropertyIdStore();
  const mutationFn = async (data: PropertyAgreementData) => {


    const response = await axios.post('/api/v1/front/post_property', data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  };

  return useMutation<usePropertyDetailsResponse, usePropertyDetailsError, PropertyAgreementData>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as usePropertyDetailsError);
      }
    },
  });
};

export default usePropertyDetails;

import { useMutation } from "@tanstack/react-query";
import axios from "."; // Ensure this path matches your project structure

// Define data types
interface PropertyAgreementData {
    ref_dipo_amt?: number;
    agri_durr?: number;
    mnth_rent_amt?: number;
    rent_not_fix?: string;
    inc_by_amt_from?: number;
    inc_amt_to?: number;
    inc_by_per_month?: number;
    inc_by_per_to_percent?: number;
    non_ref_deposit?: number;
    agriment_date?: string;
    agriment_type?: string;
    min_lokin_period?: number;
    deposit_payment_mode?: string;
    reg_fee_paid_by?: string;
    mentenence_paid_by?: string;
    amenities?: string;
    misc_clause_desc?: string;
    printing_cleaning_charges?: string;
    property_cond_upo_vac?: string;
    property_type?: string;
    flour_num?: number;
    flat_string?: string;
    building_name?: string;
    locality?: string;
    road_street?: string;
    society_name?: string;
    pincode?: string;
    distric?: string;
    tahasil?: string;
    village_city?: string;
    property_num_type?: string;
    property_string?: string;
    builtup_area_house?: number;
    builtup_area_unit?: string;
    use_of_area?: string;
    parking_area?: number;
    parking_area_unit?: string;
    gallery_area?: number;
    gallery_area_unit?: string;
    landloard_entity_type?: string;
    landloard_name?: string;
    landloard_phone?: string;
    have_landloard_aadhar?: boolean;
    landloard_pan_string?: string;
    landloard_email?: string;
    landloard_building_name?: string;
    flat_house_no?: string;
    landloard_floor_no?: number;
    landloard_road_street?: string;
    landloard_pincode?: string;
    landloard_village_city?: string;
    landloard_dist?: string;
    landloard_state?: string;
    exicuting_through?: string;
    tenant_entity_type?: string;
    tenant_name?: string;
    tanent_phone?: string;
    tanent_adhar_card?: string;
    tenant_email?: string;
    tanent_pan?: string;
    tenant_building_name?: string;
    tenant_flat_no?: string;
    tenant_road_street?: string;
    tenant_pincode?: string;
    tenant_village_city?: string;
    tenant_district?: string;
    tenant_state?: string;
    tenant_exec_through?: string;
    delivery_add_fullname?: string;
    delivery_address_email?: string;
    delivery_address_phone?: string;
    delivery_address_pincode?: string;
    delivery_type?: string;
    flatNumberHouseNumber?: string;
  }

interface RentalResponse {
  message?: string;
  // Additional properties if required
}

interface RentalError {
  message?: string;
  // Additional properties if required
}

interface UseRentalOptions {
  onSuccess?: (data: RentalResponse) => void;
  onError?: (error: RentalError) => void;
}

const useRentalDetail = ({ onSuccess, onError }: UseRentalOptions) => {
  const mutationFn = async (data: PropertyAgreementData) => {
    const response = await axios.post('/api/v1/agreements', data, { headers: {
      "Content-Type": "application/json",
    }

    });
    
    return response.data;

  };

  return useMutation<RentalResponse, RentalError, PropertyAgreementData>({
    mutationFn,
    onSuccess,
    onError: (error) => {
      if (onError) {
        onError(error as RentalError);
      }
    },
  });
};

export default useRentalDetail;
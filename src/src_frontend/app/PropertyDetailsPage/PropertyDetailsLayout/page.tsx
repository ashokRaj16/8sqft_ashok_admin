"use client";

import { useParams } from "next/navigation";
import ActivityCard from "./ActivityCard";
import Amenities from "./Amenities";
import Description from "./Description";
import Overview from "./Overview";
import Services from "./Services";
import usePropertyDetail from "@/hooks/usePropertygetDetail";

interface PropertyImage {
  id?: number;
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

// interface PropertyDetailsLayout {
//   id: number;
// }

// interface Property {
//   id: number;
//   user_id: number;
//   form_step_id: string;
//   form_status: string;
//   user_type: string;
//   property_title: string;
//   description: string;
//   landmark: string;
//   locality: string;
//   city_id: number;
//   latitude: string;
//   longitude: string;
//   land_area: number;
//   land_area_unit: string;
//   property_availibility_type: string;
//   is_maintenance: string;
//   property_variety_type: string;
//   builtup_area: number;
//   builtup_area_unit: string;
//   rent_amount: number;
//   deposite_amount: number;
//   property_type: string;
//   bed_rooms: number;
//   washrooms: number;
//   floor_number: number;
//   total_floors: number;
//   balcony: number;
//   unit_number: number;
//   total_wing: number;
//   wing_name: string;
//   property_variety: string;
//   property_rent_buy: string;
//   rent_is_nogotiable: string;
//   deposite_is_negotiable: string;
//   availability_date: string;
//   property_age: string;
//   furnishing_status: string;
//   parking: string;
//   water_supply: string;
//   granted_security: string;
//   other_amenities: string;
//   door_facing: string;
//   preferred_tenent: string;
//   pet_allowed: string;
//   non_veg_allowed: string;
//   ip_address: string;
//   user_agent: string;
//   host_name: string;
//   status: string;
//   status_text: string;
//   is_deleted: string;
//   created_at: string;
//   updated_at: string;
//   images: PropertyImage[];
// }

// const defaultProperty: Property = {
//   id: 0,
//   user_id: 0,
//   form_step_id: "",
//   form_status: "",
//   user_type: "",
//   property_title: "",
//   description: "",
//   landmark: "",
//   locality: "",
//   city_id: 0,
//   latitude: "",
//   longitude: "",
//   land_area: 0,
//   land_area_unit: "",
//   property_availibility_type: "",
//   is_maintenance: "",
//   property_variety_type: "",
//   builtup_area: 0,
//   builtup_area_unit: "",
//   rent_amount: 0,
//   deposite_amount: 0,
//   property_type: "",
//   bed_rooms: 0,
//   washrooms: 0,
//   floor_number: 0,
//   total_floors: 0,
//   balcony: 0,
//   unit_number: 0,
//   total_wing: 0,
//   wing_name: "",
//   property_variety: "",
//   property_rent_buy: "",
//   rent_is_nogotiable: "",
//   deposite_is_negotiable: "",
//   availability_date: "",
//   property_age: "",
//   furnishing_status: "",
//   parking: "",
//   water_supply: "",
//   granted_security: "",
//   other_amenities: "",
//   door_facing: "",
//   preferred_tenent: "",
//   pet_allowed: "",
//   non_veg_allowed: "",
//   ip_address: "",
//   user_agent: "",
//   host_name: "",
//   status: "",
//   status_text: "",
//   is_deleted: "",
//   created_at: "",
//   updated_at: "",
//   images: [],
// };

const PropertyDetailsLayout = () => {
  const params = useParams(); // Retrieve route parameters
  const propertyId = params?.id ? Number(params.id) : null; // Safely parse id
  const { data, isLoading, error } = usePropertyDetail(Number(propertyId));
  const property = data?.data;

  if (isLoading) return <p>Loading property details...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="flex gap-6 p-4 bg-white rounded-lg shadow-md w-full">
      {/* Left Section (70%) */}
      <div className="lg:w-[70%] flex flex-col gap-6">
        {/* Overview */}
        <Overview
          Furnishing={property?.furnishing_status}
          DoorFacing={property?.door_facing}
          WaterSupply={property?.water_supply}
          Floor={property?.floor_number}
          Washroom={property?.washrooms}
          Non_VegAllowed={property?.non_veg_allowed}
          GatedSecurity={property?.granted_security}
        />
        {/* Services */}
        <Services />
        {/* Amenities */}
        <Amenities otherAmenities={property?.other_amenities} />
        {/* Description */}
        <Description description={property?.description} />
      </div>

      {/* Right Section (30%) */}
      <div className="hidden lg:block w-[30%]">
        <ActivityCard />
      </div>
    </div>
  );
};

export default PropertyDetailsLayout;

"use client";
import ActivityCard from "./ActivityCard";
import Amenities from "./Amenities";
import Description from "./Description";
import Overview from "./Overview";
import Services from "./Services";
import usePropertyIdStore from "@/Store/propertyid";
import usePreviewModeDetail from "@/hooks/usePreviewMode";
import { Suspense } from "react";

const PreviewmodeLayout: React.FC = () => {
  const { id } = usePropertyIdStore(); // Fetch the property ID
  const propertyId = Number(id);

  const { data, error, isLoading } = usePreviewModeDetail(propertyId);
  const property = data?.data;
  // Handle loading and error states
  if (isLoading) {
    return <p>Loading property details...</p>;
  }

  return (
    <Suspense>
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

         
          {/* Amenities */}
          <Amenities otherAmenities={property?.other_amenities} />
          {/* Description */}
          <Description description={property?.description} />
        </div>

        {/* Right Section (30%) */}
        <div className=" lg:block w-[30%] ">
          <ActivityCard />
        </div>
      </div>
    </Suspense>
  );
};

export default PreviewmodeLayout;

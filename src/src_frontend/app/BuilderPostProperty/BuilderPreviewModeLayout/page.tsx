"use client";
import usePropertyIdStore from "@/Store/propertyid";
import { Suspense } from "react";
import DownloadBrochure from "./DownloadBrochure";
import MoreAbout from "./MoreAbout";
import PricePlotSection from "./FloorPlanContent";
import ProjectAmenities from "./AmenitiesContent";
import ReviewSection from "./RatingsContent";
import ContactDeveloperSection from "./ContactDeveloperSection";
import useGallaryDetail from "@/hooks/Postpropertyhooks/useGallary";
import toast from "react-hot-toast";
import useBuilderPreviewDetail from "@/hooks/useBuilderPreviewmode";

const BuilderPreviewModeLayout: React.FC = () => {
  const { id } = usePropertyIdStore(); // Fetch the property ID
  const propertyId = Number(id);
  const { data, error, isLoading } = useBuilderPreviewDetail(propertyId);
  // Handle loading and error states
  // if (isLoading) {
  //   return <p>Loading property details...</p>;
  // }
  const property = data?.data;

  if (isLoading) return <p>Loading property details...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  return (
    <div className="flex gap-6 p-4 bg-white rounded-lg shadow-md w-full">
      {/* Left Section (70%) */}
      <div className="lg:w-[70%] flex flex-col gap-6">
        {/* Overview */}

        <DownloadBrochure
          title={property?.property_title}
          projectArea={property?.project_area}
          configration={property?.configuration}
          per_sqft_amount={property?.per_sqft_amount}
          property_variety={property?.property_variety}
          possession_date={property?.possession_date}
        />
        <MoreAbout description={property?.description} />
        {/* 8SQFT Services */}
        <PricePlotSection
          configration={property?.configuration}
          possession_date={property?.possession_date}
          propertytype={property?.property_type}
        />

        <ProjectAmenities otherAmenities={property?.other_amenities} />
        {/* Description */}
        <ReviewSection />
      </div>

      {/* Right Section (30%) */}
      <div className="hidden lg:block w-[30%]">
        <ContactDeveloperSection />
      </div>
    </div>
  );
};

export default BuilderPreviewModeLayout;

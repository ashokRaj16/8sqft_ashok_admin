"use client";
import DownloadBrochure from "./DownloadBrochure";
import MoreAbout from "./MoreAbout";
import PricePlotSection from "./FloorPlanContent";
import ProjectAmenities from "./AmenitiesContent";
import ReviewSection from "./RatingsContent";
import ContactDeveloperSection from "./ContactDeveloperSection";
import useBuilderDetail from "@/hooks/useBuilderDetail";
import { useParams } from "next/navigation";
import OverviewComponent from "./overview-mobile";
import ReportIssueCard from "@/app/PropertyDetailsPage/ReportIssueCard";
import DetailComponent from "./DetailComponent";
import ReraComponent from "./ReraComponent";
import BuilderContactSection from "./BuilderContactSection";
import SimilarComponent from "./Similaromponnent";
import ActivityCard from "@/app/Post-PropertyformResidential/previewmodeLayout/ActivityCard";
import BuilderLocation from "../BuilderLocation";

const BuilderLayout: React.FC = () => {
  const params = useParams(); // Retrieve route parameters
  const propertyId = params?.id ? Number(params.id) : null; // Safely parse id

  const { data, error, isLoading } = useBuilderDetail(Number(propertyId));
  const property = data?.data;

  if (isLoading) return <p>Loading property details...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  return (
    <div className="lg:flex lg:gap-6 lg:p-4 lg:bg-white lg:rounded-lg lg:shadow-md lg:w-full">
      {/* Left Section (70%) */}
      <div className="lg:w-[70%] flex flex-col gap-6">
        {/* Overview */}

        <div className="">
          <DetailComponent
            configration={property?.configuration}
            per_sqft_amount={property?.per_sqft_amount}
            possession_date={property?.possession_date}
          />
        </div>

        <div className="hidden lg:block ">
          <DownloadBrochure
            title={property?.property_title}
            projectArea={property?.project_area}
            configration={property?.configuration}
            per_sqft_amount={property?.per_sqft_amount}
            property_variety={property?.property_variety}
            possession_date={property?.possession_date}
            unit_type={property?.project_area_unit}
            rera={property?.rera_number}
          />
        </div>
       

        {/* <div className="">
          <DetailComponent
            configration={property?.configuration}
            per_sqft_amount={property?.per_sqft_amount}
            possession_date={property?.possession_date}
          />
        </div> */}

        <div className="container lg:hidden">
        <ActivityCard/>
        </div>
        <div className="w-full flex justify-center lg:hidden">
          <OverviewComponent
            configration={property?.configuration}
            width_facing_road={property?.width_facing_road}
            reraNumber={property?.rera_number}
            property_type={property?.property_type}
          />
        </div>

        <div className=" ">
          <MoreAbout
            description={property?.description}
            locality={property?.locality}
            city_name={property?.city_name}
          />
        </div>

        {/* 8SQFT Services */}
        <div className="lg:hidden"></div>
        <div className="container lg:hidden">
          <ReraComponent reraNumber={property?.rera_number} />
        </div>
        <div className=" lg:block ">
          <PricePlotSection
            configration={property?.configuration}
            possession_date={property?.possession_date}
          />
        </div>

        <div className="">
          <ProjectAmenities otherAmenities={property?.other_amenities} />
        </div>
        <div>
           <BuilderLocation lat={property?.latitude} lng={property?.longitude} />
        </div>

       

        <div className="container hidden lg:block">
          <ReraComponent reraNumber={property?.rera_number}  />
        </div>
        
        <div className="lg:hidden container">
          <SimilarComponent />
        </div>
        
        
        
        <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center py-4 shadow-lg lg:hidden">
          {/* Description */}
          <BuilderContactSection />
        </div>
      </div>

      {/* Right Section (30%) */}
      <div className="hidden lg:block w-[30%]">
        <ActivityCard title={'Project'}  shortlistedCount={property?.shortlistedCount} intrestedCount={property?.intrestedCount} viewCount={property?.unique_view_count} />

        <ContactDeveloperSection configration={property?.configuration} />

       
          <ReportIssueCard />
        
      </div>

      <div className=" conatiner ml-4 lg:hidden">
        <ContactDeveloperSection  configration={property?.configuration}/>
      </div>



    </div>
  );
};

export default BuilderLayout;

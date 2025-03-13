"use client";
import usePropertyIdStore from "@/Store/propertyid";
import { Suspense, useEffect, useRef, useState } from "react";
import DownloadBrochure from "./DownloadBrochure";
import MoreAbout from "./MoreAbout";
import PricePlotSection from "./FloorPlanContent";
import ProjectAmenities from "./AmenitiesContent";
import ReviewSection from "./RatingsContent";
import ContactDeveloperSection from "./ContactDeveloperSection";
import useGallaryDetail from "@/hooks/Postpropertyhooks/useGallary";
import toast from "react-hot-toast";
import useBuilderPreviewDetail from "@/hooks/useBuilderPreviewmode";
import DetailComponent from "@/app/Builder/BuilderLayout/DetailComponent";
import ReraComponent from "./ReraComponent";
import ActivityCard from "./ActivityCard";
import ReportIssueCard from "./ReportIssueCard";
import OverviewComponent from "./overview-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import propLocation from '@/public/assets/icon/Location.svg'
import Image from "next/image";
const BuilderPreviewModeLayout: React.FC = () => {
  const { id } = usePropertyIdStore(); // Fetch the property ID
  const propertyId = Number(id);
  const { data, error, isLoading } = useBuilderPreviewDetail(propertyId);
  // Handle loading and error states
  // if (isLoading) {
  //   return <p>Loading property details...</p>;
  // }
  const property = data?.data;
  // Create refs for each section
  const [activeSection, setActiveSection] = useState("overview");
    const navRef = useRef<HTMLDivElement>(null);
    // Create refs for each section
    const sectionRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {
      overview: useRef(null),
      about: useRef(null),
      price: useRef(null),
      amenities: useRef(null),
      location: useRef(null),
      rera: useRef(null),
      similar: useRef(null),
    };
  
    // Scroll to the selected section
    const handleScroll = (section: keyof typeof sectionRefs & string) => {
      setActiveSection(section);
      const sectionElement = sectionRefs[section]?.current;
      if (sectionElement) {
        const yOffset = -150; // Offset to prevent hiding behind navbar
        const yPosition = sectionElement.getBoundingClientRect().top + window.scrollY + yOffset;
  
        window.scrollTo({ top: yPosition, behavior: "smooth" });
      }
    };
   // Detect section in viewport
   useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0.1 }
    );
  
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
  
    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);
  
  // Scroll nav horizontally
  const scrollNav = (direction: "left" | "right") => {
    if (navRef.current) {
      navRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };
  

  if (isLoading) return <p>Loading property details...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  return (
    <>
      <div className="">
        <DetailComponent
          configration={property?.configuration}
          property_variety={property?.property_variety}
          per_sqft_amount={property?.per_sqft_amount}
          possession_date={property?.possession_date}
          property_type={property?.property_type}

        />
      </div>

      <div className="flex space-x-4 overflow-x-auto items-center scrollbar-hide border-b border-gray-200 py-2 sticky top-20 bg-white z-20">
          <button onClick={() => scrollNav("left")} className="p-2 absolute left-0  translate-y-[0px] z-30 bg-white">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button  onClick={() => scrollNav("right")} className="p-2 absolute right-0 top-[10px] z-30 bg-white">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>

          <div
        ref={navRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pl-3 pr-6"
      >
        {Object.keys(sectionRefs).map((section) => (
          <button
            key={section}
            className={`whitespace-nowrap p-2 text-sm ${
              activeSection === section
                ? "text-primary font-semibold border-b-2 border-primary"
                : "text-gray-600 hover:text-primary"
            }`}
            onClick={() => handleScroll(section as keyof typeof sectionRefs & string)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>
        </div>

      <div className="lg:flex lg:gap-6  lg:bg-white pt-4 ">
        <div className="lg:w-[100%] flex flex-col gap-6">

          <div className="grid lg:grid-cols-3 gap-4 justify-between">
            <div className="lg:col-span-2">
              <div className="bg-white shadow-custom mb-3">
                <div className=" flex items-center gap-3 bg-white px-5 py-1">
                  <Image src={propLocation} alt="locaion" />
                  <div>
                    <label className="text-[#808080] text-xs lg:text-sm font-light lg:font-semibold">Property Location</label>
                    <p className="text-[#222222] text-[10px] lg:text-sm font-normal">{property?.full_address} {`${property?.locality} ${property?.city_name}`}</p>
                  </div>
                </div>
                <div className="flex justify-center w-full shadow-custom py-1">
                  <p className="text-[#FC660099] lg:text-sm text-[10px] font-normal my-2 cursor-pointer" onClick={() => handleScroll("location")}>View on Map</p>
                </div>
              </div>

              <div ref={sectionRefs.overview}>
                <DownloadBrochure
                  title={property?.property_title}
                  projectArea={property?.project_area}
                  configration={property?.configuration}
                  per_sqft_amount={property?.per_sqft_amount}
                  property_variety={property?.property_variety}
                  publish_date={property?.publish_date}
                  unit_type={property?.project_area_unit}
                  rera={property?.rera_number}
                  propertyCurrentStatus={property?.property_current_status}
                  widthFacingRoad={property?.width_facing_road}
                  totalUnits={property?.total_units}
                  floorNumber={property?.total_floors}
                  propertyType={property?.property_type}
                  totalTowers={property?.total_towers}
                />
              </div>
              <div ref={sectionRefs.about}>
                <MoreAbout
                 property_title={property?.property_title}
                  description={property?.description}
                  locality={property?.locality}
                  city_name={property?.city_name}
                />
              </div>
              {/* 8SQFT Services */}
              <div ref={sectionRefs.price}>
                <PricePlotSection
                  configration={property?.configuration}
                  possession_date={property?.possession_date}
                  propertytype={property?.property_type}
                  propertyVariety={property?.property_variety}
                />
              </div>

              <div className="" ref={sectionRefs.amenities}>
              <ProjectAmenities
                    otherAmenities={property?.other_amenities}
                    parking={property?.parking}
                    waterSupply={property?.water_supply}
                    grantedSecurity={property?.granted_security}
                    sewageConnection={property?.sewage_connection}
                    electricityConnection={property?.electricity_connection}
                    washroomType={property?.washroom_type}
                    furnishingStatus={property?.furnishing_status}
                  />
              </div>
              <div className="container " ref={sectionRefs.rera}>
                <ReraComponent reraNumber={property?.rera_number} />
              </div>



            </div>
            <div className="  ">
              <ActivityCard
                title={"Project"}
                shortlistedCount={property?.shortlistedCount}
                intrestedCount={property?.intrestedCount}
                viewCount={property?.unique_view_count}
              />
              <div className="w-full flex justify-center lg:hidden">
                <OverviewComponent
                  configration={property?.configuration?.map(config => ({
                    ...config,
                    unit_name: config.unit_name ?? ''
                  }))}
                  width_facing_road={property?.width_facing_road}
                  reraNumber={property?.rera_number}
                  property_type={property?.property_type}
                  projectArea={property?.project_area}
                  projectAreaUnit={property?.project_area_unit}
                  publishDate={property?.publish_date}
                  totalTowers={property?.total_towers}
                  totalUnits={property?.total_units}
                  perSqftAmount={property?.per_sqft_amount}
                  propertyVariety={property?.property_variety}
                />
              </div>
              <ContactDeveloperSection
                configration={property?.configuration}
                propertyVariety={property?.property_variety}
                propertytype={property?.property_type} />
              <ReportIssueCard />
            </div>
          </div>



        </div>
      </div>
    </>
  );
};

export default BuilderPreviewModeLayout;

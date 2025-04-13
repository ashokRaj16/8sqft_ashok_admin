"use client";
import DownloadBrochure from "./DownloadBrochure";
import MoreAbout from "./MoreAbout";
import PricePlotSection from "./FloorPlanContent";
import ProjectAmenities from "./AmenitiesContent";
import ReviewSection from "./RatingsContent";
import ContactDeveloperSection from "./ContactDeveloperSection";
import useBuilderDetail from "@/hooks/useBuilderDetail";
import useUpdateViewCount from "@/hooks/updatedViews";
import { useParams } from "next/navigation";
import OverviewComponent from "./overview-mobile";
import ReportIssueCard from "@/app/PropertyDetailsPage/ReportIssueCard";
import DetailComponent from "./DetailComponent";
import ReraComponent from "./ReraComponent";
import BuilderContactSection from "./BuilderContactSection";
import SimilarComponent from "./Similaromponnent";
import ActivityCard from "@/app/Post-PropertyformResidential/previewmodeLayout/ActivityCard";
import BuilderLocation from "../BuilderLocation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import propLocation from '@/public/assets/icon/Location.svg'
import Image from "next/image";
import TransitInfo from "./TransitInfo";
import Link from "next/link";
const BuilderLayout: React.FC = () => {
  const params = useParams(); // Retrieve route parameters
  const extractId = (url: any) => {
    if (!url || typeof url !== "string") return null; // Ensure it's a string
    const match = url.match(/-(\d+)$/);
    return match ? match[1] : null;
  };
  const id = extractId(params.id);

  const propertyId = params?.id ? Number(id) : null;
  const { data, error, isLoading } = useBuilderDetail(Number(propertyId));
  const property = data?.data;

  const { mutate: updateViewCount } = useUpdateViewCount();
  const hasUpdated = useRef(false); // ✅ Ensures API call runs only once.

  // ✅ Wrap in useCallback to prevent infinite re-renders
  const handleViewCount = useCallback(
    (propertyId: number) => {
      updateViewCount(propertyId, {
        onSuccess: () => {
          console.log(`View count updated for property ID: ${propertyId}`);
        },
        onError: (err) => {
          console.error(`Error updating view count for property ID ${propertyId}:`, err.message);
        },
      });
    },
    [updateViewCount]
  );

  useEffect(() => {
    if (!hasUpdated.current && propertyId) {
      handleViewCount(propertyId);
      hasUpdated.current = true;
    }
  }, [propertyId, handleViewCount]); // ✅ Added `handleViewCount` as dependency



//   const [activeSection, setActiveSection] = useState("overview");
//   const navRef = useRef<HTMLDivElement>(null);
//   const sectionRefs: { [key: string]: React.RefObject<HTMLDivElement> } = {
//     overview: useRef(null),
//     about: useRef(null),
//     price: useRef(null),
//     amenities: useRef(null),
//     location: useRef(null),
//     rera: useRef(null),
//     similar: useRef(null),
//   };

//   const handleScroll = (section: keyof typeof sectionRefs & string) => {
//     setActiveSection(section);
//     const sectionElement = sectionRefs[section]?.current;
//     if (sectionElement) {
//       const yOffset = -150; 
//       const yPosition = sectionElement.getBoundingClientRect().top + window.scrollY + yOffset;

//       window.scrollTo({ top: yPosition, behavior: "smooth" });
//     }
//   };
 
//  useEffect(() => {
//   const observer = new IntersectionObserver(
//     (entries) => {
//       const visibleSection = entries.find((entry) => entry.isIntersecting);
//       if (visibleSection) {
//         setActiveSection(visibleSection.target.id);
//       }
//     },
//     { rootMargin: "-50% 0px -50% 0px", threshold: 0.1 }
//   );

//   Object.values(sectionRefs).forEach((ref) => {
//     if (ref.current) observer.observe(ref.current);
//   });

//   return () => {
//     Object.values(sectionRefs).forEach((ref) => {
//       if (ref.current) observer.unobserve(ref.current);
//     });
//   };
// }, []);


// const scrollNav = (direction: "left" | "right") => {
//   if (navRef.current) {
//     navRef.current.scrollBy({
//       left: direction === "left" ? -200 : 200,
//       behavior: "smooth",
//     });
//   }
// };


  if (isLoading) return <p>Loading property details...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  return (
    <>
      <div className="">
        <div className="mx-4 lg:mx-0">
          <DetailComponent
            configration={property?.configuration}
            property_variety={property?.property_variety}
            per_sqft_amount={property?.per_sqft_amount}
            possession_date={property?.possession_date}
            property_type={property?.property_type}
          />
        </div>

        {/* <div className="flex space-x-4 overflow-x-auto items-center scrollbar-hide border-b border-gray-200 py-2 sticky top-14 lg:top-20 bg-white z-20">
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
        </div> */}
       


        <div className="lg:flex lg:gap-6 pt-2 ">
          <div className="lg:w-[100%] flex flex-col gap-6">
            {/* Overview */}

            <div className="grid lg:grid-cols-4 gap-4">
              <div className="col-span-3">
                <div className="shadow-custom mb-4 mt-2 mx-4 lg:mx-0 bg-white">
                    <div className="font-semibold lg:text-lg border-b border-[#D9D9D9] py-2 mb-2 px-4 shadow-sm w-full">
                  <div className=" flex items-center gap-3  py-1">
                    <Image src={propLocation} alt="locaion" />
                      <label className="text-[#808080] text-xs lg:text-sm font-light lg:font-semibold">Property Location</label>
                      <p className="text-[#222222] text-[10px] lg:text-sm font-normal">{property?.full_address}, {`${property?.locality}, ${property?.city_name}`}</p>
                    </div>
                  </div>
                  <div className="flex justify-center w-full">
                    <Link href={'#Location'} className="text-[#FC660099] lg:text-sm text-[10px] font-normal my-2 cursor-pointer">View on Map</Link>
                  </div>
                </div>
                <div className="lg:scroll-mt-32 scroll-mt-24" id="Overview">
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
                <div className="container lg:hidden">
                  <ActivityCard
                    title={"Project"}
                    shortlistedCount={property?.shortlistedCount}
                    intrestedCount={property?.intrestedCount}
                    viewCount={property?.unique_view_count}
                  />
                </div>

                <div className="w-full flex justify-center lg:hidden scroll-mt-24" id="Overview">
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
                    floorNumber={property?.total_floors}
                    propertyCurrentStatus={property?.property_current_status}
                  />
                </div>

                <div className="lg:scroll-mt-32 scroll-mt-24 mx-4 lg:mx-0" id="About">
                  <MoreAbout
                    property_title={property?.property_title}
                    description={property?.description}
                    locality={property?.locality}
                    city_name={property?.city_name}
                  />
                </div>

                <div className="lg:scroll-mt-32 scroll-mt-24" id="Price">
                  <PricePlotSection
                    configration={property?.configuration}
                    possession_date={property?.possession_date}
                    propertytype={property?.property_type}
                    propertyVariety={property?.property_variety}
                  />
                </div>

                <div className="m-4 lg:mx-0 lg:scroll-mt-32 scroll-mt-24" id="Amenities">
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
                <div className=" mx-4 mb-2 lg:mx-0 lg:scroll-mt-32 scroll-mt-24" id="Rera">
                  <ReraComponent reraNumber={property?.rera_number} />
                </div>
                {/* <div className="my-2 mx-4 lg:mx-0" ref={sectionRefs.location}>
                  <BuilderLocation
                    lat={property?.latitude}
                    lng={property?.longitude}
                  />
                </div> */}
                    
                
         
              </div>

              <div className="col-span-1 hidden lg:block">
              <div className="shadow-custom my-2 bg-white px-2">
              <ActivityCard
                  title={"Project"}
                  shortlistedCount={property?.shortlistedCount}
                  intrestedCount={property?.intrestedCount}
                  viewCount={property?.unique_view_count}
                />

                <ContactDeveloperSection
                  configration={property?.configuration}
                  propertyVariety={property?.property_variety}
                  propertytype={property?.property_type}
                />
              </div>

                {/* <ReportIssueCard  propertyId={Id?.property_id}/> */}
                <div className="lg:sticky top-36">
                <ReportIssueCard />
                </div>

              </div>


            </div>

            {/* <div className="">
          <DetailComponent
            configration={property?.configuration}
            per_sqft_amount={property?.per_sqft_amount}
            possession_date={property?.possession_date}
          />
        </div> */}



           
            {/* <div className="container lg:hidden">
              <ReraComponent reraNumber={property?.rera_number} />
            </div> */}

            {/* <div className="lg:hidden container" ref={sectionRefs.similar}>
              <SimilarComponent propertyId={property?.id} />
            </div> */}
          </div>

          {/* <div className=" conatiner mx-4 lg:hidden">
            <ContactDeveloperSection
              configration={property?.configuration}
              propertyVariety={property?.property_variety}
              propertytype={property?.property_type} />
          </div> */}
        </div>
      </div>
      {/* <div className="hidden lg:block" ref={sectionRefs.similar}></div> */}
    </>
  );
};

export default BuilderLayout;

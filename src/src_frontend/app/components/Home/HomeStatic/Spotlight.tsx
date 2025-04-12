


'use client';
import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import axios from "@/hooks/index";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { formatPrice } from "../../../Builder/BuilderLayout/overview-mobile";
import useUpdateViewCount from "@/hooks/updatedViews";
import { useAuthStore } from "@/Store/jwtTokenStore";
import useDialogStore from "@/Store/useDialogStore ";
import useGetSpotlightlist from "@/hooks/useGetSpotlightList";
import { IoShieldCheckmark } from "react-icons/io5";
import RERA_ico from '@/public/assets/icon/rera-ico.svg'
import User_ico from '@/public/assets/icon/user-ico.svg'
import Biceps_ico from '@/public/assets/icon/biceps-ico.svg'
import ShareShortlist from "../../common/ShareShortlist";
import { formatNumber } from "@/utils/priceFormatter";

const Spotlight = () => {

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const selectedCityName = searchParams.get("city_name") || "";
  const searchKeyword = searchParams.get("searchKeyword") || "";
  const params = useParams();
  const router = useRouter();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/front/spotlight`, {
        params: {
          categories: 'SPOTLIGHT'
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "A8SQFT7767", // Replace with your actual API key
        },
      });

      const propertiesData = response.data.data || [];


      setProperties(propertiesData);
    } catch (err) {
      setError("Failed to fetch properties. Please try again later.");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [selectedCityName, searchKeyword]); // Rerun the fetch when the city or search keyword changes




  // Navigate to property details page

  // const moveToDetailsHandler = (id: number) => {
  //   router.push(`/Builder/${id}`);

  // }

  const moveToDetailsHandler = async (id: string) => {


    router.push(`/Builder/${id}`);
  };





  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>

      <ReusableCarousel className="w-full">
        {properties
          .filter((property: any) => property.property_rent_buy === "PROJECT") // Filter to show only 
          .map((property: any) => {
            const features = [
              {
                icon: "/assets/icon/Calender.svg",
                label: `${property.possession_date ? property.possession_date : '-'}`,
                alt: "Possession Date",
                subLabel: "Possession Date",
              },
              {
                icon: "/assets/icon/Size.svg",
                // label:new Date(property.publish_date).toLocaleDateString("en-IN") || "Available From",
                label: property.carpet_area_range ? property.carpet_area_range : '-',
                alt: "Size",
                subLabel: "Size",
              },
              {
                icon: "/assets/icon/Parking.svg",
                label: property.parking,
                alt: "Parking",
                subLabel: "Parking",
              },
              ...(property.config_dimenssion
                ? [
                  {
                    icon: "/assets/icon/Dimension.svg",
                    label: property.config_dimenssion
                      ? `${property.config_dimenssion}`
                      : "35x26",
                    alt: "Dimension (LxW)",
                    subLabel: "Dimension (LxW)",
                  },
                ]
                : [
                  {
                    icon:property?.property_current_status==="Under Construction" ? "/assets/icon/UnderConstructed.svg": property?.property_current_status==="New Launch"?  "/assets/icon/NewlyLaunch.svg" :  "/assets/icon/Readytomove.svg",
                    label: property.property_current_status
                      ? `${property.property_current_status}`
                      : "-",
                    alt: "Status",
                    subLabel: "Status",
                  },
                ]),
            ];

            const details = [
              {
                label: property.config_carpet_price ? ` ${formatPrice(property.config_carpet_price)}` : "N/A",
                subLabel: "Price (Negotiable)",
              },
              { label: `${formatPrice(property.per_sqft_amount) || 0}`, subLabel: "per sq ft" },
              // { label: `${property.project_area || "-"} ${property.project_area_unit} `, subLabel: "Project area" },
              {
                label: property.property_type === "RESIDENTIAL" ? [property.other_unit_types, property.bhk_types, property.property_variety]
                  .filter(Boolean) // This removes null, undefined, and empty strings
                  .join(", ") :
                  property.property_type === "COMMERCIAL" ? property.property_variety :
                    `${property.project_area || "-"} ${property.project_area_unit}`,
                subLabel: property.property_type === "RESIDENTIAL" ? property.property_variety + " Type" : property.property_type === "COMMERCIAL" ? property.property_variety + " Type" : "Project Area"
              },
            ];

            return (
              <div
                key={property.id}
                onClick={() => moveToDetailsHandler(property.title_slug)}
                className="lg:border cursor-pointer border-gray-300 rounded-lg bg-white shadow-custom my-2 lg:shadow-md  p-2 space-y-4 w-[375px] lg:w-auto relative"
              >
                <div className="bg-[#ececec]  lg:p-2 p-1 flex justify-between items-center">
                  <div>
                    <h2 className="lg:text-base me-2 text-sm font-semibold text-gray-800 ">
                      {property.property_title && property.property_title.length > 50 ? `${property.property_title.slice(0, 50)} ...` : property.property_title || "Property Title"}
                    </h2>
                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                      <Image
                        src="/assets/property-list-asset/g2509.svg"
                        alt="Location"
                        width={14}
                        height={14}
                      />
                      <span className="ml-2">{property.locality || "Locality"}</span>
                    </div>
                  </div>

                  <div className="text-white font-medium lg:px-2 py-1 px-1 rounded bg-[#FC6600] text-center">
                    <div className="flex flex-row gap-2">
                      <div>
                        <Image
                          className="min-w-4 w-4"
                          src="/assets/Home_page/Profile.svg"
                          alt="Location"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="lg:text-base text-xs">
                        {formatNumber(property.unique_view_count) || 0}
                      </div>
                    </div>
                    <span className="lg:text-xs text-[10px] text-start lg:block text-white hidden">Views</span>
                  </div>
                </div>

                <div className="flex lg:gap-6 justify-around sm:flex-wrap sm:gap-2 lg:w-full border py-2">
                  {details.map((detail, index) => (
                    <div key={index} className="flex gap-2 lg:gap-10 ">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-sm font-medium lg:text-md text-black">
                          {detail.label}
                        </span>
                        <span className="text-xs text-gray-300 ">
                          {detail.subLabel}
                        </span>
                      </div>
                      {index < details.length - 1 && (
                        <div className="w-[1px] h-full bg-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="w-full h-[1px] bg-gray-300 hidden lg:block"></div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="relative w-full lg:w-[270px]">
                    <div className=" w-full flex items-center justify-center ">
                      <label className="text-[8px] top-2 flex absolute bg-[#FFFFFFC2] rounded-lg p-1 gap-1 leading-none">
                        <span className="flex items-center"><Image className="mr-1" src={RERA_ico} width={8} height={8} alt="icon" />RERA</span>
                        | <span className="flex items-center"><Image className="mr-1" src={User_ico} width={8} height={8} alt="icon" />Exclusive</span>
                        {/* |<span className="flex items-center"><Image className="mr-1" src={Biceps_ico} width={8} height={8} alt="icon"/>Assure</span>  */}
                      </label>
                    </div>
                    <img
                      src={property.property_img_url || "https://via.placeholder.com/300x200"}
                      alt="Property"
                      className="w-full object-cover rounded-md h-44"
                    />
                  </div>

                  <div className="flex flex-col justify-between w-full">
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-1 lg:gap-4 border border-gray-300 rounded-lg">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-100 px-2 py-1"
                        >
                          <img src={feature.icon} alt={feature.alt} className="w-7 lg:w-8"/>
                          <div className="flex flex-col text-left">
                            <span className="text-xs lg:text-sm text-gray-70 font-medium capitalize">{feature.label} </span>
                            <span className="text-xs text-gray-700">{feature.subLabel} </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-4 relative">
                      <button className="bg-[#FC6600] text-white px-4 py-2 rounded-md text-sm font-medium">
                        View Details 
                      </button>
                      <ShareShortlist
                        background={"bg-white"}
                        shadow={"shadow-lg"}
                        rounded={"rounded-lg"}
                        fontSize={"text-xs"}
                        textTransform={"uppercase"}
                        fontWeight={"font-light"}
                        hoverBackground={"hover:bg-primary"}
                        hoverTextColor={"hover:text-white"}
                        iconColor={"text-primary"}
                        iconHoverColor={"group-hover:text-white"}
                        propertyId={property?.id}
                        propertyIdSlug={property?.title_slug}
                        btnSaveText={"Save"}
                        showBtnText={false}
                        tooltip={"absolute  -top-8 -translate-x-1/2 left-1/2"}
                        tooltipArrow={"-bottom-8 rotate-180 absolute left-[50%] transform -translate-x-1/2 -translate-y-full border-8 border-transparent border-b-black"}
                      />

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </ReusableCarousel>
      {/* {isVisible && (
        <div className="  " onClick={(e) => e.stopPropagation()}>
          {isVisible && (

            <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 flex flex-col justify-center items-center z-50">
              <div className="bg-black  w-full max-w-sm p-6 rounded-lg shadow-lg">

                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-white">Share</p>
                  <button
                    className="text-white px-4 py-2 rounded-md"
                    onClick={() => setIsVisible(false)}
                  >
                    x
                  </button>
                </div>
                <div className=" p-5   rounded-md shadow-md max-w-sm w-full flex justify-between">

                  <div className=" sharethis-inline-share-buttons gap-1" style={{ marginLeft: "8px", gap: "6px" }}></div>

                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2  rounded-full  border-[1px] border-gray" >
                    <input
                      type="text"
                      value={currentPath}
                      readOnly
                      className="p-2 w-full  rounded-md  "
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentPath);
                        alert("Link copied to clipboard!");
                      }}
                      className="bg-blue text-white px-4 py-2 rounded-full  border-white"
                    >
                      Copy
                    </button>
                  </div>
                </div>

              </div>
            </div >

          )}
        </div >
      )} */}
    </>

  );
};

export default Spotlight;



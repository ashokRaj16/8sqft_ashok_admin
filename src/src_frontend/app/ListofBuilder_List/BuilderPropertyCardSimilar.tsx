"use client";

import useBuilderPropertylist from "@/hooks/useBuilderPropertyList";
import usePropertylist from "@/hooks/usepropertylist";
import useActiveTabStore from "@/Store/activeTab";
import useFilterStore from "@/Store/useFilterStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { useMediaQuery } from "usehooks-ts";
import { formatPrice } from "../Builder/BuilderLayout/overview-mobile";
import SimilarComponent from "../Builder/BuilderLayout/Similaromponnent";
import ShareShortlist from "../components/common/ShareShortlist";
import { BsEye } from "react-icons/bs";
import { formatNumber } from "@/utils/priceFormatter";
import RERA_ico from "@/public/assets/icon/rera-ico.svg";
import User_ico from "@/public/assets/icon/user-ico.svg";
declare global {
  interface Window {
    __sharethis__?: { initialize: () => void };
  }
}
// Card Component (For Mobile)
const Card = ({ property }: any) => {
  console.log(property, "propertyproperty2");
  const details = [
    {
      label: `${formatPrice(Number(property.config_carpet_price))} Starting`,
      subLabel: "Price",
    },
    {
      label: `${property.possession_date || "N/A"}`,
      subLabel: "Possession Starts",
    },
    {
      label: property.config_dimenssion
        ? `${property.config_dimenssion}`
        : "N/A",
      alt: "Dimension (LxW)",
      subLabel: " Dimension (LxW) ",
    },
  ];

  return (
    <div className="container w-full h-full mx-auto my-5">
      <div className=" max-w-[408px] max-h-[432px] bg-white rounded-2xl shadow-md flex flex-col  overflow-hidden">
        {/* Image Section */}
        <div className="w-full h-[303px] p-5 flex justify-center items-center overflow-hidden relative">
          <img
            src={
              property.property_img_url || "https://via.placeholder.com/300x200"
            }
            alt="Property"
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <div className="flex items-center gap-1 absolute bg-primary p-1 rounded-md top-7 right-7">
            <BsEye className="text-white" />
            <label className=" text-white text-[10px]">
              {property?.unique_view_count}{" "}
            </label>
          </div>
        </div>

        {/* Title Section */}
        <div className="w-full h-[35px] px-5 py-1 border-b border-gray-300 flex items-center">
          <h3 className="text-md font-medium text-gray-800 my-3 line-clamp-1">
            {property.property_title || "Property Title"}
          </h3>
        </div>

        {/* Details Section */}
        <div className="w-full flex justify-evenly py-2">
          {details.map((detail, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-xs text-black font-medium">
                {detail.label}
              </span>
              <span className="text-[10px] text-gray-500">
                {detail.subLabel}
              </span>
            </div>
          ))}
        </div>

        {/* Action Section */}
        <div className="w-full flex justify-between items-center px-5 py-3">
          <Link href={`/Builder/${property?.title_slug}`}>
            <button className="bg-[#FC6600] text-white px-4 py-2 rounded-lg">
              View Details
            </button>
          </Link>
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
            tooltipArrow={
              "-bottom-8 rotate-180 absolute left-[50%] transform -translate-x-1/2 -translate-y-full border-8 border-transparent border-b-black"
            }
          />
        </div>
      </div>
    </div>
  );
};

// PropertyCard Component
function BuilderPropertyCardSimilar() {
  const filters = useFilterStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCityName = searchParams.get("city_name") || "";
  const selectedlocality = searchParams.get("searchKeyword") || "";
  const sortOrder = searchParams.get("sortOrder") || filters?.sortOrder;
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const propertyRentBuy = useActiveTabStore((state) => state.property_rent_buy);
  // const updateURLWithFilters = () => {
  //   // Construct a new query object, starting with existing searchParams
  //   const query: Record<string, string> = {};

  //   searchParams.forEach((value, key) => {
  //     query[key] = value; // Include existing query params
  //   });

  //   // Add or update new filters
  //   if (filters.city_name) query.city_name = filters.city_name;
  //   if (filters.locality) query.locality = filters.locality;
  //   if (filters.amount_range) query.amount_range = filters.amount_range;
  //   if (filters.property_variety_type)
  //     query.property_variety_type = filters.property_variety_type;
  //   if (filters.availability_date)
  //     query.availability_date = filters.availability_date;
  //   if (filters.property_variety)
  //     query.property_variety = filters.property_variety;

  //   // Convert query object to query string
  //   const queryString = new URLSearchParams(query).toString();

  //   // Update the URL without reloading the page
  //   router.replace(`/ListofProperty_List?${queryString}`);
  // };
  // console.log(filters, "filters");
  const { data, isLoading, error } = useBuilderPropertylist({
    city_name: selectedCityName,
    // property_variety: filters?.property_variety,
    // // property_rent_buy: "PROJECT",
    property_rent_buy: filters?.property_rent_buy,
    // property_type: filters?.property_type,
    // sortOrder,
    // price_range: filters?.price_range,
    // project_area: filters?.project_area,
    // property_current_status: filters?.property_current_status,
    // furnishing: filters?.furnishing,
    // parking: filters?.parking,
    // width_facing_road: filters?.width_facing_road,
    // other_amenities: filters?.other_amenities,
    // is_rera_number: filters?.is_rera_number,
    // property_variety_type: filters?.property_variety_type,
  });

  const properties = data?.data?.property || [];

  properties.forEach((property) => {
    const configurations = property.configuration || []; // Ensure `configration` is defined
    const carpetAreas = configurations.map(
      (item: any) => item.carpet_area || 0
    );

    const minCarpetArea = carpetAreas.length ? Math.min(...carpetAreas) : "N/A";
    const maxCarpetArea = carpetAreas.length ? Math.max(...carpetAreas) : "N/A";
  });

  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search);

    if (filters.property_variety) {
      newParams.set("property_variety", filters.property_variety);
    } else {
      newParams.delete("property_variety");
    }

    if (filters.sortOrder) {
      newParams.set("sortOrder", filters.sortOrder);
    } else {
      newParams.delete("sortOrder");
    }
    if (filters.price_range) {
      newParams.set("price_range", filters.price_range);
    } else {
      newParams.delete("price_range");
    }
    if (filters.project_area) {
      newParams.set("project_area", filters.project_area);
    } else {
      newParams.delete("project_area");
    }
    if (filters.property_current_status) {
      newParams.set("property_current_status", filters.property_current_status);
    } else {
      newParams.delete("property_current_status");
    }
    if (filters.furnishing) {
      newParams.set("furnishing", filters.furnishing);
    } else {
      newParams.delete("furnishing");
    }
    if (filters.parking) {
      newParams.set("parking", filters.parking);
    } else {
      newParams.delete("parking");
    }
    if (filters.width_facing_road) {
      newParams.set("width_facing_road", filters.width_facing_road);
    } else {
      newParams.delete("width_facing_road");
    }
    if (filters.other_amenities) {
      newParams.set("other_amenities", filters.other_amenities);
    } else {
      newParams.delete("other_amenities");
    }
    if (filters.property_rent_buy) {
      newParams.set("property_rent_buy", filters.property_rent_buy);
    } else {
      newParams.delete("property_rent_buy");
    }
    if (filters.property_type) {
      newParams.set("property_type", filters.property_type);
    } else {
      newParams.delete("property_type");
    }
    if (filters.is_rera_number) {
      newParams.set("is_rera_number", filters.is_rera_number);
    } else {
      newParams.delete("is_rera_number");
    }
    if (filters.property_variety_type) {
      newParams.set("property_variety_type", filters.property_variety_type);
    } else {
      newParams.delete("property_variety_type");
    }
    if (filters.property_config_type) {
      newParams.set("property_config_type", filters.property_config_type);
    } else {
      newParams.delete("property_config_type");
    }

    router.push(`?${newParams.toString()}`, { scroll: false }); // Update URL without page reload
  }, [
    filters.property_variety,
    filters.sortOrder,
    filters.price_range,
    filters.project_area,
    filters.property_current_status,
    filters.furnishing,
    filters.width_facing_road,
    filters.parking,
    filters.other_amenities,
    filters.property_rent_buy,
    filters.property_type,
    filters.is_rera_number,
    filters.property_variety_type,
    filters.property_config_type,
  ]);

  if (isLoading) {
    return <div>Loading properties...</div>;
  }

  if (error) {
    return <div>Error fetching properties: {error.message}</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* {isMobile &&
        properties?.map((property: any) => (
          <Card key={property.id} property={property} />
        ))} */}
      <div className="lg:space-y-4 lg:w-full  px-1">
        {properties?.map((property: any) => {
          const features = [
            {
              icon: "/assets/icon/Calender.svg",
              label: `${
                property.possession_date ? property.possession_date : "-"
              }`,
              alt: "Possession Date",
              subLabel: "Possession Date",
            },
            {
              icon: "/assets/icon/Size.svg",
              // label:new Date(property.publish_date).toLocaleDateString("en-IN") || "Available From",
              label: property.carpet_area_range
                ? property.carpet_area_range
                : "-",
              alt: "Size",
              subLabel: "Size",
            },
            ...(property.parking
              ? [
                  {
                    icon: "/assets/icon/Parking.svg",
                    label: property.parking,
                    alt: "Parking",
                    subLabel: "Parking",
                  },
                ]
              : [
                  {
                    icon: "/assets/Builder/facingDirection.svg",
                    label: `${property.width_facing_road} feet` || "25 ft",
                    alt: "Width of facing road",
                    subLabel: "Width of facing road",
                  },
                ]),
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
                    icon:
                      property?.property_current_status === "Under Construction"
                        ? "/assets/icon/UnderConstructed.svg"
                        : property?.property_current_status === "New Launch"
                        ? "/assets/icon/NewlyLaunch.svg"
                        : "/assets/icon/Readytomove.svg",
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
              label: property.config_carpet_price
                ? ` ${formatPrice(property.config_carpet_price)}`
                : "N/A",
              subLabel: "Price (Negotiable)",
            },
            {
              label: `${formatPrice(property.per_sqft_amount) || 0}`,
              subLabel: "per sq ft",
            },
            // { label: `${property.project_area || "-"} ${property.project_area_unit} `, subLabel: "Project area" },
            {
              label:
                property.property_type === "RESIDENTIAL"
                  ? [
                      property.other_unit_types,
                      property.bhk_types,
                      property.property_variety,
                    ]
                      .filter(Boolean) // This removes null, undefined, and empty strings
                      .join(", ")
                  : property.property_type === "COMMERCIAL"
                  ? property.property_variety
                  : `${property.project_area || "-"} ${
                      property.project_area_unit
                    }`,
              subLabel:
                property.property_type === "RESIDENTIAL"
                  ? property.property_variety + " Type"
                  : property.property_type === "COMMERCIAL"
                  ? property.property_variety + " Type"
                  : "Project Area",
            },
          ];

          return (
            <div
              key={property.id}
              onClick={() =>
                window.open(`/Builder/${property?.title_slug}`, "_blank")
              }
              className="lg:border cursor-pointer border-gray-300 rounded-lg bg-white shadow-custom my-2 lg:shadow-md  p-2 space-y-4 w-full lg:w-auto relative"
            >
              <div className="bg-[#ececec]  lg:p-2 p-1 flex justify-between items-center">
                <div>
                  <h2 className="lg:text-base me-2 text-sm font-semibold text-gray-800 ">
                    {property.property_title &&
                    property.property_title.length > 50
                      ? `${property.property_title.slice(0, 50)} ...`
                      : property.property_title || "Property Title"}
                  </h2>
                  <div className="text-sm text-gray-500 mt-1 flex items-center">
                    <Image
                      src="/assets/property-list-asset/g2509.svg"
                      alt="Location"
                      width={14}
                      height={14}
                    />
                    <span className="ml-2">
                      {property.locality || "Locality"}
                    </span>
                  </div>
                </div>

                <div className="text-white font-medium lg:px-2 py-1 px-1 rounded bg-[#FC6600] text-center">
                  <div className="flex flex-row gap-2 items-center">
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
                  <span className="lg:text-xs text-[10px] text-start lg:block text-white hidden">
                    Views
                  </span>
                </div>
              </div>

              <div className="flex lg:gap-6 justify-around sm:flex-wrap sm:gap-2 lg:w-full border py-2">
                {details.map((detail, index) => (
                  <div key={index} className="flex gap-2 lg:gap-10 ">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xs lg:text-sm font-medium lg:text-md text-black">
                        {detail.label}
                      </span>
                      <span className="text-[10px] lg:text-xs text-gray-300 ">
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
                  {property?.rera_number && (
                    <div className=" w-full flex items-center justify-center ">
                      <label className="text-[8px] top-2 flex absolute bg-[#FFFFFFC2] rounded-lg p-1 gap-1 leading-none">
                        <span className="flex items-center">
                          <Image
                            className="mr-1"
                            src={RERA_ico}
                            width={8}
                            height={8}
                            alt="icon"
                          />
                          RERA
                        </span>
                        {/* | <span className="flex items-center"><Image className="mr-1" src={User_ico} width={8} height={8} alt="icon" />Exclusive</span> */}
                        {/* |<span className="flex items-center"><Image className="mr-1" src={Biceps_ico} width={8} height={8} alt="icon"/>Assure</span>  */}
                      </label>
                    </div>
                  )}
                  <img
                    src={
                      property.property_img_url ||
                      "https://via.placeholder.com/300x200"
                    }
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
                        <img
                          src={feature.icon}
                          alt={feature.alt}
                          className="w-6 lg:w-8"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-xs lg:text-sm text-gray-70 font-medium capitalize">
                            {feature.label}{" "}
                          </span>
                          <span className="text-[10px] lg:text-xs text-[#22222280]">
                            {feature.subLabel}{" "}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 relative">
                    <Link
                      href={`/Builder/${property?.title_slug}`}
                      target="_blank"
                    >
                      <button className="bg-[#FC6600] text-white px-4 py-2 rounded-md text-sm font-medium">
                        View Details
                      </button>
                    </Link>
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
                      tooltipArrow={
                        "-bottom-8 rotate-180 absolute left-[50%] transform -translate-x-1/2 -translate-y-full border-8 border-transparent border-b-black"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Suspense>
  );
}

export default BuilderPropertyCardSimilar;

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
declare global {
  interface Window {
    __sharethis__?: { initialize: () => void };
  }
}
// Card Component (For Mobile)
const Card = ({ property }: any) => {
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
      label: `${property.config_dimenssion}` || "35x26",
      alt: "Dimension (LxW)",
      subLabel: " Dimension (LxW)",
    },
  ];

  return (
    <div className="container w-full h-full mx-auto my-5">
      <div className=" max-w-[408px] max-h-[432px] bg-white rounded-2xl shadow-md flex flex-col  overflow-hidden">
        {/* Image Section */}
        <div className="w-full h-[303px] p-5 flex justify-center items-center overflow-hidden">
          <img
            src={
              property.property_img_url || "https://via.placeholder.com/300x200"
            }
            alt="Property"
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </div>

        {/* Title Section */}
        <div className="w-full h-[35px] px-5 py-1 border-b border-gray-300 flex items-center">
          <h3 className="text-md font-medium text-gray-800 my-3">
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
          <Link href={`/Builder/${property.id}`}>
            <button className="bg-[#FC6600] text-white px-4 py-2 rounded-lg">
              View Details
            </button>
          </Link>
          <div className="flex items-center space-x-3">
            <button className="text-gray-300 hover:text-red border rounded-md p-2 border-gray-300">
              <FaHeart size={20} />
            </button>
            <button className="text-gray-300 hover:text-blue border rounded-md p-2 border-gray-300">
              <FaShareAlt size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropertyCard Component
function BuilderPropertyCardSimilar() {
  const searchParams = useSearchParams();
  const selectedCityName = searchParams.get("city_name") || "this location";
  const selectedlocality = searchParams.get("searchKeyword") || "this location";
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const filters = useFilterStore();

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
  const { data, isLoading, error } = useBuilderPropertylist({
    city_name: selectedCityName,
    property_variety: filters.property_variety,
    property_rent_buy: "PROJECT",
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
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (isVisible) {
      // Ensure script is loaded
      const scriptId = "sharethis-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src =
          "https://platform-api.sharethis.com/js/sharethis.js#property=679778caeec4bb0012d85a05&product=inline-share-buttons";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          if (window.__sharethis__) {
            window.__sharethis__.initialize();
          }
        };
      } else {
        // Reinitialize ShareThis buttons on every open
        setTimeout(() => {
          if (window.__sharethis__) {
            window.__sharethis__.initialize();
          }
        }, 500);
      }
    }
  }, [isVisible]);
  if (isLoading) {
    return <div>Loading properties...</div>;
  }

  if (error) {
    return <div>Error fetching properties: {error.message}</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isMobile &&
        properties?.map((property: any) => (
          <Card key={property.id} property={property} />
        ))}
      <div className="lg:space-y-4 lg:w-full lg:max-w-[719px]">
        {properties?.map((property: any) => {
          const features = [
            {
              icon: "/assets/Builder/facingDirection.svg",
              label: property.width_facing_road || "25 ft",
              alt: "Width of facing road",
              subLabel: "Width of facing road",
            },
            {
              icon: "/assets/Builder/Posted.svg",
              label:
              property.publish_date?  new Date(property.publish_date).toLocaleDateString("en-IN") : "Na",
              alt: "Posted On Icon",
              subLabel: "Posted On",
            },
            {
              icon: "/assets/Builder/BoundaryWall.svg",
              label: property.preferred_tenent || "Yes",
              alt: "Boundary Wall Icon",
              subLabel: "Boundary Wall",
            },
            {
              icon: "/assets/Builder/Sqft_meter_Sqft_foot.svg",
              label: `${property.config_dimenssion}` || "35x26",
              alt: "Dimension (LxW)",
              subLabel: " Dimension (LxW)",
            },
          ];

          const details = [
            {
              label: `${formatPrice(
                Number(property.config_carpet_price)
              )} Starting`,
              subLabel: "Price",
            },
            {
              label: `₹${property.possession_date || "N/A"}`,
              subLabel: "Possession Starts",
            },
            {
              label: `${
                Number(property.per_sqft_amount)
                  ? `${Number(
                      property.per_sqft_amount
                    ).toLocaleString()} /sq.ft`
                  : "N/A"
              }`,
              subLabel: "Avg. Price",
            },
          ];

          return (
            <div
              key={property.id}
              className="hidden lg:block border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm p-1 space-y-4"
            >
              {/* Heading */}
              <div className="hidden bg-[#ebebeb] p-3 lg:p-5 lg:flex justify-between">
                <div>
                  <h2 className="text-sm lg:text-lg font-bold text-ellipsis w-[30vw]  overflow-hidden whitespace-nowrap">
                    {property.property_title || "Property Title"}
                  </h2>
                  <div className="text-[12px] text-gray-600 my-1 flex">
                    <Image
                      src="/assets/property-list-asset/g2509.svg"
                      alt="Location"
                      width={15}
                      height={15}
                    />
                    <span className="ml-1">
                      {property.locality || "Locality"}
                    </span>
                  </div>
                </div>
                <div className="text-white font-medium px-5 py-3 rounded-sm bg-[#FC6600] w-md h-fit">
                  10+
                  <span className="text-[10px] text-white w-full m-0">
                    Views
                  </span>
                </div>
              </div>

              {/* Pricing and Features */}
              <div className="hidden lg:flex gap-2 lg:gap-4 w-full justify-evenly">
                {details.map((detail, index) => (
                  <div key={index} className="flex gap-5 lg:gap-10 ">
                    <div className="flex flex-col items-center">
                      <span className="text-sm lg:text-md text-black">
                        {detail.label}
                      </span>
                      <span className="text-xs lg:text-sm text-gray-300 ml-2">
                        {detail.subLabel}
                      </span>
                    </div>
                    {index < details.length - 1 && (
                      <div className="w-[1px] h-full bg-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="hidden lg:block w-full h-[1px] bg-gray-300"></div>

              <div className="flex flex-col lg:flex-row gap-4 max-h-28 lg:max-h-48 w-full">
                <img
                  src={
                    property.property_img_url ||
                    "https://via.placeholder.com/300x200"
                  }
                  alt="Property"
                  className="w-full rounded-lg lg:object-cover lg:max-w-[40%]  "
                />
                <p className="lg:hidden text-sm text-black lg:text-lg font-bold text-ellipsis w-[30vw] lg:w-[80vw] overflow-hidden whitespace-nowrap">
                  {property.property_title || "Property Title"}
                </p>
                <div className=" lg:hidden gap-2 lg:gap-4 w-full justify-evenly overflow-x-auto">
                  {details.map((detail, index) => (
                    <div key={index} className="flex gap-5 lg:gap-10 ">
                      <div className="flex flex-col items-center">
                        <span className="text-sm lg:text-md text-black">
                          {detail.label}
                        </span>
                        <span className="text-xs lg:text-sm text-gray-300 ml-2">
                          {detail.subLabel}
                        </span>
                      </div>
                      {index < details.length - 1 && (
                        <div className="w-[1px] h-full bg-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-4 relative w-full ">
                  {/* Features */}
                  <div className="hidden lg:grid grid-cols-4 lg:grid-cols-2 gap-2 border border-gray-300 rounded-lg lg:p-2  mb-[3.5rem] ">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="relative flex items-center lg:gap-2 bg-gray-100 text-gray-700 lg:px-3 py-1 rounded-lg"
                      >
                        <img
                          src={feature.icon}
                          alt={feature.alt}
                          className="w-10 h-10"
                        />
                        <div className="flex flex-col items-center">
                          <span className="text-sm text-black font-[500]">
                            {feature.label}
                          </span>
                          <span className="text-[12px] text-black ml-2">
                            {feature.subLabel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Section */}
                  <div className="flex justify-between items-center mt-4 absolute bottom-1 left-0 w-full">
                    <Link href={`/Builder/${property.id}`}>
                      <button className="bg-[#FC6600] text-white px-4 py-2 rounded-lg">
                        View Details
                      </button>
                    </Link>
                    <div className="hidden lg:flex items-center space-x-3 ">
                      <button className="text-gray-300 hover:text-red border rounded-md p-1 border-[#D1D5DB]">
                        <FaHeart size={20} />
                      </button>
                      <button
                        className="text-gray hover:text-blue border rounded-md p-1 border-[#D1D5DB]"
                        onClick={() => {
                          setIsVisible(true);
                        }}
                      >
                        <FaShareAlt size={20} />
                      </button>
                      {isVisible && (
                        <div className="relative  ">
                          {isVisible && (
                            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
                              <div className="bg-white p-5 border border-gray-300 rounded-md shadow-md max-w-sm w-full">
                                <div className=" sharethis-inline-share-buttons"></div>
                                <div className="w-full ">
                                  <button
                                    className="bg-primary text-white px-4 py-2 rounded-md my-3 self-center w-full"
                                    onClick={() => setIsVisible(false)} // Close the dialog
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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

"use client";

import useUpdateViewCount from "@/hooks/updatedViews";
import usePropertylist from "@/hooks/usepropertylist";
import useFilterStore from "@/Store/useFilterStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { useMediaQuery } from "usehooks-ts";

// Card Component (For Mobile)
const Card = ({ property }: any) => {
  const details = [
    {
      label: `₹${property?.rent_amount || "N/A"}`,
      subLabel:
        property?.rent_is_nogotiable === "1"
          ? "Rent (Non-Negotiable)"
          : "Rent (Negotiable)",
    },
    {
      label: `₹${property?.deposite_amount || "N/A"}`,
      subLabel:
        property?.deposite_is_negotiable === "1"
          ? "Deposit (Non-Negotiable)"
          : "Deposit (Negotiable)",
    },
    {
      label: `${property?.builtup_area || "N/A"} ${property?.builtup_area_unit || ""
        }`,
      subLabel: "Builtup Area",
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
              <span className="text-sm text-black font-medium">
                {detail.label}
              </span>
              <span className="text-xs text-gray-500">{detail.subLabel}</span>
            </div>
          ))}
        </div>

        {/* Action Section */}
        <div className="w-full flex justify-between items-center px-5 py-3">
          <Link href={`/PropertyDetailsPage/${property.id}`}>
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

;

// PropertyCard Component
function PropertyCard() {

  const searchParams = useSearchParams();
  const selectedCityName = searchParams.get("city_name") || "";
  const selectedlocality = searchParams.get("searchKeyword") || "";
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const filters = useFilterStore();

  const router = useRouter(); 
  // const { mutate: updateViewCount } = useUpdateViewCount();

  const moveToDetailsHandler = async (id: number) => {
    // updateViewCount(id, {
    //   onSuccess: () => {
    //     console.log(`View count updated for property ID: ${id}`);
    //   },
    //   onError: (err) => {
    //     console.error(`Error updating view count for property ID ${id}:`, err.message);
    //   },
    // });


  }
  const { data, isLoading, error } = usePropertylist({
    city_name: selectedCityName,
    locality: selectedlocality,
    sortOrder: filters.sortOrder,
    furnishing: filters.furnishing,
    amount_range: filters.amount_range,
    property_variety_type: filters.property_variety_type,
    availability_date: filters.availability_date,
    parking: filters.parking,
    property_variety: filters.property_variety,
    property_rent_buy: "RENT",
  });


  const properties = data?.data.property || [];

  if (isLoading) {
    return <div>Loading properties...</div>;
  }

  if (error) {
    return <div>Error fetching properties: {error.message}</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        <p className="text-lg font-semibold">
          Oops! We couldn’t find any properties listing in{" "}
          <span className="text-primary"> {selectedlocality}</span>, right now.
        </p>
        <p className="text-sm mt-2">
          Please try adjusting your search filters or check back later.
        </p>
      </div>
    );
  }



  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isMobile &&
        properties.map((property: any) => (
          <Card key={property.id} property={property} />
        ))}
      <div className="lg:space-y-4 lg:w-full lg:max-w-[719px]">
        {properties.map((property: any) => {
          const features = [
            {
              icon: "/assets/property-list-asset/Furnished_Icon.svg",
              label: property.furnishing_status || "Furnishing Status",
              alt: "Furnishing Status Icon",
              subLabel: "Furnishing",
            },
            {
              icon: "/assets/property-list-asset/Apartment.svg",
              label: property.property_variety_type || "Property Type",
              alt: "Property Type Icon",
              subLabel: "Property Type",
            },
            {
              icon: "/assets/property-list-asset/user.svg",
              label: property.preferred_tenent || "Preferred Tenant",
              alt: "Preferred Tenant Icon",
              subLabel: "Preferred Tenants",
            },
            {
              icon: "/assets/property-list-asset/Available-From.svg",
              label:
                new Date(property.availability_date).toLocaleDateString(
                  "en-IN"
                ) || "Available From",
              alt: "Available From Icon",
              subLabel: "Available From",
            },
          ];

          const details = [
            {
              label: `₹${property?.rent_amount || "N/A"}`,
              subLabel:
                property?.rent_is_nogotiable === "1"
                  ? "Rent (Non-Negotiable)"
                  : "Rent (Negotiable)",
            },
            {
              label: `₹${property?.deposite_amount || "N/A"}`,
              subLabel:
                property?.deposite_is_negotiable === "1"
                  ? "Deposit (Non-Negotiable)"
                  : "Deposit (Negotiable)",
            },
            {
              label: `${property?.builtup_area || "N/A"} ${property?.builtup_area_unit || ""
                }`,
              subLabel: `Builtup`,
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
                  <h2 className="text-sm lg:text-lg font-bold text-ellipsis w-[30vw] lg:w-[80vw] overflow-hidden whitespace-nowrap">
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
                <div className="text-white font-medium px-5 py-3 rounded-sm bg-[#FC6600] w-full h-fit">
                  10+
                  <span className="text-[10px] text-white w-full m-0">
                    Unique Views
                  </span>
                </div>
              </div>

              {/* Pricing and Features */}
              <div className="hidden lg:flex gap-2 lg:gap-4 w-full justify-evenly overflow-x-auto">
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
                  <div className="hidden lg:grid grid-cols-4 lg:grid-cols-2 gap-2 border border-gray-300 rounded-lg lg:p-2 overflow-x-auto mb-[3.5rem] ">
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
                    <Link href={`/PropertyDetailsPage/${property.id}`}>
                      <button onClick={() => moveToDetailsHandler(property.id)} className="bg-[#FC6600] text-white px-4 py-2 rounded-lg">
                        View Details
                      </button>
                    </Link>
                    <div className="hidden lg:flex items-center space-x-3 ">
                      <button className="text-gray-300 hover:text-red border rounded-md p-1 border-[#D1D5DB]">
                        <FaHeart size={20} />
                      </button>
                      <button className="text-gray-300 hover:text-blue border rounded-md p-1 border-[#D1D5DB]">
                        <FaShareAlt size={20} />
                      </button>
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

export default PropertyCard;

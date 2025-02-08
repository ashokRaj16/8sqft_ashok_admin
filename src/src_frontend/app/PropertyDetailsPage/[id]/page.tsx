"use client";

import React from "react";
import ImageGrid from "../ImageGrid";
import ContactSection from "../ContactSection";
import ReportIssueCard from "../ReportIssueCard";
import DetailsSection from "../DetailsSection";
import PropertyDetailsLayout from "../PropertyDetailsLayout/page";
import { useParams } from "next/navigation";
import usePropertyDetail from "@/hooks/usePropertygetDetail";
import PropertyLocation from "../PropertyLocation";

// interface Detail {
//   [key: string]: string | number | null; // Allow any string key with value type of string, number or null
// }

interface PropertyImage {
  id: number;
  property_id: number;
  property_img_url: string;
  img_title: string;
  img_type: string;
  img_description: string | null;
  created_at: string;
  updated_at: string;
}

// interface PropertyDetailsProps {
//   details: Detail[];
//   images: Image[];
// }

const PropertyDetailsPage: React.FC = () => {
  const params = useParams(); // Retrieve route parameters
  const propertyId = params?.id ? Number(params.id) : null; // Safely parse id
  // const secretKey = "skey_9834knj43n5kj23n4l5kj23n4l5kj23";
  // const decryptId = async (encryptedId: string) => {
  //   const encodedEncryptedId = new Uint8Array(
  //     atob(encryptedId).split('').map(char => char.charCodeAt(0))
  //   );

  //   const key = await crypto.subtle.importKey(
  //     'raw',
  //     new TextEncoder().encode(secretKey),
  //     { name: 'AES-GCM' },
  //     false,
  //     ['decrypt']
  //   );

  //   const decryptedId = await crypto.subtle.decrypt(
  //     {
  //       name: 'AES-GCM',
  //       iv: new Uint8Array(12), // Use the same IV used for encryption
  //     },
  //     key,
  //     encodedEncryptedId
  //   );

  //   return new TextDecoder().decode(decryptedId);
  // };
  // const decryptedPropertyId =  decryptId(propertyId!.toString());
  const { data, isLoading, error } = usePropertyDetail(Number(propertyId));

  if (!propertyId) {
    return <p className="text-red-500">Error: Invalid Property ID</p>;
  }

  // ✅ Handle loading and error states
  if (isLoading) return <p>Loading property details...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  // ✅ Extract property data
  const property = data?.data;

  const images =
    property?.images?.map((img) => ({
      url: img.property_img_url,
    })) || [];
  const isoDate = `${property?.availability_date}`;
  const formattedDate = isoDate.split("T")[0];

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
      label: `${property?.builtup_area || "N/A"} ${
        property?.builtup_area_unit || ""
      }`,
      subLabel: `Builtup`,
    },
  ];

  return (
    <div className="flex flex-col p-10 w-full max-w-7xl mx-auto">
      <div className="flex flex-col  gap-6 p-4 bg-white rounded-lg shadow-md w-full">
        {/* Top Rent Section */}
        <div className="flex lg:flex-row p-2 lg:gap-4 items-center border border-gray rounded-lg lg:p-4 justify-between">
          <div className="hidden lg:flex flex-col lg:items-center gap-2">
            <img
              src="/assets/property-list-asset/property-detail-asset/Rent_Icon.svg"
              alt="Top Rent Icon"
              className="w-6 h-6"
            />
            <h2 className="text-sm font-normal">Rent</h2>
          </div>
          <div className="w-[1px] h-full bg-black"></div>
          <div className="flex flex-col text-left">
            <h3 className="text-smlg:text-lg font-medium text-ellipsis overflow-hidden max-w-28 whitespace-nowrap lg:max-w-full">
              {property?.property_title || "Property Title"}
            </h3>
            <p className="text-[10px] text-gray-500 text-ellipsis overflow-hidden w-[30vw] whitespace-nowrap">
              {`${property?.city_name || ""} ${property?.landmark || ""} ${
                property?.locality || ""
              }`}
            </p>
          </div>
          <div className="w-[1px] h-full bg-black"></div>
          <div className="hidden lg:flex gap-4 justify-evenly">
            {details.map((detail, index) => (
              <div key={index} className="flex">
                <div className="flex flex-col items-center">
                  <span className="text-md text-black">{detail.label}</span>
                  <span className="text-[12px] text-gray-300 ml-2">
                    {detail.subLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="w-[1px] h-full bg-black"></div>
          <div className="flex justify-center">
            
          </div>
        </div>
        {/* Apply Loan Button */}

        {/* Breadcrumb */}
        <div className="hidden lg:flex text-sm text-gray">
          Home &gt; Listings &gt; Details
        </div>
        <div className="flex flex-col lg:flex-row gap-4 w-full justify-between lg:px-10 ">
          <div className="lg:w-[60%] h-full ">
            <ImageGrid images={images} />
          </div>
          {/* Contact and Message Section */}

          <div>
            <DetailsSection
              preferred_tenent={property?.preferred_tenent}
              builtup_area={property?.builtup_area}
              availability_date={formattedDate}
              balcony={property?.balcony}
              bed_rooms={property?.bed_rooms}
              parking={property?.parking}
              property_age={property?.property_age}
              property_variety={property?.property_variety}
            />
            <ContactSection />
            <ReportIssueCard />
          </div>
        </div>
        <div className="text-sm text-gray-600 mt-4">
          {/* <strong>Nearby:</strong> IndusInd Bank, Hinjewadi Phase 1, Lemon Tree
          Hotel, Hinjawadi, Pune, Aditya Birla Memorial Hospital, SPOT18, Lemon
          Tree Hotel, Hinjawadi, Pune. */}
        </div>
      </div>
      <div className="my-5">
        <PropertyDetailsLayout />
      </div>
      <PropertyLocation lat={property?.latitude} lng={property?.longitude} />
    </div>
  );
};

export default PropertyDetailsPage;

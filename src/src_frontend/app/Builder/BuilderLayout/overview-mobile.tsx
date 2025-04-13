"use client";
import { Card, CardContent } from "@/ui/card";
import { formatDate } from "@/utils/formatDate";
import { formatUnitNames } from "@/utils/formatUnitName";
import Image from "next/image";
import React from "react";

interface Overview {
  width_facing_road: string | null | undefined;
  configration: Configuration[] | undefined;
  reraNumber: string | null | undefined;
  property_type: string | null | undefined;
  other_amenities?: string | undefined;
  projectArea?: string | null | undefined;
  projectAreaUnit?: string | null | undefined;
  publishDate?: string | null | undefined;
  totalTowers?: number | null | undefined;
  totalUnits?: number | null | undefined;
  perSqftAmount?: string | null | undefined;
  propertyVariety?: string | null | undefined;
  propertyCurrentStatus?: string | null | undefined;
  floorNumber?: number | null | undefined;
}

interface Configuration {
  id: number;
  carpet_area?: number;
  carpet_price?: number;
  unit_img_url: string;
  unit_name: string;
}

export const formatPrice = (price: number): string => {
  if (price >= 1e7) return `₹ ${(price / 1e7).toFixed(2)} Cr`; // Crores
  if (price >= 1e5) return `₹ ${(price / 1e5).toFixed(2)} Lacs`; // Lakhs
  if (price >= 1e3) return `₹ ${(price / 1e3).toFixed(2)} K`; // Thousands
  return `₹ ${price}`; // Plain number
};

const OverviewComponent = ({
  width_facing_road,
  configration,
  reraNumber,
  property_type,
  other_amenities,
  projectArea,
  projectAreaUnit,
  publishDate,
  totalTowers,
  totalUnits,
  perSqftAmount,
  propertyVariety,
  floorNumber,
  propertyCurrentStatus
}: Overview) => {
  console.log(configration,'configration')
  // Extract min and max carpet area
  const minCarpetArea =
    configration && configration.length > 0
      ? Math.min(...configration.map((c) => c.carpet_area || 0))
      : null;
  const maxCarpetArea =
    configration && configration.length > 0
      ? Math.max(...configration.map((c) => c.carpet_area || 0))
      : null;

  // Extract min and max carpet price
  const minCarpetPrice =
    configration && configration.length > 0
      ? Math.min(...configration.map((c) => c.carpet_price || 0))
      : null;
  const maxCarpetPrice =
    configration && configration.length > 0
      ? Math.max(...configration.map((c) => c.carpet_price || 0))
      : null;


      const unitNamesArray = configration?.map(item => ({'unit_name': item.unit_name}));
      
      const unitNames = formatUnitNames(unitNamesArray);
  // Check if "Boundary Wall" exists in amenities
  const hasBoundaryWall =
    other_amenities && other_amenities.includes("Boundary Wall") ? "Yes" : "No";

    const isSingleCarpetArea = configration
    ? configration.map((item) => item.carpet_area || 0)
    : null;
    const sortedValue = isSingleCarpetArea?.length === 1
    ? `${minCarpetArea} sq ft`
    : isSingleCarpetArea
      ? `${minCarpetArea} - ${maxCarpetArea} sq ft`
      : `${maxCarpetArea} sq ft`;
  const propertyDetails = [
    {
      icon: "/assets/icon/projectArea.svg",
      // value: property_type==="RESIDENTIAL" ? `${totalTowers} Building - ${totalUnits} Units` : `${projectArea} ${projectAreaUnit} `,
      value:`${projectArea} ${projectAreaUnit} ${totalUnits? `, ${totalUnits} Units`  :''} `,
      label: "Project Area",
    },
    {
      icon: "/assets/icon/carpetArea.svg",
       value: sortedValue || "N/A",
      label: "Carpet Area",
    },
    {
      icon: "/assets/icon/mahaRera.svg",
      value: reraNumber || "N/A",
      label: "Rera ID",
    },
    {
      icon: "/assets/icon/avgPrice.svg",
        value: perSqftAmount
                  ? `${formatPrice(Number(perSqftAmount))}/sq ft`
                  : "N/A",
      // value: property_type==="RESIDENTIAL" ?  `${formatPrice(Number(perSqftAmount))}/Sq ft` : minCarpetPrice && maxCarpetPrice ? `${formatPrice(minCarpetPrice)} - ${formatPrice(maxCarpetPrice)}`: "N/A" ,
      label: "Avg Price",
    },
    {
      icon: "/assets/icon/addedOn.svg",
      value: publishDate ? formatDate(publishDate) : "N/A",
      label: "Added On",
    },
    {
      icon: "/assets/icon/propertyType.svg",
      value: property_type==="RESIDENTIAL"? unitNames :  "N/A",
      label: "Property Type",
    },

    {
      icon:"/assets/icon/Readytomove.svg",
      label: "Current Status",
      value: propertyCurrentStatus? propertyCurrentStatus: "N/A",
    },
    {
      icon:property_type?.toLowerCase()==="open land" ? "/assets/Builder/facingDirection.svg" : "/assets/Builder/amenity/Floor.svg" ,
       label: property_type?.toLowerCase()==="open land" ?  "Width Of Facing Road" : "Total Floors",
      value: property_type?.toLowerCase()==="open land" ? `${width_facing_road } feet` || "N/A" : floorNumber || "N/A"},
    {
      icon: "/assets/icon/propertyType.svg",
      label: property_type?.toLowerCase()==="open land" ? "Total Units" : "Total Towers",
      value:property_type?.toLowerCase()==="open land" ? totalUnits : totalTowers || "N/A" 
    },
    {
      icon: "/assets/icon/NewlyLaunch.svg",
       label: "Residential Variety",
        value: propertyVariety || "N/A" 
      },
    
       
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full px-4 mt-3">
      <h2 className="font-medium text-sm text-[#222222] text-start w-full p-2 bg-white">
        Overview
      </h2>
      <div className="flex items-center p-1 bg-white border-b-2 border-[#fc6600] w-full"></div>
      <div className="grid grid-cols-2 gap-px p-px bg-[#d9d9d9] w-full">
        {propertyDetails.map((detail, index) => (
          <Card key={index} className="rounded-none border-none shadow-none">
            <CardContent className="flex items-center p-2 h-[60px] bg-white">
              <div className="flex items-center gap-4">
                <Image
                  src={detail.icon}
                  alt={detail.label}
                  className="w-8 h-8"
                  width={10}
                  height={10}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[#222222] text-[10px] flex flex-wrap ">
                    {detail.value}
                  </span>
                  <span className="font-light text-[#222222] text-[10px]">
                    {detail.label}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OverviewComponent;

"use client";
import { Card, CardContent } from "@/ui/card";
import Image from "next/image";
import React from "react";

interface Overview {
  width_facing_road: string | null | undefined;
  configration: Configuration[] | undefined;
  reraNumber: string | null | undefined;
  property_type: string | null | undefined;
  other_amenities?: string | undefined;
}

interface Configuration {
  id: number;
  carpet_area?: number;
  carpet_price?: number;
  unit_img_url: string;
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
}: Overview) => {
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

  // Check if "Boundary Wall" exists in amenities
  const hasBoundaryWall =
    other_amenities && other_amenities.includes("Boundary Wall") ? "Yes" : "No";

  // Property details
  const propertyDetails = [
    {
      icon: "/assets/BuilderDetail/Widthfacing.svg",
      value: `${width_facing_road}`,
      label: "Width of facing road",
    },
    {
      icon: "/assets/BuilderDetail/Size.svg",
      value:
        minCarpetArea && maxCarpetArea
          ? `${minCarpetArea} - ${maxCarpetArea} sq. ft.`
          : "N/A",
      label: "Size",
    },
    {
      icon: "/assets/BuilderDetail/Boundary.svg",
      value: hasBoundaryWall,
      label: "Boundary Wall",
    },
    {
      icon: "/assets/BuilderDetail/Rupees.svg",
      value:
        minCarpetPrice && maxCarpetPrice
          ? `${formatPrice(minCarpetPrice)} - ${formatPrice(maxCarpetPrice)}`
          : "N/A",
      label: "Avg Price",
    },
    {
      icon: "/assets/BuilderDetail/home.svg",
      value: property_type || "N/A",
      label: "Property Type",
    },
    {
      icon: "/assets/BuilderDetail/Maharera.svg",
      value: reraNumber || "N/A",
      label: "RERA ID",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full px-5 my-3">
      <h2 className="font-medium text-sm text-[#222222] text-start w-full">
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

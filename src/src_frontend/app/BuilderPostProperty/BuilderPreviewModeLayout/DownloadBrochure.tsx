"use client";
import { formatPrice } from "@/app/Builder/BuilderLayout/overview-mobile";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import { formatDate } from "@/utils/formatDate";
import { formatUnitNames } from "@/utils/formatUnitName";
import { Heart, Share2 } from "lucide-react";
import React, { useState } from "react";

interface DownloadBrochure {
  title: string | undefined;
  projectArea: string | null | undefined;
  configration: configuration[] | undefined;
  per_sqft_amount: number | null | undefined;
  property_variety: string | undefined;
  possession_date?: string | null | undefined;
  publish_date: string | null | undefined;
  unit_type?: string | null;
  rera?: string | null | undefined;
  propertyCurrentStatus?: string | null | undefined;
  widthFacingRoad?: string | null | undefined;
  totalUnits?: number | null | undefined;
  floorNumber?: number | null | undefined;
  propertyType?: string | null | undefined;
  totalTowers?: number | null | undefined;
}

interface configuration {
  id: number;
  unit_type?: string | null;
  unit_name?: string | null;
  length?: number;
  width?: number;
  carpet_area?: number;
  carpet_price?: number;
  width_unit?: string;
  length_unit?: string;
  unit_img_url: string;
  file_type?: string;
}
[];

const DownloadBrochure = ({
  title,
  projectArea,
  configration,
  per_sqft_amount,
  property_variety,
  publish_date,
  unit_type,
  rera,
  propertyCurrentStatus,
  widthFacingRoad,
  totalUnits,
  floorNumber,
  propertyType,
  totalTowers,
}: DownloadBrochure) => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  // Safely access configration[0].carpet_price
  const maxCarpetArea = configration
    ? Math.max(...configration.map((item) => item.carpet_area || 0))
    : null;

  const minCarpetArea = configration
    ? Math.min(...configration.map((item) => item.carpet_area || 0))
    : null;
  const unit = configration
    ? configration.map((item) => item.length_unit || 0)
    : null;
  // Property Details
  const isSingleCarpetArea = configration
  ? configration.map((item) => item.carpet_area || 0)
  : null;

  const sortedValue = isSingleCarpetArea?.length === 1
  ? `${minCarpetArea} sq ft`
  : isSingleCarpetArea
    ? `${minCarpetArea} - ${maxCarpetArea} sq ft`
    : `${maxCarpetArea} sq ft`;
  const unitNamesArray = configration?.map(item => ({'unit_name': item.unit_name}));
      
      const unitNames = formatUnitNames(unitNamesArray);
  const propertyDetails = [
    {
      row: 1,
      items: [
        {
          label: "Project Area",
          value: projectArea ? `${projectArea} ${unit_type}` : "N/A",
        },
        {
          label: "Carpet Area",
          value: sortedValue || "N/A",
        },
        {
          label: "RERA ID",
          value: rera || "N/A",
        },
      ],
    },
    {
      row: 2,
      items: [
        {
          label: "Avg. Price",
          value: per_sqft_amount
            ? `${formatPrice(Number(per_sqft_amount))}/sq ft`
            : "N/A",
        },
        { label: "Added On", value: publish_date ? formatDate(publish_date) : "N/A" },

        { label: propertyType?.toLowerCase()==="commercial" ?"Commercial Variety": "Project Type", value:propertyType?.toLowerCase()==="residential" ? unitNames || "N/A" : property_variety || "N/A" },
      ],
    },
    {
      row: 3,
      items: [
        {
          label: "Current Status",
          value: propertyCurrentStatus? propertyCurrentStatus: "N/A",
        },
        { label: propertyType?.toLowerCase()==="residential"? "Total unit(in one wing)" : "Total Units", value: totalUnits || "N/A" },
        { label: propertyType?.toLowerCase()==="open land" ?  "Width Of Facing Road" : "Total Floors",
           value: propertyType?.toLowerCase()==="open land" ? `${widthFacingRoad } feet` || "N/A" : floorNumber || "N/A"},

        // { label: "Total Floor Number", value: floorNumber || "N/A" },
      ],
    },
  ];

  if (propertyType?.toLowerCase() === "residential") {
    propertyDetails.push({
      row: 4,
      items: [
        {
          label: "Total Towers",
          value: totalTowers || "N/A",
        },
        { label: "Residential Variety", value: property_variety || "N/A" },
        { label: "", value: "" },
      ],
    });
  }

  return (
    <Card className="flex flex-col  gap-5 p-0 bg-white">
      <CardContent className="w-full p-0">
      <div className="hidden lg:block">
          {/* Header */}
          <div className="flex items-center px-5 py-1 shadow-sm border-b">
            <h2 className="font-medium text-base text-[#222222]">
              {title || "N/A"}
            </h2>
          </div>

          {/* Property Details */}
          <div className="flex flex-col gap-4 p-2">
            {propertyDetails.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-start gap-16">
                {row.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex flex-col gap-1 w-full">
                    <span className="text-sm text-[#22222280] font-light">
                      {item.label}
                    </span>

                    {item.label === "RERA ID" && item.value !== "N/A" ? <a href="https://maharera.maharashtra.gov.in/" target="_blank" className="text-sm text-blue font-medium">{item.value}</a> :
                      <span className="text-sm text-black font-light">{item.value}</span>}

                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex items-center gap-4 justify-center p-4 lg:static absolute top-0 right-0">
          <Button
            variant="secondary"
            onClick={() => setActiveButton("share")}
            className={`lg:w-40 lg:h-10 h-8 w-8 gap-2 p-1 rounded-full lg:rounded-sm lg:shadow-none shadow-lg ${activeButton === "share"
              ? "bg-primary text-white"
              : "lg:bg-[#e6e6e6] bg-white"
              }`}
          >
            <Share2 className="h-4 w-4 text-primary" />
            <span
            className={`text-xs font-light hidden lg:block ${activeButton === "share" ? "text-white" : ""
            }`}
            >
              SHARE
            </span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => setActiveButton("save")}
            className={`lg:w-40 lg:h-10 h-8 w-8 gap-2 p-1 rounded-full lg:rounded-sm lg:shadow-none shadow-lg ${activeButton === "save"
              ? "bg-[#fc6600] text-white"
              : "lg:bg-[#e6e6e6] bg-white"
              }`}
          >
            <Heart className="h-4 w-4 text-primary" />
            <span
         className={`text-xs font-light hidden lg:block ${activeButton === "save" ? "text-white" : ""
           }`}
       >
         SHORTLIST
            </span>
          </Button>

          <Button
            onClick={() => setActiveButton("details")}
            className={`w-40 h-10 rounded-sm ${
              activeButton === "details"
                ? "bg-[#fc6600] text-white hover:bg-[#fc6600]/90"
                : "bg-[#e6e6e6]"
            }`}
          >
            <span
              className={`text-xs font-light ${
                activeButton === "details" ? "text-white" : "text-black"
              }`}
            >
              CONTACT BUILDER
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadBrochure;

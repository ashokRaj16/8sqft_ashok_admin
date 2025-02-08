"use client";
import { formatPrice } from "@/app/Builder/BuilderLayout/overview-mobile";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import { Heart, Share2 } from "lucide-react";
import React, { useState } from "react";

interface DownloadBrochure {
  title: string | undefined;
  projectArea: string | null | undefined;
  configration: configuration[] | undefined;
  per_sqft_amount: string | null | undefined | number;
  property_variety: string | undefined;
  possession_date: string | null | undefined;
  unit_type?: string | null;
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
  possession_date,
  unit_type,
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
  const propertyDetails = [
    {
      row: 1,
      items: [
        {
          label: "Project Area",
          value: projectArea ? `${projectArea} ${unit_type}` : "N/A",
        },
        {
          label: "Size",
          value:
            `${formatPrice(Number(minCarpetArea))} - ${formatPrice(
              Number(maxCarpetArea)
            )}${unit}` || "N/A",
        },
      ],
    },
    {
      row: 2,
      items: [
        {
          label: "Avg. Price",
          value: per_sqft_amount
            ? `${formatPrice(Number(per_sqft_amount))}/sq.ft`
            : "N/A",
        },
        { label: "Added", value: possession_date || "N/A" },
        { label: "Project Type", value: property_variety || "N/A" },
      ],
    },
  ];

  return (
    <Card className="flex flex-col items-center gap-5 p-0 bg-white">
      <CardContent className="w-full p-0">
        {/* Header */}
        <div className="flex items-center px-5 py-4 bg-white shadow-sm border-b">
          <h2 className="font-medium text-base text-[#222222]">
            {title || "N/A"}
          </h2>
        </div>

        {/* Property Details */}
        <div className="flex flex-col gap-6 p-4">
          {propertyDetails.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-start gap-16">
              {row.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex flex-col gap-4 w-[138px]">
                  <span className="text-sm text-[#22222280] font-light">
                    {item.label}
                  </span>
                  <span className="text-sm text-black font-light">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 justify-center p-4">
          <Button
            variant="secondary"
            onClick={() => setActiveButton("share")}
            className={`w-40 h-10 gap-2 rounded-sm ${
              activeButton === "share"
                ? "bg-[#fc6600] text-white"
                : "bg-[#e6e6e6]"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span
              className={`text-xs font-light ${
                activeButton === "share" ? "text-white" : ""
              }`}
            >
              SHARE
            </span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => setActiveButton("save")}
            className={`w-40 h-10 gap-2 rounded-sm ${
              activeButton === "save"
                ? "bg-[#fc6600] text-white"
                : "bg-[#e6e6e6]"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span
              className={`text-xs font-light ${
                activeButton === "save" ? "text-white" : ""
              }`}
            >
              SAVE
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
              Ask for details
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadBrochure;

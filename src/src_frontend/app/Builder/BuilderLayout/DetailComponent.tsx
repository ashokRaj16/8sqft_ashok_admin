import { Card, CardContent } from "@/ui/card";
import React from "react";

interface DetailComponent {
  project_area: string;
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
interface ImageGridProps {
  configration: configuration[] | undefined;
  per_sqft_amount: string | null | undefined | number;
  possession_date: string | null | undefined;
}
export default function DetailComponent({
  configration,
  per_sqft_amount,
  possession_date,
}: ImageGridProps) {
  const maxCarpetArea = configration
  ? Math.max(...configration.map((item) => item.carpet_area || 0))
  : null;

const minCarpetArea = configration
  ? Math.min(...configration.map((item) => item.carpet_area || 0))
  : null;
  const propertyDetail = [
    {
      title: `${minCarpetArea}-${maxCarpetArea} sqft`,
      subtitle: "Configurations",
    },
    {
      title: `${possession_date}`,
      subtitle: "Possession Starts",
    },
    {
      title: ` ₹ ${per_sqft_amount}/sq.ft`,
      subtitle: "Avg. Price",
    },
  ];

  return (
    <div className="container flex items-start w-full bg-white mt-4 ">
      {propertyDetail.map((detail, index) => (
        <div key={index} className=" items-center w-full m-2">
          {/* Price Component */}
          <Card className=" bg-white border border-[#222222] flex  items-center gap-3 px-1 justify-center ">
            <CardContent className="text-center p-0 h-10 flex flex-col justify-center items-center">
              <span className="text-black text-xs font-medium ">
                {detail.title}
              </span>
              <span className="text-black text-[10px] font-normal ">
                {detail.subtitle}
              </span>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

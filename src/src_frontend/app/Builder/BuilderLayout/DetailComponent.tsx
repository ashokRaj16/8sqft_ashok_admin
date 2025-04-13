import { Card, CardContent } from "@/ui/card";
import { formatUnitNames } from "@/utils/formatUnitName";
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
  property_variety: string | null | undefined;
  property_type?: string | null | undefined;
}
export default function DetailComponent({
  configration,
  per_sqft_amount,
  possession_date,
  property_variety,
  property_type,
}: ImageGridProps) {

  const maxCarpetArea = configration
  ? Math.max(...configration.map((item) => item.carpet_area || 0))
  : null;

const minCarpetArea = configration
  ? Math.min(...configration.map((item) => item.carpet_area || 0))
  : null;

const isSingleCarpetArea = configration
  ? configration.map((item) => item.carpet_area || 0)
  : null;
// Property Details

console.log(configration,'configration')

const unitNamesArray = configration?.map(item => ({'unit_name': item.unit_name}));
const unitNames = formatUnitNames(unitNamesArray);

const sortedValue = isSingleCarpetArea?.length === 1
  ? `${minCarpetArea} sq ft`
  : isSingleCarpetArea
    ? `${minCarpetArea} - ${maxCarpetArea} sq ft`
    : `${maxCarpetArea} sq ft`;

  const propertyDetail = [
    {
      title: property_type==="RESIDENTIAL"? `${unitNames}, ${property_variety}`: property_variety ,
      subtitle: "Project Type",
    },
    {
      title: `${possession_date}`,
      subtitle: "Possession Starts",
    },
    {
      title: sortedValue,
      subtitle: "Carpet Area",
    },
  ];

  return (
    // <div className="container flex flex-row justify-center  ">
    //   {propertyDetail.map((detail, index) => (
    //     <div key={index} className=" items-center w-full m-2">
    //       <Card className=" bg-white border border-[#222222] flex  items-center gap-3 px-1 justify-center ">
    //         <CardContent className="text-center p-0 h-10 flex flex-col justify-center items-center">
    //           <span className="text-black text-xs font-medium ">
    //             {detail.title}
    //           </span>
    //           <span className="text-black text-[10px] font-normal ">
    //             {detail.subtitle}
    //           </span>
    //         </CardContent>
    //       </Card>
    //     </div>
    //   ))}
    // </div>

    <div className="container w-full flex flex-row justify-center border border-blue-500 bg-white p-2">
  {propertyDetail.map((detail, index) => (
    <div 
      key={index} 
      className={`flex justify-center items-center w-full ${index !== propertyDetail.length - 1 ? "border-r border-gray-300" : ""}`}
    >
      <Card className="bg-white border-none flex flex-col items-center justify-center text-center px-4 py-2">
        <CardContent className="p-0 flex flex-col justify-center items-center">
          <span className="text-black text-xs font-medium">
            {detail.title}
          </span>
          <span className="text-[#22222275] text-[10px] font-normal">
            {detail.subtitle}
          </span>
        </CardContent>
      </Card>
    </div>
  ))}
</div>

  );
}

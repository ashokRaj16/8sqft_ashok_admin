import { formatUnitNames } from "@/utils/formatUnitName";
import { formatPrice } from "../Builder/BuilderLayout/overview-mobile";
import { formatDate } from "@/utils/formatDate";
import { Card, CardContent } from "@/ui/card";
import Image from "next/image";

interface OverviewProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  builderResponseData: any;
  title: string | undefined;
  projectArea: string | null | undefined;
  configration: configuration[] | undefined;
  per_sqft_amount: string | null | undefined;
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
export default function Overview({
  themeColors,
  builderResponseData,
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
}: OverviewProps) {
  // Safely access configration[0].carpet_price
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

  console.log(configration, "minCarpetArea");

  const sortedValue =
    isSingleCarpetArea?.length === 1
      ? `${minCarpetArea} sq ft`
      : isSingleCarpetArea
      ? `${minCarpetArea} - ${maxCarpetArea} sq ft`
      : `${maxCarpetArea} sq ft`;

  const unitNamesArray = configration?.map((item) => ({
    unit_name: item.unit_name,
  }));

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
        {
          label: "Added On",
          value: publish_date ? formatDate(publish_date) : "N/A",
        },

        {
          label:
            propertyType?.toLowerCase() === "commercial"
              ? "Commercial Variety"
              : "Project Type",
          value:
            propertyType?.toLowerCase() === "residential"
              ? unitNames || "N/A"
              : property_variety || "N/A",
        },
      ],
    },
    {
      row: 3,
      items: [
        {
          label: "Current Status",
          value: propertyCurrentStatus ? propertyCurrentStatus : "N/A",
        },
        {
          label:
            propertyType?.toLowerCase() === "residential"
              ? "Total unit(in one wing)"
              : "Total Units",
          value: totalUnits || "N/A",
        },
        {
          label:
            propertyType?.toLowerCase() === "open land"
              ? "Width Of Facing Road"
              : "Total Floors",
          value:
            propertyType?.toLowerCase() === "open land"
              ? `${widthFacingRoad} feet` || "N/A"
              : floorNumber || "N/A",
        },

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

  const propertyDetailsMob = [
    {
      icon: "/assets/icon/projectArea.svg",
      // value: property_type==="RESIDENTIAL" ? `${totalTowers} Building - ${totalUnits} Units` : `${projectArea} ${projectAreaUnit} `,
      value: `${projectArea} ${unit_type} ${
        totalUnits ? `, ${totalUnits} Units` : ""
      } `,
      label: "Project Area",
    },
    {
      icon: "/assets/icon/carpetArea.svg",
      value: sortedValue || "N/A",
      label: "Carpet Area",
    },
    {
      icon: "/assets/icon/mahaRera.svg",
      value: rera || "N/A",
      label: "Rera ID",
    },
    {
      icon: "/assets/icon/avgPrice.svg",
      value: per_sqft_amount
        ? `${formatPrice(Number(per_sqft_amount))}/sq ft`
        : "N/A",
      // value: property_type==="RESIDENTIAL" ?  `${formatPrice(Number(perSqftAmount))}/Sq ft` : minCarpetPrice && maxCarpetPrice ? `${formatPrice(minCarpetPrice)} - ${formatPrice(maxCarpetPrice)}`: "N/A" ,
      label: "Avg Price",
    },
    {
      icon: "/assets/icon/addedOn.svg",
      value: publish_date ? formatDate(publish_date) : "N/A",
      label: "Added On",
    },
    {
      icon: "/assets/icon/propertyType.svg",
      value: propertyType === "RESIDENTIAL" ? unitNames : "N/A",
      label: "Property Type",
    },

    {
      icon: "/assets/icon/Readytomove.svg",
      label: "Current Status",
      value: propertyCurrentStatus ? propertyCurrentStatus : "N/A",
    },
    {
      icon:
        propertyType?.toLowerCase() === "open land"
          ? "/assets/Builder/facingDirection.svg"
          : "/assets/Builder/amenity/Floor.svg",
      label:
        propertyType?.toLowerCase() === "open land"
          ? "Width Of Facing Road"
          : "Total Floors",
      value:
        propertyType?.toLowerCase() === "open land"
          ? `${widthFacingRoad} feet` || "N/A"
          : floorNumber || "N/A",
    },
    {
      icon: "/assets/icon/propertyType.svg",
      label:
        propertyType?.toLowerCase() === "open land"
          ? "Total Units"
          : "Total Towers",
      value:
        propertyType?.toLowerCase() === "open land"
          ? totalUnits
          : totalTowers || "N/A",
    },
    {
      icon: "/assets/icon/NewlyLaunch.svg",
      label: "Residential Variety",
      value: property_variety || "N/A",
    },
  ];
  return (
    <>
      <div className="my-4" style={{ color: themeColors.themeColorDark }}>
        <h3 className="font-semibold my-2  text-lg">{title}, Overview</h3>
        <div className="grid grid-cols-2 gap-px p-px bg-[#d9d9d9] w-full lg:hidden">
          {propertyDetailsMob.map((detail: any, index: number) => (
            <Card key={index} className="rounded-none border-none shadow-none">
              <CardContent className="flex items-center p-2 h-[60px] bg-white">
                <div className="flex items-center gap-4">
                  {/* <Image
                    src={detail.icon}
                    alt={detail.label}
                    className="w-8 h-8"
                    width={10}
                    height={10}
                  /> */}
                         <div
                    style={{
                      width: 32,
                      height: 32,
                      backgroundColor: themeColors.themeColorDark,
                      maskImage: `url(${detail.icon})`,
                      WebkitMaskImage: `url(${detail.icon})`,
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                    }}
                  ></div>
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
        <div className="hidden lg:flex flex-col gap-4 py-2 px-4">
          {propertyDetails.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-start gap-16">
              {row.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex flex-col gap-1 w-full">
                  <span className="text-sm text-[#22222280]">{item.label}</span>

                  {item.label === "RERA ID" && item.value !== "N/A" ? (
                    <a
                      href="https://maharera.maharashtra.gov.in/"
                      target="_blank"
                      className="text-sm text-blue font-medium"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm text-black">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

"use client";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import { Heart, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { formatPrice } from "./overview-mobile";
import { useAuthStore } from "@/Store/jwtTokenStore";
import useShareContactDetail from "@/hooks/Postpropertyhooks/useShareContact";
import { useParams, usePathname } from "next/navigation";
import useShareWhatsappDetail from "@/hooks/Postpropertyhooks/useShareWhatsappDetail";
import useDialogStore from "@/Store/useDialogStore ";
import 'font-awesome/css/font-awesome.min.css';
import Image from "next/image"


import { jwtTokenDecodeAll } from "@/lib/jwtTokenDecodeAll";
import { formatDate } from "@/utils/formatDate";
import axios from "@/hooks";
import ShareShortlist from "@/app/components/common/ShareShortlist";
import { formatUnitNames } from "@/utils/formatUnitName";

interface DownloadBrochure {
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
  const params = useParams(); // Retrieve route parameters
  const extractId = (url:any) => {
    if (!url || typeof url !== "string") return null; // Ensure it's a string
    const match = url.match(/-(\d+)$/);
    return match ? match[1] : null;
  };
  const id = extractId(params.id);
  
  const propertyId = params?.id ? Number(id) : null;
  // State for success message
  const token = useAuthStore((state) => state.token);
  const decoded: any = jwtTokenDecodeAll(token || "");
  // const propertyIdNumber = Array.isArray(propertyId)
  //   ? Number(propertyId[0])
  //   : Number(propertyId);




  const handleOwnerContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (token) {

      handleClick();
    } else {
      openDialog();
    }
  }

  const handleClick = () => {
    if (propertyId !== null) {
      shareContact({ propertyId: propertyId });
      shareWhatsapp({ propertyId: propertyId });
    }
    setDialogOpen(true);
  };

  const { mutate: shareContact } = useShareContactDetail({
    onSuccess: (data) => {
      console.log("Successfully sent contact details", data);
    },
    onError: (error) => {
      console.log("Error in sending contact details", error);
    },
  });

  const { mutate: shareWhatsapp } = useShareWhatsappDetail({
    onSuccess: (data) => {
      console.log("Successfully sent contact details", data);
    },
    onError: (error) => {
      console.log("Error in sending contact details", error);
    },
  });

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

  console.log(property_variety, 'configration')

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
        <div className=" items-center gap-4 justify-center p-4 hidden lg:flex">
          <ShareShortlist
            background={"lg:bg-[#e6e6e6] bg-white"}
            shadow={"lg:shadow-none shadow-lg"}
            rounded={"rounded-full lg:rounded-[2px]"}
            fontSize={"text-xs"}
            textTransform={"uppercase"}
            fontWeight={"font-light"}
            hoverBackground={"hover:bg-primary"}
            hoverTextColor={"hover:text-white"}
            iconColor={"text-primary"}
            iconHoverColor={"group-hover:text-white"}
            propertyId={propertyId}
            propertyIdSlug={params?.id}
            btnSaveText={"Shortlist"}
            showBtnText={true}
          />


          <Button

            onClick={handleOwnerContactClick}

            className={` h-10 rounded-[2px] hover:bg-primary hover:text-white text-xs font-light uppercase ${activeButton === "details"
                ? "bg-[#fc6600] text-white hover:bg-[#fc6600]/90"
                : "bg-[#e6e6e6]"
              }`}
          >

            Contact Builder

          </Button>

          <div className="relative  ">
            {dialogOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
                <div className="bg-white p-5 border border-gray-300 rounded-md shadow-md max-w-sm w-full">
                  <h1 className="font-bold">Contact Details Sent</h1>
                  <p className="text-sm">
                    We have successfully sent the owner contact details on your
                    WhatsApp and Email. Feel free to contact the owner directly.
                  </p>
                  <div className="w-full ">
                    <button
                      className="bg-primary text-white px-4 py-2 rounded-md my-3 self-center w-full"
                      onClick={() => setDialogOpen(false)} // Close the dialog
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </CardContent>



    </Card >
  );
};

export default DownloadBrochure;

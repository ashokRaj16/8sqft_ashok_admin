"use client";

import React, { useEffect } from "react";
import ImageGrid from "../PropertyDetailsPage/ImageGrid";
import DetailsSection from "../PropertyDetailsPage/DetailsSection";
import ContactSection from "../PropertyDetailsPage/ContactSection";
import ReportIssueCard from "../PropertyDetailsPage/ReportIssueCard";

import Image from "next/image";
import { Button } from "@/ui/Button";
import usePreviewModeDetail from "@/hooks/usePreviewMode";
import toast from "react-hot-toast";
import usePropertyIdStore from "@/Store/propertyid";
import useGallaryDetail from "@/hooks/Postpropertyhooks/useGallary";
import { useRouter } from "next/navigation";
import PreviewmodeLayout from "./previewmodeLayout/page";
import { formatPrice } from "../Builder/BuilderLayout/overview-mobile";

interface PreviewModeProps {
  onNext: () => void; // Receive `onNext` as a prop
}
const PreviewModeComponent = ({ onNext }: PreviewModeProps) => {
  const { id } = usePropertyIdStore(); // Fetch the property ID
  const propertyId = Number(id);

  const userid = id!;
  const { mutate } = useGallaryDetail({
    onSuccess: (data: any) => {
      toast.success(`${data.message}`);
      onNext();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const { data, error, isLoading } = usePreviewModeDetail(propertyId);
  const router = useRouter();

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     router.push("/"); // Redirect to the homepage after 5000ms
  //   }, 5000);

  //   // Cleanup the timeout when the component unmounts or rerenders
  //   return () => clearTimeout(timeout);
  // }, [router]);
  // Handle loading and error states
  if (isLoading) {
    return <p>Loading property details...</p>;
  }

  if (error) {
    toast.error("Failed to load property details.");
    return <p>Error loading property details. Please try again later.</p>;
  }

  // Use the API data for rendering
  const property = data!.data || {};
  const images =
    property?.images?.map((img: any) => ({
      url: img.property_img_url,
    })) || [];

  const isoDate = property?.availability_date || "";
  const formattedDate = isoDate.split("T")[0];
  const configurations = property?.configuration;

  // Find the minimum carpet price
  const minCarpetPrice = configurations?.reduce((min:any, config:any) => {
    if (config.carpet_price !== null && config.carpet_price < min) {
      return config.carpet_price;
    }
    return min;
  }, Infinity);
  const details = [
    {
      label: `₹${property?.rent_amount || "N/A"}`,
      subLabel:
      property?.rent_is_nogotiable === "1" ? "Rent (Non-Negotiable)" : "Rent (Negotiable)",
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
      <div className="flex flex-col gap-6 p-4 bg-white rounded-lg shadow-md w-full">
        <div className="flex lg:justify-between items-center ">
          <div className="lg:w-fit flex px-5">
            <span className="text-[10px] lg:text-lg w-full ">
              You will see your property listing post on our website like this
            </span>
            <Image
              src={"/assets/previewmode/Youwillseeyour.svg"}
              alt={`Image`}
              width={10}
              height={10}
              className="ml-3"
            />
          </div>
          <Button
            className="bg-[#222222] text-white w-full max-w-28"
            variant="outline"
          >
            EDIT
          </Button>
        </div>

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
                  <span className="text-sm text-gray-300 ml-2">
                    {detail.subLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="w-[1px] h-full bg-black"></div>
          <div className="flex justify-center">
            <button className="bg-primary-light text-white lg:px-6 lg:py-2 rounded-md text-sm p-1 pointer-events-none">
              {`  ${formatPrice(Number(minCarpetPrice))} Starting`}
            </button>
          </div>
        </div>

        <div className="hidden lg:flex text-sm text-gray">
          Home &gt; Listings &gt; Details
        </div>
        <div className="flex flex-col lg:flex-row gap-4 w-full justify-between lg:px-10">
          <div className="lg:w-[60%] h-full">
            <ImageGrid images={images} />
          </div>
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
          <strong>Nearby:</strong> {property?.landmark || "N/A"}
        </div>
      </div>
      <div className="my-5">
        <PreviewmodeLayout />
      </div>
      <button
        onClick={() => mutate({ id: Number(userid), step_id: 5 })}
        className="mt-8 w-full max-w-48 flex self-center text-center text-white py-2 px-6 rounded-md bg-primary hover:bg-primary transition-colors"
      >
        Save and Next
      </button>
    </div>
  );
};

export default PreviewModeComponent;

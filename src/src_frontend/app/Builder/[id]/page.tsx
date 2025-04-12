

"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/ui/Button";
import { Check, Download, Info, Phone, Star, X } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import useBuilderDetail from "@/hooks/useBuilderDetail";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import BuilderImageGrid from "../BuilderImageGrid";
import BuilderLayout from "../BuilderLayout/page";
import BuilderLocation from "../BuilderLocation";
import BuilderContactSection from "../BuilderLayout/BuilderContactSection";
import { formatPrice } from "../BuilderLayout/overview-mobile";
import SimilarComponent from "../BuilderLayout/Similaromponnent";
import ReviewSection from "../BuilderLayout/RatingsContent";
import Faq from "../BuilderLayout/Faqs";
import { BsCheck, BsFillInfoCircleFill } from "react-icons/bs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";
import { FaFaceSadTear } from "react-icons/fa6";
import Link from "next/link";
import ContactDeveloperSection from "../BuilderLayout/ContactDeveloperSection";
import TransitInfo from "../BuilderLayout/TransitInfo";
import SectionNavbar from "../SectionNavbar";
import DetailSkeleton from "../DetailSkeleton";
import ReportIssueCard from "@/app/PropertyDetailsPage/ReportIssueCard";

const BuilderComponent = () => {
  const params = useParams();
  const extractId = (url:any) => {
    if (!url || typeof url !== "string") return null; // Ensure it's a string
    const match = url.match(/-(\d+)$/);
    return match ? match[1] : null;
  };
  const id = extractId(params.id);
  const propertyId = params?.id ? Number(id) : null;
  const hasFetched = useRef(false);
  const { data, isLoading, error } = useBuilderDetail(Number(propertyId));

  useEffect(() => {
    if (!hasFetched.current && propertyId) {
      hasFetched.current = true; // ✅ Ensures this runs only once
    }
  }, [propertyId]);


  if (isLoading) {
    return <>
    <DetailSkeleton/>
    </>;
  }

  if (error) {
    toast.error("Failed to load property details.");
    return <div className="h-screen flex flex-col items-center justify-center gap-4">
      <FaFaceSadTear className="text-3xl" />
       <h3 className="text-2xl font-semibold">Oops No result found for : </h3>
       <p className="italic"> {params.id}</p>
       <Link href={"/"} className="text-white bg-primary p-3 rounded-lg">Click here to explore more</Link>
    </div>
  }

  const property = data?.data;
  const images =
    property?.images.map((img: any) => ({
      url: img.property_img_url,
      file_type: img.file_type,
      title: img.img_title
    })) || [];

  const configurations = property?.configuration;

  const minCarpetPrice = configurations?.reduce((min, config) => {
    if (config.carpet_price !== null && config.carpet_price < min) {
      return config.carpet_price;
    }
    return min;
  }, Infinity);
  const unitPriceType = configurations?.reduce((min, config) => {
    if (config.unit_price_type !== null && config.carpet_price < min.carpet_price) {
      return config;
    }
    return min;
  }, { carpet_price: Infinity, unit_price_type: "" }).unit_price_type;
  const sections = ["Overview", "About", "Price", "Amenities", "Rera", "Review", "Location", "Similar", "FAQs"];
  return (
    <div>
      <div className="relative flex flex-col w-full max-w-7xl mx-auto">


<div className="flex flex-col gap-2  lg:py-4 pb-2 bg-white rounded-lg w-full">
  <div className="flex items-center justify-between lg:px-4 lg:py-2 bg-transparent w-full lg:w-auto fixed bottom-0 lg:static z-50 lg:z-auto">
    <div className="lg:flex flex-col w-[688px] gap-4 hidden">
      <div className="space-y-2 ">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-medium text-[#222222cc]">
            {property?.property_title || "Property Title"}
          </h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {property?.rera_number && (<div className="flex bg-[#F4F4F4] border border-[#E6E6E6] gap-1 items-center text-xs">
                  <BsCheck className="text-[#4EDBA5] text-[25px]" />
                  RERA <BsFillInfoCircleFill className="text-[#22222280] text-[20px]" />
                </div>)}
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white p-1">
                <p>{property?.rera_number}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs">
            <span className="font-light">By</span>
            <span className="font-light text-[#fc6600]">
              {property?.company_name}
            </span>
          </div>

          <p className="text-xs font-light text-[#222222]">
            {`${property?.city_name || ""} ${property?.landmark || ""} ${property?.locality || ""
              }`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Card className="w-11 h-8 bg-gradient-to-b from-[#ff9146] to-[#fc6600]">
            <CardContent className="flex items-center justify-center p-0 h-full">
              <Star className="w-4 h-4 text-white" />
              <h1 className="text-xs text-white ml-1">5</h1>
            </CardContent>
          </Card>

          
          <Link href={'#Review'}><Button
            variant="secondary"
            className="h-8 bg-[#f3f1f1] text-[#fc6600] hover:bg-[#f3f1f1] hover:text-[#fc6600]"
          >
            Write a Review
          </Button></Link>
        </div>
      </div>
    </div>

    <div className="flex flex-col lg:items-end gap-4 w-full lg:w-[370px]">
      <div className="text-right">
        <div className="lg:flex items-center gap-1 hidden">
          <span className="text-xl font-normal text-black">
            {`  ${formatPrice(Number(minCarpetPrice))} `}
            <span className="font-light">{unitPriceType} |</span>
          </span>
          <span className="text-md font-light">
            {`  ${formatPrice(Number(property?.per_sqft_amount))}/sq ft`}
          </span>
        </div>
      </div>

      <BuilderContactSection />
    </div>
  </div>

  <div className="flex flex-col gap-4 w-full ">
    <div className="lg:w-full h-full">
      <BuilderImageGrid
        images={images}
        configration={property?.configuration}
        per_sqft_amount={Number(property?.per_sqft_amount)}
        possession_date={property?.possession_date}
        property_title={property?.property_title}
        propertyId={property?.id}
      />
    </div>
  </div>

  <div className="lg:space-y-2 flex gap-1 justify-between px-5 lg:hidden">
    <div>
    <div className="flex items-start gap-2">
      <h1 className="text-sm text-[#222222cc] font-semibold flex gap-1">
        {property?.property_title || "Property Title"}
        {property?.rera_number && (
                  <span
                    className="flex bg-[#F4F4F4] border rounded-sm border-[#E6E6E6] items-center text-[10px] pr-1 w-fit"
                  >
                    <BsCheck className="text-[#4EDBA5] text-lg" />
                    RERA
                  </span>
                )}
      </h1>
      </div>
      <div className="space-y-1">
       
          <span className="font-light text-[#fc6600] text-xs">
           By {property?.company_name}
          </span>
       

        <p className="text-xs font-light text-[#222222]">
          {`${property?.city_name || ""} ${property?.landmark || ""} ${property?.locality || ""
            }`}
        </p>
      </div>
    </div>
    <button className="bg-primary text-white lg:px-6 lg:py-2 py-1 rounded-md text-xs px-2 h-fit w-32">
      {`  ${formatPrice(Number(minCarpetPrice))} Starting`}
    </button>
  </div>
</div>
</div>
<div className="bg-[#F4F2F2] pb-4">

<div className=" flex flex-col w-full max-w-7xl mx-auto">

<SectionNavbar sections={sections} />

<BuilderLayout />

<div className="grid grid-cols-4">
<div className="lg:col-span-3 col-span-4 lg:scroll-mt-32 scroll-mt-24" id="Review">

<ReviewSection propertyId={propertyId}/>
</div>
</div>
<div className="grid lg:grid-cols-4  lg:gap-4 lg:scroll-mt-32 scroll-mt-24 mx-4 lg:mx-0" id="Location">
<div className="lg:col-span-3 col-span-full mt-2">
<BuilderLocation
                  lat={property?.latitude}
                  lng={property?.longitude}
                />
</div>

<div className="lg:col-span-1 col-span-full mt-2">

<TransitInfo NearbyLocations={property?.nearbyLocations || []} />
</div>
</div>
<div className="lg:scroll-mt-32 scroll-mt-24 mx-4 lg:mx-0" id="Similar">
  <div className="">
    <SimilarComponent propertyId={property?.id} />
  </div>

  <div className=" lg:hidden bg-white shadow-custom p-2 my-4">
      <ContactDeveloperSection
        configration={property?.configuration}
        propertyVariety={property?.property_variety}
        propertytype={property?.property_type} />
          <ReportIssueCard />
    </div> 
</div>

<div id="FAQs" className="lg:scroll-mt-32 scroll-mt-24">
<Faq />
</div>
</div>
</div>
    </div>
  );
};

export default BuilderComponent;


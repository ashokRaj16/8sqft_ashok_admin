"use client";
import React from "react";
import { Button } from "@/ui/Button";
// import useBuilderDetail from "@/hooks/useBuilder";
import { Download, Phone, Star } from "lucide-react";
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
const BuilderComponent = () => {
  const params = useParams(); // Retrieve route parameters
  const propertyId = params?.id ? Number(params.id) : null; // Safely parse id
  const { data, isLoading, error } = useBuilderDetail(Number(propertyId));

  // Handle loading and error states
  if (isLoading) {
    return <p>Loading property details...</p>;
  }

  if (error) {
    toast.error("Failed to load property details.");
    return <p>Error loading property details. Please try again later.</p>;
  }

  // Use the API data for rendering
  const property = data?.data;
  const images =
    property?.images.filter(item => item.file_type !== 'application/pdf')?.map((img: any) => ({
      url: img.property_img_url,
      title: img.img_title
    })) || [];
  const configurations = property?.configuration;

  // Find the minimum carpet price
  const minCarpetPrice = configurations?.reduce((min, config) => {
    if (config.carpet_price !== null && config.carpet_price < min) {
      return config.carpet_price;
    }
    return min;
  }, Infinity);
  return (
    <div className="flex flex-col  w-full max-w-7xl mx-auto ">
      <div className="flex flex-col gap-6 lg:p-4 bg-white rounded-lg lg:shadow-md w-full">
        <div className="flex items-center justify-between lg:px-4 lg:py-2 bg-white">
          <div className="flex flex-col w-[688px] gap-4">
            <div className="hidden lg:flex text-sm text-gray">
              Home &gt; Listings &gt; Dehu
            </div>

            <div className="space-y-2 hidden lg:block">
              <h1 className="text-3xl font-medium text-[#222222cc] ">
                {property?.property_title || "Property Title"}
              </h1>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs">
                  <span className="font-light">By</span>
                  <span className="font-light text-[#fc6600]">
                    {property?.company_name}
                  </span>
                </div>

                <p className="text-xs font-light text-[#222222]">
                  {`${property?.city_name || ""} ${property?.landmark || ""} ${
                    property?.locality || ""
                  }`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Card className="w-11 h-8 bg-gradient-to-b from-[#ff9146] to-[#fc6600]">
                  <CardContent className="flex items-center justify-center p-0 h-full">
                    <Star className="w-4 h-4 text-white" />
                    <h1 className="text-xs text-white ml-1"> 5</h1>
                  </CardContent>
                </Card>

                <Button
                  variant="secondary"
                  className="h-8 bg-[#f3f1f1] text-[#fc6600] hover:bg-[#f3f1f1] hover:text-[#fc6600]"
                >
                  Write a Review
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:flex flex-col items-end gap-4 w-[348px] hidden">
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-primary ">
                  {`  ${formatPrice(Number(minCarpetPrice))} `}
                  <span className="font-light">Starting |</span>
                </span>
                <span className="text-md font-light">
                  {`  ${formatPrice(Number(property?.per_sqft_amount))}/sq.ft`}
                </span>
              </div>
            </div>

            <BuilderContactSection />
          </div>
        </div>

        <div className="flex flex-col  gap-4 w-full  lg:px-10 h-[60vh]">
          <div className="lg:w-full h-full">
            <BuilderImageGrid
              images={images}
              configration={property?.configuration}
              per_sqft_amount={Number(property?.per_sqft_amount)}
              possession_date={property?.possession_date}
              property_title={property?.property_title}
            />
          </div>
        </div>
        <div className="lg:space-y-2 flex justify-between px-5 lg:hidden">
          <div>
            <h1 className="text-md  text-[#222222cc] font-semibold">
              {property?.property_title || "Property Title"}
            </h1>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs">
                <span className="font-light">By</span>
                <span className="font-light text-[#fc6600]">
                  {property?.company_name}
                </span>
              </div>

              <p className="text-xs font-light text-[#222222]">
                {`${property?.city_name || ""} ${property?.landmark || ""} ${
                  property?.locality || ""
                }`}
              </p>
            </div>
          </div>
          <button className="bg-primary text-white lg:px-6 lg:py-2 rounded-md text-xs  px-4 h-10">
            {`  ${formatPrice(Number(minCarpetPrice))} Starting`}
          </button>
        </div>
      </div>
      <BuilderLayout />
      <div className="-z-10 w-full">
        <div className="hidden lg:block">
          <SimilarComponent />
        </div>

        {/* <BuilderLocation lat={property?.latitude} lng={property?.longitude} /> */}
      </div>


      <div className="hidden lg:block ">
          {/* Description */}
          <ReviewSection />
        </div>
    </div>
  );
};

export default BuilderComponent;

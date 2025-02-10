"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/ui/Button";
import toast from "react-hot-toast";
import usePropertyIdStore from "@/Store/propertyid";
import useGallaryDetail from "@/hooks/Postpropertyhooks/useGallary";
import { useRouter } from "next/navigation";
import PropertyLocation from "../Builder/Location";
import OverviewFunction from "../Builder/Overview";
import { Download, Phone, Star } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import BuilderImageGrid from "../Builder/BuilderImageGrid";
import useBuilderPreviewDetail from "@/hooks/useBuilderPreviewmode";
import useBuilderSubmitDetail from "@/hooks/BuilderFormHooks/useBuilderSubmit";
import BuilderPreviewModeLayout from "./BuilderPreviewModeLayout/page";
import BuilderContactSection from "../Builder/BuilderLayout/BuilderContactSection";
import { formatPrice } from "../Builder/BuilderLayout/overview-mobile";

interface PreviewModeProps {
  onNext: () => void; // Receive `onNext` as a prop
}
const PreviewModeComponent = ({ onNext }: PreviewModeProps) => {
  const { id } = usePropertyIdStore(); // Fetch the property ID
  const propertyId = Number(id);

  const userid = id!;
  const { mutate } = useBuilderSubmitDetail({
    onSuccess: (data: any) => {
      toast.success(`${data.message}`);
      // ### show popup/modal for submitted successfully and shift him to post property 
      onNext();
      router.push('/Post-Property')
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const { data, error, isLoading } = useBuilderPreviewDetail(propertyId);

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
  const minCarpetPrice = configurations?.reduce((min, config) => {
    if (config.carpet_price !== null && config.carpet_price < min) {
      return config.carpet_price;
    }
    return min;
  }, Infinity);

  const details = [
    {
      label: `₹${property?.rent_amount || "N/A"}`,
      subLabel:
        property?.rent_is_nogotiable === "1"
          ? "Rent (Non-Negotiable)"
          : "Rent (Negotiable)",
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
    <div className="flex flex-col  w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-6 p-4 bg-white rounded-lg w-full">
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

        <div className="flex flex-col  w-full max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 lg:p-4 bg-white rounded-lg lg:shadow-md w-full">
            <div className="flex items-center justify-between lg:px-4 lg:py-2 bg-white">
              <div className="flex flex-col w-[688px] gap-4">
                {/* <div className="hidden lg:flex text-sm text-gray">
                  Home &gt; Listings &gt; Dehu
                </div> */}

                <div className="space-y-2 hidden lg:block">
                  <h1 className="text-3xl font-medium text-[#222222cc] ">
                    {property?.property_title || "Property Title"}
                  </h1>

                  <div className="space-y-1 gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-light">By</span>
                      <span className="font-light text-[#fc6600]">
                        {property?.company_name}
                      </span>
                    </div>

                    <p className="text-xs font-light text-[#222222]">
                      {`${property?.city_name || ""} ${
                        property?.landmark || ""
                      } ${property?.locality || ""}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Card className="w-11 h-8 bg-gradient-to-b from-[#ff9146] to-[#fc6600]">
                      <CardContent className="flex items-center justify-center p-0 h-full">
                        <Star className="w-4 h-4 text-white" />
                        <h1 className="text-xs text-white"> 5</h1>
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
                    <span className="text-xl font-light">{`  ${formatPrice(
                      Number(minCarpetPrice)
                    )} Starting`}</span>
                    <span className="text-md font-light">
                      {`  ${formatPrice(
                        Number(property?.per_sqft_amount)
                      )}/sq.ft`}
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
                  configration={property.configuration}
                  per_sqft_amount={Number(property.per_sqft_amount)}
                  possession_date={property.possession_date}
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-4">
              <BuilderPreviewModeLayout />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 justify-center items-center">
          <button
            onClick={() => mutate({ id: Number(userid), step_id: 5 })}
            className="mt-8 w-full max-w-48 flex justify-center items-center text-center text-white py-2 px-6 rounded-md bg-primary hover:bg-primary transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModeComponent;

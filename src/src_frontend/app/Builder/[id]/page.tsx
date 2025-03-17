// "use client";
// import React from "react";
// import { Button } from "@/ui/Button";
// // import useBuilderDetail from "@/hooks/useBuilder";
// import { Download, Phone, Star } from "lucide-react";
// import { Card, CardContent } from "@/ui/card";
// import useBuilderDetail from "@/hooks/useBuilderDetail";
// import { useParams } from "next/navigation";
// import toast from "react-hot-toast";
// import BuilderImageGrid from "../BuilderImageGrid";
// import BuilderLayout from "../BuilderLayout/page";
// import BuilderLocation from "../BuilderLocation";
// import BuilderContactSection from "../BuilderLayout/BuilderContactSection";
// import { formatPrice } from "../BuilderLayout/overview-mobile";
// import SimilarComponent from "../BuilderLayout/Similaromponnent";
// import ReviewSection from "../BuilderLayout/RatingsContent";
// import Faq from "../BuilderLayout/Faqs"
// const BuilderComponent = () => {
//   const params = useParams(); // Retrieve route parameters
//   const propertyId = params?.id ? Number(params.id) : null; // Safely parse id
//   const { data, isLoading, error } = useBuilderDetail(Number(propertyId));

//   // Handle loading and error states
//   if (isLoading) {
//     return <p>Loading property details...</p>;
//   }

//   if (error) {
//     toast.error("Failed to load property details.");
//     return <p>Error loading property details. Please try again later.</p>;
//   }

//   // Use the API data for rendering
//   const property = data?.data;
//   const images =
//     property?.images.filter(item => item.file_type !== 'application/pdf')?.map((img: any) => ({
//       url: img.property_img_url,
//       title: img.img_title
//     })) || [];
//   const configurations = property?.configuration;

//   // Find the minimum carpet price
//   const minCarpetPrice = configurations?.reduce((min, config) => {
//     if (config.carpet_price !== null && config.carpet_price < min) {
//       return config.carpet_price;
//     }
//     return min;
//   }, Infinity);
//   return (
//     <div className="flex flex-col  w-full max-w-7xl mx-auto ">
//       <div className="flex flex-col gap-6 lg:p-4 bg-white rounded-lg  w-full">
//         <div className="flex items-center justify-between lg:px-4 lg:py-2 bg-white">
//           <div className="flex flex-col w-[688px] gap-4">
//             {/* <div className="hidden lg:flex text-sm text-gray">
//               Home &gt; Listings &gt; Dehu
//             </div> */}

//             <div className="space-y-2 hidden lg:block">
//               <h1 className="text-3xl font-medium text-[#222222cc] ">
//                 {property?.property_title || "Property Title"}
//               </h1>

//               <div className="space-y-1">
//                 <div className="flex items-center gap-1 text-xs">
//                   <span className="font-light">By</span>
//                   <span className="font-light text-[#fc6600]">
//                     {property?.company_name}
//                   </span>
//                 </div>

//                 <p className="text-xs font-light text-[#222222]">
//                   {`${property?.city_name || ""} ${property?.landmark || ""} ${
//                     property?.locality || ""
//                   }`}
//                 </p>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Card className="w-11 h-8 bg-gradient-to-b from-[#ff9146] to-[#fc6600]">
//                   <CardContent className="flex items-center justify-center p-0 h-full">
//                     <Star className="w-4 h-4 text-white" />
//                     <h1 className="text-xs text-white ml-1"> 5</h1>
//                   </CardContent>
//                 </Card>

//                 <Button
//                   variant="secondary"
//                   className="h-8 bg-[#f3f1f1] text-[#fc6600] hover:bg-[#f3f1f1] hover:text-[#fc6600]"
//                 >
//                   Write a Review
//                 </Button>
//               </div>
//             </div>
//           </div>

//           <div className="lg:flex flex-col items-end gap-4 w-[348px] hidden mt-10">
//             <div className="text-right">
//               <div className="flex items-center gap-1">
//                 <span className="text-xl font-normal text-black ">
//                   {`  ${formatPrice(Number(minCarpetPrice))} `}
//                   <span className="font-light">Starting |</span>
//                 </span>
//                 <span className="text-md font-light">
//                   {`  ${formatPrice(Number(property?.per_sqft_amount))}/sq.ft`}
//                 </span>
//               </div>
//             </div>

//             <BuilderContactSection />
//           </div>
//         </div>

//         <div className="flex flex-col  gap-4 w-full  lg:px-10">
//           <div className="lg:w-full h-full">
//             <BuilderImageGrid
//               images={images}
//               configration={property?.configuration}
//               per_sqft_amount={Number(property?.per_sqft_amount)}
//               possession_date={property?.possession_date}
//               property_title={property?.property_title}
//             />
//           </div>
//         </div>
//         <div className="lg:space-y-2 flex justify-between px-5 lg:hidden">
//           <div>
//             <h1 className="text-md  text-[#222222cc] font-semibold">
//               {property?.property_title || "Property Title"}
//             </h1>

//             <div className="space-y-1">
//               <div className="flex items-center gap-1 text-xs">
//                 <span className="font-light">By</span>
//                 <span className="font-light text-[#fc6600]">
//                   {property?.company_name}
//                 </span>
//               </div>

//               <p className="text-xs font-light text-[#222222]">
//                 {`${property?.city_name || ""} ${property?.landmark || ""} ${
//                   property?.locality || ""
//                 }`}
//               </p>
//             </div>
//           </div>
//           <button className="bg-primary text-white lg:px-6 lg:py-2 rounded-md text-xs  px-4 h-10">
//             {`  ${formatPrice(Number(minCarpetPrice))} Starting`}
//           </button>
//         </div>
//       </div>

//       <BuilderLayout />

//       <div className="hidden lg:block ">
//           {/* Description */}
//           <ReviewSection />
//         </div>

//       <div className="-z-10 w-full">
//         <div className="hidden lg:block">
//           <SimilarComponent />
//         </div>

//         {/* <BuilderLocation lat={property?.latitude} lng={property?.longitude} /> */}
//       </div>

//       <div>
//       <Faq/>
//       </div>



//     </div>
//   );
// };

// export default BuilderComponent;


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

const BuilderComponent = () => {
  const params = useParams();
  const extractId = (url:any) => {
    if (!url || typeof url !== "string") return null; // Ensure it's a string
    const match = url.match(/-(\d+)$/);
    return match ? match[1] : null;
  };
  const id = extractId(params.id);
  console.log(params,'paramsparams')
  const propertyId = params?.id ? Number(id) : null;
  const hasFetched = useRef(false);
  const { data, isLoading, error } = useBuilderDetail(Number(propertyId));

  useEffect(() => {
    if (!hasFetched.current && propertyId) {
      hasFetched.current = true; // ✅ Ensures this runs only once
    }
  }, [propertyId]);


  if (isLoading) {
    return <p>Loading property details...</p>;
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

  return (
    <div className="relative flex flex-col w-full max-w-7xl mx-auto">


      <div className="flex flex-col gap-2 lg:p-4 bg-white rounded-lg w-full">
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

                <Button
                  variant="secondary"
                  className="h-8 bg-[#f3f1f1] text-[#fc6600] hover:bg-[#f3f1f1] hover:text-[#fc6600]"
                >
                  Write a Review
                </Button>
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

        <div className="lg:space-y-2 flex justify-between px-5 lg:hidden">
          <div>
            <h1 className="text-md text-[#222222cc] font-semibold mr-1">
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
                {`${property?.city_name || ""} ${property?.landmark || ""} ${property?.locality || ""
                  }`}
              </p>
            </div>
          </div>
          <button className="bg-primary text-white lg:px-6 lg:py-2 py-1 rounded-md text-xs px-2 h-fit">
            {`  ${formatPrice(Number(minCarpetPrice))} Starting`}
          </button>
        </div>
      </div>

      <BuilderLayout />

      <div className="hidden lg:block">
        <ReviewSection />
      </div>

      <div className="w-full">
        <div className="hidden lg:block">
          <SimilarComponent propertyId={property?.id} />
        </div>
      </div>

      <Faq />
    </div>
  );
};

export default BuilderComponent;


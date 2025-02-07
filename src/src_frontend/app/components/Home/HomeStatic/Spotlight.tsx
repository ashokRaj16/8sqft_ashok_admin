


// 'use client';
// import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
// import usePropertylist from "@/hooks/usepropertylist";
// import Image from "next/image";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import React, { Suspense } from "react";
// import { FaHeart, FaShareAlt } from "react-icons/fa";
// import { useRouter } from "next/navigation";

// const Spotlight = () => {


//   const searchParams = useSearchParams();
//   const selectedCityName = searchParams.get("city_name") || "";
//   const searchKeyword = searchParams.get("searchKeyword") || "";

//   const { data, isLoading, error } = usePropertylist({
//     city_name: selectedCityName,
//     locality: searchKeyword,
//   });

//   const properties = data?.data.property || [];

  
//   console.log("API Response Data.......xyz:", data);

//   const router = useRouter();


//   const moveToDetailsHandler = (id: number) => {
//     router.push(`/Builder/${id}`);
//   }
  
//   return (
 

    
//     <Suspense fallback={<div>Loading...</div>}>
//       <ReusableCarousel className="w-full">
//         {properties
//           .filter((property: any) => property.property_rent_buy === "PROJECT")
//           .map((property: any) => {
           

//             const features = [
//               {
//                 icon: "/assets/Builder/facingDirection.svg",
//                 label: property.furnishing_status || "25 ft",
//                 alt: "Width of facing road",
//                 subLabel: "Width of facing road",
//               },
//               {
//                 icon: "/assets/Builder/Posted.svg",
//                 label:
//                   new Date(property.availability_date).toLocaleDateString(
//                     "en-IN"
//                   ) || "Available From",
//                 alt: "Posted On Icon",
//                 subLabel: "Posted On",
//               },
//               {
//                 icon: "/assets/Builder/BoundaryWall.svg",
//                 label: property.preferred_tenent || "Yes",
//                 alt: "Boundary Wall Icon",
//                 subLabel: "Boundary Wall",
//               },
//               {
//                 icon: "/assets/Builder/Sqft_meter_Sqft_foot.svg",
//                 label: property.preferred_tenent || "35x26",
//                 alt: "Dimension (LxW)",
//                 subLabel: " Dimension (LxW)",
//               },
//             ];



//             const details = [
//               { label: `₹ ${property.rent_amount || 0}`, subLabel: "Price (Negotiable)" },
//               { label: `${property.price_per_sqft || 0}k`, subLabel: "per sq. ft." },
//               { label: `${property.plot_area_range || "-"}`, subLabel: "Plot area" },
//             ];

//             return (
//               <div
//                 key={property.id}
//                 onClick={() => moveToDetailsHandler(property.id)}
//                 className="lg:border border-gray-300 rounded-lg bg-white shadow-md p-4 space-y-4  
//                "
//                 >
              
//                 <div className="bg-[#ececec] p-4 flex justify-between items-center">
//                   <div>
//                     <h2 className="text-lg font-semibold text-gray-800 truncate">
//                       {property.property_title || "Property Title"}
//                     </h2>
//                     <div className="text-sm text-gray-500 mt-1 flex items-center">
//                       <Image
//                         src="/assets/property-list-asset/g2509.svg"
//                         alt="Location"
//                         width={14}
//                         height={14}
//                       />
//                       <span className="ml-2">{property.locality || "Locality"}</span>
//                     </div>
//                   </div>

//                   <div className="text-white font-medium px-3 py-1 rounded bg-[#FC6600] text-center">
//                     <div className="flex flex-row gap-2">
//                       <div>
//                         <Image
//                           src="/assets/Home_page/Profile.svg"
//                           alt="Location"
//                           width={20}
//                           height={20}
//                         />
//                       </div>
//                       <div>
//                         {property.views || 150}+
//                       </div>
//                     </div>
                
//                     <span className="text-xs text-start block text-white">Views</span>
//                   </div>
//                 </div>

//                 <div className="flex gap-6 justify-around w-[583px] ">
//                   {property  && details.map((detail, index) => (
//                     <div key={index} className="text-center border-r-2  w-[128px] ">
//                       <span className="block text-base font-semibold text-gray-700">
//                         {detail.label}
//                       </span>
//                       <span className="text-sm text-gray-500 whitespace-nowrap">{detail.subLabel}</span>
//                     </div>
//                   ))}
                 
//                 </div>

//                 <div className="w-full h-[1px] bg-gray-200"></div>

//                 <div className="flex flex-col lg:flex-row gap-6">
//                   <img
//                     src={property.property_img_url || "https://via.placeholder.com/300x200"}
//                     alt="Property"
//                     className="w-full lg:w-2/5 h-40 object-cover rounded-md"
//                   />
//                   <div className="flex flex-col justify-between w-full">
//                     <div className="grid grid-cols-2 lg:grid-cols-2  gap-4 border-2 p-4 ">
//                       {features.map((feature, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md border-b-2"
//                         >
//                           <img src={feature.icon} alt={feature.alt} className="w-5 h-5" />
//                           <span className="text-sm text-gray-700">{feature.label}</span>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex justify-between items-center mt-4">
//                       <button className="bg-[#FC6600] text-white px-4 py-2 rounded-md text-sm font-medium">
//                         Get Owner Details
//                       </button>
                     
//                       <div className="hidden lg:flex items-center space-x-3">
//                            <button className="text-gray-300 hover:text-red">
//                            <FaHeart size={20} />
//                           </button>
//                          <button className="text-gray-300 hover:text-blue">
//                            <FaShareAlt size={20} />
//                         </button>
//                          </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//             );
//           })}
//       </ReusableCarousel>
//     </Suspense>

//   );
// };

// export default Spotlight;


'use client';
import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import axios from "axios";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Spotlight Component
// Define the Property type
type Property = {
  id: number;
  property_title: string;
  landmark: string;
  land_area: string;
  deposite_amount: string;
  rent_amount: string;
  image?: string; // Optional because we provide a fallback image
  property_img_url?:string
};

const Spotlight = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const selectedCityName = searchParams.get("city_name") || "";
  const searchKeyword = searchParams.get("searchKeyword") || "";

  const router = useRouter();

  // Fetch the properties using axios

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.8sqft.com/api/v1/front/property/list_properties", {
        params: {
          city_name: selectedCityName,
          locality: searchKeyword,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "A8SQFT7767", // Replace with your actual API key
        },
      });

      const propertiesData = response.data.data?.property || [];


      console.log("API propertiesData:", propertiesData);


      setProperties(propertiesData);
    } catch (err) {
      setError("Failed to fetch properties. Please try again later.");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [selectedCityName, searchKeyword]); // Rerun the fetch when the city or search keyword changes


  

  // Navigate to property details page
  const moveToDetailsHandler = (id: number) => {
    router.push(`/Builder/${id}`);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
   

    <ReusableCarousel className="w-full">
  {properties
    .filter((property: any) => property.property_rent_buy === "PROJECT") // Filter to show only 
    .map((property: any) => {
      const features = [
        {
          icon: "/assets/Builder/facingDirection.svg",
          label: property.width_facing_road || "25 ft",
          alt: "Width of facing road",
          subLabel: "Width of facing road",
        },
        {
          icon: "/assets/Builder/Posted.svg",
          label:
            new Date(property.publish_date).toLocaleDateString("en-IN") || "Available From",
          alt: "Posted On Icon",
          subLabel: "Posted On",
        },
        {
          icon: "/assets/Builder/BoundaryWall.svg",
          label: property.other_amenities?.includes("BOUNDARY WALL") ? "Yes" : "No",
          alt: "Boundary Wall Icon",
          subLabel: "Boundary Wall",
        },
        {
          icon: "/assets/Builder/Sqft_meter_Sqft_foot.svg",
          label: property.config_dimenssion
            ? `${property.config_dimenssion}`
            : "35x26",
          alt: "Dimension (LxW)",
          subLabel: "Dimension (LxW)",
        },
      ];

      const details = [
        {
          label: property.config_carpet_price ? `₹ ${property.config_carpet_price.toLocaleString()}` : "N/A",
          subLabel: "Price (Negotiable)",
        },
        { label: `${property.per_sqft_amount || 0}k`, subLabel: "per sq. ft." },
        { label: `${property.project_area || "-"}`, subLabel: "Plot area" },
      ];

      return (
        <div
          key={property.id}
          onClick={() => moveToDetailsHandler(property.id)}
          className="lg:border border-gray-300 rounded-lg bg-white shadow-md p-4 space-y-4"
        >
          <div className="bg-[#ececec] p-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {property.property_title || "Property Title"}
              </h2>
              <div className="text-sm text-gray-500 mt-1 flex items-center">
                <Image
                  src="/assets/property-list-asset/g2509.svg"
                  alt="Location"
                  width={14}
                  height={14}
                />
                <span className="ml-2">{property.locality || "Locality"}</span>
              </div>
            </div>

            <div className="text-white font-medium px-3 py-1 rounded bg-[#FC6600] text-center">
              <div className="flex flex-row gap-2">
                <div>
                  <Image
                    src="/assets/Home_page/Profile.svg"
                    alt="Location"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  {property.unique_view_count || 0}
                </div>
              </div>
              <span className="text-xs text-start block text-white">Views</span>
            </div>
          </div>

          <div className="flex gap-6 justify-around sm:flex-wrap sm:gap-2 lg:w-full">
            {details.map((detail, index) => (
              <div
                key={index}
                className="text-center border-r-2 sm:border-r-0 sm:border-b-2 w-[128px] sm:w-auto"
              >
                <span className="block text-base font-semibold text-gray-700">
                  {detail.label}
                </span>
                <span className="text-sm text-gray-500 whitespace-nowrap">{detail.subLabel}</span>
              </div>
            ))}
          </div>

          <div className="w-full h-[1px] bg-gray-200"></div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
            <img
              src={property.property_img_url || "https://via.placeholder.com/300x200"}
              alt="Property"
              className="w-full sm:w-1/2 lg:w-2/5 h-40 object-cover rounded-md"
            />

            <div className="flex flex-col justify-between w-full">
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 border-2 p-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md border-b-2"
                  >
                    <img src={feature.icon} alt={feature.alt} className="w-5 h-5" />
                    <span className="text-sm text-gray-700">{feature.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <button className="bg-[#FC6600] text-white px-4 py-2 rounded-md text-sm font-medium">
                  Get Owner Details
                </button>

                <div className="hidden lg:flex items-center space-x-3">
                  <button className="text-gray-300 hover:text-red">
                    <FaHeart size={20} />
                  </button>
                  <button className="text-gray-300 hover:text-blue">
                    <FaShareAlt size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
</ReusableCarousel>

  );
};

export default Spotlight;



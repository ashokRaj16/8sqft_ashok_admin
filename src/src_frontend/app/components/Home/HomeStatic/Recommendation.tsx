


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import RecomandationCard from "@/StaticComponent/RecomandationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Autoplay, Navigation } from "swiper/modules";

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

export default function RecommendationComponent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const fallbackImage = "/assets/Home_page/luxury_banglow.JPG"; // Fallback image if API has no image
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
  // Fetch data from API
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.8sqft.com/api/v1/front/recommendations?property_rent_buy=RENT", {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "A8SQFT7767", 
        },
      });

      const recommendations = response.data.data || [];


 


      const obj =[{property_title:""}]

      // Map response data to the required format
      const formattedProperties: Property[] = recommendations.map((property: any, index: number) => ({
        id: property.id || index, // Use a unique id or fallback to index
        property_title: property.property_title || "No Title Provided",
        landmark: property.landmark || "No Location Provided",
        land_area: ` ${property.land_area ? property.land_area || "N/A"  + property.land_area_unit || "" : ''}`,
        deposite_amount: property.deposite_amount || "No Deposit Info",
        rent_amount: property.rent_amount || "No Rent Info",
        property_img_url: property. property_img_url, // Use fallback image as the API doesn't return an image
      }));

      setProperties(formattedProperties);
    } catch (error) {
      setError("Failed to fetch properties. Please try again later.");
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);


if(loading){
return  <>
<p className="lg:text-2xl text-xl font-medium lg:font-semibold my-5 text-center">Recommendation</p>
<div className="flex justify-center container">
<div className="hidden lg:flex gap-2">
    {[1, 2, 3].map((item) => (
      <div key={item} className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-80 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[290px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
    ))}
  </div>

  {/* Mobile View: Show Only 1 Card */}
  <div className="flex lg:hidden">
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-80 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[290px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    </div>
  </div>
</div>
</>
}
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="">
      <p className="lg:text-2xl text-xl font-medium lg:font-semibold my-5 text-center">Recommendation</p>
        <div className="relative px-4 lg:px-10">
              <Swiper
                grabCursor={true}
                centeredSlides={false}
                slidesPerView={1}
                spaceBetween={10}
                speed={1000}
                loop={true}
                navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                autoplay={{ delay: 1500, disableOnInteraction: false,    pauseOnMouseEnter: true,
                }}
                modules={[Navigation, Autoplay]}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 2,
                  },
                  1200: {
                    slidesPerView: 4,
                  },
                }}
                onSwiper={(swiper) => {
                  setTimeout(() => {
                    if (
                      swiper?.params?.navigation &&
                      typeof swiper?.params?.navigation !== "boolean"
                    ) {
                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                      swiper.navigation.init();
                      swiper.navigation.update();
                    }
                  });
                }}
                className="" 
              >
             {properties.map((property,index) => ( 
        <SwiperSlide key={index} className="h-full">
        <RecomandationCard
            key={property.id}
            id={property.id}
            title={property. property_title}
            location={property.landmark}
            area={property.land_area}
            deposit={property.deposite_amount}
            rent={property.rent_amount}
            imageUrl={property.property_img_url || fallbackImage} // Always use the fallback image
          />
        </SwiperSlide>
        ))}
              </Swiper>
              <button
                ref={prevRef}
                className="hidden lg:block absolute left-4 top-1/2 transform -translate-y-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2 border-primary"
              >
                <ArrowLeft size={18} className="text-primary" />
              </button>
              <button
                ref={nextRef}
                className="hidden lg:block absolute right-4 top-1/2 transform -translate-y-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2 border-primary"
              >
              <ArrowRight size={18} className="text-primary" />
              </button>
            </div>

    </div>
  );
}
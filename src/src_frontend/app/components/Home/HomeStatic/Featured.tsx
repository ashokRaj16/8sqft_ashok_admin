import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import FeaturedCard from "@/StaticComponent/FeaturedCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./scroll.css";
import { useAuthStore } from "@/Store/jwtTokenStore";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Navigation } from "swiper/modules";
import { Skeleton } from "@/components/ui/skeleton";
import { FaBed } from "react-icons/fa";
type Property = {
  id: number;
  property_title: string;
  landmark: string;
  builtup_area: number;
  deposite_amount: string;
  rent_amount: string;
  image?: string;
  property_img_url?: string;
  washrooms?: number;
};
type cardData = {
  landmark: string;
  property_img_url: string;
  bed_rooms: number;
  washrooms?: number;
  balcony: number;
  builtup_area: number;
  rent_amount: string;
  property_title: string;
  title_slug: string;
  id: number;
};

export default function FeaturedComponent() {
  const [activeTab, setActiveTab] = useState("sell");
  const [sellCardData, setSellCardData] = useState<cardData[]>([]);
  const [rentCardData, setRentCardData] = useState<cardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const token = useAuthStore((state) => state.token);
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://api.8sqft.com/api/v1/front/recommendations?property_rent_buy=RENT",
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "A8SQFT7767",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const recommendations = response.data.data || [];

        const sellData = recommendations.filter(
          (property: { property_rent_buy: string }) =>
            property.property_rent_buy === "RENT"
        );

        const rentData = recommendations.filter(
          (property: { property_rent_buy: string }) =>
            property.property_rent_buy === "RENT"
        );


        setSellCardData(sellData);
        setRentCardData(rentData);
      } catch (error) {
        setError("Failed to fetch properties. Please try again later.");
      }
      finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [activeTab]);


  if(loading){
    return  <>
    <div className=" container">
    <p className="lg:text-2xl text-xl font-medium lg:font-semibold my-5 text-center">For Sell/ For Rent</p>
    <div className="justify-center flex-wrap gap-4 hidden lg:flex ">
        {[1, 2, 3].map((item) => (
          <div key={item} className="p-4 space-y-4 w-[350px]">
          <Skeleton className="w-full h-40 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
      
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        ))}
      </div>
      <div className="flex lg:hidden justify-center">
      <div className="p-4 space-y-4 w-[350px]">
          <Skeleton className="w-full h-40 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
      
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-10 w-10 rounded-full" />
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
    <div className=" w-full h-full relative pt-5">
      <p className="lg:text-3xl text-xl font-medium lg:font-semibold my-5 text-primary lg:hidden text-center">
        Explore the Featured Properties
      </p>
      <Tabs defaultValue="sell" onValueChange={(value) => setActiveTab(value)}>
        <div className="flex items-center justify-center relative mb-2">
          <TabsList className="flex justify-center gap-5">
            <TabsTrigger
              value="sell"
              className="text-[#22222270] data-[state=active]:bg-[#FFF3EB] data-[state=active]:text-primary bg-[#EFEFEF] px-6 py-3 rounded-sm w-full lg:w-auto"
            >
              For Sell
            </TabsTrigger>

            <TabsTrigger
              value="rent"
              className="text-[#22222270] data-[state=active]:bg-[#FFF3EB] data-[state=active]:text-primary bg-[#EFEFEF] px-6 py-3 rounded-sm w-full lg:w-auto"
            >
              For Rent
            </TabsTrigger>
          </TabsList>
          <div className="z-10 lg:flex flex-row items-center absolute right-3 hidden">
            <button
              className=" shadow-md p-2 rounded-full  border-2 border-primary"
              ref={prevRef}
            >
              <ArrowLeft size={18} className="text-primary" />
            </button>

            <button
              className=" shadow-md p-2 ml-2 rounded-full  border-2 border-primary"
              ref={nextRef}
            >
              <ArrowRight size={18} className="text-primary" />
            </button>
          </div>
        </div>

        <div className=" w-full sm:w-[60vw] md:w-full">
          <div className="relative flex flex-col items-center">
            {/* <div className="relative w-1/2 h-[90vh] hidden lg:block rounded-lg p-10 overflow-hidden">
              <div className="h-[90vh] bg-[#FFF3EB] rounded-lg">
                <div
                  className="absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: "url('/assets/Home_page/HorizontalDots.svg')",
                    backgroundPosition: "left center",
                    backgroundSize: "20% auto",
                  }}
                ></div>

                <div
                  className="absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: "url('/assets/Home_page/verticalDots.svg')",
                    backgroundPosition: "right 30px top 0px",
                  }}
                ></div>

                <div className="relative z-20 flex flex-row absolute mr-16">
                  <p className="text-4xl font-semibold text-primary leading-tight pt-4">
                    Explore the Featured Properties
                  </p>
                </div>

                <div className="relative z-10 flex flex-row mt-[290px] ml-[120px] absolute bottom-10">


                  <button className=" shadow-md p-2 rounded-full  border-2 border-primary" onClick={() => handleScroll("prev")}>
                    <ArrowLeft size={18} className="text-primary" />
                  </button>

                  <button className=" shadow-md p-2 ml-[20px] rounded-full  border-2 border-primary" onClick={() => handleScroll("next")}>
                    <ArrowRight size={18} className="text-primary" />
                  </button>


                </div>


              </div>
            </div> */}

            <div className="w-full h-fit relative  ">
              <div className=" ">
                <TabsContent value="sell">
                 
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={1.2}
                    speed={1000}
                    loop={true}
                    navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                    autoplay={{ delay: 1500, disableOnInteraction: false,    pauseOnMouseEnter: true,
                    }}
                    modules={[Navigation, Autoplay]}
                    breakpoints={{
                      640: {
                        slidesPerView: 1.2,
                      },
                      768: {
                        slidesPerView: 2,
                      },
                      1024: {
                        slidesPerView: 3,
                      },
                      1200: {
                        slidesPerView: 4.5,
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
                  >
                    {sellCardData.map((data, index) => (
                      <SwiperSlide key={index}>
                        <FeaturedCard
                          priceType={""}
                          title={data.property_title}
                          propertyIdSlug={data.title_slug}
                          location={data.landmark}
                          imageUrl={data.property_img_url}
                          beds={data.bed_rooms}
                          washrooms={data.washrooms}
                          balconies={data.balcony}
                          area={data.builtup_area}
                          price={data.rent_amount}
                          key={data.id}
                          {...data}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </TabsContent>

                <TabsContent value="rent">
                  

                  <Swiper
                    spaceBetween={20}
                    slidesPerView={1.2}
                    speed={1000}
                    loop={true}
                    navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                    autoplay={{ delay: 1500, disableOnInteraction: false,    pauseOnMouseEnter: true,
                    }}
                    modules={[Navigation, Autoplay]}
                    breakpoints={{
                      640: {
                        slidesPerView: 1.2,
                      },
                      768: {
                        slidesPerView: 2,
                      },
                      1024: {
                        slidesPerView: 3,
                      },
                      1200: {
                        slidesPerView: 4.5,
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
                  >
                    {rentCardData.map((data, index) => (
                      <SwiperSlide key={index}>
                         <FeaturedCard
                        className="bg-transparent"
                        priceType={"Month"}
                        title={data.property_title}
                        propertyIdSlug={data.title_slug}
                        location={data.landmark}
                        imageUrl={data.property_img_url}
                        beds={data.bed_rooms}
                        washrooms={data.washrooms}
                        balconies={data.balcony}
                        area={data.builtup_area}
                        price={data.rent_amount}
                        key={data.id}
                        {...data}
                      />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </TabsContent>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

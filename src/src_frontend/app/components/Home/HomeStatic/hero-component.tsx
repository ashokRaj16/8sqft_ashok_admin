import { useRouter } from "next/navigation";
import SearchComponent from "./Seachbar/search-bar";
import Img from "@/public/assets/Home_page/KamalRAJ.png";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, EffectFade, Navigation } from "swiper/modules";
import { useEffect, useRef, useState } from "react";
import axios from "@/hooks";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
export default function HeroComponent() {
  const router = useRouter();
 const prevRef = useRef(null);
  const nextRef = useRef(null);

    const [sliderData, setSliderData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/front/spotlight/hero_banner`, {
          params: {
            categories: "HOME BANNER",
          },
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
          },
        });
  
        const sliderResponse = response.data.data || [];
        setSliderData(sliderResponse);
      } catch (err) {
        setError("Failed to fetch properties. Please try again later.");
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      fetchProperties();
    }, []);

    const handleClick=(item:any)=>{
      if(item.is_dedicated=="1"){
        router.push(item.title_slug)
      }
      else{
        router.push(`/Builder/${item.spotlight_slug}`)
      }
    }
    
    console.log('dataaa', sliderData);
    if (loading) {
      return <div>
         loading...
      </div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }
  return (
    <>
      <div className="h-auto relative">
        <div className="relative w-full lg:pb-14 pb-4 lg:pt-2 pt-1 cursor-pointer">
          <Swiper
           effect='creative'
           creativeEffect={{
            prev: {
              shadow: true,
              translate: ['-20%', 0, -1],
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }}
            modules={[EffectCreative,Navigation]}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            loop={true}
            speed={800}
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
            className="swiper-container w-full"
          >
            {sliderData.map((item, index) => (
              <SwiperSlide
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => handleClick(item)}
                >
                  <img
                    src={item.banner_url}
                    alt={`Slide ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    className="hidden lg:block hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                  {/* Mobile View */}
                  <img
                    src={item.banner_mobile_url}
                    alt={`Slide ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    className="block lg:hidden"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            ref={prevRef}
            className="hidden lg:block absolute left-2 top-1/2 -translate-y-1/2 z-40  shadow-lg backdrop-blur-sm p-1 rounded-full bg-white/30 text-white border-2 border-white" 
          >
            <GoChevronLeft className="text-shadow-lg" size={22} />
          </button>
          <button
            ref={nextRef}
            className="hidden lg:block absolute right-5 top-1/2 -translate-y-1/2 z-40  shadow-lg backdrop-blur-sm p-1 rounded-full bg-white/30 text-white border-2 border-white" 
          >
            <GoChevronRight className="text-shadow-lg" size={22} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="absolute -bottom-2 w-full sm:flex justify-center px-4 z-10">
          <SearchComponent />
        </div>
      </div>
    </>
  );
}
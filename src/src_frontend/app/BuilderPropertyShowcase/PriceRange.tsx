import { Card, CardContent } from "@/ui/card";
import { hexToRgba } from "@/utils/hexToRGB";
import { formatNumber } from "@/utils/priceFormatter";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";



interface PriceRangeProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  builderResponseData: any;
}
export default function PriceRange({
  themeColors,
  builderResponseData
}: PriceRangeProps) {
  const propertyData = builderResponseData?.property;
  const configurationData = builderResponseData?.configuration;
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <>
      <div className="my-4" style={{ color: themeColors.themeColorDark }}>
        <h3 className="font-semibold my-2  text-lg">Price Range</h3>
        <div
          className="relative"
        >
        <Swiper
          grabCursor={true}
          slidesPerView={1.2}
          spaceBetween={20}
          speed={700}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          loop={true}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
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
              slidesPerView: 2.5,
            },
            1200: {
              slidesPerView: 3.8,
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
          {configurationData.map((item: any, index: number) => (
            <SwiperSlide key={index} className="h-full">
              <Card key={index} className="p-6 rounded-xl border-none text-center " style={{ backgroundColor: themeColors.themeColorLight }}>
                <h2 className="text-2xl font-bold">{item.unit_name}</h2>
                <p className=" uppercase opacity-80 tracking-[0.6em]">{propertyData.property_variety}</p>
                <p className="text-lg font-semibold mt-2">
                  ₹ {formatNumber(item.carpet_price)}
                </p>
                <p className="text-sm mt-1">Carpet Area: {item.carpet_area} Sqft</p>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
            ref={prevRef}
            className="hidden lg:block absolute -left-5 top-1/2 -translate-y-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2"
            style={{ borderColor: themeColors.themeColorDark }}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            ref={nextRef}
            className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2"
            style={{ borderColor: themeColors.themeColorDark }}
          >
            <ArrowRight size={18} />
          </button>

      </div>
      </div>
    </>
  );
}

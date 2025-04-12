import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface ProjectTourProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  builderResponseData: any; 
}
export default function ProjectTour({
  themeColors,
  builderResponseData
}: ProjectTourProps) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [activeTab, setActiveTab] = useState("photos");

  const images = builderResponseData?.sponsaredImages?.filter((item: any) =>
    item.file_type.startsWith("image")
  ) || [];

  const videos = builderResponseData?.sponsaredImages?.filter((item: any) =>
    item.file_type.startsWith("video")
  ) || [];
  return (
    <>
      <div className="my-4"  style={{color:themeColors.themeColorDark}}>
        <h3 className="font-semibold my-2  text-lg">Tour this project</h3>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="justify-center w-full">
            <TabsTrigger
              className="data-[state=active]:border-b-2 data-[state=active]:opacity-100 opacity-50 w-fit rounded-none"
             
              style={{
                borderColor: activeTab === "photos" ? themeColors.themeColorDark : "transparent",
                color: themeColors.themeColorDark ,
              }}
              value="photos"
            >
              Photos
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:border-b-2 data-[state=active]:opacity-100 opacity-50 w-fit rounded-none"
              style={{
                borderColor: activeTab === "videos" ? themeColors.themeColorDark : "transparent",
                color: themeColors.themeColorDark ,
              }}
              value="videos"
            >
              Videos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="photos">
            <div className="relative">
              <Swiper
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1.2}
                spaceBetween={20}
                speed={1000}
                loop={true}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                autoplay={{
                  delay: 1500,
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
                    slidesPerView: 3,
                  },
                  1200: {
                    slidesPerView: 3,
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
                {images.map((item:any, index:number) => (
                  <SwiperSlide key={index} className="h-full">
                    <Image
                      src={item.img_url}
                      alt={item.img_url + "img"}
                      width={320}
                      height={320}
                      className="object-cover w-80 h-80 rounded-xl"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                ref={prevRef}
                className="hidden lg:block absolute -left-5 top-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2" style={{borderColor:themeColors.themeColorDark}}
              >
                <ArrowLeft size={18}  />
              </button>
              <button
                ref={nextRef}
                className="hidden lg:block absolute -right-3 top-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2" style={{borderColor:themeColors.themeColorDark}}
              >
                <ArrowRight size={18}  />
              </button>
            </div>
          </TabsContent>
          <TabsContent value="videos">
            <div className="relative">
              <Swiper
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1.2}
                spaceBetween={20}
                speed={1000}
                loop={true}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                autoplay={{
                  delay: 1500,
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
                    slidesPerView: 3,
                  },
                  1200: {
                    slidesPerView: 3,
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
                {videos.map((item:any, index:number) => (
                  <SwiperSlide key={index} className="h-full">
                     <video
                    src={item.img_url}
                    controls
                    className="w-80 h-80 rounded-xl object-cover"
                  />
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                ref={prevRef}
                className="hidden lg:block absolute -left-5 top-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2" style={{borderColor:themeColors.themeColorDark}}
              >
                <ArrowLeft size={18}  />
              </button>
              <button
                ref={nextRef}
                className="hidden lg:block absolute -right-3 top-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2" style={{borderColor:themeColors.themeColorDark}}
              >
                <ArrowRight size={18}  />
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

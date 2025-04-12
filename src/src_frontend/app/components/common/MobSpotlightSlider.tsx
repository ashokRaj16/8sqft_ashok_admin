import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/Button";
import { Pause, Play } from "lucide-react";
import axios from "@/hooks";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/utils/priceFormatter";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/ui/progress";

const AUTOPLAY_DELAY = 3000;
const SLIDE_SPEED = 1000;
const MobSpotlightSlider: React.FC = () => {
  const titleSwiperRef = useRef<SwiperClass | null>(null);
  const contentSwiperRef = useRef<SwiperClass | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (isPaused) return;

    setProgress(0); // Reset progress when slide starts

    let progressInterval = setInterval(() => {
      setProgress((prev) =>
        prev >= 100 ? 100 : prev + 100 / ((AUTOPLAY_DELAY - SLIDE_SPEED) / 100)
      );
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isPaused, contentSwiperRef.current]);

  const syncSwipers = (swiper: SwiperClass) => {
    titleSwiperRef.current?.slideTo(swiper.activeIndex);
    contentSwiperRef.current?.slideTo(swiper.activeIndex);

    setTimeout(() => {
      setProgress(0); // Reset progress after SLIDE_SPEED delay
    }, SLIDE_SPEED);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    [titleSwiperRef.current, contentSwiperRef.current].forEach((swiper) => {
      swiper && (isPaused ? swiper.autoplay.start() : swiper.autoplay.stop());
    });
  };



  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/front/spotlight`, {
        params: {
          categories: "SPOTLIGHT",
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "A8SQFT7767", // Replace with your actual API key
        },
      });

      const propertiesData = response.data.data || [];

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
  }, []);
  const userDefinedKeys = [
    { label: "", key: "property_title" },
    // { label: "Type", key: "property_variety" },
    { label: "Configuration", key: "configuration" },
    { label: "Possession Start", key: "possession_date" },
    { label: "Avg. Price", key: "per_sqft_amount" },
    { label: "Carpet Area", key: "carpet_area_range" },
  ];

  const moveToDetailsHandler = async (id: string) => {
    router.push(`/Builder/${id}`);
  };

  if (loading) {
    return <div>
     <div className="flex flex-col items-center space-y-3">
      <Skeleton className="h-[125px] w-[300px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>

    </div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <div className=" mx-auto pt-4 shadow-custom my-2 rounded-[20px]">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          direction="vertical"
          slidesPerView={1}
          speed={SLIDE_SPEED}
          autoplay={{ delay: AUTOPLAY_DELAY, disableOnInteraction: false }}
          className="h-16"
          onSwiper={(swiper) => (titleSwiperRef.current = swiper)}
          onSlideChange={syncSwipers}
        >
          {properties.map(({ property_img_url, property_title, company_name,title_slug }, index) => (
            <SwiperSlide key={index} onClick={()=>  moveToDetailsHandler(title_slug)}>
              <div className="flex items-center space-x-4 px-4">
                <img
                  src={property_img_url}
                  alt="Logo"
                  className=" w-16 h-16 object-cover rounded-full"
                />
                <div className="text-start">
                  <h2 className="text-base font-semibold line-clamp-1">{property_title}</h2>
                  <p className="text-sm text-[#22222280]">{company_name}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="relative">
          <Swiper
            modules={[EffectFade, Navigation, Autoplay]}
            effect="fade"
            speed={SLIDE_SPEED}
            autoplay={{ delay: AUTOPLAY_DELAY, disableOnInteraction: false }}
            className="mt-3"
            onSwiper={(swiper) => (contentSwiperRef.current = swiper)}
            onSlideChange={syncSwipers}
          >
            {properties.map(({ property_img_url, bhk_types, possession_date, per_sqft_amount, carpet_area_range,property_type,other_unit_types,property_variety,title_slug }, index) => (
              <SwiperSlide key={index} onClick={()=>  moveToDetailsHandler(title_slug)}>
                <Card className="overflow-hidden relative rounded-[20px] border-0">
                  <img
                    src={property_img_url}
                    alt="Project"
                    className="w-full h-[417px] object-cover"
                  />
                  <CardContent className="p-4 text-start absolute bottom-0 left-1/2 right-1/2 -translate-x-1/2 w-full">
                    <div className="text-white text-xs flex flex-col gap-2 rounded-xl bg-[#6a6a6a4a] border backdrop-blur-[3px] border-white p-2">
                      <p className="font-semibold bg-[#222222] p-1 rounded-md">
                       <span className="font-normal"> Configuration :</span> {property_type === "RESIDENTIAL"
                          ? [
                              other_unit_types,
                              bhk_types,
                              property_variety,
                            ]
                              .filter(Boolean)
                              .join(", ")
                          : property_variety || "-"}
                      </p>
                      <p className="font-semibold bg-[#222222] p-1 rounded-md">
                        <span className="font-normal">Possession Starts :</span> {possession_date || "-"}
                      </p>
                      <p className="font-semibold bg-[#222222] p-1 rounded-md">
                        <span className="font-normal">Average Price :</span> {`₹ ${formatNumber(per_sqft_amount) || "-"} / sq ft`}
                      </p>
                      <p className="font-semibold bg-[#222222] p-1 rounded-md">
                        <span className="font-normal">Carpet Area :</span> {` ${carpet_area_range || "-"} sq ft`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute top-0 left-0 right-0 z-10">
            <div className=" flex items-center gap-4 justify-between p-3">
            <Progress value={progress} className="w-full h-1" />
       
              <Button className="bg-black p-1 h-5 w-5 rounded-full" onClick={togglePause}>
                {isPaused ? (
                  <Play className="text-white h-3" />
                ) : (
                  <Pause className="text-white h-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobSpotlightSlider;

import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Controller } from "swiper/modules";
import { useEffect, useState } from "react";
import axios from "@/hooks";
import { formatNumber } from "@/utils/priceFormatter";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/Button";
import { Pause, Play } from "lucide-react";
import { Card } from "@/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/ui/progress";

interface Property {
  id: number;
  property_title: string;
  property_variety: string;
  property_type: string;
  possession_date: string | null;
  config_carpet_price: string | null;
  carpet_area_range: string | null;
  project_area: string | null;
  other_unit_types: string | null;
  bhk_types: string | null;
  property_img_url: string;
}

const SpotlightSlider: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [textSwipers, setTextSwipers] = useState<any[]>([]); // Array to hold all vertical Swiper instances
  const [imageSwiper, setImageSwiper] = useState<any>(null); // Horizontal Swiper instance
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // State to track autoplay status

  // Sync all vertical Swipers with the horizontal Swiper
  useEffect(() => {
    if (imageSwiper && textSwipers.length > 0) {
      textSwipers.forEach((swiper) => {
        swiper.controller.control = imageSwiper;
      });
      imageSwiper.controller.control = textSwipers; // Control all vertical Swipers
    }
  }, [imageSwiper, textSwipers]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/front/spotlight`, {
        params: {
          categories: "SPOTLIGHT",
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "A8SQFT7767",
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
    { label: "Configuration", key: "configuration" },
    { label: "Possession Start", key: "possession_date" },
    { label: "Avg. Price", key: "per_sqft_amount" },
    { label: "Carpet Area", key: "carpet_area_range" },
  ];

  const moveToDetailsHandler = async (id: string) => {
    router.push(`/Builder/${id}`);
  };

  // Toggle autoplay between play and pause
  const toggleAutoplay = () => {
    if (imageSwiper) {
      if (isPlaying) {
        imageSwiper.autoplay.stop();
      } else {
        imageSwiper.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) {
    return <div>
          <Card className="flex flex-col max-w-screen-xl mx-auto md:flex-row p-4 rounded-xl space-y-4 md:space-y-0 md:space-x-4">
      {/* Left Section Skeleton */}
      <div className="flex flex-col w-full md:w-1/3 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-[50px] w-[50px] rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-3 w-[140px]" />
          </div>
        </div>

        <Skeleton className="h-3 w-[100px]" />
        <Skeleton className="h-[1px] w-full" />

        <Skeleton className="h-3 w-[80px]" />
        <Skeleton className="h-[1px] w-full" />

        <Skeleton className="h-3 w-[120px]" />
        <Skeleton className="h-[1px] w-full" />

        <Skeleton className="h-3 w-[180px]" />
        <Skeleton className="h-[1px] w-full" />

        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Right Section (Image Placeholder with Progress Bar) */}
      <div className="relative w-full md:w-2/3">
        <Skeleton className="h-[220px] w-full rounded-xl" />
        <div className="absolute top-4 left-2 w-full h-2 bg-gray-200">
          <Skeleton className="h-full w-2/3" />
        </div>
        <div className="absolute top-2 right-2">
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </Card>

    </div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-4 rounded-2xl shadow-custom bg-white">
      <div className="grid grid-cols-3 gap-9">
        <div className="space-y-2">
          {userDefinedKeys.map((item, index) => (
            <div
              key={item.key}
              className={`${
                item.key === "property_title"
                  ? "h-20 border-0"
                  : "h-16 border-b-2"
              }  border-primary pb-2 pl-3 flex flex-col items-start `}
            >
              <Swiper
              loop
                direction="vertical"
                speed={1000}
                modules={[Controller]}
                onSwiper={(swiper) => {
                  // Add each vertical Swiper instance to the array
                  setTextSwipers((prev) => {
                    const newSwipers = [...prev];
                    newSwipers[index] = swiper;
                    return newSwipers;
                  });
                }}
                allowTouchMove={false}
                simulateTouch={false}
                noSwiping={true}
                className="h-full"
                style={{ margin: "0px" }}
              >
                {properties.map((property) => {
                  let value;
                  if (item.key === "property_title") {
                    value = (
                      <div className="flex items-center gap-3">
                        <div   className="w-20 h-20 bg-white">
                        <img
                          src={property.property_logo_url||property.property_img_url}
                          alt={property.property_title}
                          className="w-16 h-16 object-cover"
                        />
                        </div>
                        
                        <div className="flex flex-col justify-between gap-2">
                          <p className="font-semibold text-xl text-[#222222]">
                            {property.property_title}
                          </p>
                          <p className="text-xl text-[#222222]">
                            {property.company_name}
                          </p>
                        </div>
                      </div>
                    );
                  } else if (item.key === "per_sqft_amount") {
                    value = property.per_sqft_amount
                      ? `₹ ${formatNumber(property.per_sqft_amount)} / sq ft`
                      : "-";
                  } else if (item.key === "carpet_area_range") {
                    value = property.carpet_area_range
                      ? `₹ ${property.carpet_area_range} sq ft`
                      : "-";
                  } else if (item.key === "configuration") {
                    value =
                      property.property_type === "RESIDENTIAL"
                        ? [
                            property.other_unit_types,
                            property.bhk_types,
                            property.property_variety,
                          ]
                            .filter(Boolean)
                            .join(", ")
                        : property.property_variety || "-";
                  } else {
                    value = property[item.key as keyof Property] || "-";
                  }
                  return (
                    <SwiperSlide key={property.id} className="m-0">
                      <div className="text-[#222222] font-regular text-start text-lg">
                        {value}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <p className="text-sm text-[#22222270]">{item.label}</p>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              onClick={() =>
                moveToDetailsHandler(properties[activeIndex]?.title_slug)
              }
              className="bg-[#FC6600] text-white px-4 py-2 rounded-md text-sm font-medium w-full"
            >
              Explore More
            </button>
          </div>
        </div>
        <div className="col-span-2 relative">
          <Swiper
          loop
            direction="horizontal"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            speed={1000}
            modules={[Autoplay, Controller]}
            onSwiper={setImageSwiper}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.activeIndex);
              setProgress(0);
            }}
            onAutoplayTimeLeft={(swiper, timeLeft, progressPercentage) => {
              setProgress(102-progressPercentage * 100);
            }}
            // allowTouchMove={false}
            // simulateTouch={false}
            noSwiping={true}
            className="h-[420px] rounded-2xl overflow-hidden"
          >
            {properties.map((property) => (
              <SwiperSlide key={property.id}>
                <img
                  src={property.property_img_url}
                  alt={property.property_title}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="absolute top-0 left-0 right-0 z-10">
            <div className=" flex items-center gap-4 justify-between p-3">
          <Progress value={progress} className="w-full h-1" />
           
              <Button className="bg-black p-1 h-7 w-7 rounded-full" onClick={toggleAutoplay}>
                {isPlaying ? (
                  <Pause className="text-white h-4" />
                ) : (
                  <Play className="text-white h-4" />
                )}
              </Button>
            </div>
          </div>
      
        </div>
      </div>
    </div>
  );
};

export default SpotlightSlider;
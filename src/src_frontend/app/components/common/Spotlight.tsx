import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, Controller, Thumbs, EffectFade, Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import axios from "@/hooks";
import { formatNumber } from "@/utils/priceFormatter";
import { useRouter } from "next/navigation";
import MobSpotlightSlider from "./MobSpotlightSlider";

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
  const [controlledSwiper, setControlledSwiper] = useState<any>(null);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
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

  
  return (
    <>
      <div className="max-w-screen-xl mx-auto p-4 rounded-2xl shadow-custom bg-white">
        <div className="grid grid-cols-3 gap-9">
          <div className="space-y-2">
            {userDefinedKeys.map((item) => (
              <div
                key={item.key}
                className={`${
                  item.key === "property_title"
                    ? "h-20 border-0"
                    : "h-16 border-b-2"
                }  border-primary pb-2 pl-3 flex flex-col items-start `}
              >
                <Swiper
                  direction="vertical"
                  autoplay={{ delay: 1000 }}
                  speed={1500}
                  modules={[Autoplay, Controller]}
                  allowTouchMove={false} // Disable touch-based scrolling
                  simulateTouch={false} // Disable mouse drag
                  noSwiping={true}
                  onSwiper={setControlledSwiper}
                  onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                  className="h-full"
                  style={{ margin: "0px" }}
                >
                  {properties.map((property) => {
                    let value;
                    if (item.key === "property_title") {
                      value = (
                        <div className="flex items-center gap-5">
                          <img
                            src={property.property_img_url}
                            alt={property.property_title}
                            className="w-20 h-20 rounded-sm object-cover"
                          />
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
          <div className="col-span-2">
            <Swiper
              direction="horizontal"
              autoplay={{ delay: 1000 }}
              speed={1500}
              modules={[Autoplay, Controller]}
              controller={{ control: controlledSwiper }}
              allowTouchMove={false} // Disable touch-based scrolling
              simulateTouch={false} // Disable mouse drag
              noSwiping={true}
              className=" h-[420px] rounded-2xl overflow-hidden"
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
          </div>
        </div>
      </div> 
    </>
  );
};

export default SpotlightSlider;

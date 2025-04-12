import { Card } from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { hexToRgba } from "@/utils/hexToRGB";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface AmenitiesProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  builderResponseData: any;
  otherAmenities?: string | undefined; // Comma-separated string of amenities from the API
  parking?: string | null | undefined;
  waterSupply?: string | null | undefined;
  grantedSecurity?: string | null | undefined;
  sewageConnection?: string | null | undefined;
  electricityConnection?: string | null | undefined;
  washroomType?: string | null | undefined;
  furnishingStatus?: string | null | undefined;
}
export default function Amenities({
  themeColors,
  builderResponseData,
  otherAmenities,
  parking,
  waterSupply,
  grantedSecurity,
  sewageConnection,
  electricityConnection,
  washroomType,
  furnishingStatus,
}: AmenitiesProps) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const amenitiesArray = otherAmenities
    ? otherAmenities.split(",").map((item) => item.trim())
    : [];
  if (otherAmenities) {
    amenitiesArray.push(
      ...(parking ? [parking] : []),
      ...(waterSupply ? ["Water Supply"] : []),
      ...(grantedSecurity ? ["Granted Security"] : []),
      ...(sewageConnection ? ["Sewage Connection"] : []),
      ...(electricityConnection ? ["Electricity Connection"] : []),
      ...(washroomType ? [washroomType] : []),
      ...(furnishingStatus ? [furnishingStatus] : [])
    );
  }
  otherAmenities = amenitiesArray.join(", ");
  const amenities = [
    {
      icon: "/assets/Builder/amenity/WaterSupply.svg", 
      label: "Water Supply",
    },
    {
      icon: "/assets/Builder/amenity/Washroom.svg", 
      label: "Shared",
    },
    {
      icon: "/assets/Builder/amenity/Washroom.svg", 
      label: "Private",
    },
    {
      icon: "/assets/Builder/amenity/furnished.svg", 
      label: "Furnished",
    },
    {
      icon: "/assets/Builder/amenity/furnished.svg", 
      label: "Semi-furnished",
    },
    {
      icon: "/assets/Builder/amenity/SewageTreatmentPlant.svg",
      label: "Sewage Connection",
    },
    {
      icon: "/assets/Builder/amenity/Security.svg", 
      label: "Granted Security",
    },
    {
      icon: "/assets/Builder/amenity/Electricity.svg", 
      label: "Electricity Connection",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg",
      label: "2+4 Wheeler",
    },
    {
      icon: "/assets/Builder/amenity/4_wheeler_parking.svg",
      label: "4 wheeler",
    },
    {
      icon: "/assets/Builder/amenity/2_wheeler_parking.svg",
      label: "2 wheeler",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg",
      label: "Extra Paid Parking",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg",
      label: "Public and Reserved",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg",
      label: "Public",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg",
      label: "Reserved",
    },
    {
      icon: "/assets/Builder/amenity/AirConditioner.svg", 
      label: "Air Conditioner",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg", 
      label: "Visitor parking",
    },
    {
      icon: "/assets/Builder/amenity/Amphitheater.svg", 
      label: "Amphitheater",
    },
    {
      icon: "/assets/Builder/amenity/PlayArea.svg", 
      label: "Play Area",
    },
    {
      icon: "/assets/Builder/amenity/Powerbackup.svg", 
      label: "Power Backup",
    },
    {
      icon: "/assets/Builder/amenity/FireSafety.svg",
      label: "Fire Safety",
    },
    {
      icon: "/assets/Builder/amenity/RainWaterHarvesting.svg",
      label: "Rain Water Harvesting",
    },

    {
      icon: "/assets/Builder/amenity/Shoppingcentre.svg",
      label: "Shopping Centre",
    },
    {
      icon: "/assets/Builder/amenity/SolarWater.svg",
      label: "Solar Water",
    },
    {
      icon: "/assets/Builder/amenity/ServantRoom.svg",
      label: "Servant Room",
    },
    {
      icon: "/assets/Builder/amenity/Garden.svg", 
      label: "Garden",
    },
    {
      icon: "/assets/Builder/amenity/InternetServices.svg", 
      label: "Internet Services",
    },
    {
      icon: "/assets/Builder/amenity/Lift.svg", 
      label: "Lift",
    },
    {
      icon: "/assets/Builder/amenity/Park.svg", 
      label: "Park",
    },
    {
      icon: "/assets/Builder/amenity/NoSmoking.svg", 
      label: "Smoking",
    },

    {
      icon: "/assets/Builder/amenity/Intercom.svg", 
      label: "Intercom",
    },
    {
      icon: "/assets/Builder/amenity/IndoorGame.svg", 
      label: "Indoor Game",
    },
    {
      icon: "/assets/Builder/amenity/HouseKeeping.svg", 
      label: "House Keeping",
    },
    {
      icon: "/assets/Builder/amenity/Gym.svg", 
      label: "Gym",
    },
    {
      icon: "/assets/Builder/amenity/Guardian.svg", 
      label: "Guardian",
    },
    {
      icon: "/assets/Builder/amenity/Girl.svg", 
      label: "Girl",
    },
    {
      icon: "/assets/Builder/amenity/Boy.svg", 
      label: "Boy",
    },
    {
      icon: "/assets/Builder/amenity/GasPipeline.svg", 
      label: "Gas Pipeline",
    },
    {
      icon: "/assets/Builder/amenity/CCTV.svg", 
      label: "CCTV Camera",
    },
    {
      icon: "/assets/Builder/amenity/BoundaryWall.svg", 
      label: "Boundary Wall",
    },

    {
      icon: "/assets/Builder/amenity/UnderGroundElectricity.svg", 
      label: "Under Ground Electricity",
    },
    {
      icon: "/assets/Builder/amenity/Temple.svg", 
      label: "Temple",
    },
    {
      icon: "/assets/Builder/amenity/WaterStorage.svg", 
      label: "Water Storage",
    },
    {
      icon: "/assets/Builder/amenity/VastuCompliance.svg", 
      label: "Vastu Compliance",
    },
    {
      icon: "/assets/Builder/amenity/Road.svg", 
      label: "Road",
    },
    {
      icon: "/assets/Builder/amenity/SwimmingPool.svg", 
      label: "Swimming Pool",
    },
    {
      icon: "/assets/Builder/amenity/DayCare.svg", 
      label: "Day Care",
    },
    {
      icon: "/assets/Builder/amenity/ConferenceRoom.svg", 
      label: "Conference Room",
    },
    {
      icon: "/assets/Builder/amenity/water.svg", 
      label: "water",
    },
    {
      icon: "/assets/Builder/amenity/Drinking.svg", 
      label: "Drinking",
    },

    {
      icon: "/assets/Builder/amenity/Family.svg", 
      label: "Family",
    },
    {
      icon: "/assets/Builder/amenity/facingDirection.svg", 
      label: "facing Direction",
    },
    {
      icon: "/assets/Builder/amenity/StreetPole.svg", 
      label: "Street Pole",
    },
    {
      icon: "/assets/Builder/amenity/CementRoad.svg",
      label: "Cement Road",
    },
    {
      icon: "/assets/Builder/amenity/Drainage.svg", 
      label: "Drainage",
    },
    {
      icon: "/assets/Builder/amenity/ClubHouse.svg", 
      label: "Club House",
    },
  ];
  const availableAmenities = amenities.filter((amenity) => {
    if (!otherAmenities || typeof otherAmenities !== "string") {
      return false; // Skip filtering if `otherAmenities` is invalid
    }

    // Normalize spaces and case for better matching
    const amenitiesArray = otherAmenities
      .toUpperCase() // Normalize to uppercase
      .split(", ") // Split by comma (without the space)
      .map((amenityName) => amenityName.trim()); // Trim extra spaces

    return amenitiesArray.includes(amenity.label.toUpperCase()); // Match against normalized amenity names
  });
  return (
    <>
      <div className="my-4" style={{ color: themeColors.themeColorDark }}>
        <h3 className="font-semibold mt-2  text-lg">Amenities</h3>

        <div
          className="relative"
       
        >
          <Swiper
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={2}
            spaceBetween={20}
            speed={700}
            loop={true}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
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
                slidesPerView: 3,
              },
              1200: {
                slidesPerView: 4.3,
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
            {availableAmenities.map((item, index) => (
              <SwiperSlide key={index} className="h-full">
                <Card
                  className="justify-center items-center flex flex-col border-0 gap-2  mt-4 mb-2 rounded-lg p-3"
                  style={{
                    backgroundColor:  themeColors.themeColorLight,
                    boxShadow: `0 0 10px ${hexToRgba(
                      themeColors.themeColorDark,
                      0.3
                    )}`,
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: themeColors.themeColorDark,
                      maskImage: `url(${item.icon})`,
                      WebkitMaskImage: `url(${item.icon})`,
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                    }}
                  ></div>
                  <h2 className="font-medium text-sm">{item.label}</h2>
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

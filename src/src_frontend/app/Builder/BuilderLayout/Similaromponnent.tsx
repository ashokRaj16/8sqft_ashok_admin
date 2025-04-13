import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import useBuilderPropertylist from "@/hooks/useBuilderPropertyList";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BiRightArrowAlt } from "react-icons/bi";
import { formatPrice } from "./overview-mobile";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Share2 } from "lucide-react";
import { useAuthStore } from "@/Store/jwtTokenStore";
import useDialogStore from "@/Store/useDialogStore ";
import axios from "@/hooks";
import ShareShortlist from "@/app/components/common/ShareShortlist";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

declare global {
  interface Window {
    __sharethis__?: { initialize: () => void };
  }
}
interface propertyDataProps {
  propertyId: any;
}

export default function SimilarComponent({ propertyId }: propertyDataProps) {
  const { data, isLoading, error } = useBuilderPropertylist({
    property_rent_buy: "PROJECT",
  });
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState<{ [key: number]: boolean }>({});
  const token = useAuthStore((state) => state.token);
  const properties = data?.data?.property || [];
  const filterdData = properties.filter((item) => item.id !== propertyId);
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`/Builder/${id}`);
  };
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );
  const currentPath = "https://8sqft.com/Builder/" + selectedPropertyId;
  useEffect(() => {
    if (isVisible) {
      // Ensure script is loaded
      const scriptId = "sharethis-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src =
          "https://platform-api.sharethis.com/js/sharethis.js#property=679778caeec4bb0012d85a05&product=inline-share-buttons";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          if (window.__sharethis__) {
            window.__sharethis__.initialize();
          }
        };
      } else {
        // Reinitialize ShareThis buttons on every open
        setTimeout(() => {
          if (window.__sharethis__) {
            window.__sharethis__.initialize();
          }
        }, 500);
      }
    }
  }, [isVisible]);

  const handleButtonClick = async (id: number) => {
    try {
      const response = await axios.post(
        "/api/v1/front/shortlist",
        { propertyId: id },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setShowPopup((prev) => ({ ...prev, [id]: true }));

        setTimeout(() => {
          setShowPopup((prev) => ({ ...prev, [id]: false }));
        }, 2000);
      }
    } catch (err) {
      console.warn("Failed to add property to wishlist. Please try again.");
    }
  };



  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading properties</div>;
  }

  return (
    <>
      <div className="bg-white shadow-custom my-2">
      <h2 className="font-semibold lg:text-lg border-b border-[#D9D9D9] py-2 mb-2 px-4 shadow-sm">
        Similar Properties
      </h2>

      <div className="relative p-2">
        <Swiper
          grabCursor={true}
          centeredSlides={false}
          slidesPerView={1}
          spaceBetween={20}
          speed={1000}
          loop={true}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
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
          {filterdData.map((property) => (
            <SwiperSlide key={property.id} className="h-full">
              <Card
                className="lg:w-[300px] h-96 flex-shrink-0 shadow-md border border-gray-300 my-5"
                onClick={() => handleClick(property?.title_slug)}
              >
                <CardContent className="p-0 relative">
                  {/* Image Section */}
                  <div className="relative w-full h-56 rounded-t-xl overflow-hidden">
                    <div className="Imgshine w-full h-full ">
                    <img
                      className="w-full h-full object-cover"
                      src={property?.property_img_url || "default-image.png"}
                      alt={property.property_title || "Property Image"}
                    />
                    </div>
                   

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 justify-center p-4  absolute top-0 right-0">
                      <ShareShortlist
                        btnHeight="h-9"
                        btnWidth="w-9"
                        btnPadding="p-2"
                        background={"bg-white"}
                        shadow={"shadow-lg"}
                        rounded={"rounded-full"}
                        fontSize={"text-xs"}
                        textTransform={"uppercase"}
                        fontWeight={"font-light"}
                        hoverBackground={"hover:bg-primary"}
                        hoverTextColor={"hover:text-white"}
                        iconColor={"text-primary"}
                        iconHoverColor={"group-hover:text-white"}
                        propertyId={property?.id}
                        propertyIdSlug={property?.title_slug}
                        btnSaveText={"Save"}
                        showBtnText={false}
                        tooltip={"absolute  top-9 -translate-x-1/2 left-1/2"}
                        tooltipArrow={
                          "bottom-1 rotate-0 absolute left-[50%] transform -translate-x-1/2 -translate-y-full border-8 border-transparent border-b-black"
                        }
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex flex-col items-start">
                      <h3 className="text-sm lg:text-md font-semibold line-clamp-2">
                        {property.property_title || "No Title"}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Image
                          src="/assets/Similar/landmark.svg"
                          alt="Heart Icon"
                          className="w-5 h-4"
                          width={5}
                          height={5}
                        />
                        <span>
                          {property.locality}, {property.city_name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col items-start gap-1 border border-gray-400 rounded-md px-2 py-1 w-full">
                        <div className="text-sm font-medium">For Sale</div>
                        <div className="flex items-center gap-1 text-xs">
                          <b className="text-lg">
                            {property?.config_carpet_price
                              ? `${formatPrice(
                                  Number(property.config_carpet_price)
                                )}`
                              : "N/A"}
                          </b>

                          {/* "Starting" with `text-sm` */}
                          {property?.config_carpet_price && (
                            <span className="text-sm">Starting</span>
                          )}
                        </div>
                      </div>

                      <Button className="bg-primary text-white h-10 w-10 rounded-full p-2">
                        <IoIosArrowRoundForward size={25} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          ref={prevRef}
          className="hidden lg:block absolute -left-2 top-1/2 transform -translate-y-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2 border-primary"
        >
          <ArrowLeft size={18} className="text-primary" />
        </button>
        <button
          ref={nextRef}
          className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2 border-primary"
        >
          <ArrowRight size={18} className="text-primary" />
        </button>
      </div>      
      </div>
      {isVisible && (
        <div className="  " onClick={(e) => e.stopPropagation()}>
          {isVisible && (
            <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 flex flex-col justify-center items-center z-50 p-4">
              <div className="bg-black  w-full max-w-sm p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-white">Share</p>
                  <button
                    className="text-white px-4 py-2 rounded-md"
                    onClick={() => setIsVisible(false)}
                  >
                    x
                  </button>
                </div>
                <div className=" p-5   rounded-md shadow-md max-w-sm w-full flex justify-between">
                  <div
                    className=" sharethis-inline-share-buttons gap-1"
                    style={{ marginLeft: "8px", gap: "6px" }}
                  ></div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 p-4  rounded-full  border-[1px] border-gray">
                    <input
                      type="text"
                      value={currentPath}
                      readOnly
                      className="p-2 w-full  rounded-md  "
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentPath);
                        alert("Link copied to clipboard!");
                      }}
                      className="bg-blue text-white px-4 py-2 rounded-full  border-white"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

import Image from "next/image";
import { Card, CardContent } from "@/ui/card";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Button } from "@/ui/Button";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaPause, FaPlay } from "react-icons/fa";
import { MdPauseCircle, MdPlayCircle } from "react-icons/md";
import {
  IoMdArrowDropleftCircle,
  IoMdArrowDroprightCircle,
} from "react-icons/io";
import Logo from "@/public/assets/logo/markandya.svg";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { Download } from "lucide-react";
import useShareContactDetail from "@/hooks/Postpropertyhooks/useShareContact";
import useShareWhatsappDetail from "@/hooks/Postpropertyhooks/useShareWhatsappDetail";
import { useAuthStore } from "@/Store/jwtTokenStore";
import useDialogStore from "@/Store/useDialogStore ";
import { formatNumber } from "@/utils/priceFormatter";
import usePdfStore from "@/Store/fileStore";
const images = [
  "https://8sqft-images.s3.eu-north-1.amazonaws.com/mar-2025/989/main-image-1741334219237-311929079.jpg",
  "https://8sqft-images.s3.eu-north-1.amazonaws.com/mar-2025/989/main-image-1741334440557-810697898.jpg",
  "https://8sqft-images.s3.eu-north-1.amazonaws.com/mar-2025/989/main-image-1741334534209-876665879.jpg",
];

const colors = ["#243E68", "#0078DB", "#F1A900"];

interface MediaItem {
  id: number;
  sp_id: number;
  banner_id: number | null;
  img_url: string;
  img_title: string | null;
  img_description: string | null;
  file_type: string; // e.g., "image/jpeg", "video/mp4"
  file_size: string; // stored as a string (e.g., "315001.00")
  status: string; // e.g., "1"
  img_categories: string; // e.g., "BANNER", "TOUR VIDEO"
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
interface themeColorsProps {
  themeColorDark: string;
  themeColorGradient: string;
  [key: string]: any;
}
interface ProjectInfoProps {
  data: MediaItem[];
  themeColors: themeColorsProps;
  builderResponseData: any;
  propertyId: any;
}

export default function ProjectInfo({ themeColors, builderResponseData, propertyId }: ProjectInfoProps) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const data = builderResponseData?.sponsaredImages;
  const propertyData = builderResponseData?.property;
  const configurationData = builderResponseData?.configuration;
  const prices = configurationData.map((unit: any) => unit.carpet_price);

  const featuresArray = propertyData?.key_features.split(',').map((f: any) => f.trim());
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const handlePlayPause = () => {
    if (swiperRef.current) {
      if (isPlaying) {
        swiperRef.current.autoplay.stop();
      } else {
        swiperRef.current.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const filteredImgs = data.filter((item: MediaItem) => item.file_type.startsWith("image/"));


  const [dialogOpen, setDialogOpen] = useState(false);
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
  const token = useAuthStore((state) => state.token);

  const { pdfUrl } = usePdfStore();

  const handleOpenInNewTab = () => {
    if (pdfUrl && token) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    } else {
      openDialog();
    }
  };


  const handleOwnerContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (token) {

      handleClick();
    } else {
      openDialog();
    }
  }

  const handleClick = () => {
    if (propertyId !== null) {
      shareContact({ propertyId: propertyId });
      shareWhatsapp({ propertyId: propertyId });
    }
    setDialogOpen(true);
  };
  const { mutate: shareContact } = useShareContactDetail({
    onSuccess: (data) => {
      console.log("Successfully sent contact details", data);
    },
    onError: (error) => {
      console.log("Error in sending contact details", error);
    },
  });

  const { mutate: shareWhatsapp } = useShareWhatsappDetail({
    onSuccess: (data) => {
      console.log("Successfully sent contact details", data);
    },
    onError: (error) => {
      console.log("Error in sending contact details", error);
    },
  });

  return (
    <>
      <div
        className={`gradient-animate text-white  lg:py-16 py-5 relative`}
        style={{ backgroundImage: themeColors?.themeColorGradient }}>
        <div className="relative">
          <div className="flex justify-center">
            <div className="max-w-7xl  w-full grid grid-cols-1 md:grid-cols-2 lg:gap-8 gap-4">
              <div className="order-2 lg:order-1 lg:text-start text-center">
                <h2 className="lg:text-3xl text-lg">Newly Launch Project</h2>
                <div className="flex gap-4 justify-center items-center lg:w-4/5 p-1">
                  <Image src={propertyData?.property_logo_url} width={92} height={126} alt="logo" className="w-12 h-12 lg:w-20 lg:h-20 invert" />
                  <h1 className="lg:text-4xl text-2xl font-semibold lg:w-full uppercase"> {propertyData?.property_title}</h1>
                </div>
                <p
                  className={` mt-2`}
                  style={{ color: colors ? colors[2] : "white" }}
                >
                  Project By - {propertyData?.company_name}
                </p>
                <ul className="mt-4 lg:space-y-2 flex lg:flex-col flex-wrap px-4 lg:px-0 text-sm lg:text-base">
                  {featuresArray.map((item: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 lg:gap-4">
                      <IoArrowForwardCircleOutline
                        size={24}
                        style={{ color: colors ? colors[2] : "white" }}
                      />{" "}
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="lg:mt-48 mt-2 justify-center lg:justify-start flex gap-4 ">
                  <Button className="bg-white text-primary-black lg:text-base text-xs lg:h-auto lg:px-4 h-8 px-2">
                    View Details
                  </Button>
                  <Button onClick={handleOwnerContactClick} className="bg-white text-primary-black lg:text-base text-xs lg:h-auto lg:px-4 h-8 px-2">
                    Contact Builder
                  </Button>
                  {pdfUrl && (<Button onClick={handleOpenInNewTab} className="bg-white text-primary-black lg:text-base text-xs lg:h-auto lg:px-4 h-8 px-2">
                    <Download size={20} /> Brochure
                  </Button>)}
                </div>
              </div>

              <div className="order-1 lg:order-2 relative">
                <div className="flex lg:flex-row flex-col lg:gap-4 lg:border-2  p-2 rounded-3xl" style={{ borderColor: themeColors?.themeColorDark }}>
                  <div className="relative p-[2px] rounded-3xl min-w-0 overflow-hidden gradient-animate" style={{ backgroundImage: themeColors?.themeColorGradient }}>
                    <Swiper
                      modules={[EffectFade, Navigation, Autoplay, Pagination]}
                      effect="fade"
                      speed={1000}
                      loop
                      autoplay={{ delay: 3000, disableOnInteraction: false }}
                      onSwiper={(swiper) => (swiperRef.current = swiper)}
                      onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                      className=" mask mask-outset rounded-3xl"
                    >
                      {filteredImgs.map((src: MediaItem, index: number) => (
                        <SwiperSlide key={index}>
                          <Image
                            src={src.img_url}
                            alt="Project Image"
                            width={800}
                            height={700}
                            className={`w-full lg:h-[450px] h-80 object-cover  ${isPlaying ? 'animated-image' : ''}`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="flex lg:flex-col justify-center gap-2 mt-4">
                    {filteredImgs.map((_: MediaItem, index: number) => (
                      <button
                        key={index}
                        style={{ backgroundColor: activeIndex === index ? colors[2] : '#FFFFFF80' }}
                        className={`lg:w-4 lg:h-4 h-2 w-2 rounded-full transition-all border border-white`}
                        onClick={() => swiperRef.current?.slideToLoop(index)}
                      ></button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-2 absolute lg:static bottom-11 left-1/2 -translate-x-1/2 lg:translate-x-0 z-40">
                  <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className=""
                  >
                    <IoMdArrowDropleftCircle className="text-white lg:text-white/40" size={28} />
                  </button>
                  <button onClick={handlePlayPause} className="">
                    {isPlaying ? (
                      <MdPauseCircle className="text-white lg:text-white/40" size={28} />
                    ) : (
                      <MdPlayCircle className="text-white lg:text-white/40" size={28} />
                    )}
                  </button>
                  <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className=""
                  >
                    <IoMdArrowDroprightCircle className="text-white lg:text-white/40" size={28} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute -bottom-3 lg:w-3/5">
            <div className="lg:border-y-2 border-r-2 rounded-r-3xl lg:py-16  w-full  relative" style={{ borderColor: themeColors?.themeColorDark }}>
              <div className="absolute right-10 -top-[50px] z-20 hidden lg:block">
                <Card className=" p-[2px] rounded-3xl overflow-hidden Imgshine gradient-animate" style={{ backgroundImage: themeColors?.themeColorGradient, backgroundSize: '250%,250%' }}>
                  <CardContent className="bg-gradient-to-r from-[#303030b3] via-[#747474c0] to-[#2b2b2ba2]  rounded-3xl p-4">
                    <p className="text-xl">Price Starts from</p>
                    <p
                      className="text-lg font-semibold"
                      style={{ color: colors ? colors[2] : "white" }}
                    >
                      ₹ {formatNumber(minPrice)} - ₹{formatNumber(maxPrice)}
                    </p>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </div>


      </div>

      <div className="relative  ">
        {dialogOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-5 border border-gray-300 rounded-md shadow-md max-w-sm w-full">
              <h1 className="font-bold">Contact Details Sent</h1>
              <p className="text-sm">
                We have successfully sent the owner contact details on your
                WhatsApp and Email. Feel free to contact the owner directly.
              </p>
              <div className="w-full ">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-md my-3 self-center w-full"
                  onClick={() => setDialogOpen(false)} // Close the dialog
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

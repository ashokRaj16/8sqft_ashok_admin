import { Card, CardContent } from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { getInitials } from "@/utils/getInitialName";
import { ArrowLeft, ArrowRight } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRef, useState } from "react";
import { IoStar } from "react-icons/io5";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import StarRating from "../components/common/Rating";
import { hexToRgba } from "@/utils/hexToRGB";

interface CustomerReviewProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  builderResponseData: any;
  reviewData: any;
}
export default function CustomerReview({
  themeColors,
  builderResponseData,
  reviewData
}: CustomerReviewProps) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [readMoreStates, setReadMoreStates] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleReadMore = (index: any) => {
    setReadMoreStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  console.log(reviewData, 'reviewData')
  return (
    <>
     {reviewData?.reviews.length>0&&( <div className="my-4" style={{ color: themeColors.themeColorDark }}>
        <h3 className="font-semibold my-2  text-lg">Customer Review </h3>
        <div className="relative py-2 px-2 lg:px-4 mt-4" style={{ backgroundColor: themeColors.themeColorLight }}>
          <Swiper
            speed={700}
            loop={true}
            slidesPerView={1.3}
            spaceBetween={10}
            autoplay={{ delay: 1500, pauseOnMouseEnter: true, disableOnInteraction: false }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            modules={[Navigation, Autoplay]}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3.3,
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
            {reviewData?.reviews?.map((item: any, index: number) => (
              <SwiperSlide key={index} className="h-full">
                <Card
                  className={`p-3 bg-white border-0 rounded relative ${readMoreStates[index] ? "h-auto" : "h-[230px]"
                    } `}
                >
                  <StarRating value={item.rating} filledColor={themeColors.themeColorDark} readOnly />
                  <CardContent className="p-0 mt-2 text-primary-black lg:text-sm text-xs">
                    <p
                      className={`${readMoreStates[index] ? "line-clamp-none" : "line-clamp-3"
                        } `}
                    >
                      {item.review}
                    </p>
                    {item.review.length > 120 && (
                      <button
                        className="opacity-90 mt-1"
                        style={{ color: themeColors.themeColorDark }}
                        onClick={() => toggleReadMore(index)}
                      >
                        {readMoreStates[index] ? "Show less" : "Show more"}
                      </button>
                    )}
                  </CardContent>
                  <div
                    className={`flex flex-col gap-2 bottom-4 ${readMoreStates[index] ? "static" : "absolute"
                      }`}
                  >
                    <div className="w-10 h-10 bg-[#FFE6BC] rounded-full flex items-center justify-center font-medium text-[#844B00]">
                      {getInitials(item?.fname, item?.lname)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">
                        {item.fname} {item.lname}
                      </h4>
                      <p className="text-xs text-[#42526E]">
                        User | Posted {moment(item.updated_at).fromNow()}
                      </p>
                    </div>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            ref={prevRef}
            className="hidden lg:block absolute -left-5 top-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2" style={{ borderColor: themeColors.themeColorDark }}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            ref={nextRef}
            className="hidden lg:block absolute -right-3 top-1/2 z-40  shadow-md p-2 ml-2 rounded-full bg-white border-2" style={{ borderColor: themeColors.themeColorDark }}
          >
            <ArrowRight size={18} />
          </button>
        </div>

      </div>)}
    </>
  );
}

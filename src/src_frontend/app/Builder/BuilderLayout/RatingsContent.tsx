"use client";
import StarRating from "@/app/components/common/Rating";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/hooks";
import { useAuthStore } from "@/Store/jwtTokenStore";
import useDialogStore from "@/Store/useDialogStore ";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import { Progress } from "@/ui/progress";
import { getInitials } from "@/utils/getInitialName";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoStar } from "react-icons/io5";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import moment from "moment";
import { ArrowLeft, ArrowRight } from "lucide-react";
interface RatingProps {
  propertyId?: number | null;
}

interface FormErrors {
  review?: string;
  rating?: string;
}
interface Review {
  id: number;
  user_id: number;
  property_id: number;
  rating: number;
  review: string;
  status: string;
  feature_name: string | null;
  created_at: string;
  updated_at: string;
  fname: string;
  lname: string;
  profile_picture_url: string | null;
}

interface ReviewData {
  reviews: Review[];
  rating_distribution: Record<string, number>;
  average_rating: number;
  total_count: number;
}
const RatingsContent: React.FC<RatingProps> = ({ propertyId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const { openDialog } = useDialogStore();
  const token = useAuthStore((state) => state.token);
  const [revireResp, setReviewResp] = useState("");
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

  

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!review.trim()) newErrors.review = "Review cannot be empty!";
    if (!rating) newErrors.rating = "Give Rating between 1 to 5";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `/api/v1/front/post_property/review`,
        {
          property_id: propertyId,
          rating,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
          },
        }
      );

      if (response.data.status) {
        toast.success(`${response.data.message}`);
        setReview("");
        setRating(0);
        setReviewResp(response.data);
      } else {
        toast.error("There was an error with your request.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the form.");
    }
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
    if (errors.rating) setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
    if (errors.review) setErrors((prev) => ({ ...prev, review: undefined }));
  };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `/api/v1/front/property/reviews/${propertyId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "A8SQFT7767",
            },
          }
        );
        if (response.data.status) {
          setReviewData(response?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReview();
  }, [propertyId, revireResp]);

  return (
    <>
    <div className="mx-4 lg:mx-0">
    <div className="shadow-custom py-2 bg-white my-2">
        <h1 className="font-semibold lg:text-lg border-b border-[#D9D9D9] py-2 mb-2 px-4 shadow-sm">Reviews</h1>
        <div className="grid lg:grid-cols-3 px-4">
          <div className="col-span-1">
      {Array.isArray(reviewData?.reviews) && (reviewData?.reviews?.length ?? 0) > 0 ?(<div>
      <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-primary">
                {reviewData?.average_rating}
              </span>
              <span className="text-gray">/ 5</span>
            </div>
            <p className="text-primary text-sm">
              Average Rating{" "}
              <span className="text-gray text-xs">{`(${reviewData?.total_count} Total Reviews)`}</span>
            </p>

            <div className="mt-3 space-y-2 hidden lg:block">
              {reviewData?.rating_distribution &&
                Object.entries(reviewData.rating_distribution).map(
                  ([rating, percentage], index) => (
                    <div key={index} className="flex items-center justify-between space-x-3 w-48">
                      <Progress
                        value={(percentage / reviewData?.total_count) * 100}
                        className="w-32 bg-[#EBECF0]"
                      />
                      <span className="text-gray">{rating}</span>
                    <IoStar size={20} className="text-primary" />
                    </div>
                  )
                )}
            </div>
      </div>):
      <div className="flex items-center h-full justify-center text-gray">
      <span>No stars yet. Shine some light with your review!</span>
      </div>
      }
          </div>

          <div className="flex flex-col gap-5 col-span-2">
            <section className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 space-y-1">
                  {/* <span className="text-xs text-[#22222280]">Rate</span> */}
                  <StarRating value={rating} onChange={handleRatingChange} />
                </div>
                {errors.rating && (
                  <p className="text-xs text-red">*{errors.rating}</p>
                )}
              </div>

              <div>
                <Textarea
                  value={review}
                  onChange={handleReviewChange}
                  rows={8}
                  className="text-sm lg:text-base"
                  placeholder="Help others by sharing your great experience!"
                />
                {errors.review && (
                  <p className="text-xs text-red">*{errors.review}</p>
                )}
              </div>

              <div className="flex justify-end gap-2.5">
                <Button
                  variant="outline"
                  className="w-20 h-8 lg:h-10 text-sm lg:text-base border-[#fc6600] text-[#fc6600] hover:bg-[#fc6600] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => (token ? handleSubmit() : openDialog())}
                  className="w-20 h-8 lg:h-10 text-sm lg:text-base bg-[#fc6600] text-white hover:bg-[#e55a00]"
                >
                  Post
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
      {Array.isArray(reviewData?.reviews) && (reviewData?.reviews?.length ?? 0) > 0 && (

   <div className="relative shadow-custom py-2 px-2 lg:px-4 mt-4 bg-white">
        <Swiper
         speed={700}
         loop={true}
          slidesPerView={1.3}
          spaceBetween={10}
          autoplay={{ delay: 1500, pauseOnMouseEnter: true, disableOnInteraction: false }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          modules={[Navigation,Autoplay]}
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
              slidesPerView: 2,
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
          {reviewData?.reviews?.map((item, index) => (
            <SwiperSlide key={index} className="h-full">
              <Card
                className={`p-3 shadow-lg border border-[#22222220] rounded relative ${
                  readMoreStates[index] ? "h-auto" : "h-[200px]"
                } `}
              >
                <div
                  className={`flex items-center gap-1 text-white ${
                    item?.rating > 3.5 ? "bg-[#2E7B32]" : "bg-accent-yellow"
                  } w-fit p-1 rounded`}
                >
                  <span className=" lg:text-sm text-xs">{item?.rating}</span>
                  <IoStar size={15} />
                </div>
                <CardContent className="p-0 mt-2 text-primary-black lg:text-sm text-xs">
                  <p
                    className={`${
                      readMoreStates[index] ? "line-clamp-none" : "line-clamp-3"
                    } `}
                  >
                    {item.review}
                  </p>
                  {item.review.length > 120 && (
                    <button
                      className="text-primary mt-1"
                      onClick={() => toggleReadMore(index)}
                    >
                      {readMoreStates[index] ? "Show less" : "Show more"}
                    </button>
                  )}
                </CardContent>
                <div
                  className={`flex items-center gap-2 mt-4 bottom-4 ${
                    readMoreStates[index] ? "static" : "absolute"
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
                  className="hidden lg:block absolute -left-2 top-1/2 transform -translate-y-1/2 z-10  shadow-md p-2 ml-2 rounded-full bg-white border-2 border-primary"
                >
                  <ArrowLeft size={18} className="text-primary" />
                </button>
                <button
                  ref={nextRef}
                  className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10  shadow-md p-2 ml-2 rounded-full bg-white border-2 border-primary"
                >
                  <ArrowRight size={18} className="text-primary" />
                </button>
      </div>
  )}
    </div>
    </>
  );
};

export default RatingsContent;

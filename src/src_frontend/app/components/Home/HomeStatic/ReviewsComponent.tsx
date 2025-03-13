import Image from "next/image";
import { useRef, useState } from "react";
import "./scroll.css";
import StarRating from "../../common/Rating";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Controller,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
export default function ReviewsComponent() {
  const reviews = [
    {
      name: "Rohan Kamble",
      location: "Moshi",
      rating: 4.5,
      review:
        "I purchased my flat using the 8sqft property portal, and the experience was amazing. The process was smooth, with zero brokerage fees. Everything was transparent, and I found my dream home at the best price. Highly recommended for hassle-free property buying!",
      imgSrc: "/assets/Post_Property_latest/Image1.png",
    },
    {
      name: "Suraj Kamble",
      location: "Kharadi",
      rating: 4,
      review:
        "8sqft made my home-buying journey simple and stress-free. The website has many property options, and I easily found the perfect flat. The best part is that there are no hidden charges or middlemen, saving me a lot of money. Excellent service!",
      imgSrc: "/assets/Post_Property_latest/Image.png",
    },
    {
      name: "Akshay Patel",
      location: "Hadapsar",
      rating: 5,
      review:
        "I was looking for a flat for months, and 8sqft helped me find the right one quickly. Their platform is easy to use, and I got all the details I needed. No extra charges, and everything was handled professionally.",
      imgSrc: "/assets/Post_Property_latest/Image 2.png",
    },
    {
      name: "Raj Kale",
      location: "Baner",
      rating: 4.5,
      review:
        "Buying a flat through 8sqft was a great decision. The listings were genuine, and I didn’t have to deal with brokers. The team was helpful, and the entire process was seamless. I highly recommend 8sqft to anyone looking for a new home.",
      imgSrc: "/assets/Post_Property_latest/user4.jpg",
    },
    {
      name: "Ajay Gore",
      location: "Talegaon Dabhade",
      rating: 4,
      review:
        "8sqft is the best platform for buying property. I got my flat at a reasonable price without paying brokerage. The entire process was quick, and I felt confident in my decision. If you want a trustworthy property portal, 8sqft is the right choice!",
      imgSrc: "/assets/Post_Property_latest/Image1.png",
    },
    // Add more reviews as needed
  ];
  const [readMoreStates, setReadMoreStates] = useState<{ [key: number]: boolean }>({});

  const toggleReadMore = (index:any) => {
    setReadMoreStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  
  return (
    <>
   

      <section className=" lg:ml-6 bg-gray-50 mt-[10px]">
        <div className=" lg:flex flex-row mx-auto lg:px-10 justify-center align-middle space-x-6">
          {/* Section Title and Navigation Buttons */}
          <div className="flex flex-col items-center  justify-between ">
            <div>
              <h2 className="lg:text-2xl text-xl font-medium lg:font-semibold text-black text-center md:text-left">
                How we work
              </h2>
            </div>

            <section className=" pt-4 bg-gray-50">
                <div
                className="lg:flex justify-center overflow-x-auto gap-6 scrollbar-hide lg:w-[92%]"
              >
                <div className="w-full lg:w-[560px] aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/aqey3PIDnpo?si=XqRcUJwk1sSL5ZYL"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              {/* </div> */}
            </section>

          </div>
        </div>
      </section>
      <div className="relative px-4 lg:px-10">
        <Swiper
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          spaceBetween={10}
          speed={1000}
          loop={true}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          autoplay={{ delay: 1500, disableOnInteraction: false,    pauseOnMouseEnter: true,
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
              slidesPerView: 2,
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
       {reviews.map((review, index) => ( 
  <SwiperSlide key={index} className="h-full">
    <div className={`bg-white shadow-rating my-10 mx-2 p-4 rounded-2xl overflow-hidden ${readMoreStates[index] ? "h-auto" : "lg:h-[220px]"}  `}>
      <div className="relative flex flex-row mb-4 gap-4">
        <Image
          src={review.imgSrc}
          alt="profile"
          width={100}
          height={100}
          className="h-[70px] w-[70px] object-cover border border-[#22222250] rounded-full"
        />
        <div className="flex flex-col justify-end items-start">
          <h3 className="font-semibold">{review.name}</h3>
          <p className="text-[#636363] text-xs lg:text-base">{review.location}</p>
          <StarRating rating={review.rating ?? 0} />
        </div>
      </div>
      <div className="text-start">
        <p className={`text-[#636363] text-xs lg:text-base ${readMoreStates[index] ? "line-clamp-none" : "line-clamp-4"}`}>
          {review.review}
        </p>
        <span 
          className="text-xs cursor-pointer hover:text-primary flex hover:underline" 
          onClick={() => toggleReadMore(index)}
        >
          {readMoreStates[index] ? "Read less" : "Read more"}
        </span>
      </div>
    </div>
  </SwiperSlide>
  ))}
        </Swiper>
        <button
          ref={prevRef}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40"
        >
          <IoChevronBack className="text-black hover:text-white text-3xl bg-white p-1 rounded-full shadow-custom hover:bg-primary" />
        </button>
        <button
          ref={nextRef}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40"
        >
          <IoChevronForward  className="text-black hover:text-white text-3xl bg-white p-1 rounded-full shadow-custom hover:bg-primary" />
        </button>
      </div>
    </>
  );
}

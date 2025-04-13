"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import StatueImg from "@/public/assets/AboutUs/statue.svg";
import FemaleStatueImg from "@/public/assets/AboutUs/Female_Statue.svg";
import ZigzagLine from "@/public/assets/AboutUs/line.svg";
import { useRef } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
const teamMembers = [
  { name: "Dipak Wable", role: "Technical Head", image: StatueImg },
  { name: "Chaitanya Zambare", role: "Marketing Head", image: StatueImg },
  { name: "Prashant Borate", role: "Sales Head", image: StatueImg },
  { name: "Ashok Ambore", role: "Tech Team Lead", image: StatueImg },
  { name: "Prakash Rathwa", role: "UI-UX Lead", image: StatueImg },
  { name: "Sharli Khare", role: "Team Lead", image: FemaleStatueImg },
];

const OurTeam = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <section className="px-4 lg:px-16 py-11 bg-[#222222] text-white">
      <div className=" mx-auto relative">
        <div className="flex justify-center flex-col items-center">
        <h2 className="lg:text-5xl text-2xl text-center lg:text-start font-bold mb-4 capitalize lg:uppercase">Our experienced team</h2>
          <Image src={ZigzagLine} alt="line" width={150} height={200} />
        </div>
        <button
          ref={prevRef}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 "
        >
          <FaCaretLeft className="text-white text-3xl bg-black p-1 rounded-full hover:bg-primary"/>
        </button>
        <button
          ref={nextRef}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 "
        >
          <FaCaretRight className="text-white text-3xl bg-black p-1 rounded-full hover:bg-primary"/>
        </button>
        <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        coverflowEffect={{
          // rotate: 0,
          // stretch: 0,
          // depth: 100,
          // modifier: 1,
          slideShadows: false,
        }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 50,
            },
            1200: {
              slidesPerView: 2,
              spaceBetween: 750,
              coverflowEffect:{
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 2.5,
                slideShadows: false,
              }
            },
          }}
          speed={700}
          loop={true}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          autoplay={{ delay: 1500, disableOnInteraction: false }}
          modules={[EffectCoverflow, Navigation, Autoplay]}
          className="lg:w-[1100px] mt-7"
  
          onSwiper={(swiper) => {
            setTimeout(() => {
              if ( swiper.params.navigation &&
                    typeof swiper.params.navigation !== "boolean") {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            });
          }}
        >
          {teamMembers.map((member, index) => (
            <SwiperSlide
              key={index}
              className="flex flex-col items-center transition-all duration-300 w-fit"
            >
              <div className="flex justify-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={140}
                  height={200}
                  className={`transition-all duration-300 w-28 lg:w-36`}
                />
              </div>
              <div
                className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-primary text-white p-4 "
                style={{ clipPath: "polygon(0 21%, 100% 0, 100% 100%, 0 82%)" }}
              >
                <p className="lg:text-sm text-base uppercase whitespace-nowrap">{member.name}</p>
                <p className="text-xs font-normal whitespace-nowrap">{member.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default OurTeam;

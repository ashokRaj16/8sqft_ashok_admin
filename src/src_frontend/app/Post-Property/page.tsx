"use client";

import React, { useEffect, useRef, useState } from "react";
import PostPropertyformComponent from "./Post-Propertyform";
import PostPropertyStaticComponent from "./Post-PropertyStatic";
import Image from "next/image";
import "./scroll.css";
import { Swiper, SwiperSlide } from "swiper/react";
import StarRating from "../components/common/Rating";
import { Autoplay, Navigation } from "swiper/modules";
import ReviewsComponent from "../components/Home/HomeStatic/ReviewsComponent";
import { Button } from "@/ui/Button";
import Link from "next/link";
import { BsWhatsapp } from "react-icons/bs";

export default function PostProperty() {



  function openWhatsapp() {
    const phoneNumber = "917219009062"; // Ensure this is in international format without '+' or spaces
    const message = "Hi, I want to post my project/property";
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  }

  const scrollToSection = (id:any) => {
    const section = document.getElementById(id);
  
  if (section) {
    const sectionPosition = section.offsetTop;
    const offset = 100; 
    const position = sectionPosition - offset;

    window.scrollTo({
      top: position,
      behavior: 'smooth',
    });
  }
  };
  return (
    <>
      <div className="flex bg-[#C8DFF1] lg:bg-[url('/assets/postproperty/postpropertyBanner.svg')] bg-contain bg-no-repeat h-fit w-full max-w-full mx-auto relative">
        <div className="w-full max-w-[100vw] flex justify-center items-center lg:justify-end lg:mr-40 lg:h-[80vh] py-5 ">
          <PostPropertyformComponent />
        </div>
       <div className="hidden lg:flex absolute bottom-2 left-1/2 -translate-x-1/2 gap-4">
       <Link onClick={(e) => { e.preventDefault(); scrollToSection('Howitwork'); }} href={"#Howitwork"} className="bg-white border border-primary text-primary rounded px-2 py-1 text-sm">How it works?</Link>
       <Link onClick={(e) => { e.preventDefault(); scrollToSection('Faq'); }} href={"#Faq"} className="bg-white border border-primary text-primary rounded px-2 py-1 text-sm">FAQ</Link>
       </div>
      </div>

      <div className="container mx-auto mt-5">
        <div className="flex lg:mx-10 my-5  bg-[#FFF4EC] text-center lg:items-center  justify-center p-3 border border-primary">
        <BsWhatsapp className="text-xl lg:text-lg"/>
          <p className="text-sm lg:text-base">
            &nbsp;Give a Hii... message to{" "}
            <span
              onClick={openWhatsapp}
              className="text-primary border-b-2 border-primary pr-1"
            >
              +917219009062 
            </span>
            to get help with your project/property listing
          </p>
        </div>

        <div className=" lg:mx-10 bg-[#FFF4EC] my-5 flex flex-col items-center justify-center text-center ">
          <div className=" flex flex-col md:flex-row items-center justify-between bg-[#FFF4EC] p-2 rounded-md">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="flex flex-col items-center md:items-start">
                <p className="lg:text-lg font-semibold text-gray-800">
                  Scan the QR code or click to{" "}
                  <span className="text-primary font-bold">
                    post your property
                  </span>{" "}
                  via Whatsapp
                </p>
                <button
                  onClick={openWhatsapp}
                  className="mt-4 flex gap-2 items-center justify-center bg-primary text-white text-sm font-medium px-4 py-2 rounded-md shadow-md hover:bg-orange-600"
                >
                  <BsWhatsapp/>
                  Post property via Whatsapp
                </button>
                <p className="mt-2 text-sm text-gray-600 italic">
                  * Feature available for builders and owners
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-center">
              <Image
                src="/assets/Post_Property_latest/Scanner/scanner.png"
                alt="QR Code Scanner"
                width={100}
                height={100}
                className="h-[100px] w-[100px] object-cover"
              />
              <p className="mt-2 text-sm font-medium text-gray-700">Scan Me</p>
            </div>
          </div>
        </div>

        {/* works section */}

        <div id="Howitwork" className=" max-w-4xl mx-auto my-5 lg:px-6 flex flex-col items-center text-center">
          <h2 className="lg:text-2xl text-xl font-medium lg:font-semibold my-5 text-center">
            How It Works
          </h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center sm:space-x-4 text-left">
              <div className="flex-shrink-0">
                <Image
                  src="/assets/Post_Property_latest/steps/firststep.png"
                  alt="Step 1 Icon"
                  width={48}
                  height={48}
                  className="border-orange"
                />
              </div>
              <div className="mt-4 sm:mt-0">
                <h3 className=";g:text-lg font-semibold text-gray-800 sm:whitespace-nowrap">
                  Upload your property in{" "}
                  <span className="text-primary">4 easy steps.</span>
                </h3>
                <p className="lg:text-sm text-xs text-gray-600">
                  Submit your property details, pricing, photos, and
                  documentation after your property is verified and listed.
                </p>
              </div>
              {/* <div className="relative">

              <iframe width="315" height="560"
src="https://youtube.com/embed/Yh0AfCzpbY0?si=ZIhs51FEQfuhNWSX"
title="YouTube video player"
                  frameBorder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen></iframe>

                </div> */}
            </div>

            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 text-left">
              <div className="flex-shrink-0">
                <Image
                  src="/assets/Post_Property_latest/steps/secondstep.png"
                  alt="Step 2 Icon"
                  width={48}
                  height={48}
                  className="border-orange-500"
                />
              </div>
              <div className="mt-4 sm:mt-0">
                <h3 className="lg:text-lg font-semibold text-gray-800">
                  Property reaches to{" "}
                  <span className="text-primary">
                    1 lac+ verified tenants & buyers.
                  </span>
                </h3>
                <p className="lg:text-sm text-xs text-gray-600">
                  Your property will be showcased to a vast audience of buyers
                  and tenants across India through the largest property search
                  platform.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row items-center  sm:space-x-4 text-left">
              <div className="flex-shrink-0">
                <Image
                  src="/assets/Post_Property_latest/steps/thirdstep.png"
                  alt="Step 3 Icon"
                  width={48}
                  height={48}
                  className="border-orange-500"
                />
              </div>
              <div className="mt-4 sm:mt-0">
                <h3 className="lg:text-lg font-semibold text-gray-800">
                  Start getting{" "}
                  <span className="text-primary">verified inquiries.</span>
                </h3>
                <p className="lg:text-sm text-xs text-gray-600">
                  Verified inquiries from prospective buyers and tenants will
                  start coming in as soon as your property goes live on
                  8sqft.com.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="my-5  lg:mx-10 bg-gray-50">
          <div>
           
                <p className="lg:text-2xl text-xl font-medium lg:font-semibold my-5 text-center">
                  Testimonial
                </p>
                <div
                className="lg:flex justify-center overflow-x-auto gap-6 scrollbar-hide lg:w-[92%]"
              >
                <div className="w-full lg:w-[560px] aspect-video">
              <iframe
                  className="w-full h-full rounded-lg"
                src="https://youtube.com/embed/Yh0AfCzpbY0?si=ZIhs51FEQfuhNWSX"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            </div>
          </div>
        </section>

        <div className="text-center mt-10">
          <p className="lg:text-2xl text-xl font-medium lg:font-semibold text-center">
            Happy Property Owner
          </p>
          <ReviewsComponent />
        </div>

        <div id="Faq" className=" lg:mx-10">
          <PostPropertyStaticComponent />
        </div>
      </div>
    </>
  );
}

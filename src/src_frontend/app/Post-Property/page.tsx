"use client";

import React, { useEffect, useRef, useState } from "react";
import PostPropertyformComponent from "./Post-Propertyform";
import PostPropertyStaticComponent from "./Post-PropertyStatic";
import Image from "next/image";
import "./scroll.css";
export default function PostProperty() {
  const videos = [
    "https://youtube.com/shorts/Yh0AfCzpbY0?si=Z282amZzStJDeWgW",
    "https://youtube.com/shorts/Yh0AfCzpbY0?si=Z282amZzStJDeWgW",
  ];

  const reviews = [
    {
      name: "Rohan Kamble",
      location: "Hinjewadi, Pune",
      review:
        "I rented out my 1BHK flat quickly through 8sqft.com, and the best part was that there was no brokerage involved. The process was smooth, and the platform is very user-friendly. Highly recommend their services!",
      imgSrc: "/assets/Post_Property_latest/Image1.png",
    },
    {
      name: "Suraj Kamble",
      location: "Pune",
      review:
        "My 2BHK flat was rented out without brokerage with the help of 8sqft.com. I had a smooth experience with their platform. The team is professional, and the process is simple. Highly recommended for buying, selling, or renting properties hassle-free!",
      imgSrc: "/assets/Post_Property_latest/Image.png",
    },
    {
      name: "Akshay Patel",
      location: "Wakad, Pune",
      review:
        "Thanks to 8sqft.com, I rented out my 3BHK flat without any hassle. Their team was professional and supportive throughout. A great platform for anyone looking for a brokerage-free experience!",
      imgSrc: "/assets/Post_Property_latest/Image 2.png",
    },
    {
      name: "Rohan Kamble",
      location: "Hinjewadi, Pune",
      review:
        "I rented out my 1BHK flat quickly through 8sqft.com, and the best part was that there was no brokerage involved. The process was smooth, and the platform is very user-friendly. Highly recommend their services!",
      imgSrc: "/assets/Post_Property_latest/Image1.png",
    },
    // Add more reviews as needed
  ];

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scroll = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "prev" | "next") => {
    const container = scrollContainerRef.current;

    // Ensure the container exists before attempting to scroll
    if (container) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      container.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollReviews = (direction: string) => {
    if (scroll.current) {
      const scrollAmount = 300; // Adjust as needed for the scroll distance
      const currentScroll = scroll.current.scrollLeft;

      if (direction === "prev") {
        scroll.current.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: "smooth",
        });
      } else if (direction === "next") {
        scroll.current.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };


  // function openWhatsapp() {
  //   window.open(
  //     "https://web.whatsapp.com/send?phone=917219009062&text=Hi,%20I%20want%20to%20post%20my%20project/property",
  //     "_blank"
  //   );
  // }

  function openWhatsapp() {
    const phoneNumber = '917219009062'; // Ensure this is in international format without '+' or spaces
    const message = 'Hi, I want to post my project/property';
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
    window.open(whatsappURL, '_blank');
  }
  

  return (
    <>

      <div className="flex bg-[#C8DFF1] lg:bg-[url('/assets/postproperty/postpropertyBanner.svg')] bg-cover  h-fit py-4 w-full max-w-full mx-auto m-10">
        <div className="w-full max-w-[100vw] flex justify-center items-center lg:justify-end lg:mr-40  lg:p-14 ">
          <PostPropertyformComponent />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className=" w-[90%] mx-auto flex flex-row  bg-[#FFF4EC] text-center items-center justify-center p-3 border border-primary">
          <Image
            src="/assets/Post_Property_latest/whatsapp/whatsapp.svg"
            alt="Contact Us Background"
            width={20}
            height={25}
            className=" h-[20px]  object-cover "
          />
          <p>
            &nbsp;Give a Hii... message to{" "}
            <span onClick={openWhatsapp} className="text-primary border-b-2 border-primary">
             
                +917219009062
            
            </span>
            to get help with your project/property listing
          </p>
        </div>

        <div className="w-[70%] bg-[#FFF4EC] py-6 flex flex-col items-center justify-center text-center m-10">
          <div className="w-[90%] flex flex-col md:flex-row items-center justify-between bg-[#FFF4EC] p-2 rounded-md">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-lg font-semibold text-gray-800">
                  Scan the QR code or click to{" "}
                  <span className="text-primary font-bold">
                    post your property
                  </span>{" "}
                  via Whatsapp
                </p>
                <button onClick={openWhatsapp}  className="mt-4 flex items-center justify-center bg-primary text-white text-sm font-medium px-4 py-2 rounded-md shadow-md hover:bg-orange-600">
                  <Image
                    src="/assets/Post_Property_latest/whatsapp/whatsapp.svg"
                    alt="Whatsapp Icon"
                    width={20}
                    height={20}
                    className="mr-2 h-[20px] object-cover"
                  />
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

        <div className="w-[50%] max-w-4xl mx-auto py-12 px-6 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
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
                <h3 className="text-lg font-semibold text-gray-800 sm:whitespace-nowrap">
                  Upload your property in{" "}
                  <span className="text-primary">4 easy steps.</span>
                </h3>
                <p className="text-sm text-gray-600">
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
                <h3 className="text-lg font-semibold text-gray-800">
                  Property reaches to{" "}
                  <span className="text-primary">
                    1 lac+ verified tenants & buyers.
                  </span>
                </h3>
                <p className="text-sm text-gray-600">
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
                <h3 className="text-lg font-semibold text-gray-800">
                  Start getting{" "}
                  <span className="text-primary">verified inquiries.</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Verified inquiries from prospective buyers and tenants will
                  start coming in as soon as your property goes live on
                  8sqft.com.
                </p>
              </div>
            </div>
          </div>
        </div>




        <section className="py-12 ml-4 bg-gray-50">
          <div className="container lg:flex flex-row mx-auto px-10 justify-center align-middle space-x-6  ">
            <div className="flex flex-col justify-between">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary text-center md:text-left">
                  Testimonial
                </h2>
              </div>
              <div className="flex space-x-2 mt-4 md:mt-0">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-primary text-primary hover:bg-orange-100"
                  onClick={() => handleScroll("prev")}
                >
                  &#8592;
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-primary text-primary hover:bg-orange-100"
                  onClick={() => handleScroll("next")}
                >
                  &#8594;
                </button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 scrollbar-hide w-[71%]"
            >

              <iframe
                width="300"
                height="160"
                src="https://youtube.com/embed/Yh0AfCzpbY0?si=ZIhs51FEQfuhNWSX"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>



        <section className="py-12 ml-4 bg-gray-50">
          <div className="container lg:flex flex-row mx-auto px-10 justify-center align-middle space-x-6">
            {/* Section Title and Navigation Buttons */}
            <div className="flex flex-col items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary text-center md:text-left">
                Happy
                <br />
                Property
                <br />
                Owner
              </h2>

              {/* Navigation Buttons */}
              <div className="flex space-x-2 mt-4 md:mt-0">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-primary text-primary hover:bg-orange-100"
                  onClick={() => scrollReviews("prev")}
                >
                  &#8592;
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-primary text-primary hover:bg-orange-100"
                  onClick={() => scrollReviews("next")}
                >
                  &#8594;
                </button>
              </div>
            </div>

            {/* Review Cards */}
            <div
              ref={scroll}
              className="flex overflow-x-auto gap-6 scrollbar-hide w-[73%]"
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-72 bg-white shadow-lg rounded-lg overflow-hidden border"
                >
                  <div className="relative flex flex-row p-4">
                    <Image
                      src={review.imgSrc}
                      alt="profile"
                      width={100}
                      height={100}
                      className="h-[70px] w-[80px] object-cover"
                    />
                    <div className="flex flex-col justify-end">
                      <h3 className="font-semibold">{review.name}</h3>
                      <p>{review.location}</p>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-[#636363]">{review.review}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full mx-auto lg:p-32">
          <PostPropertyStaticComponent />
        </div>
      </div>

    </>
  );
}

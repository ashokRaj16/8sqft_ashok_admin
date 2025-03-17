import React from "react";
import AboutImg1 from "@/public/assets/AboutUs/about1.svg";
import AboutImg2 from "@/public/assets/AboutUs/about2.svg";
import AboutImg3 from "@/public/assets/AboutUs/about3.svg";
import Image from "next/image";
const About = () => {
  return (
    <>
      <div className="px-4 lg:px-16 py-11 bg-[#000000] text-white about_hero_section">
        <div className="flex justify-between flex-col lg:flex-row gap-4 items-end mb-14">
          <h1 className="lg:text-6xl text-3xl font-bold lg:font-normal">
            We&apos;re building communities.
          </h1>
          <p className="text-base text-[#C0C0BF] lg:w-10/12">
            With a commitment to quality, innovation, and customer satisfaction,
            we&apos;ve established ourselves as a trusted leader in the construction
            and real estate industry. We&apos;re passionate about building
            exceptional homes and communities that exceed our clients&apos;
            expectations.
          </p>
        </div>
        <div className="">
          {/* Right Section (Images) */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="col-span-1 flex flex-col gap-3 order-last lg:order-1">
              <Image
                src={AboutImg2}
                alt="Meeting Room"
                className="rounded-xl shadow-about_us object-cover w-full lg:h-[296px]"
              />
              <Image
                src={AboutImg3}
                alt="Group Celebration"
                className="rounded-xl shadow-about_us object-cover w-full lg:h-[296px]"
              />
            </div>
            <div className="col-span-1 md:col-span-2 order-1 lg:order-last">
              <Image
                src={AboutImg1}
                alt="Office Discussion"
                className="rounded-xl shadow-about_us object-cover w-full lg:h-[600px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

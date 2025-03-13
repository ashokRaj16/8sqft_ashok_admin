import Image from "next/image";
import React from "react";
import OurStoryImg from "@/public/assets/AboutUs/ourStory.svg";
import ourStorySmImg from "@/public/assets/AboutUs/ourStorySm.svg";
import CEOImg from "@/public/assets/AboutUs/ceo.svg";
const OurStory = () => {
  return (
    <>
      <div className="px-4 lg:px-16 py-11 bg-[#222222] text-white">
        <section className="bg-gray-900 text-white lg:py-16">
          <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 lg:gap-12 items-center">
            {/* Left Section - Image */}
            <div className="lg:block hidden relative lg:w-full h-full overflow-hidden rounded-2xl shadow-our_story">
              <Image
                src={OurStoryImg}
                alt="Building Image"
                layout="fill"
                objectFit="cover"
                className="relative lg:absolute"
              />
            </div>
            <div className="lg:hidden block relative lg:w-full h-full overflow-hidden rounded-2xl">
              <h2 className="text-2xl font-medium mb-6 absolute top-0 z-20 whitespace-nowrap left-1/2 -translate-x-1/2">
                Our Story & Values
              </h2>
              <div className="h-full w-full absolute bg-[#0000006b] z-10"></div>
              <Image
                src={ourStorySmImg}
                alt="Building Image"
                layout="responsive"
                objectFit="conver"
                className="relative lg:absolute"
              />
            </div>

            {/* Right Section - Text Content */}
            <div className="col-span-2">
              <h2 className="text-5xl font-bold mb-6 hidden lg:block uppercase">
                Our Story & Values
              </h2>
              <p className="text-[#C0C0BF] text-sm mb-6 mt-6 lg:mt-0">
                8sqft was founded in 2000 by Kuldeep Jadhav, a seasoned
                entrepreneur with a vision to create a company that would
                revolutionize the way homes are built and lived in. As 8sqft
                founder and CEO, Kuldeep Jadhav has led the company to new
                heights, driven by his unwavering commitment to excellence.
              </p>

              <div className="flex flex-col lg:flex-row items-start space-x-4 bg-gray-800 lg:p-6 rounded-lg border border-[#ffffff14] p-2">
                <div className="flex items-end gap-2">
                  <Image
                    src={CEOImg}
                    alt="Kuldeep Jadhav"
                    width={200}
                    height={200}
                    className="rounded-xl max-w-20 lg:max-w-fit"
                  />
                  <span className="block lg:hidden font-normal mt-2">
                    - Kuldeep Jadhav, Founder and CEO
                  </span>
                </div>
                <blockquote className="text-[#C0C0BF] text-lg font-semibold pt-4 lg:pt-0">
                  At 8sqft, we believe that every home we build should be a
                  masterpiece - a reflection of our clients&apos; dreams and
                  aspirations. That&apos;s why we&apos;re dedicated to pushing
                  the boundaries of what&apos;s possible in construction and
                  real estate.
                  <span className="lg:block hidden font-normal mt-2">
                    - Kuldeep Jadhav, Founder and CEO
                  </span>
                </blockquote>
              </div>

              <p className="text-[#C0C0BF] text-sm mt-6">
                Since its inception, 8sqft has grown to become a leading player
                in the industry, completing over 500 projects and serving
                thousands of satisfied clients. Today, the company employs a
                team of over 200 professionals, each with a unique set of skills
                and expertise.
              </p>

              <p className="text-[#C0C0BF] text-sm mt-6">
                At 8sqft, we&apos;re guided by a set of core values that shape
                our approach to every project we undertake. These values
                include:
              </p>
              <ul className=" space-y-3 text-sm">
                <li className="text-[#C0C0BF]">
                  <span className="text-orange-400 font-semibold">
                    Quality:
                  </span>{" "}
                  We&apos;re committed to delivering exceptional quality in
                  every aspect of our work, from design to construction to
                  customer service.
                </li>
                <li className="text-[#C0C0BF]">
                  <span className="text-orange-400 font-semibold">
                    Innovation:
                  </span>{" "}
                  We&apos;re always looking for new and innovative ways to
                  improve our processes, products, and services, ensuring that
                  our clients receive the best possible experience.
                </li>
                <li className="text-[#C0C0BF]">
                  <span className="text-orange-400 font-semibold">
                    Customer Satisfaction:
                  </span>{" "}
                  We&apos;re dedicated to exceeding our clients&apos;
                  expectations, providing them with a personalized and tailored
                  experience that meets their unique needs and preferences.
                </li>
                <li className="text-[#C0C0BF]">
                  <span className="text-orange-400 font-semibold">
                    Sustainability:
                  </span>{" "}
                  We&apos;re committed to building sustainable homes and
                  communities that minimize our impact on the environment and
                  promote a healthier, more sustainable future.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default OurStory;

import React from 'react'
import GrowWithUsBG from "@/public/assets/OurStory/grow_with_us.svg";
import GrowWithUsMobBG from "@/public/assets/OurStory/grow_with_us_mob.svg";
import Image from "next/image";
export default function GrowYourBusiness() {
  return (
    <>
    <div id='growBusiness' className='relative scroll-mt-20'>
    <Image src={GrowWithUsBG} alt="hero img" width={400} height={400} className="w-full hidden lg:block"/>
    <Image src={GrowWithUsMobBG} alt="hero img" width={400} height={400} className="w-full block lg:hidden"/>
      <div className='absolute top-1/2 lg:left-28 -translate-y-1/2 z-10 text-white p-5 lg:p-0'>
        <h1 className='lg:text-5xl text-lg uppercase font-semibold w-full lg:w-[70%] lg:!leading-[3.5rem] tracking-wider'>Grow Your Real Estate Business with 8sqft</h1>
        <p className='bg-black/40 p-5 lg:mt-5 rounded-xl w-full lg:w-[50%] lg:leading-8 leading-5 text-xs lg:text-base backdrop-blur-sm'>
        8sqft helps you sell properties faster and grow your business with expert support, smart technology, and a strong team. We provide everything you need leads, marketing, and tools to close more deals and stay ahead of the competition.
        </p>
      </div>
    </div>
    </>
  )
}

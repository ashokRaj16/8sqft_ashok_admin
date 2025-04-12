import React from 'react'
import builderLogo from "@/public/assets/OurStory/builderLogo.svg";
import flipIcon from "@/public/assets/OurStory/flip_icon.svg";
import Image from "next/image";
import { Card, CardContent } from '@/ui/card';
import Link from 'next/link';
export default function BuilderSpotlight() {
  return (
    <>
      <div>
        <div className='w-full max-w-7xl  mx-auto lg:pb-5 px-4'>
          <h1 className='lg:text-3xl text-lg font-semibold tracking-widest'>BUILDER SPOTLIGT</h1>
        </div>
        <div className=' bg-[#E3E3E380] lg:py-10 p-2 lg:m-0 m-1 rounded-lg lg:rounded-2xl'>
          <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-y-10 lg:gap-x-16 gap-3 w-full max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) =>
             <Link href={`/OurStory/${i}`} key={i}>
              <Card className='overflow-hidden rounded-lg border-none relative group [perspective:1000px]'>
                <CardContent className='bg-[url(/assets/OurStory/cardBg.png)] flex items-center justify-center bg-cover bg-no-repeat px-6 py-10 transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]'>
                  <div className="[backface-visibility:hidden]">
                    <Image src={flipIcon} alt="flipicon" width={16} height={16} className="w-5 absolute top-3 right-3" />
                    <Image src={builderLogo} alt="hero img" width={200} height={200} className="w-full shadow-lg" />
                  </div>
                  <div className="absolute inset-0 h-full w-full rounded-lg bg-black/70 lg:p-3 p-1 text-white [transform:rotateY(180deg)] [backface-visibility:hidden]">

                    <h1 className='lg:text-lg text-sm lg:font-semibold border-b'>Yashraj Nakshatra</h1>
                    <div className="grid grid-cols-2 lg:gap-y-4 gap-1 lg:my-2">
                      <div>
                        <h1 className='lg:text-xl text-sm lg:font-semibold'>1700+</h1>
                        <p className='lg:text-sm text-[10px] font-light'>Site Visits</p>
                      </div>
                      <div>
                        <h1 className='lg:text-xl text-sm lg:font-semibold'>800+</h1>
                        <p className='lg:text-sm text-[10px] font-light'>Site Visits through Direct</p>
                      </div>
                      <div>
                        <h1 className='lg:text-xl text-sm lg:font-semibold'>174+</h1>
                        <p className='lg:text-sm text-[10px] font-light'>Booking</p>
                      </div>
                      <div>
                        <h1 className='lg:text-xl text-sm lg:font-semibold'>₹70Cr+</h1>
                        <p className='lg:text-sm text-[10px] font-light'>Revenue</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
             </Link>
            )}
          </div>
        </div>
      </div>

    </>
  )
}

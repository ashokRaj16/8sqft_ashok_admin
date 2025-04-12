import Image from 'next/image'
import React from 'react'

const data=[
    {
        title:'Strategic Partnership',
        description:'Partner with 8sqft to create a strong, long-term real estate sales strategy.',
        icon:'/assets/OurStory/StrategicPartnership.svg'
    },
    {
        title:'Data-Driven Decisions',
        description:'Use market insights to make informed choices.',
        icon:'/assets/OurStory/DataDrivenDecisions.svg'
    },
    {
        title:'Stronger Sales Network',
        description:'Build a solid channel partner ecosystem.',
        icon:'/assets/OurStory/StrongerSalesNetwork.svg'

    },
    {
        title:'Marketing Partnership',
        description:'Boost your property sales with our powerful marketing strategies.',
        icon:'/assets/OurStory/MarketingPartnership.svg'
    },
    {
        title:'Brand Visibility',
        description:'Enhance your presence across digital and offline channels.',
        icon:'/assets/OurStory/BrandVisibility.svg'
    },
    {
        title:'Collaboration for Growth',
        description:'Work with industry experts to scale your business.',
        icon:'/assets/OurStory/CollaborationforGrowth.svg'
    },
    {
        title:'Tech-Enabled Solutions',
        description:'Leverage smart technology to enhance operations.',
        icon:'/assets/OurStory/TechEnabledSolutions.svg'
    },
    {
        title:'End-to-End Support',
        description:'From planning to execution, we’ve got you covered.',
        icon:'/assets/OurStory/EndtoEndSupport.svg'
    },
    {
        title:'Targeted Campaigns',
        description:'Reach the right buyers with data-backed advertising.',
        icon:'/assets/OurStory/TargetedCampaigns.svg'
    },
    {
        title:'Lead Generation',
        description:'Drive high-quality leads through multi-platform strategies.',
          icon:'/assets/OurStory/LeadGeneration.svg'
    }
]
export default function OurValue() {
  return (
    <>
        <div className='w-full max-w-7xl mx-auto pb-4'>
        <div className="text-center">
      <h1 className='lg:text-3xl text-lg font-semibold tracking-widest'>Our Values</h1>
      <label className='uppercase lg:tracking-wider text-xs lg:text-base'>We strive to redefine the standard of excellence.</label>
      </div>

      <div className="grid lg:grid-cols-2 justify-center items-center gap-4 mt-4">
        {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center ">
          <Image src={item.icon} alt='icon' width={175} height={175} className='border border-dashed rounded-2xl border-black-50 lg:w-[120px] lg:h-[120px] w-20 h-20'/>
          <h1 className='lg:text-lg text-sm font-semibold uppercase tracking-wide mt-4'>{item.title}</h1>
            <p className='lg:text-sm text-xs font-light w-10/12'>{item.description}</p>
            </div>
        ))}
      </div>
            </div>
            </>
  )
}

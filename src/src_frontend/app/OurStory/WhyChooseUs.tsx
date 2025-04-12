
import React from 'react'
import { BiBuildingHouse } from 'react-icons/bi'
import { FaHandsHelping, FaRegBuilding } from 'react-icons/fa'
import { GrDocumentVerified } from 'react-icons/gr'
import { IoRocketOutline } from 'react-icons/io5';
import { SiMoleculer } from "react-icons/si";
const data=[
    {
        title:'10+ Years',
        description:'of experience in thereal estate industry',
        icon:<FaRegBuilding />
    },
    {
        title:'1,000+ Clients',
        description:'served across the real estate sector in India',
        icon:<GrDocumentVerified />
    },
    {
        title:'INR 750+ crore',
        description:'worth of inventory sold',
        icon:<BiBuildingHouse />

    },
    {
        title:'5+ million',
        description:'Leads generated across various channels',
        icon:<SiMoleculer />
    },
    {
        title:'INR 10+ crore',
        description:'marketing budget managed',
        icon:<FaHandsHelping />
    },
    {
        title:'100+ successful',
        description:'property transactions completed',
        icon:<IoRocketOutline />
    }
]
export default function WhyChooseUs() {
  return (
    <>
    <div className='w-full max-w-7xl mx-auto px-4 pt-4 lg:pt-0'>
    <div className="text-center">
      <h1 className='lg:text-3xl text-lg font-semibold tracking-widest'>Why you choose 8SQFT?</h1>
      <label className='uppercase lg:tracking-wider text-xs lg:text-base'>We have a strong track record in real estate sales and marketing, helping businesses grow with smart strategies.</label>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 py-4">
        {data.map((item, index) => (
            <div key={index} className="flex flex-col px-4 lg:py-10 py-4 rounded-lg bg-primary-black text-white Imgshine">
          <div className="flex items-center gap-2">
          <div className="text-4xl text-primary m-0">{item.icon}</div>
          <h1 className='lg:text-2xl text-lg font-semibold uppercase'>{item.title}</h1>
          </div>
            <p className='lg:text-base text-sm font-light mt-2 uppercase w-10/12'>{item.description}</p>
            </div>
        ))}
      </div>
    </div>
    </>
  )
}

import React from "react";
import Image from "next/image";

interface FeatureProps {
  title: string;
  imageSrc: string;
}

const Feature: React.FC<FeatureProps> = ({ title, imageSrc }) => (
  <div className="flex flex-col gap-2 items-center ">
    <div className="w-20 h-20 relative">
      <Image src={imageSrc} alt={title} layout="fill" objectFit="contain" />
    </div>
    <span className="text-center text-[#222222] text-sm font-normal leading-6">
      {title}
    </span>
  </div>
);

const WhyChooseComponent: React.FC = () => {
  const features = [
    {
      title: "Fast Assistance",
      imageSrc: "/assets/WhyChoose/Fast_Rent_Assistance_Icon.svg",
    },
    {
      title: "Verified Owners, Trusted Connections",
      imageSrc: "/assets/WhyChoose/Verified_Owner_Icon.svg",
    },
    {
      title: "Transparent Pricing Guarantee",
      imageSrc: "/assets/WhyChoose/Transparent_Pricing_Icon.svg",
    },
    {
      title: "Connect beyond listing",
      imageSrc: "/assets/WhyChoose/Connect_Beyond_Icon.svg",
    },
  ];

  return (
    <div className='w-FULL flex flex-col justify-center align-middle  items-center mx-auto my-8 p-14 bg-[#FFF4ED] rounded-lg'>
      <div>
        <h1 className="text-center text-[#222222] text-2xl font-bold mb-12">Why Choose 8Sqft?</h1>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-8" >

        {features.map((feature, index) => (
          <Feature key={index} title={feature.title} imageSrc={feature.imageSrc} />
        ))}
      </div>
    </div>
  );
};

export default WhyChooseComponent;

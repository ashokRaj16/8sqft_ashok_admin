'use client';
import React from "react";

interface OverviewItem {
  icon?: React.ReactNode; // Optional icon
  name: string; // Display name
  src?: string; // Optional image source
}

const overviewData: OverviewItem[] = [
  { src: "/assets/services8sqft/RentAgreement.svg", name: "Rent Agreement" },
  {
    src: "/assets/services8sqft/RentAgreement.svg",
    name: "Tenant Police Agreement",
  },
];

const ServicesData: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">8sqft Services</h2>
      <div className="flex flex-wrap gap-4">
        {overviewData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col  items-center text-center gap-2"
          >
            {item.icon ? (
              <div className="text-blue-500 text-2xl">{item.icon}</div>
            ) : item.src ? (
              <img
                src={item.src}
                alt={item.name}
                className="w-8 h-8 object-contain"
              />
            ) : null}
            <h3 className="font-medium text-sm w-28 lg:w-full">{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesData;

import React from "react";

interface OverviewItem {
  icon: string; // Updated to accept the string path of icons
  name: string;
  info: string;
}

interface OverviewProps {
  Furnishing: string | undefined;
  DoorFacing: string | null | undefined;
  WaterSupply: string | undefined;
  Floor: number | undefined;
  Washroom: number | undefined;
  Non_VegAllowed: string | undefined;
  GatedSecurity: string | undefined;
}

export default function Overview({
  Furnishing,
  DoorFacing,
  WaterSupply,
  Floor,
  Washroom,
  Non_VegAllowed,
  GatedSecurity,
}: OverviewProps) {
  const overviewData: OverviewItem[] = [
    {
      icon: "/assets/overview/Furnished_Icon.svg",
      name: "Furnishing Status",
      info: Furnishing || "",
    },
    {
      icon: "/assets/overview/DoorFacing.svg",
      name: "Door Facing",
      info: DoorFacing || "",
    },
    {
      icon: "/assets/overview/WaterSupply.svg",
      name: "Water Supply",
      info: WaterSupply || "",
    },
    {
      icon: "/assets/overview/Floor.svg",
      name: "Floor",
      info: Floor !== undefined ? `${Floor}` : "",
    },
    {
      icon: "/assets/overview/Washroom.svg",
      name: "Washroom",
      info: Washroom !== undefined ? `${Washroom}` : "",
    },
    {
      icon: "/assets/overview/Non-VegAllowed.svg",
      name: "Non-Veg Allowed",
      info:
        Non_VegAllowed === "0"
          ? "Yes"
          : Non_VegAllowed === "1"
          ? "No"
          : "", // Handle cases where Non_VegAllowed is undefined or invalid
    },
    {
      icon: "/assets/overview/GatedSecurity.svg",
      name: "Gated Security",
      info: GatedSecurity || "",
    },
  ];

  // Filter out items with empty info
  const filteredData = overviewData.filter((item) => item.info.trim() !== "");

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Overview</h2>
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 ">
          {filteredData.map((item, index) => (
            <div key={index}>
              <div className="flex flex-col lg:flex-row items-center gap-2 mb-2 my-5 ">
                {/* Render the icon */}
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-8 h-8 text-blue-500"
                />
                
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-gray-600 text-xs">{item.info}</p>
                
              </div>
              <div className="border-b border-dotted border-black"></div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No data available.</p>
      )}
    </div>
  );
}

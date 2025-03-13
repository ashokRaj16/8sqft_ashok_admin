'use client';
import React, { useState } from "react";



interface AmenitiesProps {
  otherAmenities?: string | undefined; // Comma-separated string of amenities from the API
  parking?: string | null | undefined;
  waterSupply?: string | null | undefined;
  grantedSecurity?: string | null | undefined;
  sewageConnection?: string | null | undefined;
  electricityConnection?: string | null | undefined;
  washroomType?: string | null | undefined;
  furnishingStatus?: string | null | undefined;
}
const AmenitiesContent: React.FC<AmenitiesProps> = ({ otherAmenities, parking, waterSupply, grantedSecurity, sewageConnection, electricityConnection, washroomType, furnishingStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const amenitiesArray = otherAmenities ? otherAmenities.split(',').map(item => item.trim()) : [];
  if (otherAmenities) {
    amenitiesArray.push(
      ...(parking ? [parking] : []),
      ...(waterSupply ? ["Water Supply"] : []),
      ...(grantedSecurity ? ["Granted Security"] : []),
      ...(sewageConnection ? ["Sewage Connection"] : []),
      ...(electricityConnection ? ["Electricity Connection"] : []),
      ...(washroomType ? [washroomType] : []),
      ...(furnishingStatus ? [furnishingStatus] : [])
    );
  }
  otherAmenities = amenitiesArray.join(', ');

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const amenities = [
    {
      icon: "/assets/Builder/amenity/WaterSupply.svg", // Placeholder for play area icon
      label: "Water Supply",
    },
    {
      icon: "/assets/Builder/amenity/Washroom.svg", // Placeholder for play area icon
      label: "Shared",
    },
    {
      icon: "/assets/Builder/amenity/Washroom.svg", // Placeholder for play area icon
      label: "Private",
    },
    {
      icon: "/assets/Builder/amenity/furnished.svg", // Placeholder for play area icon
      label: "Furnished",
    },
    {
      icon: "/assets/Builder/amenity/furnished.svg", // Placeholder for play area icon
      label: "Semi-furnished",
    },
    {
      icon: "/assets/Builder/amenity/SewageTreatmentPlant.svg", 
      label: "Sewage Connection",
    },
    {
      icon: "/assets/Builder/amenity/Security.svg", // Placeholder for security icon
      label: "Granted Security",
    },
    {
      icon: "/assets/Builder/amenity/Electricity.svg", // Placeholder for electricity icon
      label: "Electricity Connection",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg",
      label: "2+4 Wheeler",
    },
    {
      icon: "/assets/Builder/amenity/4_wheeler_parking.svg",
      label: "4 wheeler",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg",
      label: "Extra Paid Parking",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg",
      label: "Public and Reserved",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg",
      label: "Public",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg",
      label: "Reserved",
    },
    {
      icon: "/assets/Builder/amenity/AirConditioner.svg", // Placeholder for play area icon
      label: "Air Conditioner",
    },
    {
      icon: "/assets/Builder/amenity/VisitorParking.svg", // Placeholder for play area icon
      label: "Visitor parking",
    },
    {
      icon: "/assets/Builder/amenity/Amphitheater.svg", // Placeholder for play area icon
      label: "Amphitheater",
    },
    {
      icon: "/assets/Builder/amenity/PlayArea.svg", // Placeholder for play area icon
      label: "Play Area",
    },
    {
      icon: "/assets/Builder/amenity/Powerbackup.svg", // Placeholder for play area icon
      label: "Power Backup",
    },
    {
      icon: "/assets/Builder/amenity/FireSafety.svg", 
      label: "Fire Safety",
    },
    {
      icon: "/assets/Builder/amenity/RainWaterHarvesting.svg", 
      label: "Rain Water Harvesting",
    },

    {
      icon: "/assets/Builder/amenity/Shoppingcentre.svg", 
      label: "Shopping Centre",
    },
    {
      icon: "/assets/Builder/amenity/SolarWater.svg", 
      label: "Solar Water",
    },
    {
      icon: "/assets/Builder/amenity/ServantRoom.svg", 
      label: "Servant Room",
    },
    {
      icon: "/assets/Builder/amenity/Garden.svg", // Placeholder for garden icon
      label: "Garden",
    },
    {
      icon: "/assets/Builder/amenity/InternetServices.svg", // Placeholder for garden icon
      label: "Internet Services",
    },
    {
      icon: "/assets/Builder/amenity/Lift.svg", // Placeholder for garden icon
      label: "Lift",
    },
    {
      icon: "/assets/Builder/amenity/Park.svg", // Placeholder for garden icon
      label: "Park",
    },
    {
      icon: "/assets/Builder/amenity/NoSmoking.svg", // Placeholder for garden icon
      label: "Smoking",
    },
 
    {
      icon: "/assets/Builder/amenity/Intercom.svg", // Placeholder for garden icon
      label: "Intercom",
    },
    {
      icon: "/assets/Builder/amenity/IndoorGame.svg", // Placeholder for garden icon
      label: "Indoor Game",
    },
    {
      icon: "/assets/Builder/amenity/HouseKeeping.svg", // Placeholder for garden icon
      label: "House Keeping",
    },
    {
      icon: "/assets/Builder/amenity/Gym.svg", // Placeholder for garden icon
      label: "Gym",
    },
    {
      icon: "/assets/Builder/amenity/Guardian.svg", // Placeholder for garden icon
      label: "Guardian",
    },
    {
      icon: "/assets/Builder/amenity/Girl.svg", // Placeholder for garden icon
      label: "Girl",
    },
    {
      icon: "/assets/Builder/amenity/Boy.svg", // Placeholder for garden icon
      label: "Boy",
    },
    {
      icon: "/assets/Builder/amenity/GasPipeline.svg", // Placeholder for garden icon
      label: "Gas Pipeline",
    },
    {
      icon: "/assets/Builder/amenity/CCTV.svg", // Placeholder for garden icon
      label: "CCTV Camera",
    },
    {
      icon: "/assets/Builder/amenity/BoundaryWall.svg", // Placeholder for boundary wall icon
      label: "Boundary Wall",
    },

    {
      icon: "/assets/Builder/amenity/UnderGroundElectricity.svg", // Placeholder for electricity icon
      label: "Under Ground Electricity",
    },
    {
      icon: "/assets/Builder/amenity/Temple.svg", // Placeholder for temple icon
      label: "Temple",
    },
    {
      icon: "/assets/Builder/amenity/WaterStorage.svg", // Placeholder for temple icon
      label: "Water Storage",
    },
    {
      icon: "/assets/Builder/amenity/VastuCompliance.svg", // Placeholder for temple icon
      label: "Vastu Compliance",
    },
    {
      icon: "/assets/Builder/amenity/Road.svg", // Placeholder for temple icon
      label: "Road",
    },
    {
      icon: "/assets/Builder/amenity/SwimmingPool.svg", // Placeholder for temple icon
      label: "Swimming Pool",
    },
    {
      icon: "/assets/Builder/amenity/DayCare.svg", // Placeholder for temple icon
      label: "Day Care",
    },
    {
      icon: "/assets/Builder/amenity/ConferenceRoom.svg", // Placeholder for temple icon
      label: "Conference Room",
    },
    {
      icon: "/assets/Builder/amenity/water.svg", // Placeholder for water supply icon
      label: "water",
    },
    {
      icon: "/assets/Builder/amenity/Drinking.svg", // Placeholder for water supply icon
      label: "Drinking",
    },
   
    {
      icon: "/assets/Builder/amenity/Family.svg", // Placeholder for water supply icon
      label: "Family",
    },
    {
      icon: "/assets/Builder/amenity/facingDirection.svg", // Placeholder for water supply icon
      label: "facing Direction",
    },
    {
      icon: "/assets/Builder/amenity/StreetPole.svg", // Placeholder for street pole icon
      label: "Street Pole",
    },
    {
      icon: "/assets/Builder/amenity/CementRoad.svg", // Placeholder for cement road icon
      label: "Cement Road",
    },
    {
      icon: "/assets/Builder/amenity/Drainage.svg", // Placeholder for drainage icon
      label: "Drainage",
    },
    {
      icon: "/assets/Builder/amenity/ClubHouse.svg", // Placeholder for drainage icon
      label: "Club House",
    },
  ];
  const availableAmenities = amenities.filter((amenity) => {

    if (!otherAmenities || typeof otherAmenities !== "string") {
      return false; // Skip filtering if `otherAmenities` is invalid
    }

    // Normalize spaces and case for better matching
    const amenitiesArray = otherAmenities
      .toUpperCase() // Normalize to uppercase
      .split(",") // Split by comma (without the space)
      .map((amenityName) => amenityName.trim()); // Trim extra spaces

    return amenitiesArray.includes(amenity.label.toUpperCase()); // Match against normalized amenity names
  });
  const previewAmenities = availableAmenities.slice(0, 12);
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Amenities</h2>
      <div className="grid md:grid-cols-6 grid-cols-3 gap-3">
        {(isExpanded ? availableAmenities : previewAmenities).map(
          (amenity, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-[#F8F8F8] p-2 rounded-lg border  border-[#d4d4d4]"
            >
              <img
                src={amenity.icon}
                alt={amenity.label}
                className="w-8 h-8 mb-2 object-contain"
              />
              <span className="lg:text-xs text-[10px] text-gray-700 font-medium text-center line-clamp-1">
                {amenity.label}
              </span>
            </div>
          )
        )}
      </div>

      {availableAmenities.length > 12 && (
        <div className="flex justify-center ">
          <button
            onClick={toggleExpand}
            className="mt-4 text-[#FC6600] text-sm  hover:underline block text-center"
          >
            {isExpanded ? "Show Less Amenities" : "Show More Amenities"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AmenitiesContent;

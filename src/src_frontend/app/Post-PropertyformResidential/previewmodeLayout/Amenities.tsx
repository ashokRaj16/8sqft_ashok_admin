"use client";

import React, { useState } from "react";

interface Amenity {
  name: string;
  icon: string;
}

interface AmenitiesProps {
  otherAmenities: string | undefined; // Comma-separated string of amenities from the API
}

const Amenities: React.FC<AmenitiesProps> = ({ otherAmenities }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Master amenities list with icons
  const amenitiesList: Amenity[] = [
    { name: "Lift", icon: "/assets/PropertyDetailsPage/Lift.svg" },
    { name: "AirConditioner", icon: "/assets/PropertyDetailsPage/Air_Conditioner.svg" },
    { name: "Internet Services", icon: "/assets/PropertyDetailsPage/Internet_services.svg" },
    { name: "ClubHouse", icon: "/assets/PropertyDetailsPage/Club_House.svg" },
    { name: "Intercom", icon: "/assets/PropertyDetailsPage/Intercom.svg" },
    { name: "Swimming Pool", icon: "/assets/PropertyDetailsPage/Swimming_Pool.svg" },
    { name: "Play Area", icon: "/assets/PropertyDetailsPage/Play_Area.svg" },
    { name: "FireSafety", icon: "/assets/PropertyDetailsPage/Fire_Safety.svg" },
    { name: "Servant Room", icon: "/assets/PropertyDetailsPage/Servant_Room.svg" },
    { name: "Shopping Centre", icon: "/assets/PropertyDetailsPage/Shopping_centre.svg" },
    { name: "GasPipeline", icon: "/assets/PropertyDetailsPage/Gas_Pipeline.svg" },
    { name: "Park", icon: "/assets/PropertyDetailsPage/Park.svg" },
    { name: "Sewage Treatment Plant", icon: "/assets/PropertyDetailsPage/Sewage_treatment_plant.svg" },
    { name: "House Keeping", icon: "/assets/PropertyDetailsPage/House_Keeping.svg" },
    { name: "Power backup", icon: "/assets/PropertyDetailsPage/Power_backup.svg" },
    { name: "Visiting parking", icon: "/assets/PropertyDetailsPage/Visiting_parking.svg" },
    { name: "Solar Water", icon: "/assets/PropertyDetailsPage/Solar_Water.svg" },
    { name: "Day Care", icon: "/assets/PropertyDetailsPage/Day_Care.svg" },
    { name: "Pet Allowed", icon: "/assets/PropertyDetailsPage/Pet_Allowed.svg" }, // Placeholder
    { name: "Gym", icon: "/assets/PropertyDetailsPage/Gym.svg" }, // Placeholder
    { name: "Geysericon", icon: "/assets/PropertyDetailsPage/Geysericon.svg" }, // Placeholder
  ];
  

  // Filter available amenities
  const availableAmenities = amenitiesList.filter((amenity) => {
    if (!otherAmenities || typeof otherAmenities !== "string") {
      return false; // Skip filtering if `otherAmenities` is invalid
    }
  
    // Normalize spaces and case for better matching
    const amenitiesArray = otherAmenities
      .toUpperCase() // Normalize to uppercase
      .split(",") // Split by comma (without the space)
      .map((amenityName) => amenityName.trim()); // Trim extra spaces
  
    return amenitiesArray.includes(amenity.name.toUpperCase()); // Match against normalized amenity names
  });
  

  // Limit initial view to the first 6 amenities
  const previewAmenities = availableAmenities.slice(0, 6);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Amenities</h2>
      <div className="flex flex-wrap gap-5">
        {(isExpanded ? availableAmenities : previewAmenities).map(
          (amenity, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-[#F8F8F8] p-4 rounded-lg shadow-sm w-32"
            >
              <img
                src={amenity.icon}
                alt={amenity.name}
                className="w-8 h-8 mb-2 object-contain"
              />
              <span className="text-sm text-gray-700 font-medium text-center">
                {amenity.name}
              </span>
            </div>
          )
        )}
      </div>

      {availableAmenities.length > 6 && (
        <button
          onClick={toggleExpand}
          className="mt-4 text-blue-600 text-sm font-medium hover:underline block text-center"
        >
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default Amenities;

'use client';
import React, { useState } from "react";


interface Amenity {
    name: string;
    icon: string;
  }
  
  interface AmenitiesProps {
    otherAmenities?: string | undefined; // Comma-separated string of amenities from the API
  }
const AmenitiesContent: React.FC<AmenitiesProps> = ({ otherAmenities }) => {
     const [isExpanded, setIsExpanded] = useState(false);
    
      const toggleExpand = () => setIsExpanded(!isExpanded);
      const amenities = [
        {
          icon: "/assets/Builder/amenity/PlayArea.svg", // Placeholder for play area icon
          label: "PlayArea",
        },
        {
          icon: "/assets/Builder/amenity/FireSafety.svg", // Placeholder for fire safety icon
          label: "FireSafety",
        },
        {
          icon: "/assets/Builder/amenity/Garden.svg", // Placeholder for garden icon
          label: "Garden",
        },
        {
          icon: "/assets/Builder/amenity/BoundaryWall.svg", // Placeholder for boundary wall icon
          label: "BoundaryWall",
        },
        {
          icon: "/assets/Builder/amenity/Security.svg", // Placeholder for security icon
          label: "Security",
        },
        {
          icon: "/assets/Builder/amenity/UnderGroundElectricity.svg", // Placeholder for electricity icon
          label: "UnderGroundElectricity",
        },
        {
          icon: "/assets/Builder/amenity/Temple.svg", // Placeholder for temple icon
          label: "Temple",
        },
        {
          icon: "/assets/Builder/amenity/WaterSupply.svg", // Placeholder for water supply icon
          label: "WaterSupply",
        },
        {
          icon: "/assets/Builder/amenity/StreetPole.svg", // Placeholder for street pole icon
          label: "StreetPole",
        },
        {
          icon: "/assets/Builder/amenity/CementRoad.svg", // Placeholder for cement road icon
          label: "CementRoad",
        },
        {
          icon: "/assets/Builder/amenity/Drainage.svg", // Placeholder for drainage icon
          label: "Drainage",
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
                alt={amenity.label}
                className="w-8 h-8 mb-2 object-contain"
              />
              <span className="text-sm text-gray-700 font-medium text-center">
                {amenity.label}
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

export default AmenitiesContent;

import React from "react";

interface Detail {
  icon: string; // Icon for each detail
  label: string; // Label for each detail
  value: string | number; // Dynamic value from props
}

// Props interface for DetailsSection
interface DetailsProps {
  preferred_tenent: string | undefined;
  builtup_area: number | undefined;
  availability_date: string | undefined;
  bed_rooms: number | undefined;
  balcony: number | undefined;
  parking: string | undefined;
  property_age: string | number | undefined;
  property_variety: string | undefined;
}

// DetailsSection Component
const DetailsSection: React.FC<DetailsProps> = ({
  preferred_tenent,
  availability_date,
  bed_rooms,
  balcony,
  parking,
  property_age,
  property_variety,
}) => {
  const PropertyAgeOptions = [
    { label: "New", value: 0 },
    { label: "1 to 3 Years", value: 36 },
    { label: "4 to 6 Years", value: 72 },
    { label: "7 to 9 Years", value: 108 },
    { label: "+ 9 Years", value: 120 },
  ];

  // Helper function to map property_age to its label
  const getPropertyAgeLabel = (age: string | number | undefined): string => {
    if (age === undefined || age === null) return "Unknown"; // Default if undefined
    const matchingOption = PropertyAgeOptions.find(
      (option) => Number(age) === option.value
    );
    return matchingOption ? matchingOption.label : "Unknown";
  };

  // Map details data dynamically
  const detailsData: Detail[] = [
    {
      icon: "/assets/property-list-asset/property-detail-asset/Bedroon.svg",
      label: "No. of Bedroom",
      value:
        bed_rooms !== undefined && bed_rooms !== null
          ? `${bed_rooms} Bedroom`
          : "N/A",
    },
    {
      icon: "/assets/property-list-asset/Apartment.svg",
      label: "Property Type",
      value: property_variety ?? "N/A",
    },
    {
      icon: "/assets/property-list-asset/property-detail-asset/Anyone.svg",
      label: `Preferred Tenant`,
      value: preferred_tenent ?? "N/A",
    },
    {
      icon: "/assets/property-list-asset/property-detail-asset/Immediately.svg",
      label: "Available from",
      value: availability_date ?? "N/A",
    },
    {
      icon: "/assets/property-list-asset/bikeandcar.svg",
      label: "Parking",
      value: parking ?? "N/A",
    },
    {
      icon: "/assets/property-list-asset/constructed.svg",
      label: "Property Age",
      value: getPropertyAgeLabel(property_age), // Map age to label
    },
    {
      icon: "/assets/property-list-asset/property-detail-asset/Balcony.svg",
      label: "Balcony",
      value: balcony ?? "N/A",
    },
    {
      icon: "/assets/property-list-asset/calender.svg",
      label: "Posted on",
      value: availability_date ?? "N/A",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 border-t border-b py-3 w-full">
      {detailsData.map((detail, index) => (
        <div
          key={index}
          className="flex flex-col lg:flex-row items-center gap-4 w-full"
        >
          {/* Icon */}
          <img
            src={detail.icon}
            alt={detail.label}
            className="w-8 h-8 object-contain"
          />

          {/* Text Content */}
          <div className="flex flex-col">
            <span className="text-sm text-black font-medium">
              {detail.value}
            </span>
            <span className="text-[12px] text-gray-600 ">{detail.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailsSection;

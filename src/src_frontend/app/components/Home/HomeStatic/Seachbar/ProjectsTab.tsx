import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useState } from "react";
interface ProjectsTabProps {
  setPropertyType: (type: string) => void;
  propertyType: string;
}

export default function ProjectsTab({propertyType, setPropertyType}: ProjectsTabProps) {
  // const [propertyType, setPropertyType] = useState<
  //   "Residential" | "Commercial" | "Plot"
  // >("Residential");
  const [selectedOption, setSelectedOption] = useState<string>("");

  return (
    <>
      <div className="flex flex-col">
        {/* Radio Buttons for Property Type */}
        <div className="flex space-x-4  flex-wrap ">
          <label className="items-center flex">
            <input
              type="radio"
              name="propertyType"
              value="Residential"
              checked={propertyType === "Residential"}
              onChange={(e) =>
                setPropertyType("Residential")
              }
            />
            <span className="ml-1 text-xs lg:text-sm">Residential</span>
          </label>
          <label className="items-center flex">
            <input
              type="radio"
              name="propertyType"
              value="Commercial"
              checked={propertyType === "Commercial"}
              onChange={(e) =>
                setPropertyType("Commercial")
              }
            />
            <span className="ml-1 text-xs lg:text-sm">Commercial</span>
          </label>
          <label className="items-center flex">
            <input
              type="radio"
              name="propertyType"
              value="Open Land"
              checked={propertyType === "Open Land"}
              onChange={(e) =>
                setPropertyType("Open Land")
              }
            />
            <span className="ml-1 text-xs lg:text-sm">Open Land</span>
          </label>
        </div>

        {/* Dropdown for Options */}

        {/* Display Selected Option */}
        {/* {propertyType && (
          <p className="text-gray-600">
            Selected Option: <strong>{propertyType}</strong>
          </p>
        )} */}
      </div>
    </>
  );
}

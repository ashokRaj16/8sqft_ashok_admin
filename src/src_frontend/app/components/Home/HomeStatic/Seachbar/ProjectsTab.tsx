import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { useState } from "react";

export default function ProjectsTab() {
  const [propertyType, setPropertyType] = useState<
    "Residential" | "Commercial" | "Plot"
  >("Residential");
  const [selectedOption, setSelectedOption] = useState<string>("");

  return (
    <>
      <div className="flex flex-col space-y-4">
        {/* Radio Buttons for Property Type */}
        <div className="flex space-x-4 flex-wrap ">
          <label>
            <input
              type="radio"
              name="propertyType"
              value="Residential"
              checked={propertyType === "Residential"}
              onChange={(e) =>
                setPropertyType(
                  e.target.value as "Residential" | "Commercial" | "Plot"
                )
              }
            />
            <span className="ml-1">Residential</span>
          </label>
          <label>
            <input
              type="radio"
              name="propertyType"
              value="Commercial"
              checked={propertyType === "Commercial"}
              onChange={(e) =>
                setPropertyType(
                  e.target.value as "Residential" | "Commercial" | "Plot"
                )
              }
            />
            <span className="ml-1">Commercial</span>
          </label>
          <label>
            <input
              type="radio"
              name="propertyType"
              value="Plot"
              checked={propertyType === "Plot"}
              onChange={(e) =>
                setPropertyType(
                  e.target.value as "Residential" | "Commercial" | "Plot"
                )
              }
            />
            <span className="ml-1">Plot</span>
          </label>
        </div>

        {/* Dropdown for Options */}

        {/* Display Selected Option */}
        {selectedOption && (
          <p className="text-gray-600">
            Selected Option: <strong>{selectedOption}</strong>
          </p>
        )}
      </div>
    </>
  );
}

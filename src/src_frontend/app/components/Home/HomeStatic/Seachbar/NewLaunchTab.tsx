import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { useState } from "react";

export default function NewLaunchTab(){
    const [propertyType, setPropertyType] = useState<
        "Residential" | "Commercial" | "Land/Plot"
      >("Residential");
      const [selectedOption, setSelectedOption] = useState<string>("");
    
      const residentialOptions = [
        "Studio",
        "1RK",
        "1BHK",
        "2BHK",
        "3BHK",
        "4BHK",
        "5+BHK",
        "Other",
      ];
      const commercialOptions = ["Shop", "Other"];
      const Land = ["Residential Land/Plot", "Industrial Land/Plot", "Other"];
    return (<>
    <div className="flex flex-col space-y-4">
        {/* Radio Buttons for Property Type */}
        <div className="flex space-x-4 flex-wrap">
          <label>
            <input
              type="radio"
              name="propertyType"
              value="Residential"
              checked={propertyType === "Residential"}
              onChange={(e) =>
                setPropertyType(
                  e.target.value as "Residential" | "Commercial" | "Land/Plot"
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
                  e.target.value as "Residential" | "Commercial" | "Land/Plot"
                )
              }
            />
            <span className="ml-1">Commercial</span>
          </label>
          <label>
            <input
              type="radio"
              name="propertyType"
              value="Land/Plot"
              checked={propertyType === "Land/Plot"}
              onChange={(e) =>
                setPropertyType(
                  e.target.value as "Residential" | "Commercial" | "Land/Plot"
                )
              }
            />
            <span className="ml-1">Land/Plot</span>
          </label>
        </div>

        {/* Dropdown for Options */}
        <Select onValueChange={(value) => setSelectedOption(value)}>
          <SelectTrigger className="border border-gray-300 rounded w-28">
            
            {/* Minimum width */}
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="bg-white p-2 w-28">
           
            {/* Match dropdown width */}
            {(propertyType === "Residential"
              ? residentialOptions
              : propertyType === "Commercial"
              ? commercialOptions
              : Land
            ).map((option) => (
              <SelectItem
                className="hover:bg-primary hover:text-white p-2 cursor-pointer"
                key={option}
                value={option}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Display Selected Option */}
        {/* {selectedOption && (
          <p className="text-gray-600">
            Selected Option: <strong>{selectedOption}</strong>
          </p>
        )} */}
      </div>
    </>)
}
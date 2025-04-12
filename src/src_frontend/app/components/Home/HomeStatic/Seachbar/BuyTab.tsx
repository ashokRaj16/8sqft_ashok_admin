import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { RadioGroup, RadioGroupItem } from "@/ui/radio";
import { Label } from "@/ui/label";

// Define types for fixed options
type PropertyType = "Full House" | "Land/Plot";


export default function BuyTab() {
  const [propertyType, setPropertyType] = useState<PropertyType>("Full House");
 
  // const [propertyStatus, setPropertyStatus] = useState<PropertyStatus>("Under Construction");
  // const [isNewBuilderProject, setIsNewBuilderProject] = useState<boolean>(false);

 

  return (
    <div className="flex flex-col ">
      <div className="flex flex-wrap gap-4">
      <RadioGroup className="flex items-center text-white lg:text-black" value={propertyType} onValueChange={(value) => setPropertyType(value as PropertyType)}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Full House" id="full_house" />
        <Label className="ml-1 text-[10px] lg:text-sm font-normal" htmlFor="full_house">
          Full House
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="Land/Plot" id="land_plot" />
        <Label className="ml-1 text-[10px] lg:text-sm font-normal" htmlFor="land_plot">
          Land/Plot
        </Label>
      </div>
    </RadioGroup>

        {/* <label className="text-sm sm:text-base items-center flex">
          <input
            type="radio"
            name="propertyType"
            value="Full House"
            checked={propertyType === "Full House"}
            onChange={(e) => setPropertyType(e.target.value as PropertyType)}
          />
         <span className="ml-1 text-xs lg:text-sm">Full House</span> 
        </label>
        <label className="text-sm sm:text-base items-center flex">
          <input
            type="radio"
            name="propertyType"
            value="Land/Plot"
            checked={propertyType === "Land/Plot"}
            onChange={(e) => setPropertyType(e.target.value as PropertyType)}
          />
              <span className="ml-1 text-xs lg:text-sm">Land/Plot</span> 
        </label> */}
      </div>

      {propertyType === "Full House" && (
        <div className="flex flex-wrap gap-4">
          {/* BHK Type Select */}
          

          {/* Property Status Select */}
          {/* <Select onValueChange={(value) => setPropertyStatus(value as PropertyStatus)}>
            <SelectTrigger className="flex-1 border border-gray-300 rounded text-sm sm:text-base">
              <SelectValue placeholder="Select Property Status" />
            </SelectTrigger>
            <SelectContent className="bg-white w-full p-2 cursor-pointer">
              {["Under Construction", "Ready"].map((status) => (
                <SelectItem className="cursor-pointer hover:bg-primary hover:text-white p-2" key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          {/* New Builder Project Checkbox
          <label className="flex items-center space-x-2 text-sm sm:text-base">
            <input
              type="checkbox"
              checked={isNewBuilderProject}
              onChange={() => setIsNewBuilderProject((prev) => !prev)}
            />
            <span>New Builder Project</span>
          </label> */}
        </div>
      )}
    </div>
  );
}

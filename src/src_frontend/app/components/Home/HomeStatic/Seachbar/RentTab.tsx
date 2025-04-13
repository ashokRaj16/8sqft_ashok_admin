import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import useFilterStore from "@/Store/useFilterStore";
import { RadioGroup, RadioGroupItem } from "@/ui/radio";
import { Label } from "@/ui/label";

export default function RentTab() {
  const [propertyType, setPropertyType] = useState<
    "Residential" | "Commercial" | "PG"
  >("Residential");
  const [selectedOption, setSelectedOption] = useState<string>("Residential");
  const filters = useFilterStore();
  const { setFilter } = filters;

 

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
    setFilter({ property_type: value });
  };

  return (
    <div className="flex flex-col">
      {/* Radio Buttons for Property Type */}
      <RadioGroup className="flex items-center text-white lg:text-black" value={propertyType} onValueChange={(value) => setPropertyType(value as "Residential" | "Commercial" | "PG")}>
      {(["Residential", "Commercial", "PG"] as const).map((type) => (
        <div key={type} className="flex items-center space-x-2">
          <RadioGroupItem value={type} id={type} />
          <Label className="ml-1 text-[10px] lg:text-sm font-normal" htmlFor={type}>
            {type}
          </Label>
        </div>
      ))}
    </RadioGroup>
      {/* <div className="flex space-x-4 flex-wrap">
        {(["Residential", "Commercial", "PG"] as const).map((type) => (
          <label key={type} className="items-center flex">
            <input
              type="radio"
              name="propertyType"
              value={type}
              checked={propertyType === type}
              onChange={() => setPropertyType(type)}
            />
            <span className="ml-1 text-xs lg:text-sm">{type}</span>
          </label>
        ))}
      </div> */}

     

      {/* Display Selected Option */}
      {/* {selectedOption && (
        <p className="text-gray-600">
          Selected Option: <strong>{selectedOption}</strong>
        </p>
      )} */}
    </div>
  );
}

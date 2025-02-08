import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import useFilterStore from "@/Store/useFilterStore";

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
    <div className="flex flex-col space-y-4">
      {/* Radio Buttons for Property Type */}
      <div className="flex space-x-4 flex-wrap">
        {(["Residential", "Commercial", "PG"] as const).map((type) => (
          <label key={type}>
            <input
              type="radio"
              name="propertyType"
              value={type}
              checked={propertyType === type}
              onChange={() => setPropertyType(type)}
            />
            <span className="ml-1">{type}</span>
          </label>
        ))}
      </div>

     

      {/* Display Selected Option */}
      {/* {selectedOption && (
        <p className="text-gray-600">
          Selected Option: <strong>{selectedOption}</strong>
        </p>
      )} */}
    </div>
  );
}

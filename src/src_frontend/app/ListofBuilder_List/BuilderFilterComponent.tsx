import React, { useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/ui/radio";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge, RotateCcw } from "lucide-react";

import { Slider } from "@/ui/slider";
import useFilterStore from "@/Store/useFilterStore";
import { RiRestartLine } from "react-icons/ri";
const calculateDate = (option: string): string => {
  const currentDate = new Date();

  switch (option) {
    case "Immediate":
      return currentDate.toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

    case "Within 15 Days":
      currentDate.setDate(currentDate.getDate() + 15); // Add 15 days
      return currentDate.toISOString().split("T")[0];

    case "Within 30 Days":
      currentDate.setDate(currentDate.getDate() + 30); // Add 30 days
      return currentDate.toISOString().split("T")[0];

    case "After 30 Days":
      currentDate.setDate(currentDate.getDate() + 31); // Add 31 days
      return currentDate.toISOString().split("T")[0];

    default:
      return "Invalid option";
  }
};
export default function BuilderFilterComponent() {
  const roadWidthOptions = [
    { value: "10-20", label: "10-20 ft" },
    { value: "20-50", label: "20-50 ft" },
    { value: "50+", label: "50+ ft" },
  ];
  const ownershipOptions = [
    { id: "freehold", label: "Freehold" },
    { id: "cooperative", label: "Co-operative Society" },
    { id: "leasehold", label: "Leasehold" },
  ];
  const amenitiesOptions = [
    { id: "concert-road", label: "Concert Road" },
    { id: "electricity", label: "Electricity" },
    { id: "park", label: "Park" },
    { id: "security", label: "Security" },
    { id: "boundary-wall", label: "Boundary Wall" },
  ];
  const propertyTypes = [
    "Apartment",
    "Independent House/Villa",
    "Gated Community Villa",
  ];
  const [selectedRoadWidths, setSelectedRoadWidths] = useState<string[]>([]);
  const [selectedOwnership, setSelectedOwnership] = useState<string | null>(
    null
  );
  // const handleRoadWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setSelectedRoadWidths((prevState) =>
  //     prevState.includes(value)
  //       ? prevState.filter((item) => item !== value)
  //       : [...prevState, value]
  //   );
  // };
  const filters = useFilterStore(); // Access entire store
  const { setFilter, resetFilters } = filters; // Extract setFilter for convenience

  const [selectedFurnishing, setSelectedFurnishing] = useState<string>("");

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [Plotarea, setPlotArea] = useState<[number, number]>([0, 50000000]);
  const [selectedRoadWidth, setSelectedRoadWidth] = useState<string | null>(
    null
  );
  // const [rentRange, setRentRange] = useState<[number, number]>([0, 500000]);

  // Handle BHK selection
  type Filters = {
    property_variety_type?: string[]; // Define this as an array of strings
  };

  const handleBhkTypeClick = (type: string) => {
    // Normalize the input type (e.g., "1 BHK" -> "1BHK")
    const formattedType = type.replace(/\s+/g, "").toUpperCase();

    // Convert the string back into an array for manipulation
    const varietyArray = filters.property_variety_type
      ? filters.property_variety_type.split(",") // Split the string into an array
      : [];

    const updatedVarietyType = varietyArray.includes(formattedType)
      ? varietyArray.filter((t) => t !== formattedType) // Remove if already selected
      : [...varietyArray, formattedType]; // Add if not selected

    // Convert the array back into a comma-separated string
    const updatedVarietyTypeString = updatedVarietyType.join(",");

    setFilter({ property_variety_type: updatedVarietyTypeString });
    console.log("BHK Type Updated:", updatedVarietyTypeString);
  };

  const [calculatedDate, setCalculatedDate] = useState<string>("");

  // Handle Slider
  const handleSliderChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
    setFilter({ amount_range: `${values[0]}-${values[1]}` });
    console.log("Rent Range Updated:", `${values[0]}-${values[1]}`);
  };
  const handlePlotSliderChange = (values: number[]) => {
    setPlotArea([values[0], values[1]]);
    setFilter({ amount_range: `${values[0]}-${values[1]}` });
    console.log("Rent Range Updated:", `${values[0]}-${values[1]}`);
  };
  // Handle Furnishing Selection
  const handleFurnishingChange = (option: string) => {
    let mappedFurnishing = "";

    if (option === "Full") {
      mappedFurnishing = "Furnished";
    } else if (option === "Semi") {
      mappedFurnishing = "Semi-furnished";
    } else if (option === "None") {
      mappedFurnishing = "Unfurnished";
    }

    setFilter({ furnishing: mappedFurnishing });
    console.log("Furnishing Updated:", mappedFurnishing);
  };

  const handlePropertyTypeChange = (type: string) => {
    console.log("Selected Property Type:", type);
    setFilter({ property_variety: type });
  };

  const handleReset = () => {
    resetFilters(); // Reset all filters to default
    console.log("Filters reset to default values.");
  };
  const toggleRoadWidth = (value: string) => {
    setSelectedRoadWidths(
      (prevSelected) =>
        prevSelected.includes(value)
          ? prevSelected.filter((width) => width !== value) // Remove if already selected
          : [...prevSelected, value] // Add if not selected
    );
  };
  return (
    <Card className="w-[309px] border-r border-b border-l border-[#22222233]">
      <div className="h-[42px] border-t border-[#22222233]">
        <div className="h-9 flex items-center justify-between px-5 py-2 border-b border-[#fc6600] shadow-[0px_2px_2px_#00000033]">
          <span className="font-medium text-[#fc6600] text-xs">Filters</span>
          <button className="inline-flex items-center gap-1">
            <span className="font-medium text-[#222222] text-xs">Reset</span>
            <RotateCcw className="w-[10.66px] h-[10.66px]" />
          </button>
        </div>
      </div>

      <CardContent className="p-2">
        <div className="flex-col w-[293px] items-start gap-3 flex">
          {/* Price Range Section */}
          <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-base">
                Price Range: ₹ {priceRange[0].toLocaleString()} to ₹
                {priceRange[1].toLocaleString()}
              </h3>
            </div>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handleSliderChange}
                min={0}
                max={50000000} // ₹50 Cr
                step={100000} // ₹1 Lakh step
                className="relative w-full bg-primary h-1"
              />
            </div>
          </div>
          <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-base">
                Plot area(sq. ft.): ₹ {Plotarea[0].toLocaleString()} to ₹
                {Plotarea[1].toLocaleString()}
              </h3>
            </div>
            <div className="px-2">
              <Slider
                value={Plotarea}
                onValueChange={handlePlotSliderChange}
                min={0}
                max={50000000} // ₹50 Cr
                step={100000} // ₹1 Lakh step
                className="relative w-full bg-primary h-1"
              />
            </div>
          </div>
          {/* Road Width Section */}
          <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-base">
                Width of Facing Road
              </h3>
            </div>
          </div>
          <div className="space-y-1 px-2">
            <div className="flex flex-wrap gap-2">
              {roadWidthOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedRoadWidth(option.value)} // Set only one selected value
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedRoadWidth === option.value // Check if the current option is selected
                      ? "bg-[#FC6600] text-white"
                      : "bg-white text-black border border-[#222222]/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ownership Section */}
          <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-base">
                Ownership
              </h3>
            </div>
            <div className="space-y-1">
              {ownershipOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-2 p-2">
                  <input
                    type="radio"
                    id={option.id}
                    name="ownership" // Use the same name for all radio buttons
                    value={option.id}
                    checked={selectedOwnership === option.id} // Bind state
                    onChange={() => setSelectedOwnership(option.id)} // Handle selection
                    className="w-4 h-4 border-[#22222280]"
                  />
                  <label
                    htmlFor={option.id}
                    className="font-medium text-[#222222cc] text-sm"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Section */}
          <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-base">
                Amenities
              </h3>
            </div>
            <div className="space-y-1">
              {amenitiesOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-2 p-2">
                  <input
                    type="checkbox"
                    id={option.id}
                    className="w-4 h-4 border-[#22222280]"
                  />
                  <label
                    htmlFor={option.id}
                    className="font-medium text-[#222222cc] text-sm"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

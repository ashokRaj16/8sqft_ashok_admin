import React, { useState } from "react";
import { Card, CardContent} from "@/ui/card";
import { Separator } from "@radix-ui/react-select";
import { Label } from "@/ui/label";
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
export default function FilterComponent() {
  const bhkTypes = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];
  const availabilityOptions = [
    "Immediate",
    "Within 15 Days",
    "Within 30 Days",
    "After 30 Days",
  ];
  const tenantTypes = ["Family", "Company", "Bachelor Male", "Bachelor Female"];
  const propertyTypes = [
    "Apartment",
    "Independent House/Villa",
    "Gated Community Villa",
  ];
  const furnishingOptions = ["Full", "Semi", "None"];
  const parkingOptions = [
    "2 Wheeler",
    "4 Wheeler",
    "2+4 Wheeler",
    "No Parking",
  ];
  const filters = useFilterStore(); // Access entire store
  const { setFilter, resetFilters } = filters; // Extract setFilter for convenience

  const [selectedFurnishing, setSelectedFurnishing] = useState<string>("");
  const [rentRange, setRentRange] = useState<[number, number]>([0, 500000]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");
  const [selectedParking, setSelectedParking] = useState<string>("");

  const handleParkingChange = (option: string) => {
    console.log("Selected Parking:", option);
    setSelectedParking(option); // Update selected parking option
    setFilter({ parking: option }); // Pass the selected parking option as a string
  };

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

  const handleSelection = (option: string) => {
    console.log("Selected Availability:", option);
    setSelectedAvailability(option); // Update selected availability in state

    const date = calculateDate(option); // Calculate the appropriate date
    console.log("Calculated Date:", date);

    // Ensure the filter and API call are triggered correctly
    setFilter({ availability_date: date });

    // Mock example: Trigger API call if necessary
    // triggerApiCall({ availability_date: date }); // Ensure this logic is correct
  };

  // Handle Slider
  const handleSliderChange = (values: number[]) => {
    setRentRange([values[0], values[1]]);
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

  // const handleSliderChange = (values: number[]) => {
  //   console.log("Slider values:", values);
  //   setRentRange([values[0], values[1]]);
  //   setFilter({ amount_range: `${values[0]}-${values[1]}` });
  // };

  // const handleSelection = (option: string) => {
  //   console.log("Selected Availability:", option);
  //   setSelectedAvailability(option);
  // };

  const handlePropertyTypeChange = (type: string) => {
    console.log("Selected Property Type:", type);
    setFilter({ property_variety: type });
  };

  const handleLeaseCheckboxChange = (isChecked: boolean) => {
    const updatedAvailabilityType = isChecked ? "lease" : undefined;
    console.log("Lease Checkbox Checked:", isChecked);
    setFilter({ property_availibility_type: updatedAvailabilityType });
  };

  // const handleFurnishingChange = (option: string) => {
  //   let mappedFurnishing = "";

  //   if (option === "Full") {
  //     mappedFurnishing = "Furnished";
  //   } else if (option === "Semi") {
  //     mappedFurnishing = "Semi-furnished";
  //   } else if (option === "None") {
  //     mappedFurnishing = "Unfurnished";
  //   }

  //   setSelectedFurnishing(option); // Update the selected furnishing state
  //   console.log("Furnishing:", mappedFurnishing); // Log the mapped value
  //   setFilter({ furnishing: mappedFurnishing }); // Update the filter store
  // };

  // const handleParkingChange = (option: string) => {
  //   console.log("Selected Parking:", option);
  //   setFilter({ parking: option });
  // };
  const handleReset = () => {
    resetFilters(); // Reset all filters to default
    console.log("Filters reset to default values.");
  };

  return (
    <Card className="w-full max-w-[300px] shadow-lg overflow-y-auto h-[100vh]">
      <CardContent className="p-6 mb-10">
        <div className="space-y-4">
          {/* BHK Type Section */}
          <div className="">
            <div className='flex justify-end w-full '><button
              className="flex px-2 py-1 gap-1 bg-[#F4F4F4] text-black rounded text-xs font-bold  "
              onClick={handleReset}
            >
              <RiRestartLine />
              Reset
            </button></div>
            <div>
              <h3 className="text-lg font-semibold mb-2">BHK Type</h3>
              <div className="flex flex-wrap gap-2">
                {bhkTypes.map((type) => {
                  // Normalize the type for comparison (e.g., "1 BHK" -> "1BHK")
                  const formattedType = type.replace(/\s+/g, "").toUpperCase();

                  // Convert the string back into an array for checking active state
                  const activeTypes = filters.property_variety_type
                    ? filters.property_variety_type.split(",")
                    : [];

                  return (
                    <button
                      key={type}
                      className={`px-3 py-1 rounded ${
                        activeTypes.includes(formattedType)
                          ? "bg-primary text-white" // Active state
                          : "bg-gray-200 text-gray-800" // Inactive state
                      }`}
                      onClick={() => handleBhkTypeClick(type)}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Separator />
          {/* Rent Range Section */}
          <div className="w-full max-w-md mx-auto">
            <div style={{ height: "fit-content" }}>
              <h3 className="text-lg font-semibold mb-2">
                Rent Range: ₹ {rentRange[0].toLocaleString()} to ₹
                {rentRange[1].toLocaleString()}
              </h3>
            </div>
            <Separator />
            <div className="flex flex-col space-y-4">
              <Slider
                value={rentRange}
                onValueChange={handleSliderChange}
                min={0}
                max={500000}
                step={1000}
                className="relative w-full bg-primary h-1"
              />
            </div>
          </div>

          <Separator />
          {/* Availability Section */}
          <div className="flex-col justify-start items-start inline-flex">
            <h3 className="text-lg font-semibold mb-2">Availability</h3>
            <div className="flex flex-wrap gap-2">
              {availabilityOptions.map((option) => (
                <div
                  key={option}
                  className="p-2 flex items-center gap-2 cursor-pointer"
                  onClick={() => handleSelection(option)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      selectedAvailability === option
                        ? "border-[#fc6600]"
                        : "border-[#222222]/50"
                    }`}
                  />
                  <span className="text-black text-sm">{option}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />
          {/* Property Type Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Property Type</h3>
            <div className="space-y-1">
              {propertyTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="propertyType"
                    value={type}
                    checked={filters.property_variety === type}
                    onChange={() => handlePropertyTypeChange(type)}
                    className="w-4 h-4"
                  />
                  <span className="text-black text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />
          {/* Furnishing Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Furnishing</h3>
            <div className="flex gap-4">
              {furnishingOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="furnishing"
                    value={option}
                    checked={selectedFurnishing === option}
                    onChange={() => handleFurnishingChange(option)}
                    className="w-4 h-4"
                  />
                  <span className="text-black text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />
          {/* Parking Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Parking</h3>
            <div className="flex flex-wrap gap-4">
              {parkingOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="parking"
                    value={option}
                    checked={selectedParking === option}
                    onChange={() => handleParkingChange(option)}
                    className="w-4 h-4"
                  />
                  <span className="text-black text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Lease Only Section */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="lease"
              checked={
                filters.property_variety_type?.includes("lease") || false
              }
              onChange={(e) => handleLeaseCheckboxChange(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="lease">Show only Lease Properties</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

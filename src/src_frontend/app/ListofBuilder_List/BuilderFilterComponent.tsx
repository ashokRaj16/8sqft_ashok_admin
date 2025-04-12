import React, { useCallback, useEffect, useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/ui/radio";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge, RotateCcw } from "lucide-react";

import { Slider } from "@/ui/slider";
import useFilterStore from "@/Store/useFilterStore";
import { RiRestartLine } from "react-icons/ri";
import { formatNumber } from "@/utils/priceFormatter";
import { debounce } from "lodash";
import { useSearchParams } from "next/navigation";
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
  const bhkType = [
    { value: "1 RK", label: "1 RK" },
    { value: "1 BHK", label: "1 BHK" },
    { value: "2 BHK", label: "2 BHK" },
    { value: "3 BHK", label: "3 BHK" },
    { value: "4 BHK", label: "4 BHK" },
    { value: "5+BHK", label: "5+ BHK" },
  ];
  const rera = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];
  const currentStatus = [
    { value: "New Launch", label: "Newly Launch" },
    { value: "Under Construction", label: "Under Construction" },
    { value: "Ready to move", label: "Ready to move" },
  ];
  const roadWidthOptions = [
    { value: "10-20", label: "10-20 ft" },
    { value: "20-50", label: "20-50 ft" },
    { value: "50-100", label: "50+ ft" },
  ];
  const ownershipOptions = [
    { id: "freehold", label: "Freehold" },
    { id: "cooperative", label: "Co-operative Society" },
    { id: "leasehold", label: "Leasehold" },
  ];
  const availability = [
    { id: "Immediate", label: "Immediate" },
    { id: "Within 15 Days", label: "Within 15 Days" },
    { id: "Within 30 Days", label: "Within 30 Days" },
    { id: "After 30 Days", label: "After 30 Days" },
  ];
  const amenitiesOptions = [
    { value: "CEMENT ROAD", label: "Cement Road" },
    { value: "STREET POLE", label: "Street Pole" },
    { value: "DRAINAGE", label: "Drainage" },
    { value: "SECURITY", label: "Security" },
    { value: "BOUNDARY WALL", label: "Boundary Wall" },
  ];
  const propertyTypes = [
    "Apartment",
    "Independent House/Villa",
    "Gated Community Villa",
  ];
  const CommercialVariety = ["Office Space", "Shop", "Showroom", "Other Business"]
const ResidentialVariety = ["Apartment", "Penthouse", "Row House", "Villa", "Bungalow", "Other"]

  const furnishingOptions = [
    { value: "Furnished", label: "Full" },
    { value: "Semi-furnished", label: "Semi" },
    { value: "Unfurnished", label: "None" },
  ];
  const parkingOptions = [
    "2 Wheeler",
    "4 Wheeler",
    "2+4 Wheeler",
    "No Parking",
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

  const [priceRange, setPriceRange] = useState<[number, number]>([1, 50000000]);
  const [Plotarea, setPlotArea] = useState<[number, number]>([0.5, 100]);
  const [selectedParking, setSelectedParking] = useState<string>("");
  const [selectedRoadWidth, setSelectedRoadWidth] = useState<string | null>(
    null
  );
  const [selectedBhkType, setSelectedBhkType] = useState<string | null>(null);
  const [selectedRERA, setSelectedRERA] = useState<string | null>(null);
  const [selectedCurrentStatus, setSelectedCurrentStatus] = useState<
    string | null
  >(null);
  const [selectedAvailability, setSelectedAvailability] = useState<
    string | null
  >(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string | null>(
    null
  );
  // const [rentRange, setRentRange] = useState<[number, number]>([0, 500000]);
  const searchParams = useSearchParams();
  const propertyVarietyType = searchParams.get("property_config_type");
  const propertyCurrentStatus = searchParams.get("property_current_status");
  const isReraNumber = searchParams.get("is_rera_number");
  const widthFacingRoad = searchParams.get("width_facing_road");
  const propertyType = searchParams.get("property_type");

  // Handle BHK selection
  type Filters = {
    property_variety_type?: string[]; // Define this as an array of strings
  };

  const handleBhkTypeClick = (type: string) => {
    // Normalize the input type (e.g., "1 BHK" -> "1BHK")
    const formattedType = type.toUpperCase();

    // Convert the string back into an array for manipulation
    const varietyArray = filters.property_config_type
      ? filters.property_config_type.split(",") // Split the string into an array
      : [];

    const updatedVarietyType = varietyArray.includes(formattedType)
      ? varietyArray.filter((t:any) => t !== formattedType) // Remove if already selected
      : [...varietyArray, formattedType]; // Add if not selected

    // Convert the array back into a comma-separated string
    const updatedVarietyTypeString = updatedVarietyType.join(",");
    setSelectedBhkType(updatedVarietyTypeString);
    setFilter({ property_config_type: updatedVarietyTypeString });
    console.log("BHK Type Updated:", updatedVarietyTypeString);
  };

  const [calculatedDate, setCalculatedDate] = useState<string>("");

  const debouncedSetFilter = useCallback(
    debounce((values: number[], type: "price" | "plot") => {
      if (type === "price") {
        setFilter({ price_range: `${values[0]}-${values[1]}` });
        console.log("Price Range Updated:", `${values[0]}-${values[1]}`);
      } else {
        setFilter({ project_area: `${values[0]}-${values[1]}` });
        console.log("Plot Area Updated:", `${values[0]}-${values[1]}`);
      }
    }, 500), // 500ms delay after user stops sliding
    []
  );
  const handleParkingChange = (option: string) => {
    console.log("Selected Parking:", option);
    setSelectedParking(option); // Update selected parking option
    setFilter({ parking: option }); // Pass the selected parking option as a string
  };

  const handleAmenitiesChange = (label: string) => {
    setSelectedAmenities((prevState) => {
      const amenitiesArray = prevState ? prevState.split(",") : [];
      let updatedAmenities;

      if (amenitiesArray.includes(label)) {
        // If the label is already in the list, remove it
        updatedAmenities = amenitiesArray
          .filter((item) => item !== label)
          .join(",");
      } else {
        // If it's not in the list, add it
        updatedAmenities = [...amenitiesArray, label].join(",");
      }

      return updatedAmenities;
    });
  };
  useEffect(() => {
    if (selectedAmenities !== null) {
      setFilter({ other_amenities: selectedAmenities });
      console.log(selectedAmenities, "selectedAmenities");
    }
  }, [selectedAmenities]);
  useEffect(() => {
    setSelectedBhkType(propertyVarietyType || "");
    setSelectedCurrentStatus(propertyCurrentStatus || "");
    setSelectedRERA(isReraNumber || "");
    setSelectedRoadWidth(widthFacingRoad || "");
    
    if (propertyType) {
      setFilter({ property_type: propertyType });
    }
  }, [searchParams]);
  
  

  // Handle price slider changes
  const handleSliderChange = (values: [number, number]) => {
    setPriceRange(values);
    debouncedSetFilter(values, "price"); // Call debounced function
  };

  // Handle plot area slider changes
  const handlePlotSliderChange = (values: [number, number]) => {
    setPlotArea(values);
    debouncedSetFilter(values, "plot"); // Call debounced function
  };

  // Handle Slider
  // const handleSliderChange = (values: number[]) => {
  //   setPriceRange([values[0], values[1]]);
  //   setFilter({ amount_range: `${values[0]}-${values[1]}` });
  //   console.log("Rent Range Updated:", `${values[0]}-${values[1]}`);
  // };
  // const handlePlotSliderChange = (values: number[]) => {
  //   setPlotArea([values[0], values[1]]);
  //   setFilter({ amount_range: `${values[0]}-${values[1]}` });
  //   console.log("Rent Range Updated:", `${values[0]}-${values[1]}`);
  // };
  // Handle Furnishing Selection
  const handleFurnishingChange = (option: string) => {
    setSelectedFurnishing(option);
    setFilter({ furnishing: option });
  };

  const handlePropertyTypeChange = (type: string) => {
    console.log("Selected Property Type:", type);
    setFilter({ property_variety: type });
  };

  const handleReset = () => {
    resetFilters(); // Reset all filters to default
    setSelectedFurnishing("");
    setSelectedParking("");
    setSelectedCurrentStatus("");
    setPriceRange([1, 50000000]);
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
    <Card className=" lg:border border-[#22222233] border-0 h-[calc(100vh-322px)] overflow-y-auto lg:h-auto lg:overflow-hidden shadow-none lg:shadow-sm">
      <div className="h-[42px] hidden lg:block">
        <div className="h-9 items-center justify-between px-5 py-2 border-b border-[#fc6600] shadow-[0px_2px_2px_#00000033] flex">
          <span className="font-medium text-[#fc6600] text-xs">Filters</span>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1"
          >
            <span className="font-medium text-[#222222] text-xs">Reset</span>
            <RotateCcw className="w-[10.66px] h-[10.66px]" />
          </button>
        </div>

      </div>
        <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 float-end mt-4 lg:hidden"
          >
            <span className="font-medium text-[#222222] text-xs">Reset</span>
            <RotateCcw className="w-[10.66px] h-[10.66px]" />
          </button>

      <CardContent className="p-2">
        <div className="flex-col items-start gap-3 flex w-full">
         {filters?.property_type==="Residential" &&( <div className="p-2">
            <h3 className="font-semibold text-[#222222cc] text-sm">BHK Type</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {bhkType.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleBhkTypeClick(option.value)} // Set only one selected value
                  className={`p-2 w-20 text-xs font-medium ${
                    selectedBhkType?.split(",").includes(option.value) // Check if selected
                      ? "bg-primary text-white"
                      : "bg-[#EFEFEF] text-[#222222CC]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>)}

          {filters?.property_type==="Commercial" &&(<div className="p-2">
            <h3 className="font-semibold text-[#222222cc] text-sm">RERA</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {rera.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedRERA(option.value);
                    setFilter({ is_rera_number: option.value });
                  }} // Set only one selected value
                  className={`p-2 w-20 text-xs font-medium ${
                    selectedRERA === option.value // Check if the current option is selected
                      ? "bg-primary text-white"
                      : "bg-[#EFEFEF] text-[#222222CC]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>)}

          {/* Price Range Section */}
          <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-sm">
                Price Range: ₹ {formatNumber(priceRange[0])} to ₹
                {formatNumber(priceRange[1])}
              </h3>
            </div>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handleSliderChange}
                min={1}
                max={50000000} // ₹5 Cr
                step={50000} // ₹50k Lakh step
                className="relative w-full bg-primary h-1"
              />
            </div>
          </div>
         {filters?.property_type==="Open Land" &&( <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-sm">
                Plot area(acre): {Plotarea[0].toLocaleString()} to
                {Plotarea[1].toLocaleString()} acre
              </h3>
            </div>
            <div className="px-2">
              <Slider
                value={Plotarea}
                onValueChange={handlePlotSliderChange}
                min={0.5}
                max={100} // ₹50 Cr
                step={0.5} // ₹1 Lakh step
                className="relative w-full bg-primary h-1"
              />
            </div>
          </div>)}

          {/* <div className="p-2">
            <h3 className="font-semibold text-[#222222cc] text-sm">
              Availability
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {availability.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={option.id}
                    name="ownership" // Use the same name for all radio buttons
                    value={option.id}
                    checked={selectedAvailability === option.id} // Bind state
                    onChange={() => setSelectedAvailability(option.id)} // Handle selection
                    className="w-4 h-4 border-[#22222280]"
                  />
                  <label
                    htmlFor={option.id}
                    className="font-medium text-[#222222cc] text-xs"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div> */}

         {filters?.property_type!=="Open Land" &&( <div className="p-2">
            <h3 className="font-semibold text-[#222222cc] text-sm">
              Current Status
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentStatus.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedCurrentStatus(option.value);
                    setFilter({ property_current_status: option.value });
                  }} // Set only one selected value
                  className={`p-2 text-xs font-medium ${
                    selectedCurrentStatus === option.value // Check if the current option is selected
                      ? "bg-primary text-white"
                      : "bg-[#EFEFEF] text-[#222222CC]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>)}

          {/* Property Type Section */}
        <div className="p-2">
            <h3 className="font-semibold text-[#222222cc] text-sm">
            Variety Type
            </h3>
            {filters?.property_type==="Commercial" &&( 
            <div className="space-y-2 mt-2">
              {CommercialVariety.map((type) => (
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
                  <span className="font-medium text-[#222222cc] text-xs">
                    {type}
                  </span>
                </label>
              ))}
            </div>
            )}
            {filters?.property_type==="Residential" &&( 
            <div className="space-y-2 mt-2">
              {ResidentialVariety.map((type) => (
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
                  <span className="font-medium text-[#222222cc] text-xs">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          )}
          </div>

          {/* Furnishing Section */}
      {filters?.property_type!=="Open Land" &&(    <div className="p-2">
            <h3 className="font-semibold text-[#222222cc] text-sm">
              Furnishing
            </h3>
            <div className="flex gap-4 mt-2">
              {furnishingOptions.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="furnishing"
                    value={option.value}
                    checked={selectedFurnishing === option.value}
                    onChange={() => handleFurnishingChange(option.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-[#222222cc] text-xs">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>)}
          {/* Parking Section */}
         {filters?.property_type!=="Open Land" &&( <div className="p-2">
            <h3 className="font-semibold text-[#222222cc] text-sm">Parking</h3>
            <div className="flex flex-wrap gap-2 mt-1">
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
                  <span className="font-medium text-[#222222cc] text-xs">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>)}

          {/* Road Width Section */}
          {filters?.property_type==="Open Land" &&(<div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-sm">
                Width of Facing Road
              </h3>

              <div className="space-y-1 mt-1">
                <div className="flex flex-wrap gap-2">
                  {roadWidthOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSelectedRoadWidth(option.value);
                        setFilter({ width_facing_road: option?.value });
                      }} // Set only one selected value
                      className={`px-4 py-2 rounded-full font-medium text-[#222222cc] text-xs ${
                        selectedRoadWidth === option.value // Check if the current option is selected
                          ? "bg-[#FC6600] text-white"
                          : "bg-white text-[#222222cc] border border-[#22222250]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>)}

          {/* Ownership Section */}
          {/* <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-sm">
                Ownership
              </h3>

              <div className="space-y-2 mt-1">
                {ownershipOptions.map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
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
                      className="font-medium text-[#222222cc] text-xs"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/* Amenities Section */}
       {filters?.property_type==="Open Land" &&(   <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-sm">
                Amenities
              </h3>

              <div className="space-y-2 mt-1">
                {amenitiesOptions.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={option.value}
                      className="w-4 h-4 border-[#22222280]"
                      onChange={() => handleAmenitiesChange(option.value)}
                    />
                    <label
                      htmlFor={option.value}
                      className="font-medium text-[#222222cc] text-xs"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>)}
        </div>
      </CardContent>
    </Card>
  );
}

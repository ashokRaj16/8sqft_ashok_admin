"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import usePropertyDetails from "@/hooks/Postpropertyhooks/usePropertyDetails";
import toast from "react-hot-toast";
import { GoogleMap, Marker, LoadScript, LoadScriptNext } from "@react-google-maps/api";
import { debounce } from "lodash";
// import usegetStateslist from "@/hooks/getStates";
import ReusableRedTagComponent from "../CompoundComponent/ReusableRedTag";
import useGetCitylist from "@/hooks/getStates";

// import { Field, ErrorMessage, useField } from 'formik';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";
import usePropertyIdStore from "@/Store/propertyid";
const RecidentialVariety = [
  "Flat/Apartment",
  "Penthouse",
  "Row-House",
  "Villa",
  "Bunglow",
  "Independant-house",
  "Farm-house",
  "Other",
];
const RecidentialVarietyType = [
  "Studio",
  "1RK",
  "1BHK",
  "2BHK",
  "3BHK",
  "4BHK",
  "5+BHK",
  "Other",
];
const PreferredTenant = [
  "Anyone",
  "Bachelor Female",
  "Bachelor Male",
  "Company",
  "Family",
];
// const states = ["New York", "California", "Texas", "Florida"]; // Example states
// const AreaUnitOptions = ["Square Meter", "Square Feet"];
const RentUnitOptions = [
  { value: "", label: "Select" }, // Placeholder
  { value: 0, label: "Negotiable" },
  { value: 1, label: "Non-Negotiable" },
];
const DepositUnitOptions = [
  { value: "", label: "Select" }, // Placeholder
  { value: 0, label: "Negotiable" },
  { value: 1, label: "Non-Negotiable" },
];
const PropertyAgeOptions = [
  { label: "New", value: 0 },
  { label: "1 to 3 Years", value: 36 },
  { label: "4 to 6 Years", value: 72 },
  { label: "7 to 9 Years", value: 108 },
  { label: "+ 9 Years", value: 120 },
];
const DoorFacing = ["East", "West", "North", "South"];

const validationSchema = Yup.object({
  propertyLocation: Yup.string().required("Property location is required"),
  residentialVariety: Yup.string().required("Residential variety is required"),
  doorFacing: Yup.string().required("Door facing is required"),
  residentialVarietyType: Yup.string().required(
    "Residential variety type is required"
  ),
  floor: Yup.string().required("Floor Number is required"),
  totalFloors: Yup.string().required("Total floors are required"),

  preferredTenant: Yup.string().required("Preferred tenant is required"),
  propertyAge: Yup.string().required("Property age is required"),
  monthlyMaintenance: Yup.string().required("Monthly maintenance is required"),
  availableDate: Yup.date().required("Available date is required"),
  wingName: Yup.string()
    .required("Wing Name is required.")
    .max(50, "Wing Name cannot exceed 50 characters."),
  bedrooms: Yup.string().required("bedrooms is required."),
  washrooms: Yup.string().required("washrooms is required."),
  totalWings: Yup.number()
    .typeError("Total Wings must be a number.")
    .required("Total Wings is required.")
    .integer("Total Wings must be an integer.")
    .positive("Total Wings must be a positive number.")
    .max(100, "Total Wings cannot exceed 100."),

  unitNumber: Yup.string()
    .required("Unit Number is required.")
    .matches(
      /^[a-zA-Z0-9-]+$/,
      "Unit Number must contain only letters, numbers, or hyphens."
    )
    .max(10, "Unit Number cannot exceed 10 characters."),
  Propertyavailablefor: Yup.string().required(
    "Propertyavailablefor is required"
  ),
  city: Yup.string().required("City is required"),
  Landarea: Yup.string(),
});
interface PropertyDetailsProps {
  onNext: () => void; // Receive `onNext` as a prop
}
export default function PropertyDetailsComponent({
  onNext,
}: PropertyDetailsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { mutate } = usePropertyDetails({
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      onNext();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const { data: City } = useGetCitylist();
  const INDIA_BOUNDS = {
    north: 37.6, // Northernmost latitude
    south: 8.0, // Southernmost latitude
    west: 68.7, // Westernmost longitude
    east: 97.25, // Easternmost longitude
  };

  const [externalLocation, setExternalLocation] = useState({
    buildingName: "",
    locality: "",
    cityName: "",
    pincode: "",
  });
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [show, setShow] = useState(false);
  const { id } = usePropertyIdStore();
  const userid = id!;
  
  const [searchQuery, setSearchQuery] = useState<string>(""); // User's search input
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [loading, setLoading] = useState(false);
  
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEMAP || '';

  const fetchPlaceSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const service = new google.maps.places.AutocompleteService();

      service.getPlacePredictions(
        { input: query, componentRestrictions: { country: "in" } },
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
          setLoading(false);
        }
      );
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchPlaceSuggestions(value);
  };

  const handleSuggestionClick = async (placeId: string, setFieldValue: any) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === "OK" && results && results[0].geometry?.location) {
        const location = results[0].geometry.location;
        const address = results[0].formatted_address;

        // Extract details from address_components
        const addressComponents = results[0].address_components;
        const getComponent = (type: string) =>
          addressComponents.find((component) => component.types.includes(type))
            ?.long_name || "";
        // Update externalLocation state
        setExternalLocation({
          buildingName:
            getComponent("premise") || getComponent("point_of_interest") || "",
          locality: getComponent("locality") || "",
          cityName: getComponent("administrative_area_level_3") || "",
          pincode: getComponent("postal_code") || "",
        });

        // Update Formik fields
        setFieldValue("latitude", location.lat());
        setFieldValue("longitude", location.lng());
        setFieldValue("propertyLocation", address);

        setSearchQuery(address);
        setSuggestions([]);
        setSelectedLocation({ lat: location.lat(), lng: location.lng() });
      } else {
        console.error("Geocoding failed:", status);
        toast.error("Failed to get location details. Please try again.");
      }
    });
  };

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent, setFieldValue: any) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        // Check if the click is within India's bounds
        if (
          lat < INDIA_BOUNDS.south ||
          lat > INDIA_BOUNDS.north ||
          lng < INDIA_BOUNDS.west ||
          lng > INDIA_BOUNDS.east
        ) {
          toast.error("Please select a location within India.");
          return;
        }

        // Update location state and form values
        setSelectedLocation({ lat, lng });
        setFieldValue("latitude", lat);
        setFieldValue("longitude", lng);
        setFieldValue("propertyLocation", `Lat: ${lat}, Lng: ${lng}`);
      }
    },
    []
  );
  const handleCustomInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const value = e.target.value;
    setFieldValue("propertyLocation", value); // Update Formik field for propertyLocation
    setSearchQuery(value); // Update search query state for consistency
  };
  const mapOptions = useMemo(
    () => ({
      zoom: 12,
      center: selectedLocation || { lat: 19.076, lng: 72.8777 },
    }),
    [selectedLocation]
  );

  return (
    <>
      <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        <Formik
          initialValues={{
            landmark: "",
            residentialVariety: "",
            doorFacing: "",
            residentialVarietyType: "",
            bedrooms: 0,
            washrooms: 0,
            balconies: 0,
            unitNumber: "",
            floor: "",
            totalFloors: "",
            wingName: "",
            totalWings: "",
            area: "",
            Landarea: "",
            Propertyavailablefor: "",
            expectedRent: "",
            rentUnit: "", // Default value
            expectedDeposit: "",
            depositUnit: "", // Default value
            preferredTenant: "",
            propertyAge: "",
            monthlyMaintenance: "", // Default value
            availableDate: "",
            city: "",
            propertytitle: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values: any) => {
            console.log(values.city, "this is the city");
            
            const FinalPayload = {
              id: Number(userid),
              step_id: 2,
              city_id: "5",
              city_name: values.city,
              landmark: values.landmark,
              locality: externalLocation.locality,
              latitude: values.latitude,
              longitude: values.longitude,
              property_variety: values.residentialVariety,
              property_title: values.propertytitle,
              property_rent_buy: values.Propertyavailablefor,
              property_variety_type: values.residentialVarietyType,
              door_facing: values.doorFacing,
              land_area: String(values.Landarea) || "0",
              land_area_unit: "SQ FT",
              builtup_area: values.area,
              builtup_area_unit: "SQ FT",
              rent_amount: values.expectedRent,
              rent_is_nogotiable: String(values.rentUnit),
              deposite_amount: values.expectedDeposit,
              deposite_is_negotiable: String(values.depositUnit),
              bed_rooms: String(values.bedrooms),
              balcony: String(values.balconies),
              washrooms: String(values.washrooms),
              unit_number: values.unitNumber,
              floor_number: values.floor,
              total_floors: values.totalFloors,
              total_wing: values.totalWings,
              wing_name: values.wingName,
              property_availibility_type: values.Propertyavailablefor,
              preferred_tenent: values.preferredTenant,
              property_age: String(values.propertyAge),
              is_maintenance: values.monthlyMaintenance,
              availability_date: values.availableDate,
            };

            mutate(FinalPayload);
          }}
        >
          {({ values, setFieldValue, isSubmitting, errors }: any) => (
            // console.log("Payload:", errors),
            (
              // <Form className="lg:max-w-4xl mx-auto p-6 bg-white rounded-lg  space-y-4 ">
              //   <div>
              //     <div className="flex">
              //       <label className="flex mb-2 font-medium w-full max-w-48">
              //         Select City <ReusableRedTagComponent />
              //       </label>
              //       {City?.data?.length ? (
              //         <div className="flex flex-wrap gap-4">
              //           {City?.data.map((citys) => (
              //             <button
              //               key={citys.id}
              //               type="button"
              //               onClick={() =>
              //                 setFieldValue("city", citys.city_name)
              //               }
              //               className={`px-4 py-2 rounded-[50px] text-sm font-medium  ${
              //                 values.city === citys.city_name
              //                   ? "bg-[#FC6600] text-white"
              //                   : "bg-white text-black border border-[#222222]/80"
              //               }`}
              //             >
              //               {citys.city_name}
              //             </button>
              //           ))}
              //         </div>
              //       ) : null}
              //     </div>

              //     <ErrorMessage
              //       name="selectedState"
              //       component="div"
              //       className="text-red text-sm mt-1"
              //     />
              //   </div>
              <Form className="max-w-4xl mx-auto p-6 bg-white rounded-lg space-y-4">
                <div>
                  <div className="flex flex-col md:flex-row">
                    <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
                      Select City
                      <ReusableRedTagComponent />
                    </label>
                    {City?.data?.length ? (
                      <div className="flex flex-wrap gap-2 md:gap-4">
                        {City?.data.map((citys) => (
                          <button
                            key={citys.id}
                            type="button"
                            onClick={() =>
                              setFieldValue("city", citys.city_name)
                            }
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                              values.city === citys.city_name
                                ? "bg-[#FC6600] text-white"
                                : "bg-white text-black border border-[#222222]/80"
                            }`}
                          >
                            {citys.city_name}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red text-sm mt-1"
                  />
                </div>

                <div className="flex flex-col md:flex-row">
                  <label className="font-semibold w-full md:max-w-48 mb-2 md:mb-0 flex items-center">
                    Property Address
                    <ReusableRedTagComponent />
                  </label>
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search location..."
                      className="w-full p-2 border rounded-md md:h-[28px] h-[36px] text-sm"
                    />

                    {/* Loading State */}
                    {loading && (
                      <div className="text-sm text-gray-500">
                        Loading suggestions...
                      </div>
                    )}

                    {/* Suggestions Dropdown */}
                    {suggestions.length > 0 && (
                      <ul className="border rounded-md mt-1 max-h-40 overflow-y-auto bg-white shadow-lg">
                        {suggestions.slice(0, 3).map((suggestion) => (
                          <li
                            key={suggestion.place_id}
                            onClick={() =>
                              handleSuggestionClick(
                                suggestion.place_id,
                                setFieldValue
                              )
                            }
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Custom Location Option */}
                    {!suggestions.length && searchQuery && (
                      <li
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => setShow(true)}
                        className="p-2 hover:bg-gray-100 text-sm"
                      >
                        Add Custom Location:
                        {show && (
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) =>
                              handleCustomInputChange(e, setFieldValue)
                            }
                            placeholder="Enter your custom address"
                            className="p-2 hover:bg-gray-100 placeholder:text-xs mt-2 border rounded-md w-full"
                          />
                        )}
                      </li>
                    )}

                    <ErrorMessage
                      name="propertyLocation"
                      component="div"
                      className="text-red text-xs mt-1"
                    />
                  </div>
                </div>

                {/* Map Integration */}

                {/* <GoogleMap

                  mapContainerStyle={{ height: "250px", width: "64%", marginLeft: "194px" }}
                  options={mapOptions}
                  onClick={(event) => handleMapClick(event, setFieldValue)}

                >
                  {selectedLocation && <Marker position={selectedLocation} />}
                </GoogleMap> */}
                <div className="w-full md:w-[64%] md:ml-[194px] h-[250px]">
                  <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    options={mapOptions}
                    onClick={(event) => handleMapClick(event, setFieldValue)}
                  >
                    {selectedLocation && <Marker position={selectedLocation} />}
                  </GoogleMap>
                </div>

                {/* Hidden Fields */}
                <Field type="hidden" name="latitude" />
                <Field type="hidden" name="longitude" />
                <Field type="hidden" name="propertyLocation" />

                {/* <div className="flex">
                  <label className="flex w-full max-w-48 font-semibold ">
                    Landmark
                    <ReusableRedTagComponent />
                  </label>
                  <Field
                    type="text"
                    name="landmark"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("landmark", e.target.value);
                    }}
                    className="w-full p-2 border rounded-md h-[28px]"
                  />
                </div> */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                  <label className="w-full md:max-w-48 font-semibold flex items-center">
                    Landmark
                    <ReusableRedTagComponent />
                  </label>
                  <Field
                    type="text"
                    name="landmark"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("landmark", e.target.value);
                    }}
                    className="w-full p-2 border rounded-md h-[28px] text-sm"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                  <label className="w-full md:max-w-48 font-semibold flex items-center">
                    Property Title
                  </label>
                  <Field
                    type="text"
                    name="propertytitle"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("propertytitle", e.target.value);
                    }}
                    className="w-full p-2 border rounded-md h-[28px]"
                  />
                </div>
                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
                    Residential Variety <ReusableRedTagComponent />
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {RecidentialVariety.map((variety) => (
                      <button
                        key={variety}
                        type="button"
                        onClick={() =>
                          setFieldValue("residentialVariety", variety)
                        }
                        className={`px-4 py-2  rounded-[50px] text-sm font-medium font-['Poppins'] ${
                          values.residentialVariety === variety
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                        }`}
                      >
                        {variety}
                      </button>
                    ))}
                  </div>
                  <ErrorMessage
                    name="residentialVariety"
                    component="div"
                    className="text-red text-xs"
                  />
                </div>

                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
                    Door Facing
                    <ReusableRedTagComponent />
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {DoorFacing.map((facing) => (
                      <button
                        key={facing}
                        type="button"
                        onClick={() => setFieldValue("doorFacing", facing)}
                        className={`px-4 py-2  rounded-[50px] text-sm font-medium font-['Poppins'] ${
                          values.doorFacing === facing
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                        }`}
                      >
                        {facing}
                      </button>
                    ))}
                  </div>

                  <ErrorMessage
                    name="doorFacing"
                    component="div"
                    className="text-red text-xs "
                  />
                </div>
                {/* Residential Variety Type Dropdown */}
                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
                    <div className="flex ">
                      <span className="w-fit">Residential Variety Type</span>
                      <span className="ml-1">
                        <ReusableRedTagComponent />
                      </span>
                    </div>
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {RecidentialVarietyType.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setFieldValue("residentialVarietyType", type)
                        }
                        className={`px-6 py-2   rounded-full text-sm font-medium  ${
                          values.residentialVarietyType === type
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <ErrorMessage
                    name="residentialVarietyType"
                    component="div"
                    className="text-red text-xs"
                  />
                </div>

                <div className="flex flex-col gap-3 lg:flex-row lg:gap-4 lg:justify-between">
                  {["bedrooms", "washrooms", "balconies"].map((field) => (
                    <div
                      key={field}
                      className="w-full flex items-center justify-between"
                    >
                      {/* Label with inline required indicator */}
                      <div className="flex items-center">
                        <label className="font-semibold">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        {field !== "balconies" && (
                          <span className="text-red-500 !important-500 ml-1">
                            <ReusableRedTagComponent />
                          </span>
                        )}
                      </div>

                      {/* Button Group */}
                      <div className="border p-1 rounded-full flex items-center space-x-2">
                        <button
                          type="button"
                          className="w-6 h-6 bg-black rounded-full text-white flex items-center justify-center"
                          onClick={
                            () =>
                              setFieldValue(
                                field,
                                Math.max(0, values[field] - 1)
                              ) // Prevent negative values
                          }
                        >
                          -
                        </button>
                        <span className="px-2 text-red-500">
                          {values[field]}
                        </span>
                        <button
                          type="button"
                          className="w-6 h-6 bg-black rounded-full text-white flex items-center justify-center"
                          onClick={() =>
                            setFieldValue(field, values[field] + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                  <label className="w-full md:max-w-48 font-semibold flex items-center">
                    Unit Number
                    <ReusableRedTagComponent />
                    <span className=" flex self-center ml-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <img
                              src="/assets/postproperty/information.svg"
                              alt="image-name"
                            ></img>
                          </TooltipTrigger>
                          <TooltipContent className=" border rounded-sm w-full bg-black text-white px-5 py-3">
                            <p className="w-full ">
                              Enter your Flat, Apartment, Bungalow, Villa Number
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </label>
                  <Field
                    type="text"
                    name="unitNumber"
                    className="w-fit p-2 border rounded-md h-[28px]"
                  />
                  <ErrorMessage
                    name="unitNumber"
                    component="div"
                    className="text-red text-[10px] "
                  />
                </div>

                {/* <div className="flex flex-col lg:flex-row justify-between ">
                  <div className="flex flex-col w-1/2">

                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Floor Number <ReusableRedTagComponent />
                      </label>
                      <Field
                        type="text"
                        name="floor"
                        className="w-full p-2 border rounded-md h-[28px]"
                      />
                    </div>

                    <ErrorMessage
                      name="floor"
                      component="div"
                      className="text-red text-[10px]"
                    />
                  </div>
                  <div className="ml-8">
                    <div className="flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                    <label className="w-full md:max-w-48 font-semibold flex items-center">
                          Total Floors <ReusableRedTagComponent />
                        </label>
                        <Field
                          type="text"
                          name="totalFloors"
                          className="w-full p-2 border rounded-md h-[28px]"
                        />
                      </div>
                      <ErrorMessage
                        name="totalFloors"
                        component="div"
                        className="text-red text-[10px]"
                      />
                    </div>
                  </div>
                </div> */}

                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex flex-col w-full lg:w-1/2">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Floor Number <ReusableRedTagComponent />
                      </label>
                      <Field
                        type="text"
                        name="floor"
                        className="w-full p-2 border rounded-md h-[28px]"
                      />
                    </div>

                    <ErrorMessage
                      name="floor"
                      component="div"
                      className="text-red text-[10px]"
                    />
                  </div>

                  <div className="flex flex-col w-full lg:w-1/2 lg:ml-8">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Total Floors <ReusableRedTagComponent />
                      </label>
                      <Field
                        type="text"
                        name="totalFloors"
                        className="w-full p-2 border rounded-md h-[28px]"
                      />
                    </div>
                    <ErrorMessage
                      name="totalFloors"
                      component="div"
                      className="text-red text-[10px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex flex-col w-full lg:w-1/2">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Wing Name <ReusableRedTagComponent />
                      </label>
                      <Field
                        type="text"
                        name="wingName"
                        className="w-full p-2 border rounded-md h-[28px]"
                      />
                    </div>
                    <ErrorMessage
                      name="wingName"
                      component="div"
                      className="text-red text-[10px]"
                    />
                  </div>
                  {/* <div className="ml-5"> */}

                  <div className="flex flex-col w-full lg:w-1/2 lg:ml-8">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Total Wings <ReusableRedTagComponent />
                      </label>
                      <Field
                        type="text"
                        name="totalWings"
                        className="w-full p-2 border rounded-md h-[28px]"
                      />
                    </div>
                    <ErrorMessage
                      name="totalWings"
                      component="div"
                      className="text-red text-[10px]"
                    />
                  </div>
                </div>
                {/* </div> */}

                {values.residentialVariety === "Flat/Apartment" ||
                values.residentialVariety === "Penthouse" ? (
                  <div className="flex items-center space-x-2">
                    <label className="flex font-semibold">
                      Builtup Area <ReusableRedTagComponent />
                    </label>
                    <Field
                      type="text"
                      name="area"
                      className="w-2/3 p-2 border rounded-md h-[28px]"
                    />
                    <span className="ml-3">sqft</span>

                    <ErrorMessage
                      name="area"
                      component="div"
                      className="text-red text-[10px]"
                    />
                    <ErrorMessage
                      name="areaUnit"
                      component="div"
                      className="text-red text-xs"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row justify-between">
                    <div className="flex flex-col w-full lg:w-1/2">
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                        <label className="w-full md:max-w-48 font-semibold flex items-center">
                          Builtup Area <ReusableRedTagComponent />
                        </label>
                        <div>
                          <Field
                            type="text"
                            name="area"
                            className="w-2/3 p-2 border rounded-md h-[28px]"
                          />
                          <span className="ml-3">Sq.ft</span>
                        </div>
                      </div>

                      <ErrorMessage
                        name="area"
                        component="div"
                        className="text-red text-[10px]"
                      />
                    </div>
                    <div className="flex flex-col w-full lg:w-1/2 lg:ml-8">
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                        <label className="w-full md:max-w-48 font-semibold flex items-center">
                          Land Area
                          <ReusableRedTagComponent />
                        </label>
                        <div>
                          <Field
                            type="text"
                            name="Landarea" // Ensure this matches initialValues
                            className="w-2/3 p-2 border rounded-md h-[28px]"
                          />
                          <span className="ml-3">Sq.ft</span>
                        </div>
                      </div>

                      <ErrorMessage
                        name="Landarea"
                        component="div"
                        className="text-red text-[10px]"
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label className="font-semibold w-full md:max-w-48 flex items-center">
                    Property available for
                    <ReusableRedTagComponent />
                  </label>
                  <div className="flex items-center gap-6">
                    {["Only Rent", "Only Lease"].map((option, index) => (
                      <label key={option} className="flex items-center gap-2">
                        <Field
                          type="radio"
                          name="Propertyavailablefor"
                          value={option}
                          className="hidden peer"
                        />
                        <div className="w-5 h-5 border-2 border-primary rounded-full flex items-center justify-center peer-checked:bg-primary">
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        </div>
                        <span className="text-sm font-[600]">{option}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorMessage
                    name="Propertyavailablefor"
                    component="div"
                    className="text-red text-[10px]"
                  />
                </div>
                {values.Propertyavailablefor === "Only Lease" ? (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Expected Rent <ReusableRedTagComponent />
                      </label>
                        <div className="w-full p-2  rounded-md border flex justify-evenly max-w-sm  items-center px-3 h-[32px]">
                          ₹
                          <Field
                            type="text"
                            name="expectedRent"
                            className="ml-0 outline-no ne h-[20px]"
                          />
                          <span className="#4E4E4E">/month</span>
                        </div>
                      <span className="w-full flex gap-2 h-[34px]" style={{marginLeft:"10px"}}>
                        {[
                          { label: "Negotiable", value: 0 },
                          { label: "Non-Negotiable", value: 1 },
                        ].map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => {
                              setFieldValue("rentUnit", option.value),
                                console.log("rentUnit", option);
                            }}
                            className={`px-4 py-2  rounded-[50px] text-sm font-medium  ${values.rentUnit === option.value
                              ? "bg-[#FC6600] text-white"
                              : "bg-white text-black border border-[#222222]/80"
                              }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </span>
                    </div>

                    <ErrorMessage
                      name="expectedRent"
                      component="div"
                      className="text-red text-[10px]"
                    />
                  </>
                ) : (
                  <>
                    {/* <div className="flex space-x-5 ">
                      <label className="flex font-semibold "> */}
                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Expected Rent <ReusableRedTagComponent />
                      </label>
                        <div className="w-full p-2  rounded-md border flex justify-evenly max-w-sm  items-center px-3 h-[32px]">
                          ₹
                          <Field
                            type="text"
                            name="expectedRent"
                            className="ml-0 outline-none h-[20px]"
                          />
                          <span className="#4E4E4E">/month</span>
                        </div>
                      <span className="w-full flex gap-2 h-[34px]" style={{marginLeft:"10px"}}>
                        {[
                          { label: "Negotiable", value: 0 },
                          { label: "Non-Negotiable", value: 1 },
                        ].map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => {
                              setFieldValue("rentUnit", option.value),
                                console.log("rentUnit", option);
                            }}
                            className={`px-4 py-2  rounded-[50px] text-sm font-medium  ${values.rentUnit === option.value
                              ? "bg-[#FC6600] text-white"
                              : "bg-white text-black border border-[#222222]/80"
                              }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </span>
                    </div>

                    <ErrorMessage
                      name="expectedRent"
                      component="div"
                      className="text-red text-[10px]"
                    />

                      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Expected Deposit <ReusableRedTagComponent />
                      </label>
                        <div className="w-full rounded-md border flex justify-evenly max-w-sm  items-center px-3 h-[32px]">
                          ₹
                          <Field
                            type="text"
                            name="expectedDeposit"
                            className="ml-4 outline-none h-[20px]"
                          />
                          <span className="#4E4E4E">/month</span>
                        </div>
                      <span className="w-full flex gap-2 h-[34px] " style={{marginLeft:"10px"}}>
                        {[
                          { label: "Negotiable", value: 0 },
                          { label: "Non-Negotiable", value: 1 },
                        ].map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => {
                              setFieldValue("depositUnit", option.value),
                                console.log("depositUnit", option);
                            }}
                            className={`px-4 py-2  rounded-[50px] text-sm font-medium font-['Poppins'] ${values.depositUnit === option.value
                              ? "bg-[#FC6600] text-white"
                              : "bg-white text-black border border-[#222222]/80"
                              }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </span>
                    </div>
                    <ErrorMessage
                      name="expectedDeposit"
                      component="div"
                      className="text-red text-[10px]"
                    />
                  </>
                )}

                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
                    Preferred Tenants <ReusableRedTagComponent />
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {PreferredTenant.map((tenant) => (
                      <button
                        key={tenant}
                        type="button"
                        onClick={() => {
                          setFieldValue("preferredTenant", tenant),
                            console.log("preferredTenant", tenant);
                        }}
                        className={`px-4 py-2  rounded-[50px] text-sm font-medium  ${
                          values.preferredTenant === tenant
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                        }`}
                      >
                        {tenant}
                      </button>
                    ))}
                  </div>

                  <ErrorMessage
                    name="preferredTenant"
                    component="div"
                    className="text-red text-[10px]"
                  />
                </div>
                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
                    Property Age
                    <ReusableRedTagComponent />
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {PropertyAgeOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => {
                          setFieldValue("propertyAge", option.value),
                            console.log("propertyAge", option.value);
                        }}
                        className={`px-4 py-2  rounded-[50px] text-sm font-medium  ${
                          values.propertyAge === option.value
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <ErrorMessage
                    name="propertyAge"
                    component="div"
                    className="text-red text-[10px]"
                  />
                </div>

                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
                    Monthly Maintenance
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {["Maintenance Included", "Maintenance Excluded"].map(
                      (option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFieldValue("monthlyMaintenance", option),
                              console.log("monthlyMaintenance", option);
                          }}
                          className={`px-4 py-2  rounded-[50px] text-sm font-medium  ${
                            values.monthlyMaintenance === option
                              ? "bg-[#FC6600] text-white"
                              : "bg-white text-black border border-[#222222]/80"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>

                  <ErrorMessage
                    name="monthlyMaintenance"
                    component="div"
                    className="text-red text-[10px]"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                  <label className="w-full md:max-w-48 font-semibold flex items-center">
                    Property Available
                    <ReusableRedTagComponent />
                  </label>
                  <Field
                    type="date"
                    name="availableDate"
                    className="w-42 p-2 border rounded-md h-[28px]"
                  />
                  <ErrorMessage
                    name="availableDate"
                    component="div"
                    className="text-red text-[10px]"
                  />
                </div>

                <div className="flex flex-row gap-4 justify-center items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-8 w-full max-w-48 flex justify-center items-center text-center text-white py-2 px-6 rounded-md bg-primary hover:bg-primary transition-colors"
                  >
                    {isSubmitting ? "Submitting..." : "SAVE & NEXT"}
                  </button>
                </div>
              </Form>
            )
          )}
        </Formik>
      </LoadScriptNext>
    </>
  );
}

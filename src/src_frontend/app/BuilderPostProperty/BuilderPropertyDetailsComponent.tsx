"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { debounce } from "lodash";
import ReusableRedTagComponent from "../CompoundComponent/ReusableRedTag";

import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";
import usePropertyIdStore from "@/Store/propertyid";
import useBuilderPostPropertyDetails from "@/hooks/BuilderFormHooks/useBuilderPostProperty";
import BuilderConfigration from "./BuilderConfigration";
import useGetCitylist from "@/hooks/getStates";
const ProjectVariety = ["Residential", "Commercial", "Open Land"];
const ProjectVarietyType = [
  "New Launch",
  "Under Construction",
  "Ready to move",
];

const DoorFacing = ["Residential Plot", "Indistrual Plot", "Other"];

const validationSchema = Yup.object({
  city: Yup.string().required("City is required"),

  landmark: Yup.string().required("Landmark is required"),
  ProjectVariety: Yup.string().required("ProjectVariety is required"),
  reraNumber: Yup.string().matches(
    /^[A-Za-z0-9]+$/,
    "RERA Number must be alphanumeric"
  ),
  is_rera_number: Yup.string()
    .required("RERA Number is required")
    .matches(/^[A-Za-z0-9]+$/, "RERA Number must be alphanumeric"),
  propertyTitle: Yup.string().nullable(),
  companyName: Yup.string().required("Company Name is required"),
  openPlotVariety: Yup.string().required("Open Plot Variety is required"),
  currentStatus: Yup.string().required("Current Status is required"),
  totalProjectArea: Yup.number()
    .required("Total Project Area is required")
    .positive("Total Project Area must be a positive number"),
  widthOfFacingRoad: Yup.number()
    .required("Width of facing road is required")
    .positive("Width of facing road must be a positive number"),
  totalUnitNumber: Yup.number()
    .required("Total Unit Number is required")
    .positive("Total Unit Number must be a positive number")
    .integer("Total Unit Number must be an integer"),
  perSqftRate: Yup.number()
    .required("Per sqft rate is required")
    .positive("Per sqft rate must be a positive number"),
});
interface PropertyDetailsProps {
  // onNext: () => void;
  // Receive `onNext` as a prop
}
interface PropertyDetailsProps {
  onNext: () => void; // Receive `onNext` as a prop
}
export default function BuilderPropertyDetailsComponent({
  onNext,
}: // onNext,
PropertyDetailsProps) {
  const { mutate } = useBuilderPostPropertyDetails({
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      onNext();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const { data: City } = useGetCitylist();

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
  const [selectedDate, setSelectedDate] = useState({ month: "", year: "" });
  const date = `${selectedDate.month}, ${selectedDate.year}`;
  const [selectedProjectAreaType, setSelectedProjectAreaType] =
    useState("Acre");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setSelectedDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]); // Search suggestions
  const [loading, setLoading] = useState(false);
  const GOOGLE_MAPS_API_KEY = "AIzaSyB4mLQjyo8whkMHMHA5mpZ4Y17dS2bjgaM";
  const INDIA_BOUNDS = {
    north: 37.6, // Northernmost latitude
    south: 8.0, // Southernmost latitude
    west: 68.7, // Westernmost longitude
    east: 97.25, // Easternmost longitude
  };

  

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
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        <Formik
          const
          initialValues={{
            city: "",
            propertyAddress: "",
            landmark: "",
            reraNumber: "",
            propertyTitle: "",
            companyName: "",
            openPlotVariety: "",
            currentStatus: "",
            totalProjectArea: "",
            widthOfFacingRoad: "",
            possessionDate: "",
            totalUnitNumber: "",
            perSqftRate: "",
            is_rera_number: "",
            ProjectVariety: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values: any) => {
            const FinalPayload = {
              id: Number(userid),
              step_id: 2,
              city_id: 5,
              city_name: values.city,
              landmark: values.landmark,
              locality: externalLocation.locality,
              latitude: values.latitude,
              longitude: values.longitude,
              state_id: 14,
              state_name: "MH",
              property_title: values.propertyTitle,
              property_type: values.ProjectVariety,
              property_variety: values.openPlotVariety,
              property_current_status: values.currentStatus,
              possession_date: date, // Format: "MM/YYYY"
              is_rera_number: values.is_rera_number === "Yes" ? "0" : "1", // "0" for false, "1" for true
              rera_number: values.reraNumber,
              total_units: values.totalUnitNumber,
              width_facing_road: values.widthOfFacingRoad,
              project_area: values.totalProjectArea,
              project_area_unit: selectedProjectAreaType, // Add other units if needed
              per_sqft_amount: values.perSqftRate,
              company_name: values.companyName,
            };

            mutate(FinalPayload);
          }}
        >
          {({ values, setFieldValue, isSubmitting }: any) => (
            console.log(values),
            (
              <Form className="max-w-4xl mx-auto p-6 bg-white rounded-lg space-y-4">
                <div>
                  <div className="flex flex-col md:flex-row">
                    <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex ">
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
                    name="selectedState"
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

                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex items-center">
                    RERA Number
                    <ReusableRedTagComponent />
                  </label>
                  <div className="flex gap-5">
                    {["Yes", "No"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFieldValue("is_rera_number", option)}
                        className={`px-8 py-1  rounded-[50px] text-sm font-medium  w-fit my-3  ${
                          values.is_rera_number === option
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {values.is_rera_number === "Yes" ? (
                    <Field
                      type="text"
                      name="reraNumber"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("reraNumber", e.target.value);
                      }}
                      placeHolder="Provide RERA Number"
                      className="w-full p-2 border rounded-md h-[28px] text-sm my-3 ml-1"
                    />
                  ) : null}

                  <ErrorMessage
                    name="is_rera_number"
                    component="div"
                    className="text-red text-[10px] lg:text-sm"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                  <label className="w-full md:max-w-48 font-semibold flex items-center">
                    Property Title
                  </label>
                  <Field
                    type="text"
                    name="propertyTitle"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("propertyTitle", e.target.value);
                    }}
                    className="w-full p-2 border rounded-md h-[28px] text-sm"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                  <label className="w-full md:max-w-48 font-semibold flex items-center">
                    Company Name
                    <ReusableRedTagComponent />
                  </label>
                  <Field
                    type="text"
                    name="companyName"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("companyName", e.target.value);
                    }}
                    className="w-full p-2 border rounded-md h-[28px] text-sm"
                  />
                </div>

                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex items-center">
                    Project Variety <ReusableRedTagComponent />
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {ProjectVariety.map((variety) => (
                      <button
                        key={variety}
                        type="button"
                        onClick={() => setFieldValue("ProjectVariety", variety)}
                        className={`px-4 py-2  rounded-[50px] text-sm font-medium font-['Poppins'] ${
                          values.ProjectVariety === variety
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                        }`}
                      >
                        {variety}
                      </button>
                    ))}
                  </div>
                  <ErrorMessage
                    name="ProjectVariety"
                    component="div"
                    className="text-red text-xs"
                  />
                </div>

                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex items-center">
                    Open Plot Variety
                    <ReusableRedTagComponent />
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {DoorFacing.map((facing) => (
                      <button
                        key={facing}
                        type="button"
                        onClick={() => setFieldValue("openPlotVariety", facing)}
                        className={`px-4 py-2  rounded-[50px] text-sm font-medium  ${
                          values.openPlotVariety === facing
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                        }`}
                      >
                        {facing}
                      </button>
                    ))}
                  </div>

                  <ErrorMessage
                    name="openPlotVariety"
                    component="div"
                    className="text-red text-xs"
                  />
                </div>

                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex items-center">
                    Current Status
                    <span className="mr-18">
                      <ReusableRedTagComponent />
                    </span>
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {ProjectVarietyType.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFieldValue("currentStatus", type)}
                        className={`px-6 py-2   rounded-full text-sm font-medium  ${
                          values.currentStatus === type
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <ErrorMessage
                    name="currentStatus"
                    component="div"
                    className="text-red text-xs"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                  {/* Label Section */}
                  <label className="font-semibold whitespace-nowrap w-full  sm:w-[150px] flex items-center">
                    Total Project Area <ReusableRedTagComponent />
                  </label>

                  {/* Input and Select Section */}
                  <div className="flex flex-col ml-8 sm:flex-row gap-4 w-full sm:w-auto">
                    {/* Input Field */}
                    <Field
                      type="text"
                      name="totalProjectArea"
                      placeholder=""
                      className="w-[165px] h-[28px]  p-2 border rounded-md "
                    />

                    <select
                      className="w-[165px] h-[28px] text-center px-4 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                      onChange={(e) =>
                        setSelectedProjectAreaType(e.target.value)
                      }
                      value={selectedProjectAreaType} // Bind state to the select value
                    >
                      <option value="Acre">Acre</option>
                      <option value="Sq.ft">Sq.ft</option>
                      <option value="Sq.m">Sq.m</option>
                    </select>
                  </div>

                  {/* Error Message */}
                  <ErrorMessage
                    name="totalProjectArea"
                    component="div"
                    className="text-red text-[10px] w-full mt-2"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                  {/* Label Section */}
                  <label className="font-semibold whitespace-nowrap w-full sm:w-[150px] flex items-center">
                    Width of facing road <ReusableRedTagComponent />
                  </label>

                  {/* Input and Select Section */}
                  <div className="flex flex-col ml-8 sm:flex-row gap-4 w-full sm:w-auto">
                    {/* Input Field */}
                    <Field
                      type="text"
                      name="widthOfFacingRoad"
                      placeholder=""
                      className="w-[165px] h-[28px]  p-2 border rounded-md "
                    />

                    <span>Feet</span>
                  </div>

                  {/* Error Message */}
                  <ErrorMessage
                    name="widthOfFacingRoad"
                    component="div"
                    className="text-red text-[10px] w-full mt-2"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                  <label className="font-semibold whitespace-nowrap w-full  sm:w-[150px] flex items-center">
                    Possession Date
                    <ReusableRedTagComponent />
                  </label>

                  <div className="flex flex-col ml-8 sm:flex-row gap-4 w-full sm:w-auto">
                    <select
                      name="month"
                      className="w-[165px] h-[40px] text-center px-4 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                      value={selectedDate.month}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select Month
                      </option>
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>

                    {/* Year Dropdown */}
                    <select
                      name="year"
                      className="w-[165px] h-[40px] text-center px-4 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                      style={{
                        maxHeight: "200px", // Allows space for 5 options
                        overflowY: "auto", // Enables scrollbar
                      }}
                      value={selectedDate.year}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select Year
                      </option>
                      {Array.from({ length: 21 }, (_, i) => 2010 + i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Error Message */}
                  <ErrorMessage
                    name="possessionDate"
                    component="div"
                    className="text-red text-[10px] w-full mt-2"
                  />
                </div>

                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex flex-col w-full lg:w-1/2">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Total Unit Number <ReusableRedTagComponent />
                      </label>
                      <Field
                        type="text"
                        name="totalUnitNumber"
                        className="lg:w-full p-2 border rounded-md h-[28px]"
                      />
                    </div>

                    <ErrorMessage
                      name="totalUnitNumber"
                      component="div"
                      className="text-red text-[10px]"
                    />
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex flex-col w-full lg:w-1/2">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Per sqft rate <ReusableRedTagComponent />
                      </label>
                      <Field
                        type="text"
                        name="perSqftRate"
                        className="lg:w-full p-2 border rounded-md h-[28px]"
                      />
                    </div>

                    <ErrorMessage
                      name="perSqftRate"
                      component="div"
                      className="text-red text-[10px]"
                    />
                  </div>
                </div>

                <BuilderConfigration />

                <div className="flex flex-row gap-4 justify-center items-center">
                  <button
                    type="submit"
                    className="min-w-[100px] p-4 bg-primary text-white rounded-full text-sm "
                  >
                    Save and Next
                  </button>
                </div>

                {/* 
                <button
                  type="submit"
                  className="w-1/2  py-2 px-4 bg-primary text-white rounded-md mt-4"
                >
                  {"Save and Next"}
                </button> */}
              </Form>
            )
          )}
        </Formik>
      </LoadScript>
    </>
  );
}

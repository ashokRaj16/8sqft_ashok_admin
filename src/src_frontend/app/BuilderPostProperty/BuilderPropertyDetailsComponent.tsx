"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { GoogleMap, Marker, LoadScript, LoadScriptNext } from "@react-google-maps/api";
import { debounce } from "lodash";
import ReusableRedTagComponent from "../CompoundComponent/ReusableRedTag";
import { MdOutlineMyLocation } from "react-icons/md";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";
import usePropertyIdStore from "@/Store/propertyid";
import useBuilderPostPropertyDetails from "@/hooks/BuilderFormHooks/useBuilderPostProperty";
import useGetCitylist from "@/hooks/getStates";
import BuilderPlotConfigration from "./BuilderPlotConfigration";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Button } from "@/ui/Button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import useSearchQuery from "@/hooks/useSearchQuery";
import useGetProfileDetails from "@/hooks/useGetProfileDetails";
const ProjectVariety = ["Residential", "Commercial", "Open Land"];
const ProjectVarietyType = [
  "New Launch",
  "Under Construction",
  "Ready to move",
];
const CommercialVariety = ["Office Space", "Shop", "Showroom", "Other Business"]
const ResidentialVariety = ["Apartment", "Penthouse", "Row House", "Villa", "Bungalow", "Other"]

const countryCodes = [
  "+1", "+7", "+20", "+27", "+30", "+31", "+32", "+33", "+34", "+36", "+39",
  "+40", "+41", "+43", "+44", "+45", "+46", "+47", "+48", "+49", "+51", "+52",
  "+53", "+54", "+55", "+56", "+57", "+58", "+60", "+61", "+62", "+63", "+64",
  "+65", "+66", "+81", "+82", "+84", "+86", "+90", "+91", "+92", "+93", "+94",
  "+95", "+98", "+212", "+213", "+216", "+218", "+220", "+221", "+222", "+223",
  "+224", "+225", "+226", "+227", "+228", "+229", "+230", "+231", "+232",
  "+233", "+234", "+235", "+236", "+237", "+238", "+239", "+240", "+241",
  "+242", "+243", "+244", "+245", "+246", "+248", "+249", "+250", "+251",
  "+252", "+253", "+254", "+255", "+256", "+257", "+258", "+260", "+261",
  "+262", "+263", "+264", "+265", "+266", "+267", "+268", "+269", "+290",
  "+291", "+297", "+298", "+299", "+350", "+351", "+352", "+353", "+354",
  "+355", "+356", "+357", "+358", "+359", "+370", "+371", "+372", "+373",
  "+374", "+375", "+376", "+377", "+378", "+380", "+381", "+382", "+383",
  "+385", "+386", "+387", "+389", "+420", "+421", "+423", "+500", "+501",
  "+502", "+503", "+504", "+505", "+506", "+507", "+508", "+509", "+590",
  "+591", "+592", "+593", "+594", "+595", "+596", "+597", "+598", "+599",
  "+670", "+672", "+673", "+674", "+675", "+676", "+677", "+678", "+679",
  "+680", "+681", "+682", "+683", "+685", "+686", "+687", "+688", "+689",
  "+690", "+691", "+692", "+850", "+852", "+853", "+855", "+856", "+880",
  "+886", "+960", "+961", "+962", "+963", "+964", "+965", "+966", "+967",
  "+968", "+970", "+971", "+972", "+973", "+974", "+975", "+976", "+977",
  "+992", "+993", "+994", "+995", "+996", "+998"
];


const DoorFacing = ["Residential Plot", "Indistrual Plot", "Other"];
// const variety = localStorage.getItem('variety') || "";
const validationSchema = Yup.object({
  // city: Yup.string().required("City is required"),

  totalTower: Yup.string()
    .nullable()
    .test(
      "is-required",
      "Total tower is required",
      function (value) {
        const { ProjectVariety } = this.parent;
        if (ProjectVariety === "Commercial" || ProjectVariety === "Residential") {
          return !!value;
        }
        return true; // Allows other varieties to be optional
      }
    ),
  totalUnitInProject: Yup.string()
    .nullable()
    .test(
      "is-required",
      "Total unit in project is required",
      function (value) {
        const { ProjectVariety } = this.parent;
        if (ProjectVariety === "Commercial" || ProjectVariety === "Residential") {
          return !!value;
        }
        return true; // Allows other varieties to be optional
      }
    ),
  totalFloorNumber: Yup.string()
    .nullable()
    .test(
      "is-required",
      "Total floor no is required",
      function (value) {
        const { ProjectVariety } = this.parent;
        if (ProjectVariety === "Commercial" || ProjectVariety === "Residential") {
          return !!value;
        }
        return true; // Allows other varieties to be optional
      }
    ),
  totalBuiltupArea: Yup.string()
    .nullable()
    .test(
      "is-required",
      "Total builtup area is required",
      function (value) {
        const { ProjectVariety } = this.parent;
        if (ProjectVariety === "Commercial" || ProjectVariety === "Residential") {
          return !!value;
        }
        return true; // Allows other varieties to be optional
      }
    ),

  commercialVariety: Yup.string()
    .nullable()
    .test(
      "is-required",
      "Commercial Variety is required",
      function (value) {
        const { ProjectVariety } = this.parent;
        if (ProjectVariety === "Commercial") {
          return !!value;
        }
        return true; // Allows other varieties to be optional
      }
    ),
  residentialVariety: Yup.string()
    .nullable()
    .test(
      "is-required",
      "Residential Variety is required",
      function (value) {
        const { ProjectVariety } = this.parent;
        if (ProjectVariety === "Residential") {
          return !!value;
        }
        return true; // Allows other varieties to be optional
      }
    ),

  openPlotVariety: Yup.string()
    .nullable()
    .test(
      "is-required",
      "Open Plot Variety is required",
      function (value) {
        const { ProjectVariety } = this.parent;
        if (ProjectVariety === "Open Land") {
          return !!value;
        }
        return true; // Allows other varieties to be optional
      }
    ),
  widthOfFacingRoad: Yup.string()
    .nullable()
    .test(
      "is-required",
      "Width of facing road is required",
      function (value) {
        const { ProjectVariety } = this.parent;
        if (ProjectVariety === "Open Land") {
          return !!value;
        }
        return true; // Allows other varieties to be optional
      }
    ),
  totalUnitNumber: Yup.string()
    .nullable()
    .test(
      "is-required",
      "Total Unit Number is required",
      function (value) {
        const { ProjectVariety } = this.parent;
        if (ProjectVariety === "Open Land") {
          return !!value;
        }
        return true; // Allows other varieties to be optional
      }
    ),


  landmark: Yup.string().required("Landmark is required"),
  ProjectVariety: Yup.string().required("ProjectVariety is required"),
  reraNumber: Yup.string().matches(
    /^[A-Za-z0-9]+$/,
    "RERA Number must be alphanumeric"
  ),
  is_rera_number: Yup.string()
    .required("RERA Number is required"),
  propertyTitle: Yup.string().nullable(),
  // companyName: Yup.string().required("Company Name is required"),
  // openPlotVariety: Yup.string().required("Open Plot Variety is required"),
  currentStatus: Yup.string().required("Current Status is required"),
  totalProjectArea: Yup.number()
    .required("Total Project Area is required")
    .positive("Total Project Area must be a positive number"),
  // widthOfFacingRoad: Yup.number()
  //   .required("Width of facing road is required")
  //   .positive("Width of facing road must be a positive number"),
  // totalUnitNumber: Yup.number()
  //   .required("Total Unit Number is required")
  //   .positive("Total Unit Number must be a positive number")
  //   .integer("Total Unit Number must be an integer"),
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
type Suggestion = {
  city_name: string;
  postal_name: string;
  pincode: string;
};
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
  const { profile } = useGetProfileDetails();
  console.log(City, 'getcity')
  const [cityId, setCityID] = useState(0)
  const [cityQuery, setCityQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  console.log(cityQuery,selectedCity,'cityQuery')
  const filteredCities: { id: number; city_name: string }[] = City?.data ? City.data.filter((city: { city_name: string }) =>
    city.city_name.toLowerCase().includes(cityQuery.toLowerCase())
  ) : [];
  const handleSelectCity = (cityName: string, cityId: number) => {
    setSelectedCity(cityName);
    setCityID(cityId)
    setCityQuery("");
  };
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityQuery(value);
    setSelectedCity("");
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
  const [selectedDate, setSelectedDate] = useState({ month: "", year: "2025" });
  const date = `${selectedDate.month}, ${selectedDate.year}`;
  const [selectedProjectAreaType, setSelectedProjectAreaType] =
    useState("Acre");

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

        },
        (error) => {
          console.log(error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setSelectedDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  console.log(suggestions, 'location')
  const [loading, setLoading] = useState(false);
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLEMAP || '';
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




  const [searchQueryLocality, setSearchQueryLocality] = useState<string>("");
  const [localityPincode, setLocalityPincode] = useState<string>("");
  const [localitySuggestions, setLocalitySuggestions] = useState<Suggestion[]>([]);
  // ✅ Use Search Hook with both city_name and searchKeyword
  const { data, isLoading, error, refetch } = useSearchQuery({
    city: selectedCity,
    searchKeyword: searchQueryLocality,
  });
  console.log(cityId, 'cityName')

  // ✅ Update suggestions when data changes
  useEffect(() => {
    if (data?.data) {
      const mappedSuggestions = data.data.map((item: any) => ({
        city_name: item.city_name,
        postal_name: item.postal_name,
        pincode: item.pincode,
      }));
      setLocalitySuggestions(mappedSuggestions);
    } else {
      setLocalitySuggestions([]);
    }
  }, [data]);

  // ✅ Debounced Search Handler
  const debouncedSearch = useCallback(
    debounce(() => {
      if (searchQuery.trim() !== "") {
        refetch();
      }
    }, 500),
    [searchQuery, refetch]
  );

  // ✅ Trigger debounced search on query change
  useEffect(() => {
    debouncedSearch();
    return () => {
      debouncedSearch.cancel(); // Cleanup on unmount
    };
  }, [searchQuery, debouncedSearch]);

  return (
    <>
      <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        <Formik
          const
          initialValues={{
            city: "",
            propertyAddress: "",
            landmark: "",
            reraNumber: "",
            propertyTitle: "",
            pointOfContact: profile?.data?.mobile,
            openPlotVariety: "",
            currentStatus: "",
            totalProjectArea: "",
            widthOfFacingRoad: "",
            possessionDate: "",
            totalUnitNumber: "",
            perSqftRate: "",
            is_rera_number: "",
            ProjectVariety: "",
            totalTower: "",
            totalUnitInProject: "",
            totalFloorNumber: "",
            totalBuiltupArea: "",
            commercialVariety: "",
            residentialVariety: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values: any) => {
            const FinalPayload = {
              id: Number(userid),
              step_id: 2,
              city_id: cityId,
              city_name: selectedCity,
              landmark: values.landmark,
              // locality: externalLocation.locality,
              locality: searchQueryLocality,
              latitude: values.latitude,
              longitude: values.longitude,
              state_id: 14,
              state_name: "MH",
              property_title: values.propertyTitle,
              property_type: values.ProjectVariety,
              property_variety: values.openPlotVariety || values.commercialVariety || values.residentialVariety,
              property_current_status: values.currentStatus,
              possession_date: date, // Format: "MM/YYYY"
              is_rera_number: values.is_rera_number === "Yes" ? "1" : "0", // "0" for false, "1" for true
              rera_number: values.reraNumber,
              total_units: values.totalUnitNumber || values.totalUnitInProject,
              width_facing_road: values.widthOfFacingRoad,
              project_area: values.totalProjectArea,
              project_area_unit: selectedProjectAreaType,
              per_sqft_amount: values.perSqftRate,
              contact_no: values.pointOfContact,
              full_address: searchQuery,
              pincode: localityPincode,
              builtup_area: values.totalBuiltupArea,
              builtup_area_unit: 'sqft',
              total_floors: values.totalFloorNumber,
              total_towers: values.totalTower,
            };

            mutate(FinalPayload);
          }}
        >
          {({ values, setFieldValue, isSubmitting, errors }: any) => (
            console.log("errors", errors),
            (
              <Form className="max-w-4xl mx-auto p-6 bg-white rounded-lg space-y-4">
                <div>

                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                    <label className="w-full md:max-w-48 font-semibold flex items-center">
                      Select City
                      <ReusableRedTagComponent />
                    </label>
                    <div className="flex flex-col w-full">

                      <div className="w-full relative">
                        <input
                          autoComplete="off"
                          type="text"
                          placeholder="Search city..."
                          value={selectedCity || cityQuery}
                          onChange={handleCityInputChange}
                      className="w-full p-2 border rounded-md h-10 text-sm"
                        />
                        {cityQuery && (
                          <ul className="w-full mt-1 border rounded-lg shadow-sm absolute z-10 bg-white overflow-y-auto max-h-48">
                            {filteredCities.length > 0 ? (
                              filteredCities.map((item) => (
                                <li key={item.id}    className="text-[10px] flex justify-between text-ellipsis  overflow-hidden w-full sm:w-full   whitespace-nowrap my-3  px-2 sm:px-4 sm:py-2 hover:bg-primary hover:text-white cursor-pointer sm:text-sm rounded-sm "
                                onClick={() => handleSelectCity(item.city_name,item.id)}>
                                  {item.city_name} <span className="font-normal text-xs">City</span>
                                </li>
                              ))
                            ) : (
                              <li className="p-2 text-gray-500">No cities found</li>
                            )}
                          </ul>
                        )}
                      </div>


                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-red text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 mt-4">
                    <label className="w-full md:max-w-48 font-semibold flex items-center">
                      Select Locality
                      <ReusableRedTagComponent />
                    </label>
                    <div className="flex flex-col w-full relative">
                      <Field
                      autoComplete="off"
                        disabled={!selectedCity}
                        value={searchQueryLocality}
                        type="text"
                        name="locality"
                        placeholder="Enter locality name"
                        onChange={(e: any) => setSearchQueryLocality(e.target.value)}
                        className="w-full p-2 border rounded-md h-10 text-sm"
                      />
                      <ErrorMessage
                        name="locality"
                        component="div"
                        className="text-red text-xs"
                      />
                      {localitySuggestions.length > 0 && (
                                   <ul className="w-full mt-1 border rounded-lg top-[40px] shadow-sm absolute z-10 bg-white overflow-y-auto max-h-48">
                          {localitySuggestions.map((item, index) => (

                            <p key={index}
                              className="text-[10px] flex justify-between text-ellipsis  overflow-hidden w-full sm:w-full   whitespace-nowrap my-3  px-2 sm:px-4 sm:py-2 hover:bg-primary hover:text-white cursor-pointer sm:text-sm rounded-sm "
                              onClick={() => {
                                setSearchQueryLocality(item?.postal_name);
                                setLocalityPincode(item?.pincode);
                                setLocalitySuggestions([]);
                              }}
                            >
                              {item.postal_name} <span className="font-normal text-xs">Locality</span>
                            </p>



                          ))}
                        </ul>
                      )}
                    </div>


                  </div>

                  {/* <div className="flex flex-col md:flex-row ">
                    <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex ">
                      Select City
                      <ReusableRedTagComponent />
                    </label>
                    <div className="flex flex-col">
                      {City?.data?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {City?.data.map((citys) => (
                            <button
                              key={citys.id}
                              type="button"
                              onClick={() =>
                                setFieldValue("city", citys.city_name)
                              }
                              className={`px-2 py-2 rounded-full text-sm font-medium ${values.city === citys.city_name
                                ? "bg-[#FC6600] text-white"
                                : "bg-white text-black border border-[#222222]/80"
                                }`}
                            >
                              {citys.city_name}
                            </button>
                          ))}
                        </div>
                      ) : null}

                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-red text-xs"
                      />
                    </div>
                  </div> */}


                </div>

                <div className="flex flex-col md:flex-row">
                  <label className="font-semibold w-full md:max-w-48 mb-2 md:mb-0 flex items-center">
                    Project Address
                    <ReusableRedTagComponent />
                  </label>
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search location..."
                      className="w-full p-2 border rounded-md h-10 text-sm"
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

                {/* <div onClick={getLocation} className="flex gap-2 items-center md:ml-[194px] cursor-pointer">
                  <MdOutlineMyLocation className="text-[#31985B] text-[24px]" />
                  <label className="text-sm text-[#366cff] cursor-pointer">Use Current Location</label>
                </div> */}

                {/* <div>
                  {location && (
                    <p>
                      Latitude: {location?.latitude}, Longitude: {location?.longitude}
                    </p>
                  )}
                </div> */}


                {selectedLocation && (<div className="w-full md:w-[64%] md:ml-[194px] h-[250px]">
                  <GoogleMap
                    mapContainerStyle={{ height: "100%", width: "100%" }}
                    options={mapOptions}
                    onClick={(event) => handleMapClick(event, setFieldValue)}
                  >
                    {selectedLocation && <Marker position={selectedLocation} />}
                  </GoogleMap>
                </div>)}

                {/* Hidden Fields */}
                <Field type="hidden" name="latitude" />
                <Field type="hidden" name="longitude" />
                <Field type="hidden" name="propertyLocation" />

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                  <label className="w-full md:max-w-48 font-semibold flex items-center">
                    Landmark
                    <ReusableRedTagComponent />
                  </label>
                  <div className="flex flex-col w-full">
                    <Field
                      type="text"
                      name="landmark"
                      placeholder="Provide landmark"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("landmark", e.target.value);
                      }}
                      className="w-full p-2 border rounded-md h-10 text-sm"
                    />
                    <ErrorMessage
                      name="landmark"
                      component="div"
                      className="text-red text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center">
                  <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex items-center">
                    RERA Number
                    <ReusableRedTagComponent />
                  </label>
                  <div className="flex gap-1 flex-col items-start">
                    <div className="flex gap-1 ">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setFieldValue("is_rera_number", option)}
                          className={`px-8 py-1  rounded-[50px] text-sm font-medium h-10 w-fit   ${values.is_rera_number === option
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                            }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <ErrorMessage
                      name="is_rera_number"
                      component="div"
                      className="text-red text-xs"
                    />
                  </div>
                  {values.is_rera_number === "Yes" ? (
                    <Field
                      type="text"
                      name="reraNumber"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("reraNumber", e.target.value);
                      }}
                      placeholder="Provide RERA Number"
                      className="w-full p-2 border rounded-md h-10 text-sm  ml-1"
                    />
                  ) : null}


                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                  <label className="w-full md:max-w-48 font-semibold flex items-center">
                    Property Title
                  </label>
                  <Field
                    type="text"
                    name="propertyTitle"
                    placeholder="Enter Property Title"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("propertyTitle", e.target.value);
                    }}
                    className="w-full p-2 border rounded-md h-10 text-sm"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                  <label className="w-full md:max-w-48 font-semibold flex items-center">
                    Point of contact
                  </label>
                  <div className="flex gap-2 w-full">
                    <select onChange={(e) => e.target.value} className="border rounded-md px-2 h-10 text-sm">
                      <option value="91">+91</option>
                      {countryCodes.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                    <Field
                      type="text"
                      name="pointOfContact"
                      placeholder="Enter mobile number to whom to contact (Person Contact)"
                      maxLength={10}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          setFieldValue("pointOfContact", value);
                        }
                      }}
                      className="w-full border rounded-md px-2 h-10 text-sm"
                    />
                  </div>
                </div>



                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex items-center">
                    Project Variety <ReusableRedTagComponent />
                  </label>
                  <div className="flex gap-1 flex-col items-start">
                    <div className="flex gap-1 flex-wrap">
                      {ProjectVariety.map((variety) => (
                        <button
                          key={variety}
                          type="button"
                          onClick={() => {
                            localStorage.setItem('variety', variety);
                            setFieldValue("ProjectVariety", variety)
                          }}
                          className={`px-4 py-2  rounded-[50px] text-sm font-medium font-['Poppins'] ${values.ProjectVariety === variety
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

                </div>

                {values.ProjectVariety === "Open Land" && (<div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex items-center">
                    Open Plot Variety
                    <ReusableRedTagComponent />
                  </label>
                  <div className="flex gap-1 flex-col">
                    <div className="flex gap-1 flex-wrap">
                      {DoorFacing.map((facing) => (
                        <button
                          key={facing}
                          type="button"
                          onClick={() => setFieldValue("openPlotVariety", facing)}
                          className={`px-4 py-2  rounded-[50px] text-sm font-medium  ${values.openPlotVariety === facing
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


                </div>)}

                <div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex items-center">
                    Current Status
                    <span className="mr-18">
                      <ReusableRedTagComponent />
                    </span>
                  </label>
                  <div className="flex gap-1 flex-col items-start">
                    <div className="flex gap-1 flex-wrap">
                      {ProjectVarietyType.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFieldValue("currentStatus", type)}
                          className={`px-6 py-2   rounded-full text-sm font-medium  ${values.currentStatus === type
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


                </div>

                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                  {/* Label Section */}
                  <label className="font-semibold whitespace-nowrap w-full  sm:w-[150px] flex items-center">
                    Total Project Area <ReusableRedTagComponent />
                  </label>

                  <div className="flex flex-col">
                    {/* Input and Select Section */}
                    <div className="flex flex-col ml-8 sm:flex-row gap-4 w-full sm:w-auto">
                      {/* Input Field */}
                      <Field
                        name="totalProjectArea"
                        placeholder="Enter total area"
                        className="w-[155px] h-10  p-2 border rounded-md "
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          let value = e.target.value;
                          if (!/^\d*\.?\d*$/.test(value)) return;                      
                          setFieldValue("totalProjectArea", value);
                        }}
                      />

                      <select
                        className="h-10 w-[147px]  px-4 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
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
                      className="text-red text-xs ml-7"
                    />
                  </div>

                </div>

                {values.ProjectVariety === "Open Land" && (<div className="flex flex-col sm:flex-row items-center w-full gap-4">
                  {/* Label Section */}
                  <label className="font-semibold whitespace-nowrap w-full sm:w-[150px] flex items-center">
                    Width of facing road <ReusableRedTagComponent />
                  </label>

                  <div className="flex flex-col">
                    {/* Input and Select Section */}
                    <div className="flex flex-col ml-8 sm:flex-row gap-4 w-full sm:w-auto">
                      {/* Input Field */}
                      <Field
                        type="text"
                        name="widthOfFacingRoad"
                        placeholder="Enter Road Facing"
                        className="w-[165px] h-10  p-2 border rounded-md "
                      />

                      <span>Feet</span>
                    </div>

                    {/* Error Message */}
                    <ErrorMessage
                      name="widthOfFacingRoad"
                      component="div"
                      className="text-red text-xs ml-7"
                    />
                  </div>
                </div>)}

                <div className="flex flex-col sm:flex-row items-center w-full gap-4">
                  <label className="font-semibold whitespace-nowrap w-full  sm:w-[150px] flex items-center">
                    Possession Date
                    <ReusableRedTagComponent />
                  </label>

                  <div className="flex flex-col ml-8 sm:flex-row gap-4 w-full sm:w-auto">
                    <select
                      name="month"
                      className=" h-[40px] w-[155px]  px-4 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
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
                      className=" h-[40px] w-[147px]   px-4 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                      style={{
                        maxHeight: "200px", // Allows space for 5 options
                        overflowY: "auto", // Enables scrollbar
                      }}
                      value={selectedDate.year || 2025}
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

                {values.ProjectVariety === "Open Land" && (<div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Total Unit Number <ReusableRedTagComponent />
                      </label>
                      <div className="flex flex-col">
                        <Field
                          type="text"
                          name="totalUnitNumber"
                          placeholder="Enter your Unit number"
                          className="lg:w-[255px] p-2 border rounded-md h-10"
                        />
                        <ErrorMessage
                          name="totalUnitNumber"
                          component="div"
                          className="text-red text-xs"
                        />
                      </div>
                    </div>


                  </div>
                </div>)}


                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex flex-col w-full ">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                      <label className="w-full md:max-w-48 font-semibold flex items-center">
                        Per sqft rate <ReusableRedTagComponent />
                      </label>
                      <div className="flex flex-col">
                        <Field
                          type="text"
                          name="perSqftRate"
                          placeholder="Enter per sqft rate"
                          className="lg:w-[255px] p-2 border rounded-md h-10"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            let value = e.target.value;
                            if (!/^\d*\.?\d*$/.test(value)) return;                        
                            setFieldValue("perSqftRate", value);
                          }}
                        />
                        <ErrorMessage
                          name="perSqftRate"
                          component="div"
                          className="text-red text-xs"
                        />
                      </div>
                    </div>


                  </div>
                </div>

                {(values.ProjectVariety === "Commercial" || values.ProjectVariety === "Residential") && (
                  <div className="flex flex-col gap-4">

                    <div className="flex flex-col lg:flex-row justify-between">
                      <div className="flex flex-col w-full ">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                          <label className="w-full md:max-w-48 font-semibold flex items-center">
                            Total Tower<ReusableRedTagComponent />
                          </label>
                          <div className="flex flex-col">
                            <Field
                              type="text"
                              name="totalTower"
                              placeholder="Total Tower Number"
                              className="lg:w-[255px] p-2 border rounded-md h-[40px]"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setFieldValue("totalTower", value);
                              }}
                            />
                            <ErrorMessage
                              name="totalTower"
                              component="div"
                              className="text-red text-xs"
                            />
                          </div>
                        </div>


                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between">
                      <div className="flex flex-col w-full ">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                          <label className="w-full md:max-w-48 font-semibold flex items-center">
                            Total Unit in project<ReusableRedTagComponent />
                          </label>
                          <div className="flex flex-col">
                            <Field
                              type="text"
                              name="totalUnitInProject"
                              placeholder="Total Unit in one wing"
                              className="lg:w-[255px] p-2 border rounded-md h-[40px]"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setFieldValue("totalUnitInProject", value);
                              }}
                            />
                            <ErrorMessage
                              name="totalUnitInProject"
                              component="div"
                              className="text-red text-xs"
                            />
                          </div>
                        </div>


                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-between">
                      <div className="flex flex-col w-full ">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                          <label className="w-full md:max-w-48 font-semibold flex items-center">
                            Total Floor Number <ReusableRedTagComponent />
                          </label>
                          <div className="flex flex-col">
                            <Field
                              type="text"
                              name="totalFloorNumber"
                              placeholder="Enter total floor number"
                              className="lg:w-[255px] p-2 border rounded-md h-[40px]"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setFieldValue("totalFloorNumber", value);
                              }}
                            />
                            <ErrorMessage
                              name="totalFloorNumber"
                              component="div"
                              className="text-red text-xs"
                            />
                          </div>
                        </div>


                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between">
                      <div className="flex flex-col w-full ">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
                          <label className="w-full md:max-w-48 font-semibold flex items-center">
                            Total Builtup Area <ReusableRedTagComponent />
                          </label>
                          <div className="flex flex-col">
                            <div className="flex flex-col items-end">
                              <Field
                                type="text"
                                name="totalBuiltupArea"
                                placeholder="Enter builtup area"
                                className="lg:w-[255px] p-2 border rounded-md h-[40px]"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const value = e.target.value.replace(/\D/g, "");
                                  setFieldValue("totalBuiltupArea", value);
                                }}
                              />
                              {values?.totalBuiltupArea && (<label className="mr-2 text-[#FC6600] text-[12px]">{values?.totalBuiltupArea} Sq ft</label>)}
                            </div>
                            <ErrorMessage
                              name="totalBuiltupArea"
                              component="div"
                              className="text-red text-xs"
                            />
                          </div>
                        </div>


                      </div>
                    </div>




                  </div>
                )}

                {values.ProjectVariety === "Commercial" && (<div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex items-center">
                    Commercial Variety
                    <span className="mr-18">
                      <ReusableRedTagComponent />
                    </span>
                  </label>
                  <div className="flex gap-1 flex-col">
                    <div className="flex gap-1 flex-wrap">
                      {CommercialVariety.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFieldValue("commercialVariety", type)}
                          className={`px-6 py-2   rounded-full text-sm font-medium  ${values.commercialVariety === type
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <ErrorMessage
                      name="commercialVariety"
                      component="div"
                      className="text-red text-xs"
                    />
                  </div>


                </div>)}

                {values.ProjectVariety === "Residential" && (<div className="flex flex-col md:flex-row">
                  <label className="mb-2 font-semibold w-full md:max-w-48 md:mb-0 flex items-center">
                    Residential Variety
                    <span className="mr-18">
                      <ReusableRedTagComponent />
                    </span>
                  </label>
                  <div className="flex flex-col">
                    <div className="flex gap-1 flex-wrap">
                      {ResidentialVariety.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFieldValue("residentialVariety", type)}
                          className={`px-6 py-2   rounded-full text-sm font-medium  ${values.residentialVariety === type
                            ? "bg-[#FC6600] text-white"
                            : "bg-white text-black border border-[#222222]/80"
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <ErrorMessage
                      name="residentialVariety"
                      component="div"
                      className="text-red text-xs"
                    />
                  </div>

                </div>)}
                <BuilderPlotConfigration currentVariety={values.ProjectVariety} residentialVariety={values.residentialVariety} />


                <div className="flex flex-row gap-4 justify-center items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-8 w-full max-w-48 flex justify-center items-center text-center text-white py-2 px-6 rounded-md bg-primary hover:bg-primary transition-colors"
                  >
                    {isSubmitting ? "Submitting..." : "SAVE & NEXT"}
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
      </LoadScriptNext>
    </>
  );
}

"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import usePropertyDetails from "@/hooks/Postpropertyhooks/usePropertyDetails";
import toast from "react-hot-toast";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { debounce } from "lodash";
// import usegetStateslist from "@/hooks/getStates";
import { GoPlus } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/tooltip";
import { Button } from "@/ui/Button";
import ReusableRedTagComponent from "@/app/CompoundComponent/ReusableRedTag";
import usePropertyIdStore from "@/Store/propertyid";
import useBuilderAmenityDetail from "@/hooks/BuilderFormHooks/useBuilderAmenity";
const openPlotAmenities = [
  "Play Area",
  "Fire Safety",
  "Garden",
  "Boundary Wall",
  "Under Ground Electricity",
  "Temple",
  "Street Pole",
  "Cement Road",
  "Road",
  "Drainage",
  "Water Supply",
];
const commercialAmenities = [
  "Lift",
  "Air Conditioner",
  "Internet Services",
  "Intercom",
  "Fire Safety",
  "Shopping Centre",
  "Gas Pipeline",
  "House Keeping",
  "Power Backup",
  "Visitor Parking",
  "Road",
  "CCTV Camera",
];
const residentialAmenities = [
  "Lift",
  "Air Conditioner",
  "Internet Services",
  "Club House",
  "Intercom",
  "Swimming Pool",
  "Play Area",
  "Fire Safety",
  "Servant Room",
  "Shopping Centre",
  "Park",
  "Gas Pipeline",
  "Sewage Treatment Plant",
  "House Keeping",
  "Power Backup",
  "Visitor Parking",
  "Solar Water",
  "Day Care",
  "Security",
  "GYM",
  "Rain Water Harvesting",
  "CCTV Camera",
  "Vastu Complaint",
  "Indoor Game",
  "Water Storage",
  "Conference Room",
  "DG Availability",
  "Amphitheater",
  "Road",
  "Vastu Compliance",
];

const getValidationSchema = (currentVariety: any) => {
  return Yup.object({
    waterSupply: Yup.string()
      .required("Water supply status is required")
      .oneOf(["Yes", "No"], "Invalid water supply status"),

   
      electricityConnection: Yup.string()
      .nullable()
      .test(
        "is-required",
        "Electricity connection status is required",
        function (value) {
          if (currentVariety === "Open Land") {
            return !!value;
          }
          return true; // Allows other varieties to be optional
        }
      ),
      sewageConnection: Yup.string()
      .nullable()
      .test(
        "is-required",
        "Sewage connection status is required",
        function (value) {
          if (currentVariety === "Open Land") {
            return !!value;
          }
          return true; // Allows other varieties to be optional
        }
      ),
      // grantedSecurity: Yup.string()
      // .nullable()
      // .test(
      //   "is-required",
      //   "Sewage connection status is required",
      //   function (value) {
      //     if (currentVariety === "Open Land") {
      //       return !!value;
      //     }
      //     return true; // Allows other varieties to be optional
      //   }
      // ),
   
    // sewageConnection: Yup.string()
    //   .required("Sewage connection status is required")
    //   .oneOf(["Yes", "No"], "Invalid sewage connection status"),

    // electricityConnection: Yup.string()
    //   .required("Electricity connection status is required")
    //   .oneOf(["Yes", "No"], "Invalid electricity connection status"),

    // grantedSecurity: Yup.string()
    //   .required("Granted Security is required")
    //   .oneOf(["Yes", "No"], "Invalid Security status"),

    otherAmenities: Yup.array()
      .of(Yup.string())
      .min(1, "Please select at least one amenity")
      .required("Amenities are required"),

    // parking: Yup.string().required("Parking is required"),
    // washroom: Yup.string().required("Washroom is required"),

    parking: Yup.string()
      .nullable()
      .test(
        "is-required",
        "Parking is required",
        function (value) {
          if (currentVariety === "Commercial" || currentVariety === "Residential") {
            return !!value;
          }
          return true; // Allows other varieties to be optional
        }
      ),
      furnishingStatus: Yup.string()
      .nullable()
      .test(
        "is-required",
        "Furniture status is required",
        function (value) {
          if (currentVariety === "Commercial" || currentVariety === "Residential") {
            return !!value;
          }
          return true; // Allows other varieties to be optional
        }
      ),
    washroom: Yup.string()
      .nullable()
      .test(
        "is-required",
        "Washroom is required",
        function (value) {
          if (currentVariety === "Commercial") {
            return !!value;
          }
          return true; // Allows other varieties to be optional
        }
      ),



    propertyDescription: Yup.string()
      .required("Property description is required")
      .min(3, "Description must be at least 3 characters long")
      .max(5000, "Description cannot exceed 500 characters"),
  });
};


interface BuilderAmenitiesComponent {
  onNext: () => void; // Receive `onNext` as a prop
}

export default function BuilderAmenitiesComponent({
  onNext,
}: BuilderAmenitiesComponent) {
  const { mutate, isError } = useBuilderAmenityDetail({
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      onNext();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const { id } = usePropertyIdStore();
  const userid = id!;
  const getCurrentVariety = localStorage.getItem('variety') || "";
  const [currentVariety, setCurrentVariety] = useState<string>("");
  useEffect(() => {

    setCurrentVariety(getCurrentVariety);
  }, [])

  return (
    <Formik
      initialValues={{
        waterSupply: "", // Options like 'Available', 'Not Available', etc.
        sewageConnection: "", // Options like 'Connected', 'Not Connected', etc.
        electricityConnection: "", // Options like 'Available', 'Not Available', etc.
        grantedSecurity: false, // Boolean for security granted or not
        propertyDescription: "", // Text description
        parking: "", // Text description
        washroom: "", // Text description
        furnishingStatus: "", // Text description
        otherAmenities: [] as string[], // Text description
      }}
      validationSchema={getValidationSchema(currentVariety)}
      onSubmit={(values: any, { setSubmitting }) => {
        const formattedAmenities = values.otherAmenities
          .join(", ")
          .toUpperCase();
        const data = {
          id: Number(userid),
          step_id: 3,
          water_supply: values.waterSupply,
          granted_security: values.grantedSecurity,
          furnishing_status: values.furnishingStatus,
          electricity_connection: values.electricityConnection === "Yes"
          ? "1"
          : values.electricityConnection === "No"
          ? "0"
          : "",
          sewage_connection: values.sewageConnection === "Yes"
          ? "1"
          : values.sewageConnection === "No"
          ? "0"
          : "",
          description: values.propertyDescription,
          other_amenities: formattedAmenities,
          parking: values.parking,
          washroom_type: values.washroom,
        };

        mutate(data);
      }}
    >
      {({ values, setFieldValue, isSubmitting }: any) => (

        (
          <Form className="max-w-4xl mx-auto p-6 bg-white rounded-lg  space-y-4 ">

            {(currentVariety === "Commercial" || currentVariety === "Residential") && (<div>
              <div className="flex items-center flex-col sm:flex-row">
                <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 m-4">
                  Furniture Status
                  <ReusableRedTagComponent />
                </label>
                <div className="flex flex-col">
                  <div className="flex gap-1 flex-wrap sm:flex-nowrap  w-full sm:w-auto">
                    {["Furnished", "Semi-furnished", "Unfurnished"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFieldValue("furnishingStatus", option)}
                        className={`px-4 py-1 h-10 rounded-[50px] text-sm font-medium  ${values.furnishingStatus === option
                          ? "bg-[#FC6600] text-white"
                          : "bg-white text-[#222222] border border-[#222222]/80"
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <ErrorMessage
                    name="furnishingStatus"
                    component="div"
                    className="text-red text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center flex-col sm:flex-row">
                <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 m-4">
                  Parking
                  <ReusableRedTagComponent />
                </label>
                <div className="flex flex-col">
                  {currentVariety === "Commercial" && (<div className="flex gap-1 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                    {["Public and Reserved", "Public", "Reserved", "No Parking"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFieldValue("parking", option)}
                        className={`px-4 py-1 h-10 rounded-[50px] text-sm font-medium  ${values.parking === option
                          ? "bg-[#FC6600] text-white"
                          : "bg-white text-[#222222] border border-[#222222]/80"
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>)}
                  {currentVariety === "Residential" && (<div className="flex gap-1 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                    {["4 wheeler", "2+4 Wheeler", "No Parking", "Extra Paid Parking"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFieldValue("parking", option)}
                        className={`px-4 py-1 h-10 rounded-[50px] text-sm font-medium  ${values.parking === option
                          ? "bg-[#FC6600] text-white"
                          : "bg-white text-[#222222] border border-[#222222]/80"
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>)}

                  <ErrorMessage
                    name="parking"
                    component="div"
                    className="text-red text-xs"
                  />
                </div>
              </div>
            </div>)}

            <div className="flex items-center flex-col sm:flex-row">
              <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 mx-4">
                Water Supply
                <ReusableRedTagComponent />
              </label>

              <div className="flex flex-col">
                <div className="flex gap-1 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                  {["Yes", "No"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFieldValue("waterSupply", option)}
                      className={`px-4 py-1 h-10 w-20 rounded-[50px] text-sm font-medium  ${values.waterSupply === option
                        ? "bg-[#FC6600] text-white"
                        : "bg-white text-[#222222] border border-[#222222]/80"
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <ErrorMessage
                  name="waterSupply"
                  component="div"
                  className="text-red text-xs"
                />
              </div>

            </div>

            {currentVariety === "Open Land" && (<div>
              <div className="flex items-center flex-col sm:flex-row">
                <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 m-4">
                  Sewage Connection
                  <ReusableRedTagComponent />
                </label>

                <div className="flex flex-col">
                  <div className="flex gap-1 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                    {["Yes", "No"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFieldValue("sewageConnection", option)}
                        className={`px-4 py-1 h-10 rounded-[50px] text-sm font-medium  ${values.sewageConnection === option
                          ? "bg-[#FC6600] text-white"
                          : "bg-white text-[#222222] border border-[#222222]/80"
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <ErrorMessage
                    name="sewageConnection"
                    component="div"
                    className="text-red text-xs"
                  />
                </div>

              </div>

              <div className="flex items-center flex-col sm:flex-row">
                <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 m-4">
                  Electricity Connection
                  <ReusableRedTagComponent />
                </label>
                <div className="flex flex-col">
                  <div className="flex gap-1 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                    {["Yes", "No"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setFieldValue("electricityConnection", option)
                        }
                        className={`px-4 py-1 h-10 rounded-[50px] text-sm font-medium  ${values.electricityConnection === option
                          ? "bg-[#FC6600] text-white"
                          : "bg-white text-[#222222] border border-[#222222]/80"
                          }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <ErrorMessage
                    name="electricityConnection"
                    component="div"
                    className="text-red text-xs"
                  />
                </div>

              </div>
            </div>)}

            {currentVariety === "Commercial" && (<div className="flex items-center flex-col sm:flex-row">
              <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 m-4">
                Washroom
                <ReusableRedTagComponent />
              </label>
              <div className="flex flex-col">
                <div className="flex gap-1 flex-wrap sm:flex-nowrap  w-full sm:w-auto">
                  {["Shared", "Private", "No Washroom"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFieldValue("washroom", option)}
                      className={`px-4 py-1 h-10 rounded-[50px] text-sm font-medium  ${values.washroom === option
                        ? "bg-[#FC6600] text-white"
                        : "bg-white text-[#222222] border border-[#222222]/80"
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <ErrorMessage
                  name="washroom"
                  component="div"
                  className="text-red text-xs"
                />
              </div>
            </div>)}
            {(currentVariety === "Open Land" || currentVariety === "Commercial") && (<div className="flex items-center flex-col sm:flex-row">
              <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 mx-4">
                Granted Security
                <ReusableRedTagComponent />
              </label>
              <div className="flex flex-col">
                <div className="flex gap-1 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                  {["Yes", "No"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFieldValue("grantedSecurity", option)}
                      className={`px-4 py-1 h-10 w-20 rounded-[50px] text-sm font-medium  ${values.grantedSecurity === option
                        ? "bg-[#FC6600] text-white"
                        : "bg-white text-[#222222] border border-[#222222]/80"
                        }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <ErrorMessage
                  name="grantedSecurity"
                  component="div"
                  className="text-red text-xs"
                />
              </div>
            </div>)}

            <div className="flex items-start flex-col sm:flex-row">
              <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 mx-4">
                Select Available Amenities
              </label>
              <div className="flex flex-col">
                {currentVariety === "Open Land" && (<div className="flex flex-wrap gap-2">
                  {openPlotAmenities.map((amenity) => {
                    const isSelected = values.otherAmenities.includes(amenity);

                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => {
                          const updatedAmenities = isSelected
                            ? values.otherAmenities.filter(
                              (item: string) => item !== amenity
                            )
                            : [...values.otherAmenities, amenity];
                          setFieldValue("otherAmenities", updatedAmenities);
                        }}
                        className={`flex items-center space-x-1 h-10  rounded-[50px] text-[10px] lg:text-sm font-medium ${isSelected
                          ? "bg-[#FC6600] text-white px-2 py-1 "
                          : "bg-white text-[#222222] border border-[#222222]/80 px-2 py-1 "
                          }`}
                      >
                        <span>{amenity}</span>
                        <span className="text-lg">{isSelected ? <IoCloseOutline /> : <GoPlus />}</span>
                      </button>
                    );
                  })}
                </div>)}
                {currentVariety === "Residential" && (<div className="flex flex-wrap gap-2 ms-12">
                  {residentialAmenities.map((amenity) => {
                    const isSelected = values.otherAmenities.includes(amenity);

                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => {
                          const updatedAmenities = isSelected
                            ? values.otherAmenities.filter(
                              (item: string) => item !== amenity
                            )
                            : [...values.otherAmenities, amenity];
                          setFieldValue("otherAmenities", updatedAmenities);
                        }}
                        className={`flex items-center space-x-1 h-10  rounded-[50px] text-[10px] lg:text-sm font-medium ${isSelected
                          ? "bg-[#FC6600] text-white px-2 py-1 "
                          : "bg-white text-[#222222] border border-[#222222]/80 px-2 py-1 "
                          }`}
                      >
                        <span>{amenity}</span>
                        <span className="text-lg">{isSelected ? <IoCloseOutline /> : <GoPlus />}</span>
                      </button>
                    );
                  })}
                </div>)}
                {currentVariety === "Commercial" && (<div className="flex flex-wrap gap-2">
                  {commercialAmenities.map((amenity) => {
                    const isSelected = values.otherAmenities.includes(amenity);

                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => {
                          const updatedAmenities = isSelected
                            ? values.otherAmenities.filter(
                              (item: string) => item !== amenity
                            )
                            : [...values.otherAmenities, amenity];
                          setFieldValue("otherAmenities", updatedAmenities);
                        }}
                        className={`flex items-center space-x-1 h-10  rounded-[50px] text-[10px] lg:text-sm font-medium ${isSelected
                          ? "bg-[#FC6600] text-white px-2 py-1 "
                          : "bg-white text-[#222222] border border-[#222222]/80 px-2 py-1 "
                          }`}
                      >
                        <span>{amenity}</span>

                        <span className="text-lg">{isSelected ? <IoCloseOutline /> : <GoPlus />}</span>

                      </button>
                    );
                  })}
                </div>)}
                <ErrorMessage
                  name="otherAmenities"
                  component="div"
                  className={`text-red text-xs ${currentVariety === "Residential" ? "ms-12" : ""}`}
                />
              </div>
            </div>
            <div className="flex flex-col w-full text-center">
              <div className="flex flex-col md:flex-row">
                <label className=" font-semibold flex items-start gap-1 w-full sm:max-w-48 m-4">
                  Property Description
                </label>
                <Field
                  as="textarea"
                  name="propertyDescription"
                  className="w-full p-2 border rounded-md"
                  placeholder="5000 Character "
                  rows="8"
                  length="5000"
                />
              </div>
              <ErrorMessage
                name="propertyDescription"
                component="div"
                className="text-red text-xs "
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
  );
}

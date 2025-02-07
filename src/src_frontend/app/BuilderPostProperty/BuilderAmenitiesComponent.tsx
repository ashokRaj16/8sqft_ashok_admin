"use client";

import React, { useCallback, useState, useMemo } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import usePropertyDetails from "@/hooks/Postpropertyhooks/usePropertyDetails";
import toast from "react-hot-toast";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { debounce } from "lodash";
// import usegetStateslist from "@/hooks/getStates";


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
const filters = [
  "Play Area",
  "Fire Safety",
  "Garden",
  "Boundary Wall",
  "Security",
  "Under Ground Electricity",
  "Temple",
  "Street Pole",
  "Cement Road",
  "Drainage",
];

const validationSchema = Yup.object({
  waterSupply: Yup.string()
    .required("Water supply status is required")
    .oneOf(["Yes", "No"], "Invalid water supply status"),

  sewageConnection: Yup.string()
    .required("Sewage connection status is required")
    .oneOf(["Yes", "No"], "Invalid sewage connection status"),

  electricityConnection: Yup.string()
    .required("Electricity connection status is required")
    .oneOf(["Yes", "No"], "Invalid electricity connection status"),

  grantedSecurity: Yup.string()
    .required("Electricity connection status is required")
    .oneOf(["Yes", "No"], "Invalid electricity connection status"),

  otherAmenities: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one amenity")
    .required("Amenities are required"),

  propertyDescription: Yup.string()
    .required("Property description is required")
    .min(3, "Description must be at least 3 characters long")
    .max(5000, "Description cannot exceed 500 characters"),
});

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
  return (
    <Formik
      initialValues={{
        waterSupply: "", // Options like 'Available', 'Not Available', etc.
        sewageConnection: "", // Options like 'Connected', 'Not Connected', etc.
        electricityConnection: "", // Options like 'Available', 'Not Available', etc.
        grantedSecurity: false, // Boolean for security granted or not
        propertyDescription: "", // Text description
        otherAmenities: [] as string[], // Text description
      }}
      validationSchema={validationSchema}
      onSubmit={(values: any, { setSubmitting }) => {
        const formattedAmenities = values.otherAmenities
          .join(", ")
          .toUpperCase();
        const data = {
          id: Number(userid),
          step_id: 3,
          water_supply: values.waterSupply,
          granted_security: values.grantedSecurity,
          electricity_connection:
            values.electricityConnection === "Yes" ? "0" : "1",
          sewage_connection: values.sewageConnection === "Yes" ? "0" : "1",
          description: values.propertyDescription,
          other_amenities: formattedAmenities,
        };

        mutate(data);
      }}
    >
      {({ values, setFieldValue, isSubmitting }: any) => (
        
        (
          <Form className="max-w-4xl mx-auto p-6 bg-white rounded-lg  space-y-4 ">
            <div className="flex items-center flex-col sm:flex-row">
              <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 m-4">
                Water Supply
                <ReusableRedTagComponent />
              </label>
              <div className="flex gap-1 flex-wrap sm:flex-nowrap sm:ml-4 w-full sm:w-auto">
                {["Yes", "No"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFieldValue("waterSupply", option)}
                    className={`px-8 py-1 rounded-[50px] text-sm font-medium  ${
                      values.waterSupply === option
                        ? "bg-[#FC6600] text-white"
                        : "bg-white text-black border border-[#222222]/80"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <ErrorMessage
                name="waterSupply"
                component="div"
                className="text-red text-[10px]"
              />
            </div>

            <div className="flex items-center flex-col sm:flex-row">
              <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 m-4">
                Sewage Connection
                <ReusableRedTagComponent />
              </label>
              <div className="flex gap-1 flex-wrap sm:flex-nowrap sm:ml-4 w-full sm:w-auto">
                {["Yes", "No"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFieldValue("sewageConnection", option)}
                    className={`px-8 py-1  rounded-[50px] text-sm font-medium  ${
                      values.sewageConnection === option
                        ? "bg-[#FC6600] text-white"
                        : "bg-white text-black border border-[#222222]/80"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <ErrorMessage
                name="sewageConnection"
                component="div"
                className="text-red text-[10px]"
              />
            </div>

            <div className="flex items-center flex-col sm:flex-row">
              <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 m-4">
                Electricity Connection
                <ReusableRedTagComponent />
              </label>
              <div className="flex gap-1 flex-wrap sm:flex-nowrap sm:ml-4 w-full sm:w-auto">
                {["Yes", "No"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setFieldValue("electricityConnection", option)
                    }
                    className={`px-8 py-1  rounded-[50px] text-sm font-medium  ${
                      values.electricityConnection === option
                        ? "bg-[#FC6600] text-white"
                        : "bg-white text-black border border-[#222222]/80"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <ErrorMessage
                name="electricityConnection"
                component="div"
                className="text-red text-[10px]"
              />
            </div>

            <div className="flex items-center flex-col sm:flex-row">
              <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 m-4">
                Granted Security
                <ReusableRedTagComponent />
              </label>
              <div className="flex gap-1 flex-wrap sm:flex-nowrap sm:ml-4 w-full sm:w-auto">
                {["Yes", "No"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFieldValue("grantedSecurity", option)}
                    className={`px-8 py-1  rounded-[50px] text-sm font-medium  ${
                      values.grantedSecurity === option
                        ? "bg-[#FC6600] text-white"
                        : "bg-white text-black border border-[#222222]/80"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <ErrorMessage
                name="grantedSecurity"
                component="div"
                className="text-red text-[10px]"
              />
            </div>

            <div className="flex items-center flex-col sm:flex-row">
              <label className="block font-semibold flex items-center gap-1 w-full sm:max-w-48 m-4">
                Select Available Amenities
              </label>
              <div className="flex flex-wrap gap-4">
                {filters.map((amenity) => {
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
                      className={`p-0 flex items-center space-x-2 rounded-[50px] text-[10px] lg:text-sm font-medium ${
                        isSelected
                          ? "bg-[#FC6600] text-white px-2 py-1 "
                          : "bg-white text-black border border-[#222222]/80 px-2 py-1 "
                      }`}
                    >
                      <span>{amenity}</span>
                      {!isSelected && (
                        <span className="text-lg font-bold ">+</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <ErrorMessage
                name="otherAmenities"
                component="div"
                className="text-red text-xs"
              />
            </div>
            <div className="flex flex-col w-full text-center">
              <div className="flex flex-col md:flex-row">
                <label className=" font-semibold flex items-center gap-1 w-full sm:max-w-48 m-4">
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
                className="text-red  text-[10px] lg:text-xs "
              />
            </div>

            <div className="flex flex-row gap-4 justify-center items-center">
              {/* Back Button */}
              {/* <button
              type="button"
              className="min-w-[100px] py-1 px-4 bg-black text-white rounded-full text-sm"
            >
              BACK
            </button> */}

              {/* Save & Next Button */}
              <button
                type="submit"
                className="min-w-[100px] py-1 px-4 bg-primary text-white rounded-full text-sm"
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

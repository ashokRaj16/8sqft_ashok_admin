"use client";

import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAmenitiesDetail from "@/hooks/Postpropertyhooks/useAmenities";
import toast from "react-hot-toast";
import usePropertyIdStore from "@/Store/propertyid";
import ReusableRedTagComponent from "../CompoundComponent/ReusableRedTag";

const validationSchema = Yup.object({
  furnitureStatus: Yup.string().required("Furniture Status is required"),
  parking: Yup.string().required("Parking is required"),
  waterSupply: Yup.string().required("Water Supply is required"),
  grantedSecurity: Yup.string().required("Granted Security is required"),
  nonVegAllowed: Yup.string().required("Non-Veg Allowance is required"),
  petAllowed: Yup.string().required("Pet Allowance is required"),
  description: Yup.string()
    .required("Description is required")
    .test(
      "exact-word-count",
      "Description must have exactly 5000 words",
      (value) => {
        if (!value) return false;
        const wordCount = value.trim().split(/\s+/).length; // Count words
        return wordCount <= 5000; // Enforce exactly 5000 words
      }
    ),
});

const AmenitiesComponent = ({ onNext }: { onNext: () => void }) => {
  const { mutate, isError } = useAmenitiesDetail({
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      onNext();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const filters = [
    "Lift",
    "AirConditioner",
    "Internet Services",
    "ClubHouse",
    "Intercom",
    "Swimming Pool",
    "Play Area",
    "FireSafety",
    "Servant Room",
    "Shopping Centre",
    "GasPipeline",
    "Park",
    "Sewage treatment plant",
    "House Keeping",
    "Power backup",
    "Visiting parking",
    "Solar Water",
    "Day Care",
    "Pet Allowed",
    "Gym",
    "Geysericon ",
  ];

  const { id } = usePropertyIdStore();
  const userid = id!;
  const handleSubmit = async (values: any) => {
    const formattedAmenities = values.otherAmenities.join(", ").toUpperCase(); // Convert selected amenities to uppercase and join with commas.

    const data = {
      id: Number(userid),
      step_id: 3,
      furnishing_status: values.furnitureStatus,
      parking: values.parking,
      water_supply: values.waterSupply,
      granted_security: values.grantedSecurity,
      pet_allowed: String(values.petAllowed),
      non_veg_allowed: String(values.nonVegAllowed),
      description: values.description,
      other_amenities: formattedAmenities,
    };
    mutate(data);
  };

  return (
    <Formik
      initialValues={{
        furnitureStatus: "",
        parking: "",
        waterSupply: "",
        grantedSecurity: "",
        nonVegAllowed: 0,
        petAllowed: 0,
        description: "",
        otherAmenities: [] as string[],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="max-w-4xl mx-auto p-6 bg-white rounded-lg space-y-4">
          {/* Furniture Status */}

          <div className="flex flex-col md:flex-row">
            <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
              Furniture Status <ReusableRedTagComponent />
            </label>
            <div className="flex gap-1 flex-wrap">
              {["Furnished", "Unfurnished", "Semi-furnished"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFieldValue("furnitureStatus", option)}
                  className={`px-2 py-1 rounded-[50px] text-[10px] lg:text-sm font-medium ${
                    values.furnitureStatus === option
                      ? "bg-[#FC6600] text-white"
                      : "bg-white text-black border border-[#222222]/80"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <ErrorMessage
              name="furnitureStatus"
              component="div"
              className="text-red text-[10px] lg:text-sm"
            />
          </div>

          <div className="flex flex-col md:flex-row">
            <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
              Parking
              <ReusableRedTagComponent />
            </label>
            <div className="flex gap-1 flex-wrap">
              {["2 wheeler", "4 wheeler", "Both", "No Parking"].map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFieldValue("parking", option)}
                    className={`px-2 py-1 rounded-[50px] text-[10px] lg:text-sm font-medium font-['Poppins'] ${
                      values.parking === option
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
              name="parking"
              component="div"
              className="text-red text-[10px] lg:text-sm"
            />
          </div>

          <div className="flex flex-col md:flex-row">
            <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
              Water Supply
              <ReusableRedTagComponent />
            </label>
            <div className="flex gap-1 flex-wrap">
              {["Yes", "No"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFieldValue("waterSupply", option)}
                  className={`px-8 py-1  rounded-[50px] text-sm font-medium  ${
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
              className="text-red text-[10px] lg:text-sm"
            />
          </div>

          <div className="flex flex-col md:flex-row">
            <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
              Granted Security
            </label>
            <div className="flex gap-1 flex-wrap">
              {["Yes", "No"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFieldValue("grantedSecurity", option)}
                  className={`px-8 py-1  rounded-[50px] text-sm font-medium ${
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
              className="text-red text-[10px] lg:text-sm"
            />
          </div>
          <div className="flex flex-col md:flex-row">
            <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
              Non-Veg Allowed
            </label>
            <div className="flex gap-1 flex-wrap">
              {[
                { label: "Yes", value: 0 },
                { label: "No", value: 1 },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setFieldValue("nonVegAllowed", option.value)} // Fixed field name
                  className={`px-8 py-1  rounded-[50px] text-sm font-medium ${
                    values.nonVegAllowed === option.value // Fixed field name
                      ? "bg-[#FC6600] text-white"
                      : "bg-white text-black border border-[#222222]/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <ErrorMessage
              name="nonVegAllowance"
              component="div"
              className="text-red text-[10px] lg:text-sm"
            />
          </div>
          <div className="flex flex-col md:flex-row">
            <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex items-center">
              Pet Allowed
            </label>
            <div className="flex gap-1 flex-wrap">
              {[
                { label: "Yes", value: 0 },
                { label: "No", value: 1 },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setFieldValue("petAllowed", option.value)} // Fixed field name
                  className={`px-8 py-1  rounded-[50px] text-sm font-medium ${
                    values.petAllowed === option.value // Fixed field name
                      ? "bg-[#FC6600] text-white"
                      : "bg-white text-black border border-[#222222]/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <ErrorMessage
              name="nonVegAllowance"
              component="div"
              className="text-red text-[10px] lg:text-sm"
            />
          </div>

          {/* Other Amenities */}
          <div className="flex flex-col md:flex-row">
            <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex ">
              Select available Amenities
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
                    className={`px-2 py-1 flex items-center space-x-2 rounded-[50px] text-[10px] lg:text-sm font-medium ${
                      isSelected
                        ? "bg-[#FC6600] text-white"
                        : "bg-white text-black border border-[#222222]/80"
                    }`}
                  >
                    <span>{amenity}</span>
                    {!isSelected && (
                      <span className="text-lg font-bold">+</span>
                    )}
                  </button>
                );
              })}
            </div>
            <ErrorMessage
              name="otherAmenities"
              component="div"
              className="text-red text-[10px] lg:text-sm"
            />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row">
              <label className="mb-2 font-medium w-full md:max-w-48 md:mb-0 flex ">
                Property Description
              </label>
              <Field
                as="textarea"
                name="description"
                className="w-full p-2 border rounded-md"
                placeholder="5000 Character "
                rows="8"
                length="5000"
              />
            </div>
            <ErrorMessage
              name="description"
              component="div"
              className="text-red  text-[10px] lg:text-xs "
            />
          </div>
          {/* Submit */}
          {/*           
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-md"
          >
            Save and Next
          </button> */}
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
              Save and Next
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AmenitiesComponent;

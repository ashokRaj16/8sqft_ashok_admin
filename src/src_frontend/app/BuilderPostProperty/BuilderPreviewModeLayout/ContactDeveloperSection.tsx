'use client';
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import { Label } from "@/ui/label";
import { Formik, Field, Form, ErrorMessage } from "formik";
import React from "react";
import * as Yup from "yup"; // Import Yup for validation
// Data for the plot sizes and checkbox options
// const plotSizes = [
//   { value: "1000", label: "1000 Sqft" },
//   { value: "2000", label: "2000 Sqft" },
//   { value: "3000", label: "3000 Sqft" },
// ];

const checkboxOptions = [
  { id: "loans", label: "I'm interested in home loans" },
  { id: "similar", label: "Contact me for options in the similar price range" },
];
const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed in the name"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  });
  interface Configuration {
    id: number;
    carpet_area?: number;
    unit_name?: any;
  }
  
  interface ContactDeveloperSectionProps {
    configration: Configuration[] | undefined;
    propertyVariety?:string | null;
    propertytype?: string | null | undefined;
  }
  export default function ContactDeveloperSection({ configration, propertyVariety,propertytype }: ContactDeveloperSectionProps) {
    const carpetAreas = configration?.map((item) => item.carpet_area || 0).filter((area) => area > 0) || [];
    const uniqueAreas = [...new Set(carpetAreas)].sort((a, b) => a - b);
    let plotSizes: { value: string; label: string }[] = [];
    if (uniqueAreas.length >= 3) {
      const midIndex = Math.floor(uniqueAreas.length / 2);
      plotSizes = [
        { value: `${uniqueAreas[0]}`, label: `${uniqueAreas[0]} Sq ft` },
        { value: `${uniqueAreas[midIndex]}`, label: `${uniqueAreas[midIndex]} Sq ft` },
        { value: `${uniqueAreas[uniqueAreas.length - 1]}`, label: `${uniqueAreas[uniqueAreas.length - 1]} Sq ft` },
      ];
    } else {
      plotSizes = uniqueAreas.map((area) => ({ value: `${area}`, label: `${area} Sq ft` }));
    }
  return (
    <Formik
      initialValues={{
        name: "",
        phone: "",
        email: "",
        selected_plot_size: "",
        selectedUnitName: "", // Updated from plotSize to match API key
        selectedPropVarity: "", // Updated from plotSize to match API key
        options: [],
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Form Submitted:", values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Card className="w-full bg-white">
            <CardContent className="flex flex-col gap-5 p-5">
              {/* Header */}
              <div className="flex flex-col gap-3">
                <h2 className="font-semibold text-base text-[#222222]">
                  Contact Builder
                </h2>

                {/* Name, Phone, and Email Inputs */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name*</Label>
                    <Field
                      name="name"
                      id="name"
                      className="h-[35px] w-full border border-gray-300 rounded px-2"
                      placeholder="Enter your name"
                      required
                    />
                     <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone*</Label>
                    <Field
                      name="phone"
                      id="phone"
                      type="tel"
                      className="h-[35px] w-full border border-gray-300 rounded px-2"
                      placeholder="Enter your phone number"
                      required
                    />
                     <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email </Label>
                    <Field
                      name="email"
                      id="email"
                      type="email"
                      className="h-[35px] w-full border border-gray-300 rounded px-2"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Plot Size Selection */}
          <div className="space-y-3">
                       <Label>You are looking for a?</Label>
                       <div>
                  {propertytype?.toLowerCase() === "open land" && (<div className="flex gap-3">
                    {plotSizes.map((size) => (
                      <button
                        type="button"
                        key={size.value}
                        className={`h-10 px-3 text-xs rounded-[20px] border ${values.selected_plot_size === size.value ? "bg-[#fc6600] text-white" : "border-[#fc6600]"
                          }`}
                        onClick={() => setFieldValue("selected_plot_size", size.value)}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>)}
                  {propertytype?.toLowerCase() === "residential" && (<div className="flex gap-3">
                    {configration?.map((item) => (
                      <button
                        type="button"
                        key={item.unit_name}
                        className={`h-10 px-3 text-xs rounded-[20px] border ${values.selectedUnitName === item.unit_name ? "bg-[#fc6600] text-white" : "border-[#fc6600]"
                          }`}
                        onClick={() => setFieldValue("selectedUnitName", item.unit_name)}
                      >
                        {item.unit_name}
                      </button>
                    ))}
                  </div>)}

                  {propertytype?.toLowerCase() === "commercial" && (<button
                    type="button"
                    className={`h-10 px-3 text-xs rounded-[20px] border ${values.selectedPropVarity === propertyVariety ? "bg-[#fc6600] text-white" : "border-[#fc6600]"
                      }`}
                    onClick={() => setFieldValue("selectedPropVarity", propertyVariety)}>{propertyVariety}</button>)}
                </div>
                     </div>

                {/* Checkbox Options */}
                <div className="space-y-2">
                  {checkboxOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Field
                        type="checkbox"
                        id={option.id}
                        name="options"
                        value={option.id}
                        className="w-[22px] h-[22px] border border-gray-300 rounded"
                      />
                      <Label
                        htmlFor={option.id}
                        className="text-[10px] leading-[26px]"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#fc6600] hover:bg-[#fc6600]/90 text-white"
              >
                Contact Builder
              </Button>
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  );
}

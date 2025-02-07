'use client';
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import { Label } from "@/ui/label";
import { Formik, Field, Form, ErrorMessage } from "formik";
import React from "react";
import * as Yup from "yup"; // Import Yup for validation
// Data for the plot sizes and checkbox options
const plotSizes = [
  { value: "1000", label: "1000 Sqft" },
  { value: "2000", label: "2000 Sqft" },
  { value: "3000", label: "3000 Sqft" },
];

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
export default function ContactDeveloperSection() {
  return (
    <Formik
      initialValues={{
        name: "",
        phone: "",
        email: "",
        plotSize: "",
        options: [],
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Form Submitted:", values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Card className="w-[339px] bg-white">
            <CardContent className="flex flex-col gap-5 p-5">
              {/* Header */}
              <div className="flex flex-col gap-3">
                <h2 className="font-semibold text-base text-[#222222]">
                  Contact Developer
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
                  <Label>You are looking for an open plot?</Label>
                  <div className="flex gap-3">
                    {plotSizes.map((size) => (
                      <button
                        type="button"
                        key={size.value}
                        className={`h-10 px-3 text-xs rounded-[20px] border ${
                          values.plotSize === size.value
                            ? "bg-[#fc6600] text-white"
                            : "border-[#fc6600]"
                        }`}
                        onClick={() => setFieldValue("plotSize", size.value)}
                      >
                        {size.label}
                      </button>
                    ))}
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
                Contact Developer
              </Button>
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  );
}

"use client";
import axios from "@/hooks";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import { Label } from "@/ui/label";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import * as Yup from "yup"; 

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

interface ContactBuilderProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  configration: Configuration[] | undefined;
  propertyVariety?: string | null;
  propertytype?: string | null | undefined;
  propertyId?: string | null | undefined;
}
export default function ContactBuilder({
  themeColors,
  configration,
  propertyVariety,
  propertytype,
  propertyId
}: ContactBuilderProps) {

  const [successMessage, setSuccessMessage] = useState<{
      success?: string;
      error?: string;
    }>({}); 

    const carpetAreas =
      configration
        ?.map((item) => item.carpet_area || 0)
        .filter((area) => area > 0) || [];
    const uniqueAreas = [...new Set(carpetAreas)].sort((a, b) => a - b);
  
    let plotSizes: { value: string; label: string }[] = [];
    if (uniqueAreas.length >= 3) {
      const midIndex = Math.floor(uniqueAreas.length / 2);
      plotSizes = [
        { value: `${uniqueAreas[0]}`, label: `${uniqueAreas[0]} Sq ft` },
        {
          value: `${uniqueAreas[midIndex]}`,
          label: `${uniqueAreas[midIndex]} Sq ft`,
        },
        {
          value: `${uniqueAreas[uniqueAreas.length - 1]}`,
          label: `${uniqueAreas[uniqueAreas.length - 1]} Sq ft`,
        },
      ];
    } else {
      plotSizes = uniqueAreas.map((area) => ({
        value: `${area}`,
        label: `${area} Sq ft`,
      }));
    }
    const handleSubmit = async (
      values: any,
      { resetForm }: FormikHelpers<any>
    ) => {
      const requestData = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        property_id: propertyId,
        selected_plot_size:
          values.selected_plot_size ||
          values.selectedPropVarity ||
          values.selectedUnitName,
        interested_in_loans: values.options.includes("loans") ? "1" : "0", 
        contact_for_similar_options: values.options.includes("similar")
          ? "1"
          : "0", 
      };
  
      console.log("Request Data:", requestData);
      try {
        const response = await axios.post(
          "/api/v1/front/contact_developer",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "A8SQFT7767",
            },
          }
        );
  
        console.log("Response from API:", response);
  
        if (response.data.status) {
          setSuccessMessage({
            success: "✅ Your request has been submitted successfully!",
          });
          resetForm(); 
        } else {
          alert("There was an error with your request.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while submitting the form.");
      }
    };
  
    const scrollRef = useRef<HTMLDivElement>(null);
  
    const scroll = (direction: any) => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: direction === "left" ? -100 : 100,
          behavior: "smooth",
        });
      }
    };
  return (
    <div className="sticky top-24" style={{color:themeColors.themeColorDark}}>
        <Formik
      initialValues={{
        name: "",
        phone: "",
        email: "",
        selected_plot_size: "", 
        selectedUnitName: "", 
        selectedPropVarity: "", 
        interested_in_loans: "0", 
        contact_for_similar_options: "0", 
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
       <Form>
          <Card className=" bg-white border-current shadow-none">
         <CardContent className="flex flex-col gap-2 p-4">
           <h2 className="font-semibold lg:text-base text-sm">
             Contact Builder
           </h2>
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
           <div className="space-y-3">
             <Label>You are looking for a?</Label>
             <div>
               {propertytype?.toLowerCase() === "open land" && (
                 <div className="flex gap-3">
                   {plotSizes.map((size, index) => (
                     <button
                       type="button"
                       key={index}
                       className={`h-8 px-3 text-xs rounded-[20px] border ${
                         values.selected_plot_size === size.value
                           ? "bg-current text-white"
                           : "border-current"
                       }`}
                       onClick={() =>
                         setFieldValue("selected_plot_size", size.value)
                       }
                     >
                       {size.label}
                     </button>
                   ))}
                 </div>
               )}
               {propertytype?.toLowerCase() === "residential" && (
                 <div className="relative flex items-center">
                  <div ref={scrollRef} className="flex gap-3 scroll-x px-3">
                     {configration?.map((item, index) => (
                       <button
                         type="button"
                         key={index}
                         className={`h-8 px-4 text-xs rounded-[20px] border ${
                           values.selectedUnitName === item.unit_name
                               ? " text-white"
                           : "border-current"
                         }`}

                         style={{
                          backgroundColor:  values.selectedUnitName === item.unit_name? themeColors.themeColorDark:'white'
                         }}
                         onClick={() =>
                           setFieldValue("selectedUnitName", item.unit_name)
                         }
                       >
                         {item.unit_name}
                       </button>
                     ))}
                   </div>
                   {/* Right Arrow */}
                   {(configration?.length ?? 0) > 3 && (
                     <>
                       {/* Left Arrow */}
                       <label
                         onClick={() => scroll("left")}
                         className="absolute -left-3 z-10 cursor-pointer bg-white h-8"
                       >
                         <ChevronLeft className="w-6 h-6 pt-1 text-gray-600" />
                       </label>
                       <label
                         onClick={() => scroll("right")}
                         className="absolute -right-3 z-10 cursor-pointer bg-white h-8"
                       >
                         <ChevronRight className="w-6 h-6 pt-1 text-gray-600" />
                       </label>
                     </>
                   )}
                 </div>
               )}

               {propertytype?.toLowerCase() === "commercial" && (
                 <button
                   type="button"
                   className={`h-10 px-3 text-xs rounded-[20px] border ${
                     values.selectedPropVarity === propertyVariety
                       ? "bg-[#fc6600] text-white"
                       : "border-[#fc6600]"
                   }`}
                   onClick={() =>
                     setFieldValue("selectedPropVarity", propertyVariety)
                   }
                 >
                   {propertyVariety}
                 </button>
               )}
             </div>
           </div>
           <div className="space-y-2 mt-2">
             {checkboxOptions.map((option) => (
               <div key={option.id} className="flex items-center space-x-2">
                 <Field
                   type="checkbox"
                   id={option.id}
                   name="options"
                   value={option.id}
                   className="w-[20px] h-[20px] border border-gray-300 rounded"
                 />
                 <Label
                   htmlFor={option.id}
                   className="text-[10px] "
                 >
                   {option.label}
                 </Label>
               </div>
             ))}
           </div>
           <Button
                type="submit"
                className="w-full bg-transparent"
                style={{border:`1px solid ${themeColors.themeColorDark}`, color:themeColors.themeColorDark}}
              >
                Contact Builder
              </Button>
           {successMessage && (
             <p
               className={`text-center text-sm  ${
                 successMessage.error ? "text-red" : "text-green"
               }`}
             >
               {successMessage.error || successMessage.success}
             </p>
           )}
         </CardContent>
       </Card>
     </Form>
      )}
    </Formik>
    </div>
  );
}

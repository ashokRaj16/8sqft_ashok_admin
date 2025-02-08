// //// file: Rental.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { Formik, Form, FormikConfig, FormikValues } from "formik";
// import * as Yup from "yup";
// import RentalNav from "../Rentalnav";
// import { Button } from "@/ui/Button";
// import ContractStep from "../contract/page";
// import PropertyStep from "../property/page";
// import LandlordStep from "../landlord/page";
// import TenantStep from "../tenant/page";

// interface Props {
//   children: React.ReactNode;
// }

// const initialValues = {
//   contractDetails: {
//     refundableDeposit: "",
//     agreementDuration: "",
//     monthlyRent: "",
//     nonRefundableDeposit: "",
//     iAm: "",
//     minimumLockinPeriod: "",
//     stampDutyPaidBy: "",
//     maintenancePaidBy: "",
//     miscellaneousClause: "",
//   },
//   propertyDetails: {
//     typeOfProperty: "",
//     floorNumber: "",
//     flatNumber: "",
//     buildingName: "",
//     roadStreet: "",
//     societyName: "",
//     pincode: "",
//     district: "",
//     taluka: "",
//     villageCity: "",
//     propertyNumberType: "",
//     propertyNumber: "",
//     builtUpArea: "",
//     builtUpAreaUnit: "",
//     use: "",
//     parkingArea: "",
//     parkingAreaUnit: "",
//     galleryArea: "",
//     galleryAreaUnit: "",
//   },
//   landlordDetails: {
//     partyEntityType: "",
//     name: "",
//     phone: "",
//     panNumber: "",
//     emailAddress: "",
//     buildingName: "",
//     flatNumberHouseNumber: "",
//     floorNumber: "",
//     roadStreet: "",
//     pinCode: "",
//     villageCity: "",
//     district: "",
//     state: "",
//     executingThrough: "",
//   },
//   tenantDetails: {
//     partyEntityType: "",
//     name: "",
//     phone: "",
//     panNumber: "",
//     emailAddress: "",
//     buildingName: "",
//     flatNumberHouseNumber: "",
//     floorNumber: "",
//     roadStreet: "",
//     pinCode: "",
//     villageCity: "",
//     district: "",
//     state: "",
//     executingThrough: "",
//   },
// };

// const validationSchemas = [
//   Yup.object().shape({
//     contractDetails: Yup.object({
//       refundableDeposit: Yup.number()
//         .required("Refundable Deposit Amount is required")
//         .positive("Must be a positive number"),
//       agreementDuration: Yup.string().required(
//         "Agreement Duration is required"
//       ),
//       monthlyRent: Yup.number()
//         .required("Monthly Rent Amount is required")
//         .positive("Must be a positive number"),
//       nonRefundableDeposit: Yup.number()
//         .required("Non Refundable Deposit is required")
//         .positive("Must be a positive number"),
//       iAm: Yup.string().required("Please select who you are"),
//       minimumLockinPeriod: Yup.string().required(
//         "Minimum Lockin Period is required"
//       ),
//       stampDutyPaidBy: Yup.string().required(
//         "Stamp Duty & Registration Fee Paid By is required"
//       ),
//       maintenancePaidBy: Yup.string().required(
//         "Maintenance Paid By is required"
//       ),
//       miscellaneousClause: Yup.string()
//         .max(1000, "Must be 1000 characters or less")
//         .required("Miscellaneous Clause is required"),
//     }),
//     propertyDetails: Yup.object({
//       typeOfProperty: Yup.string().required("Type of Property is required"),
//       floorNumber: Yup.number()
//         .required("Floor Number is required")
//         .positive("Floor Number must be a positive number"),
//       flatNumber: Yup.string().required("Flat Number is required"),
//       buildingName: Yup.string().required("Building Name is required"),
//       roadStreet: Yup.string().required("Road / Street is required"),
//       societyName: Yup.string().required("Society Name is required"),
//       pincode: Yup.number()
//         .required("Pincode is required")
//         .positive("Pincode must be a positive number")
//         .min(100000, "Invalid Pincode")
//         .max(999999, "Invalid Pincode"),
//       district: Yup.string().notRequired(),
//       taluka: Yup.string().required("Taluka is required"),
//       villageCity: Yup.string().required("Village/City is required"),
//       propertyNumberType: Yup.string().required(
//         "Property Number Type is required"
//       ),
//       propertyNumber: Yup.number()
//         .required("Property Number is required")
//         .positive("Property Number must be a positive number"),
//       builtUpArea: Yup.number()
//         .required("Built-up Area is required")
//         .positive("Built-up Area must be a positive number"),
//       builtUpAreaUnit: Yup.string().required("Built-up Area Unit is required"),
//       use: Yup.string().required("Use is required"),
//       parkingArea: Yup.number()
//         .required("Parking Area is required")
//         .positive("Parking Area must be a positive number"),
//       parkingAreaUnit: Yup.string().required("Parking Area Unit is required"),
//       galleryArea: Yup.number()
//         .required("Gallery Area is required")
//         .positive("Gallery Area must be a positive number"),
//       galleryAreaUnit: Yup.string().required("Gallery Area Unit is required"),
//     }),
//     lanlordDetails: Yup.object({
//       partyEntityType: Yup.string().required("Party Entity Type is required"),
//       name: Yup.string().required("Name is required"),
//       phone: Yup.string()
//         .matches(/^\d{10}$/, "Phone must be a 10-digit number")
//         .required("Phone is required"),
//       panNumber: Yup.string()
//         .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format")
//         .required("PAN Number is required"),
//       emailAddress: Yup.string()
//         .email("Invalid email format")
//         .required("Email Address is required"),
//       buildingName: Yup.string().required("Building Name is required"),
//       flatNumberHouseNumber: Yup.string().required(
//         "Flat Number / House Number is required"
//       ),
//       floorNumber: Yup.string().notRequired(),
//       roadStreet: Yup.string().notRequired(),
//       pinCode: Yup.string()
//         .matches(/^\d{6}$/, "PIN Code must be a 6-digit number")
//         .notRequired(),
//       villageCity: Yup.string().required("Village/City is required"),
//       district: Yup.string().notRequired(),
//       state: Yup.string().required("State is required"),
//       executingThrough: Yup.string().notRequired(),
//     }),
//     tenantDetails: Yup.object({
//       partyEntityType: Yup.string().required("Party Entity Type is required"),
//       name: Yup.string().required("Name is required"),
//       phone: Yup.string()
//         .matches(/^\d{10}$/, "Phone must be a 10-digit number")
//         .required("Phone is required"),
//       panNumber: Yup.string()
//         .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format")
//         .required("PAN Number is required"),
//       emailAddress: Yup.string()
//         .email("Invalid email format")
//         .required("Email Address is required"),
//       buildingName: Yup.string().required("Building Name is required"),
//       flatNumberHouseNumber: Yup.string().required(
//         "Flat Number / House Number is required"
//       ),
//       floorNumber: Yup.string().notRequired(),
//       roadStreet: Yup.string().notRequired(),
//       pinCode: Yup.string()
//         .matches(/^\d{6}$/, "PIN Code must be a 6-digit number")
//         .notRequired(),
//       villageCity: Yup.string().required("Village/City is required"),
//       district: Yup.string().notRequired(),
//       state: Yup.string().required("State is required"),
//       executingThrough: Yup.string().notRequired(),
//     }),
//   }),
// ];
// function renderStepContent(step: number) {
//   switch (step) {
//     case 0:
//       return <ContractStep />;
//     case 1:
//       return <PropertyStep />;
//     case 2:
//       return <LandlordStep />;
//     case 3:
//       return <TenantStep />;
//     default:
//       return <div>Not Found</div>;
//   }
// }

// const steps = ["Contract", "Property", "Landlord", "Tenant"];

// export default function Rental() {
//   const [activeStep, setActiveStep] = useState(0);
//   const currentValidationSchema = validationSchemas[activeStep];
//   const isLastStep = activeStep === steps.length - 1;

//   const handleSubmit = async (values: FormikValues, actions: any) => {
//     if (isLastStep) {
//       alert(JSON.stringify(values, null, 2));
//       actions.setSubmitting(false);
//     } else {
//       setActiveStep((prev) => prev + 1);
//       actions.setTouched({});
//       actions.setSubmitting(false);
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   return (
//     <main className="relative">
//       <RentalNav />
//       <Formik
//         initialValues={initialValues}
//         validationSchema={currentValidationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting }) => (
//           <Form autoComplete="off">
//             {renderStepContent(activeStep)}
//             <div className="form-footer flex justify-between mt-4">
//               {activeStep > 0 && (
//                 <Button type="button" onClick={handleBack} color="primary">
//                   Back
//                 </Button>
//               )}
//               <Button type="submit" color="primary" disabled={isSubmitting}>
//                 {isLastStep ? "Submit" : "Next"}
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </main>
//   );
// }

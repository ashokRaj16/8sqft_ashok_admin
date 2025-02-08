"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/ui/Button";
import useRentalDetail from "@/hooks/rentdetail";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const RentalForm: React.FC = () => {
  const { mutate, error } = useRentalDetail({
    onSuccess: () => {
      toast.success("Rental agreement submitted successfully!", {
        style: {
          fontSize: "12px",
          fontFamily: "'Inter', sans-serif",
          fontWeight: "300",
        },
      });
    },
    onError: () => {
      toast.error("Unable to connect to the server ", {
        style: {
          fontSize: "12px",
          fontFamily: "'Inter', sans-serif",
          fontWeight: "300",
        },
      });
    },
  });
  const [step, setStep] = useState(0);
  const [isChecked, setIsChecked]= useState(false);
  const router = useRouter();
  const initialValues = {
    contractDetails: {
      refundableDeposit: 0,
      agreementDuration: 0,
      monthlyRent: 0,
      nonRefundableDeposit: 0,
      iAm: "",
      minimumLockinPeriod: 0,
      stampDutyPaidBy: "",
      maintenancePaidBy: "",
      miscellaneousClause: "",
      agreementdate: "",
      agreementType: "",
      rentNotFixed: "0",
    },
    propertyDetails: {
      typeOfProperty: "",
      floorNumber: 0,
      flatNumber: "",
      buildingName: "",
      roadStreet: "",
      societyName: "",
      pincode: "",
      district: "",
      taluka: "",
      villageCity: "",
      propertyNumberType: "",
      propertyNumber: "",
      builtUpArea: 0,
      builtUpAreaUnit: "",
      use: "",
      parkingArea: 0,
      parkingAreaUnit: "",
      galleryArea: 0,
      galleryAreaUnit: "",
    },
    landlordDetails: {
      partyEntityType: "",
      name: "",
      phone: "",
      panNumber: "",
      emailAddress: "",
      buildingName: "",
      flatNumberHouseNumber: "",
      floorNumber: 0,
      roadStreet: "",
      pinCode: "",
      villageCity: "",
      district: "",
      state: "",
      executingThrough: "",
    },
    tenantDetails: {
      partyEntityType: "",
      name: "",
      phone: "",
      panNumber: "",
      emailAddress: "",
      buildingName: "",
      flatNumberHouseNumber: "",
      floorNumber: 0,
      roadStreet: "",
      pinCode: "",
      villageCity: "",
      district: "",
      state: "",
      executingThrough: "",
    },
  };

  const validationSchemas = [
    Yup.object({
      contractDetails: Yup.object({
        refundableDeposit: Yup.number()
          .required("Refundable Deposit Amount is required")
          .positive("Must be a positive number"),
        agreementDuration: Yup.number()
          .typeError("Agreement Duration must be a number") // Handles non-numeric input
          .min(1, "Agreement Duration must be at least 1 month")
          .max(12, "Agreement Duration cannot exceed 12 months")
          .required("Agreement Duration is required"),
        monthlyRent: Yup.number()
          .required("Monthly Rent Amount is required")
          .positive("Must be a positive number"),
        agreementdate: Yup.string()
          .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            "Agreement Date must be in the format yyyy-mm-dd"
          )
          .required("Agreement Date is required"),
        agreementType: Yup.string().required("Agreement Type is required"),
        nonRefundableDeposit: Yup.number()
          .required("Non Refundable Deposit is required")
          .positive("Must be a positive number"),
        iAm: Yup.string().required("Please select who you are"),
        minimumLockinPeriod: Yup.number()
          .required("Refundable Deposit Amount is required")
          .positive("Must be a positive number"),
        stampDutyPaidBy: Yup.string().required(
          "Stamp Duty & Registration Fee Paid By is required"
        ),
        rentNotFixed: Yup.string(),

        maintenancePaidBy: Yup.string().required(
          "Maintenance Paid By is required"
        ),
        miscellaneousClause: Yup.string()
          .max(1000, "Must be 1000 characters or less")
          .required("Miscellaneous Clause is required"),
      }),
    }),
    Yup.object({
      propertyDetails: Yup.object({
        typeOfProperty: Yup.string()
          .matches(
            /^\d+bhk$/,
            "Type of Property must be in the format of '1bhk', '2bhk', etc."
          )
          .required("Type of Property is required"),
        floorNumber: Yup.number()
          .required("Floor Number is required")
          .positive("Floor Number must be a positive number"),
        flatNumber: Yup.string().required("Flat Number is required"),
        buildingName: Yup.string().required("Building Name is required"),
        roadStreet: Yup.string().required("Road / Street is required"),
        societyName: Yup.string().required("Society Name is required"),
        pinCode: Yup.string().notRequired(),
        district: Yup.string().notRequired(),
        taluka: Yup.string().required("Taluka is required"),
        villageCity: Yup.string().required("Village/City is required"),
        propertyNumberType: Yup.string().required(
          "Property Number Type is required"
        ),
        propertyNumber: Yup.number()
          .required("Property Number is required")
          .positive("Property Number must be a positive number"),
        builtUpArea: Yup.number()
          .required("Built-up Area is required")
          .positive("Built-up Area must be a positive number"),
        builtUpAreaUnit: Yup.string().required(
          "Built-up Area Unit is required"
        ),
        use: Yup.string().required("Use is required"),
        parkingArea: Yup.number()
          .required("Parking Area is required")
          .positive("Parking Area must be a positive number"),
        parkingAreaUnit: Yup.string().required("Parking Area Unit is required"),
        galleryArea: Yup.number()
          .required("Gallery Area is required")
          .positive("Gallery Area must be a positive number"),
        galleryAreaUnit: Yup.string().required("Gallery Area Unit is required"),
      }),
    }),
    Yup.object({
      landlordDetails: Yup.object({
        partyEntityType: Yup.string().required("Party Entity Type is required"),
        name: Yup.string().required("Name is required"),
        phone: Yup.string()
          .matches(/^\d{10}$/, "Phone must be a 10-digit number")
          .required("Phone is required"),
        panNumber: Yup.string()
          .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format")
          .required("PAN Number is required"),
        emailAddress: Yup.string()
          .email("Invalid email format")
          .required("Email Address is required"),
        buildingName: Yup.string().required("Building Name is required"),
        flatNumberHouseNumber: Yup.string()
        .required("Flat Number / House Number is required")
        .matches(/^\d+$/, "Flat Number / House Number must contain only digits"),
        floorNumber: Yup.number()
          .required("Floor Number is required")
          .positive("Floor Number must be a positive number"),
        roadStreet: Yup.string().notRequired(),
        pinCode: Yup.string().notRequired(),
        villageCity: Yup.string().required("Village/City is required"),
        district: Yup.string().notRequired(),
        state: Yup.string().required("State is required"),
        executingThrough: Yup.string().notRequired(),
      }),
    }),
    Yup.object({
      tenantDetails: Yup.object({
        partyEntityType: Yup.string().required("Party Entity Type is required"),
        name: Yup.string().required("Name is required"),
        phone: Yup.string()
          .matches(/^\d{10}$/, "Phone must be a 10-digit number")
          .required("Phone is required"),
        panNumber: Yup.string()
          .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format")
          .required("PAN Number is required"),
        emailAddress: Yup.string()
          .email("Invalid email format")
          .required("Email Address is required"),
        buildingName: Yup.string().required("Building Name is required"),
        flatNumberHouseNumber: Yup.string()
        .required("Flat Number / House Number is required")
        .matches(/^\d+$/, "Flat Number / House Number must contain only digits"),
        floorNumber: Yup.number()
          .required("Floor Number is required")
          .positive("Floor Number must be a positive number"),
        roadStreet: Yup.string().notRequired(),
        pinCode: Yup.string().notRequired(),
        villageCity: Yup.string().required("Village/City is required"),
        district: Yup.string().notRequired(),
        state: Yup.string().required("State is required"),
        executingThrough: Yup.string().notRequired(),
      }),
    }),
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className=" space-y-4 w-full">
            <div className="flex flex-col field-container">
              <label className="text-xl font-bold my-1">Contract details</label>
              <div className="bg-gray  w-full h-[1px] my-1"></div>
              <label>Refundable Deposit</label>
              <Field
                name="contractDetails.refundableDeposit"
                type="number"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="contractDetails.refundableDeposit"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
            <label> Agreement Duration</label>
              <Field
                name="contractDetails.agreementDuration"
                type="number"
                placeholder="enter months"
                className="border border-gray rounded-md p-1"
              />
              <ErrorMessage
                name="contractDetails.agreementDuration"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Monthly Rent</label>
              <Field
                name="contractDetails.monthlyRent"
                type="number"
                className="border border-gray rounded-md p-1"
              />
              <ErrorMessage
                name="contractDetails.monthlyRent"
                component="div"
                className="text-red text-[10px]"
              />
               <div className='flex items-center my-4'><input type="checkbox" name="contractDetails.rentNotFixed" value="true" className="mr-2 " onClick={() => setIsChecked(!isChecked)}></input><p className='text-sm font-bold'>Rent not fixed</p>
               {isChecked ? <div className='grid text-center'><Field
                name="contractDetails.rentNotFixed"
                type="number"
                className="border border-gray rounded-md p-1 ml-3"
              />
              <ErrorMessage
                name="contractDetails.rentNotFixed"
                component="div"
                className="text-red text-[10px]"
              /></div> : null}</div>
              
            </div>
            

            <div className="flex flex-col field-container">
              <label>Non-Refundable Deposit</label>
              <Field
                name="contractDetails.nonRefundableDeposit"
                type="number"
                className="border border-gray rounded-md p-1"
              />
              <ErrorMessage
                name="contractDetails.nonRefundableDeposit"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Agreement Date</label>
              <Field
                name="contractDetails.agreementdate"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="contractDetails.agreementdate"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Agreement Type</label>
              <Field
                name="contractDetails.agreementType"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="contractDetails.agreementType"
                component="div"
                className="text-red text-[10px]"
              />
            </div>

            <div className="flex flex-col field-container">
              <label>Who Are You?</label>
              <Field
                name="contractDetails.iAm"
                as="select"
                className="border border-gray rounded-md p-1"
              >
                <option value="">Select</option>
                <option value="landlord">Landlord</option>
                <option value="tenant">Tenant</option>
              </Field>
              <ErrorMessage
                name="contractDetails.iAm"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Minimum Lock-in Period</label>
              <Field
                name="contractDetails.minimumLockinPeriod"
                className="border border-gray rounded-sm p-1"
                type="number"
                placeholder="enter months"
              />
              <ErrorMessage
                name="contractDetails.minimumLockinPeriod"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Stamp Duty Paid By</label>
              <Field
                name="contractDetails.stampDutyPaidBy"
                as="select"
                className="border border-gray rounded-sm p-1"
              >
                <option value="">Select</option>
                <option value="landlord">Landlord</option>
                <option value="tenant">Tenant</option>
                <option value="both">Both</option>
              </Field>
              <ErrorMessage
                name="contractDetails.stampDutyPaidBy"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Maintenance Paid By</label>
              <Field
                name="contractDetails.maintenancePaidBy"
                as="select"
                className="border border-gray rounded-sm p-1"
              >
                <option value="">Select</option>
                <option value="landlord">Landlord</option>
                <option value="tenant">Tenant</option>
              </Field>
              <ErrorMessage
                name="contractDetails.maintenancePaidBy"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Miscellaneous Clause</label>
              <Field
                name="contractDetails.miscellaneousClause"
                as="textarea"
                rows={4}
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="contractDetails.miscellaneousClause"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div className="form-container  space-y-4">
              <label className="text-xl font-bold my-1">Property details</label>
              <div className="bg-gray  w-full h-[1px] my-1"></div>
              <div className="flex flex-col ">
                Type Of Property
                <Field
                  name="propertyDetails.typeOfProperty"
                  as="input"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.typeOfProperty"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Floor Number</label>
                <Field
                  name="propertyDetails.floorNumber"
                  as="input"
                  type="number"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.floorNumber"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Flat Number</label>
                <Field
                  name="propertyDetails.flatNumber"
                  as="input"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.flatNumber"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Building Name</label>
                <Field
                  name="propertyDetails.buildingName"
                  as="input"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.buildingName"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Road / Street</label>
                <Field
                  name="propertyDetails.roadStreet"
                  as="input"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.roadStreet"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Society Name</label>
                <Field
                  name="propertyDetails.societyName"
                  as="input"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.societyName"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Pincode</label>
                <Field
                  name="propertyDetails.pincode"
                  as="input"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.pincode"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>District</label>
                <Field
                  name="propertyDetails.district"
                  as="input"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.district"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Taluka</label>
                <Field
                  name="propertyDetails.taluka"
                  as="input"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.taluka"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Village / City</label>
                <Field
                  name="propertyDetails.villageCity"
                  as="input"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.villageCity"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Property Number Type</label>
                <Field
                  name="propertyDetails.propertyNumberType"
                  as="select"
                  className="border border-gray rounded-sm p-1"
                >
                  <option value="">Select</option>
                  <option value="survey">Survey Number</option>
                  <option value="plot">Plot Number</option>
                </Field>
                <ErrorMessage
                  name="propertyDetails.propertyNumberType"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Property Number</label>
                <Field
                  name="propertyDetails.propertyNumber"
                  as="input"
                  type="number"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.propertyNumber"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Built-up Area</label>
                <Field
                  name="propertyDetails.builtUpArea"
                  as="input"
                  type="number"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.builtUpArea"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Built-up Area Unit</label>
                <Field
                  name="propertyDetails.builtUpAreaUnit"
                  as="select"
                  className="border border-gray rounded-sm p-1"
                >
                  <option value="">Select</option>
                  <option value="sqft">Sq. Ft.</option>
                  <option value="sqm">Sq. Meter</option>
                </Field>
                <ErrorMessage
                  name="propertyDetails.builtUpAreaUnit"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>User</label>
                <Field
                  name="propertyDetails.use"
                  as="select"
                  className="border border-gray rounded-sm p-1"
                >
                  <option value="">Select</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </Field>
                <ErrorMessage
                  name="propertyDetails.use"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Parking Area</label>
                <Field
                  name="propertyDetails.parkingArea"
                  as="input"
                  type="number"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.parkingArea"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Parking Area Unit</label>
                <Field
                  name="propertyDetails.parkingAreaUnit"
                  as="select"
                  className="border border-gray rounded-sm p-1"
                >
                  <option value="">Select</option>
                  <option value="sqft">Sq. Ft.</option>
                  <option value="sqm">Sq. Meter</option>
                </Field>
                <ErrorMessage
                  name="propertyDetails.parkingAreaUnit"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Gallery Area</label>
                <Field
                  name="propertyDetails.galleryArea"
                  as="input"
                  type="number"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="propertyDetails.galleryArea"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
              <div className="flex flex-col field-container">
                <label>Gallery Area Unit</label>
                <Field
                  name="propertyDetails.galleryAreaUnit"
                  as="select"
                  className="border border-gray rounded-sm p-1"
                >
                  <option value="">Select</option>
                  <option value="sqft">Sq. Ft.</option>
                  <option value="sqm">Sq. Meter</option>
                </Field>
                <ErrorMessage
                  name="propertyDetails.galleryAreaUnit"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <label className="text-xl font-bold my-1">Landlord details</label>
            <div className="bg-gray  w-full h-[1px] my-1"></div>
            <div className="flex flex-col field-container">
              <label>Party Entity Type</label>
              <Field
                name="landlordDetails.partyEntityType"
                as="select"
                className="border border-gray rounded-sm p-1"
              >
                <option value="">Select</option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
                <option value="trust">Trust</option>
              </Field>
              <ErrorMessage
                name="landlordDetails.partyEntityType"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Name</label>
              <Field
                name="landlordDetails.name"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.name"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Phone</label>
              <Field
                name="landlordDetails.phone"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.phone"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>PAN Number</label>
              <Field
                name="landlordDetails.panNumber"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.panNumber"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Email Address</label>
              <Field
                name="landlordDetails.emailAddress"
                type="email"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.emailAddress"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Building Name</label>
              <Field
                name="landlordDetails.buildingName"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.buildingName"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Flat Number / House Number</label>
              <Field
                name="landlordDetails.flatNumberHouseNumber"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.flatNumberHouseNumber"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Floor Number</label>
              <Field
                name="landlordDetails.floorNumber"
                type="number"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.floorNumber"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Road / Street</label>
              <Field
                name="landlordDetails.roadStreet"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.roadStreet"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>PIN Code</label>
              <Field
                name="landlordDetails.pinCode"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.pinCode"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Village / City</label>
              <Field
                name="landlordDetails.villageCity"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.villageCity"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>District</label>
              <Field
                name="landlordDetails.district"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.district"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>State</label>
              <Field
                name="landlordDetails.state"
                as="select"
                className="border border-gray rounded-sm p-1"
              >
                <option value="">Select</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="delhi">Delhi</option>
                <option value="gujarat">Gujarat</option>
                <option value="karnataka"> Karnataka</option>
              </Field>
              <ErrorMessage
                name="landlordDetails.state"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
            <div className="flex flex-col field-container">
              <label>Executing Through</label>
              <Field
                name="landlordDetails.executingThrough"
                type="text"
                className="border border-gray rounded-sm p-1"
              />
              <ErrorMessage
                name="landlordDetails.executingThrough"
                component="div"
                className="text-red text-[10px]"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <>
            <div className="flex flex-col field-container">
              <h3 className="text-xl font-bold my-1">Tenant details</h3>
              <div className="bg-gray  w-full h-[1px] my-1"></div>
              <div className="flex flex-col field-container">
                <label>Party Entity Type</label>
                <Field
                  name="tenantDetails.partyEntityType"
                  as="select"
                  className="border border-gray rounded-sm p-1"
                >
                  <option value="">Select</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                  <option value="trust">Trust</option>
                </Field>
                <ErrorMessage
                  name="tenantDetails.partyEntityType"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>Name</label>
                <Field
                  name="tenantDetails.name"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.name"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>Phone</label>
                <Field
                  name="tenantDetails.phone"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.phone"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>PAN Number</label>
                <Field
                  name="tenantDetails.panNumber"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.panNumber"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>Email Address</label>
                <Field
                  name="tenantDetails.emailAddress"
                  type="email"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.emailAddress"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>Building Name</label>
                <Field
                  name="tenantDetails.buildingName"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.buildingName"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>Flat Number / House Number</label>
                <Field
                  name="tenantDetails.flatNumberHouseNumber"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.flatNumberHouseNumber"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>Floor Number</label>
                <Field
                  name="tenantDetails.floorNumber"
                  type="number"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.floorNumber"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>Road / Street</label>
                <Field
                  name="tenantDetails.roadStreet"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.roadStreet"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>PIN Code</label>
                <Field
                  name="tenantDetails.pinCode"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.pinCode"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>Village / City</label>
                <Field
                  name="tenantDetails.villageCity"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.villageCity"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>District</label>
                <Field
                  name="tenantDetails.district"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.district"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>State</label>
                <Field
                  name="tenantDetails.state"
                  as="select"
                  className="border border-gray rounded-sm p-1"
                >
                  <option value="">Select</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="delhi">Delhi</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="karnataka"> Karnataka</option>
                </Field>
                <ErrorMessage
                  name="tenantDetails.state"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>

              <div className="flex flex-col field-container">
                <label>Executing Through</label>
                <Field
                  name="tenantDetails.executingThrough"
                  type="text"
                  className="border border-gray rounded-sm p-1"
                />
                <ErrorMessage
                  name="tenantDetails.executingThrough"
                  component="div"
                  className="text-red text-[10px]"
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = (values: any, e?: any) => {
    console.log("Form Submitted", values);
    e.preventDefault();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas[step]}
      onSubmit={(values, { setSubmitting,resetForm }) => {
        if (step === 3) {
          const transformedData = {
            ref_dipo_amt: values.contractDetails.refundableDeposit,
            agri_durr: values.contractDetails.agreementDuration,
            mnth_rent_amt: values.contractDetails.monthlyRent,
            agriment_date: values.contractDetails.agreementdate,
            non_ref_deposit: values.contractDetails.nonRefundableDeposit,
            agriment_type: values.contractDetails.agreementType,
            rent_not_fix: values.contractDetails.rentNotFixed,
            min_lokin_period: values.contractDetails.minimumLockinPeriod,
            inc_by_amt_from: 1000,
            inc_amt_to: 2000,
            inc_by_per_month: 5,
            inc_by_per_to_percent: 10,
            deposit_payment_mode: "Bank Transfer",
            reg_fee_paid_by: "Tenant",

            amenities: "Pool, Gym, Parking",
            printing_cleaning_charges: "1",
            property_cond_upo_vac: "1",

            flat_number: "201",

            locality: "Downtown",
            property_number: "F201",

            use_of_area: "recedentail",

            have_landloard_aadhar: true,
            landloard_pan_number: "ABCDE1234F",

            tanent_adhar_card: "1",

            tenant_flat_no: "202",

            delivery_add_fullname: "Jane Smith",
            delivery_address_email: "jane.smith@example.com",
            delivery_address_phone: "9876543211",
            delivery_address_pincode: "123456",
            delivery_type: "Courier",
            mentenence_paid_by: values.contractDetails.maintenancePaidBy,
            misc_clause_desc: values.contractDetails.miscellaneousClause,
            property_type: values.propertyDetails.typeOfProperty,
            flour_num: values.propertyDetails.floorNumber,
            flat_string: values.propertyDetails.flatNumber,
            building_name: values.propertyDetails.buildingName,
            road_street: values.propertyDetails.roadStreet,
            society_name: values.propertyDetails.societyName,
            pincode: values.propertyDetails.pincode,
            distric: values.propertyDetails.district,
            tahasil: values.propertyDetails.taluka,
            village_city: values.propertyDetails.villageCity,
            property_num_type: values.propertyDetails.propertyNumberType,
            property_string: values.propertyDetails.propertyNumber,
            builtup_area_house: values.propertyDetails.builtUpArea,
            builtup_area_unit: values.propertyDetails.builtUpAreaUnit,
            parking_area: values.propertyDetails.parkingArea,
            parking_area_unit: values.propertyDetails.parkingAreaUnit,
            gallery_area: values.propertyDetails.galleryArea,
            gallery_area_unit: values.propertyDetails.galleryAreaUnit,
            landloard_entity_type: values.landlordDetails.partyEntityType,
            landloard_name: values.landlordDetails.name,
            landloard_phone: values.landlordDetails.phone,
            landloard_pan_string: values.landlordDetails.panNumber,
            landloard_email: values.landlordDetails.emailAddress,
            landloard_building_name: values.landlordDetails.buildingName,
            flat_house_no: values.landlordDetails.flatNumberHouseNumber,
            landloard_floor_no: values.landlordDetails.floorNumber,
            landloard_road_street: values.landlordDetails.roadStreet,
            landloard_pincode: values.landlordDetails.pinCode,
            landloard_village_city: values.landlordDetails.villageCity,
            landloard_dist: values.landlordDetails.district,
            landloard_state: values.landlordDetails.state,
            exicuting_through: values.landlordDetails.executingThrough,
            tenant_entity_type: values.tenantDetails.partyEntityType,
            tenant_name: values.tenantDetails.name,
            tanent_phone: values.tenantDetails.phone,
            tenant_email: values.tenantDetails.emailAddress,
            tanent_pan: values.tenantDetails.panNumber,
            tenant_building_name: values.tenantDetails.buildingName,
            tenant_road_street: values.tenantDetails.roadStreet,
            tenant_pincode: values.tenantDetails.pinCode,
            tenant_village_city: values.tenantDetails.villageCity,
            tenant_district: values.tenantDetails.district,
            tenant_state: values.tenantDetails.state,
            tenant_exec_through: values.tenantDetails.executingThrough,
          };
          mutate(transformedData);
          setSubmitting(false);
          resetForm();
          router.push("/");
        } else {
          handleNext();
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="relative  overflow-hidden  flex items-center justify-center flex-col bg-white w-[100vw]">
            <div className=" relative  top-10 overflow-y-scroll h-[60vh]  w-full flex justify-center">
              <div className="mb-10 sm:w-[40vw] max-w-3xl  container   ">
                {renderStep()}
              </div>
            </div>
            <div className="relative  mt-10 flex gap-1 bg-white">
            {step > 0 && (
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="bg-black rounded-sm px-2 py-3 text-white sm:w-[10em]  "
              >
                Back
              </Button>
            )}
            {step < 3 && (
              <button
                type="submit"
                className="bg-primary rounded-sm px-2 py-2 text-white   self-right sm:w-[10em]"
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                className="bg-primary rounded-sm px-2 py-2 text-white   self-center sm:w-[10em]"
              >
                Submit
              </button>
            )}
          </div>
          </div>
          
        </Form>
      )}
    </Formik>
  );
};

export default RentalForm;

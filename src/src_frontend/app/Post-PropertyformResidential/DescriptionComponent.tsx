"use client";

import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import useDescriptionDetail from "@/hooks/Postpropertyhooks/useDescription";
import toast from "react-hot-toast";

const validationSchema = Yup.object({
  description: Yup.string()
    .required("Description is required")
    .max(5000, "Description must not exceed 5000 characters"),
});
interface PropertyDescriptionProps {
  onNext: () => void; // Receive `onNext` as a prop
}
export default function PropertyDescriptionComponent({
  onNext,
}: PropertyDescriptionProps) {
  const { mutate, isError } = useDescriptionDetail({
    onSuccess: (data) => {
      toast.success(`${data.message}`);
      onNext();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return (
    <Formik
      initialValues={{
        description: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const propertyType = "sfddsfdsf";
        mutate({
          property_description: values.description,
          propertyType,
        });
      }}
    >
      {() => (
        <Form className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-4 overflow-y-auto h-[80vh]">
          {/* Property Description Title */}

          <div>
            <label className="block font-semibold">Description</label>
            <Field
              as="textarea"
              name="description"
              className="w-full p-2 border rounded-md"
              placeholder="Enter description (up to 5000 characters)"
              rows="8"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-600 text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-md"
          >
            Save and Next
          </button>
        </Form>
      )}
    </Formik>
  );
}

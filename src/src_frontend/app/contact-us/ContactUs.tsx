"use client";
import Image from "next/image";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import axios from "axios";
import * as Yup from "yup";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
  message: Yup.string().required("Message is required"),
});

export default function ContactUs() {
  // const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
  //   const fullName = `${values.firstName} ${values.lastName}`;
  //   const payload = {
  //     full_name: fullName,
  //     email: values.email,
  //     phone: values.phone,
  //     message: values.message,
  //   };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm, setStatus }: FormikHelpers<FormValues>
  ) => {
    const fullName = `${values.firstName} ${values.lastName}`;
    const payload = {
      full_name: fullName,
      email: values.email,
      phone: values.phone,
      message: values.message,
    };

    try {
      const response = await axios.post(
        "https://api.8sqft.com/api/v1/front/contact_us",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
          },
        }
      );

      if (response.status === 201) {
        setStatus({ success: "Message sent successfully!" });
        resetForm();
      }
    } catch (error: any) {
      setStatus({
        error:
          error.response?.data?.message ||
          "Failed to send message. Please try again.",
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center bg-white">
      {/* <div className="relative w-[98%] h-[40%] mt-6 border-2 border-primary rounded-lg overflow-hidden mr-4">
        <Image
          src="/assets/ContactUs/Contact.png"
          alt="Contact Us Background"
          width={1350}
          height={850}
          className="w-full h-[300px] object-cover opacity-20"
        />
        <h1 className="absolute inset-x-0 top-[50%] transform -translate-y-1/2 text-center text-4xl font-bold text-black">
          Contact Us
        </h1>
      </div> */}
      <div className="relative w-full sm:w-[98%] h-[40%] mt-6 border-2 border-primary rounded-lg overflow-hidden sm:mr-4">
        <Image
          src="/assets/ContactUs/Contact.png"
          alt="Contact Us Background"
          width={1350}
          height={850}
          className="w-full h-[200px] sm:h-[300px] object-cover opacity-20"
        />
        <h1 className="absolute inset-x-0 top-[50%] transform -translate-y-1/2 text-center text-2xl sm:text-4xl font-bold text-black">
          Contact Us
        </h1>
      </div>

      <div className="container mx-auto flex flex-col items-center justify-center md:flex-row mt-10 md:space-y-0 md:space-x-10">
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold">Let&apos;s talk with us</h2>
          <p className="text-gray-600">
            Questions, comments, or suggestions? Simply fill in the form, and
            we’ll be in touch shortly.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/assets/ContactUs/Location.svg"
                alt="Location Icon"
                width={24}
                height={24}
              />
              <p className="text-gray-600 font-semibold">
                M213, City Avenue, Shankar Kalat Nagar, Wakad, Pimpri-Chinchwad,
                Maharashtra 411057, India.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Image
                src="/assets/ContactUs/Phone.svg"
                alt="Phone Icon"
                width={24}
                height={24}
              />
              <p className="text-gray-600 font-semibold">+91 7219009062</p>
            </div>
            <div className="flex items-center space-x-4">
              <Image
                src="/assets/ContactUs/mail.svg"
                alt="Email Icon"
                width={24}
                height={24}
              />
              <p className="text-gray-600 font-semibold">
                info.8sqft@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow-md border-[1px]">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              message: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, status }) => (
              <Form className="space-y-4">
              
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Field
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      className="p-4 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red text-sm"
                    />
                  </div>
                  <div>
                    <Field
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="p-4 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red text-sm"
                  />
                </div>
                <div>
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Mobile Number"
                    className="w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red text-sm"
                  />
                </div>
                <div>
                  <Field
                    as="textarea"
                    name="message"
                    placeholder="Your Message"
                    rows={4}
                    className="w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="text-red text-sm"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[50%] mx-auto block bg-primary text-white py-3 rounded-md hover:bg-orange-600 transition duration-300"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
                {status && (
                  <p
                    className={`text-center text-sm mt-4 ${
                      status.error ? "text-red" : "text-green"
                    }`}
                  >
                    {status.error || status.success}
                  </p>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

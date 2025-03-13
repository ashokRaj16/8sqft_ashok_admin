import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import Image from "next/image";
import useEmailDetail from "@/hooks/useEmail";
import toast from "react-hot-toast";
import useVerifyDetail from "@/hooks/useVerifyOtp";
import { useRouter } from "next/navigation";
import useSignupDetail from "@/hooks/useSignup";
import Link from "next/link";
import useWhatappDetail from "@/hooks/useWhatapp";
import useEmailVerifyDetail from "@/hooks/useEmailVerify";
interface data {
  token: string;
}
// Step Validation Schemas
const stepSchemas = [
  Yup.object().shape({
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),
  }),
  Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  }),
  Yup.object().shape({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .matches(/^\d{6}$/, "OTP must be numeric")
      .required("OTP is required"),
  }),
  Yup.object().shape({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .matches(/^\d{6}$/, "OTP must be numeric")
      .required("OTP is required"),
  }),
  Yup.object().shape({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .nullable()
      .test("email-or-mobile", function (value) {
        const { mobile } = this.parent;
        if (!value && !mobile) {
          return this.createError({ path: "email", message: "Either an email or mobile is required." });
        }
        return true;
      }),

    mobile: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be 10 digits")
      .nullable()
      .test("email-or-mobile", function (value) {
        const { email } = this.parent;
        if (!value && !email) {
          return this.createError({ path: "mobile", message: "Either an email or mobile is required." });
        }
        return true;
      }),
      
    // email: Yup.mixed().
    //         test('email-or-mobile', 
    //         'Either an email or mobile is required.',
    //         function (value) {
    //             const { mobile  } = this.parent;
    //             return !!value || !!mobile;
    //         }
    //     ),

    // mobile: Yup.mixed().
    //     test('email-or-mobile', 
    //     'Either an email or mobile is required.',
    //     function (value) {
    //         const { email  } = this.parent;
    //         return !!value || !!email;
    //     }
    // ),
  }),
];
interface MultiStepFormProps {
  closeDialog: () => void;
}
export default function MultiStepForm({closeDialog}:MultiStepFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isEmailFlow, setIsEmailFlow] = useState(false); // Flag for email vs mobile flow
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    firstname: "",
    lastname: "",
    mobile: "",
  });

  // Define hooks for server-side logic
  const { mutate: sendEmail } = useEmailDetail({
    onSuccess: () => toast.success("OTP sent to email!"),
    onError: () => toast.error("Unable to connect to the server"),
  });

  const { mutate: sendWhatapp } = useWhatappDetail({
    onSuccess: () => toast.success("OTP sent to WhatsApp!"),
    onError: () => toast.error("Failed to connect to the server"),
  });

  const {
    mutateOtp,
    data: verifyData,
    error: otpError,
  } = useVerifyDetail({
    onSuccess: (data) => {
      if ("data" in data) {
        // Login successful
        toast.success("Login successful!");
        closeDialog();
        // router.push("/");
      } else if ("needToRegister" in data) {
        // Registration required
        handleNext({ otp: formData.otp });
      }
    },
    onError: (error) => {
      toast.error(error.message || "OTP verification failed");
    },
  });

  const { mutateEmailOtp } = useEmailVerifyDetail({
    onSuccess: (data) => {
      if ("data" in data) {
        // Login successful
        toast.success("Login successful!");
        closeDialog();
        // router.push("/");
      } else if ("needToRegister" in data) {
        // Registration required
        handleNext({ otp: formData.otp });
      }
    },
    onError: (error) => {
      toast.error(error.message || "OTP verification failed");
    },
  });

  const { mutate: signup } = useSignupDetail({
    onSuccess: () => {
      toast.success("Account created successfully!");
      closeDialog();

      router.push("/");
    },
    onError: () => toast.error("Account creation failed"),
  });

  const getNextStep = (currentStep: number) => {
    if (isEmailFlow) {
      switch (currentStep) {
        case 1:
          return 3; // From email entry to OTP entry
        case 3:
          return 4; // From OTP entry to account creation
        default:
          return currentStep;
      }
    } else {
      switch (currentStep) {
        case 0:
          return 2; // From mobile number entry to OTP entry
        case 2:
          return 4; // From OTP entry to account creation
        default:
          return currentStep;
      }
    }
  };

  // Handle initial flow selection
  const handleFlowSelection = (useEmail: boolean) => {
    setIsEmailFlow(useEmail);
    setFormData((prev) => ({
      ...prev,
      email: "",
      otp: "",
      firstname: "",
      lastname: "",
      mobile: "",
    })); // Reset relevant form fields
    setCurrentStep(useEmail ? 1 : 0); // Email starts at step 1, WhatsApp at step 0
  };

  const handleNext = (values: any) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep((prev) => getNextStep(prev));
  };
  
  return (
    <div className="w-full">
      <Tabs value={`step-${currentStep}`} className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="step-0">Step 1</TabsTrigger>
          <TabsTrigger value="step-1">Step 2</TabsTrigger>
          <TabsTrigger value="step-2">Step 3</TabsTrigger>
          <TabsTrigger value="step-3">Step 4</TabsTrigger>
        </TabsList>

        {currentStep === 0 && (
          <TabsContent value="step-0">
            <Formik
              initialValues={{ mobile: formData.mobile }}
              validationSchema={stepSchemas[0]}
              onSubmit={(values) => {
                sendWhatapp({ mobile: Number(values.mobile) });
                handleNext(values);
              }}
            >
              {({ isValid, dirty }) => (
                <Form className="flex flex-col gap-2 items-center">
                  <Image
                    src="/assets/logo/Only-8.svg"
                    alt="8sqft-logo"
                    width={35}
                    height={35}
                  />
                  <h1 className="text-xl font-bold">Welcome to 8sqft</h1>
                  <h4 className="text-md">SignIn / SignUp</h4>

                  <Field
                    as={Input}
                    id="mobile"
                    name="mobile"
                    placeholder="Enter Whatsapp number"
                  />
                  <ErrorMessage
                    name="mobile"
                    component="div"
                    className="text-red text-[10px]"
                  />
                  <Button
                    type="submit"
                    className={`mt-4 w-full  ${
                      isValid && dirty ? "bg-[#FC6600]" : "bg-[#ffb787]"
                    } text-white`}
                    disabled={!isValid || !dirty}
                  >
                    Continue
                  </Button>
                  <p className="text-[#808080] text-xs ">
                    Continue with Email?
                    <Link
                      className="text-[#037FFC]"
                      href="#"
                      onClick={(event) => {
                        event.preventDefault(); // Prevent the default behavior of the anchor tag
                        handleFlowSelection(true); // Call the function with the appropriate boolean value
                      }}
                    >
                        {' '} Click here
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </TabsContent>
        )}
        {currentStep === 1 && isEmailFlow && (
          <TabsContent value="step-1">
            <Formik
              initialValues={{ email: formData.email }}
              validationSchema={stepSchemas[1]}
              onSubmit={(values) => {
                sendEmail(values);
                handleNext(values);
              }}
            >
              {({ isValid, dirty }) => (
                <Form className="flex flex-col gap-2 items-center">
                  <Image
                    src="/assets/logo/Only-8.svg"
                    alt="8sqft-logo"
                    width={35}
                    height={35}
                  />
                  <h1 className="text-xl font-bold">Welcome to 8sqft</h1>                 
                  <h4 className="text-md">SignIn / SignUp</h4>

                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    placeholder="Enter Email id"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red text-[10px]"
                  />
                  <Button
                    type="submit"
                    className={`mt-4 w-full ${
                      isValid && dirty ? "bg-[#FC6600]" : "bg-[#ffb787]"
                    } text-white`}
                    disabled={!isValid || !dirty}
                  >
                    Continue
                  </Button>
                  <p className="text-[#808080] text-xs">
                    Continue with Mobile?
                    <Link className="text-[#037FFC]" href="#"
                      onClick={(event) => {
                        event.preventDefault(); // Prevent the default behavior of the anchor tag
                        handleFlowSelection(false); // Call the function with the appropriate boolean value
                      }}>
                        {' '} Click here
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </TabsContent>
        )}
        {currentStep === 2 && !isEmailFlow && (
          <TabsContent value="step-2">
            <Formik
              initialValues={{ otp: formData.otp }}
              validationSchema={stepSchemas[2]}
              onSubmit={(values) => {
                mutateOtp({ otp: values.otp, mobile: formData.mobile });
              }}
            >
              {({ isValid, dirty }) => (
                <Form className="flex flex-col gap-2 items-center">
                  <Image
                    src="/assets/logo/Only-8.svg"
                    alt="8sqft-logo"
                    width={35}
                    height={35}
                  />
                  <h1 className="text-xl font-bold">Please enter your OTP</h1>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Field
                    as={Input}
                    id="otp"
                    name="otp"
                    placeholder="Enter your OTP"
                  />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="text-red text-[10px]"
                  />
                  <Button
                    type="submit"
                    className={`w-full ${
                      isValid && dirty ? "bg-[#FC6600]" : "bg-[#ffb787]"
                    } text-white`}
                  >
                    Next
                  </Button>
                </Form>
              )}
            </Formik>
          </TabsContent>
        )}
        {currentStep === 3 && isEmailFlow && (
          <TabsContent value="step-3">
            <Formik
              initialValues={{ otp: formData.otp }}
              validationSchema={stepSchemas[3]}
              onSubmit={(values) => {
                mutateEmailOtp({ otp: values.otp, email: formData.email });
              }}
            >
              {({ isValid, dirty }) => (
                <Form className="flex flex-col gap-2 items-center">
                  <Image
                    src="/assets/logo/Only-8.svg"
                    alt="8sqft-logo"
                    width={35}
                    height={35}
                  />
                  <h1 className="text-xl font-bold">Please enter your OTP</h1>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Field
                    as={Input}
                    id="otp"
                    name="otp"
                    placeholder="Enter your OTP"
                  />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="text-red text-[10px]"
                  />
                  <Button
                    type="submit"
                    className={`w-full ${
                      isValid && dirty ? "bg-[#FC6600]" : "bg-[#ffb787]"
                    } text-white`}
                  >
                    Next
                  </Button>
                </Form>
              )}
            </Formik>
          </TabsContent>
        )}

        {currentStep === 4 && (
          <TabsContent value="step-4">
            <Formik
              initialValues={{
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                mobile: formData.mobile,
              }}
              validationSchema={stepSchemas[4]}
              onSubmit={(values) => {
                signup({
                  first_name: values.firstname,
                  last_name: values.lastname,
                  email: values.email,
                  mobile: String(values.mobile),
                });
              }}
            >
              {() => (
                <Form className="flex flex-col gap-4 items-center">
                  <Image
                    src="/assets/logo/Only-8.svg"
                    alt="8sqft-logo"
                    width={35}
                    height={35}
                  />
                  <h1 className="text-xl font-bold">Create a free account</h1>
                  <Field
                    as={Input}
                    id="firstname"
                    name="firstname"
                    placeholder="First Name"
                  />
                  <ErrorMessage
                    name="firstname"
                    component="div"
                    className="text-red text-[10px]"
                  />
                  <Field
                    as={Input}
                    id="lastname"
                    name="lastname"
                    placeholder="Last Name"
                  />
                  <ErrorMessage
                    name="lastname"
                    component="div"
                    className="text-red text-[10px]"
                  />
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    placeholder="Email"
                  />
                  <Field
                    as={Input}
                    id="mobile"
                    name="mobile"
                    placeholder="Mobile Number"
                    type="text"
                    
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red text-[10px]"
                  />
                  <ErrorMessage
                    name="mobile"
                    component="div"
                    className="text-red text-[10px]"
                  />
                  <Button type="submit" className="bg-[#FC6600] text-white">
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

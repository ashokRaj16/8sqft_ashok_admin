import * as Yup from "yup";

// ### check for email & mobile already exists in database.
export const profileSchema = Yup.object().shape({
    fname: Yup.string().required("First Name is required"),
    lname: Yup.string().required("Last Name is required"),
    email: Yup.string().required("Email is required").email('Email is not valid.'),
    mobile: Yup.string().required("Mobile is required").min(10).max(12),
    address: Yup.string()
      .required("Address is required"),
    pan: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
    // addhar: Yup.string()
    //   .matches(/^\d{12}$/, "Address must be 12 digits")
    //   .required("Aadhaar is required"),
      // .required("PAN is required"),
});

// ### check for oldPassword already exists in database.
export const passwordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
});
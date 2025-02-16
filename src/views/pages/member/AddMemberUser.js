import { CButton, CCol, CContainer, CFormInput, CFormSelect, CFormText, CRow, CSpinner } from "@coreui/react";
import { useState } from "react";
import Loader from "./Loader";
import { Formik, Field, ErrorMessage, Form } from "formik";
import {
    validationPropertyConfigurationSchema,
    WrapperValidationSchema,
} from './validationPropertySchema'
import {
    initialPropertyConfigurationValues,
    configurationUnit,
} from './data'

const AddMemberUser = (props) => {
    const [loading, setLoading] = useState(false)
    const [previewImage, setPreviewImage] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            console.log('submitting')
            setLoading(false)
        }, 5000);
        console.log('submitted')

    }

    return (
        <div>
            <h1>Users</h1>
            <CContainer>
                {
                    loading && <Loader />
                }

                <CRow className="mb-2">
                    <CRow>
                        <Formik
                            initialValues={initialPropertyConfigurationValues}
                            // validationSchema={ validationPropertyConfigurationSchema
                            // //     .context({
                            // //     property_type: 'COMMERCIAL'
                            // // })
                            // }
                            // validate={ (values)  =>
                            //   validationPropertyConfigurationSchema.validate(
                            //   values,
                            //   { context: { property_type: 'SALE' } },
                            // )}
                            validationSchema={
                                WrapperValidationSchema('RESIDENTIAL')
                            //     (values) =>
                            // validationPropertyConfigurationSchema.validate(values, {
                            //     context: { property_type: "COMMERCIAL" }, // Explicitly set context
                            // })
                            }
                            // validate={(values) => {
                            // return validationPropertyConfigurationSchema.validate(values, {
                            //     context: { property_type: "COMMERCIAL" }, // Ensure context is passed
                            // });
                            // }}
                            onSubmit={(values, { setSubmitting, resetForm }) => {

                                //                                 validationPropertyConfigurationSchema
                                // .validate(values, {
                                //   context: {
                                //     property_type: Array.isArray(propertyDetails.property_type)
                                //       ? propertyDetails.property_type[0]
                                //       : propertyDetails.property_type,
                                //   },
                                // })
                                // .then(() => {
                                //   console.log('Form submitted successfully:', values);
                                //   setSubmitting(false);
                                // })
                                // .catch((err) => {
                                //   console.error('Validation Error:', err);
                                //   setErrors(err.inner.reduce((acc, curr) => {
                                //     acc[curr.path] = curr.message;
                                //     return acc;
                                //   }, {}));
                                //   setSubmitting(false);
                                // });
                                console.log(values)
                                // handleCreatePropertyConfigurationSubmit(
                                //     values,
                                //     resetForm,
                                //     setSubmitting,
                                // )
                            }}
                        >
                            {({
                                values,
                                handleChange,
                                handleBlur,
                                isSubmitting,
                                resetForm,
                                setFieldValue,
                                errors
                            }) => (
                                console.log("config errors:", errors),
                                <Form>
                                    <CRow className="mt-2">
                                        <CCol md={2} className="fw-bold">
                                            Unit name:
                                        </CCol>
                                        <CCol md={10}>
                                            <>
                                                <Field
                                                    name="unit_name"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Unit Name"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                    name="unit_name"
                                                    // component={CFormText}
                                                    component="div"
                                                    className="text-danger"
                                                />
                                            </>
                                        </CCol>
                                    </CRow>

                                    <CRow className="mt-2">
                                        <CCol md={2} className="fw-bold">
                                            Carpet Area:
                                        </CCol>
                                        <CCol md={10}>
                                            <>
                                                <Field
                                                    name="carpet_area"
                                                    type="text"
                                                    as={CFormInput}
                                                    className="form-control"
                                                    placeholder="Area"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                    name="carpet_area"
                                                    component={CFormText}
                                                    className="text-danger"
                                                />
                                            </>
                                        </CCol>
                                    </CRow>

                                    <CRow className="mt-2">
                                        <CCol md={2} className="fw-bold">
                                            Carpet Price:
                                        </CCol>
                                        <CCol md={10}>
                                            <>
                                                <Field
                                                    name="carpet_price"
                                                    type="text"
                                                    as={CFormInput}
                                                    className="form-control"
                                                    placeholder="Price"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                    name="carpet_price"
                                                    component={CFormText}
                                                    className="text-danger"
                                                />
                                            </>
                                        </CCol>
                                    </CRow>

                                    <CRow className="mt-2">
                                        <CCol md={2} className="fw-bold">
                                            Length:
                                        </CCol>
                                        <CCol md={4}>
                                            <>
                                                <Field
                                                    name="length"
                                                    type="text"
                                                    as={CFormInput}
                                                    className="form-control"
                                                    placeholder="Length"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                    name="length"
                                                    component={CFormText}
                                                    className="text-danger"
                                                />
                                            </>
                                        </CCol>
                                        <CCol md={2} className="fw-bold">
                                            Unit :
                                        </CCol>
                                        <CCol md={4}>
                                            <>
                                                <Field
                                                    name="length_unit"
                                                    as={CFormSelect}
                                                    className="form-control"
                                                    placeholder="Unit"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                >
                                                    <option value="-1"> Select </option>
                                                    {configurationUnit.map((item) => {
                                                        return (
                                                            <option value={item.value}>{item.title}</option>
                                                        )
                                                    })}
                                                </Field>
                                                <ErrorMessage
                                                    name="length_unit"
                                                    component={CFormText}
                                                    className="text-danger"
                                                />
                                            </>
                                        </CCol>
                                    </CRow>

                                    <CRow className="mt-2">
                                        <CCol md={2} className="fw-bold">
                                            Width:
                                        </CCol>
                                        <CCol md={4}>
                                            <>
                                                <Field
                                                    name="width"
                                                    type="text"
                                                    as={CFormInput}
                                                    className="form-control"
                                                    placeholder="Width"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <ErrorMessage
                                                    name="width"
                                                    component={CFormText}
                                                    className="text-danger"
                                                />
                                            </>
                                        </CCol>

                                        <CCol md={2} className="fw-bold">
                                            Unit :
                                        </CCol>
                                        <CCol md={4}>
                                            <>
                                                <Field
                                                    name="width_unit"
                                                    as={CFormSelect}
                                                    className="form-control"
                                                    placeholder="Area"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                >
                                                    <option value="-1"> Select </option>
                                                    {configurationUnit.map((item) => {
                                                        return (
                                                            <option value={item.value}>{item.title}</option>
                                                        )
                                                    })}
                                                </Field>
                                                <ErrorMessage
                                                    name="width_unit"
                                                    component={CFormText}
                                                    className="text-danger"
                                                />
                                            </>
                                        </CCol>
                                    </CRow>

                                    <CRow className="mb-3 mt-2">
                                        {/* <CCol md="12"> */}
                                        <CCol md={2} className="fw-bold">
                                            Image:
                                        </CCol>
                                        <CCol md={10}>
                                            <CFormInput
                                                type="file"
                                                className="mb-2"
                                                name="image"
                                                multiple
                                                // value={values.image}
                                                onChange={(e) => {
                                                    console.log(
                                                        'images: ',
                                                        values.image,
                                                        e.target.files[0],
                                                    )
                                                    const file = e.target.files[0]
                                                    if (file) {
                                                        setFieldValue('image', e.target.files[0])
                                                        setPreviewImage(URL.createObjectURL(file))
                                                    }
                                                }}
                                            />

                                            {previewImage && (
                                                <CImage
                                                    width={200}
                                                    height={100}
                                                    className="w-full h-full object-cover"
                                                    src={previewImage || ''}
                                                />
                                            )}
                                            <ErrorMessage
                                                name="image"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </CCol>
                                    </CRow>

                                    <CButton
                                        disabled={isSubmitting}
                                        type="submit"
                                        color="primary"
                                    >
                                        {isSubmitting && <CSpinner size="sm" />}
                                        Save
                                    </CButton>
                                </Form>
                            )}
                        </Formik>
                    </CRow>
                </CRow>
                {/* <CButton
                    color='primary'
                    disabled={loading}
                    onClick={(e) => handleSubmit(e)} >
                    {loading ? (
                        <>
                            <CSpinner size="sm" /> Submit
                        </>
                    ) : 'Submit'}
                </CButton> */}
            </CContainer>
        </div>
    )
}

export default AddMemberUser;
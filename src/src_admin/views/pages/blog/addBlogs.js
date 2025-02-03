
import React from "react";
import {
  CCard,
  CCardBody,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CButton,
  CRow,
  CCol,
} from "@coreui/react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

const AddBlog = () => {
  // Validation Schema
  const blogSchema = Yup.object().shape({
    title: Yup.string().required("Blog title is required"),
    blogImage: Yup.mixed().required("Blog image is required"),
    category: Yup.string().required("Category is required"),
    tags: Yup.string().required("Tags are required"),
    author: Yup.string().required("Author name is required"),
    publishDate: Yup.date().required("Publish date is required"),
    content: Yup.string().required("Blog content is required"),
    metaTitle: Yup.string().required("Meta title is required"),
    metaDescription: Yup.string().max(160, "Meta description must not exceed 160 characters"),
    metaKeywords: Yup.string().required("Meta keywords are required"),
    canonicalUrl: Yup.string().url("Enter a valid URL"),
  });

  const initialValues = {
    title: "",
    blogImage: null,
    category: "",
    tags: "",
    commentEnabled: false,
    author: "",
    publishDate: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
  };

  const handleSubmit = (values) => {
    console.log("Blog Submitted:", values);
    // Perform API call to save the blog
  };

  return (
    <CCard>
      <CCardBody>
        <Formik
          initialValues={initialValues}
          validationSchema={blogSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              {/* Blog Details Section */}
              <h4>Blog Details</h4>
              <CRow className="mt-4">
                <CCol md="12">
                  <CFormLabel>Blog Title</CFormLabel>
                  <Field
                    name="title"
                    as={CFormInput}
                    placeholder="Enter the blog title"
                  />
                  <ErrorMessage name="title" component="div" className="text-danger" />
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol md="12">
                  <CFormLabel>Blog Image</CFormLabel>
                  <CFormInput
                    type="file"
                    onChange={(event) =>
                      setFieldValue("blogImage", event.currentTarget.files[0])
                    }
                  />
                  <ErrorMessage name="blogImage" component="div" className="text-danger" />
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol md="6">
                  <CFormLabel>Category</CFormLabel>
                  <Field
                    name="category"
                    as={CFormSelect}
                    placeholder="Select category"
                  >
                    <option value="">Select a category</option>
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-danger" />
                </CCol>
                <CCol md="6">
                  <CFormLabel>Tags</CFormLabel>
                  <Field
                    name="tags"
                    as={CFormInput}
                    placeholder="Enter tags (comma-separated)"
                  />
                  <ErrorMessage name="tags" component="div" className="text-danger" />
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol md="6">
                  <CFormLabel>Author</CFormLabel>
                  <Field
                    name="author"
                    as={CFormInput}
                    placeholder="Enter the author's name"
                  />
                  <ErrorMessage name="author" component="div" className="text-danger" />
                </CCol>
                <CCol md="6">
                  <CFormLabel>Publish Date</CFormLabel>
                  <Field
                    name="publishDate"
                    type="date"
                    as={CFormInput}
                  />
                  <ErrorMessage name="publishDate" component="div" className="text-danger" />
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol md="12">
                  <CFormLabel>Blog Content</CFormLabel>
                  <CFormTextarea />
                  {/* <ReactQuill
                    theme="snow"
                    onChange={(content) => setFieldValue("content", content)}
                    placeholder="Write the blog content..."
                  /> */}
                  <ErrorMessage name="content" component="div" className="text-danger" />
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol md="12">
                  <CFormCheck
                    id="commentEnabled"
                    label="Enable Comments"
                    checked={values.commentEnabled}
                    onChange={() =>
                      setFieldValue("commentEnabled", !values.commentEnabled)
                    }
                  />
                </CCol>
              </CRow>

              {/* SEO Section */}
              <h4 className="mt-5">SEO Details</h4>
              <CRow className="mt-4">
                <CCol md="12">
                  <CFormLabel>Meta Title</CFormLabel>
                  <Field
                    name="metaTitle"
                    as={CFormInput}
                    placeholder="Enter the meta title"
                  />
                  <ErrorMessage name="metaTitle" component="div" className="text-danger" />
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol md="12">
                  <CFormLabel>Meta Description</CFormLabel>
                  <Field
                    name="metaDescription"
                    as={CFormTextarea}
                    rows={4}
                    placeholder="Write the meta description (max 160 characters)"
                  />
                  <ErrorMessage name="metaDescription" component="div" className="text-danger" />
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol md="12">
                  <CFormLabel>Meta Keywords</CFormLabel>
                  <Field
                    name="metaKeywords"
                    as={CFormInput}
                    placeholder="Enter meta keywords (comma-separated)"
                  />
                  <ErrorMessage name="metaKeywords" component="div" className="text-danger" />
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol md="12">
                  <CFormLabel>Canonical URL</CFormLabel>
                  <Field
                    name="canonicalUrl"
                    as={CFormInput}
                    placeholder="Enter canonical URL"
                  />
                  <ErrorMessage name="canonicalUrl" component="div" className="text-danger" />
                </CCol>
              </CRow>

              {/* Submit Button */}
              <div className="mt-4 d-flex justify-content-end">
                <CButton type="submit" color="primary">
                  Submit Blog
                </CButton>
              </div>
            </Form>
          )}
        </Formik>
      </CCardBody>
    </CCard>
  );
};

export default AddBlog;

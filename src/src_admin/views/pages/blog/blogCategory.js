
import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormText,
  CInputGroup,
  CInputGroupText,
  CFormCheck
} from "@coreui/react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const BlogCategory = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Technology", parent: "None" },
    { id: 2, name: "Health", parent: "None" },
    { id: 3, name: "Lifestyle", parent: "None" },
    // Sample categories
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  // Validation Schema for category form
  const categorySchema = Yup.object().shape({
    catName: Yup.string().required("Category name is required"),
    catImage: Yup.mixed().required("Category image is required"),
  });

  const handleAddCategory = (values) => {
    // Here you can send values to the API to save a new category
    const newCategory = {
      id: categories.length + 1, 
      name: values.catName,
      parent: values.parentCat,
    };
    setCategories([...categories, newCategory]);
    // Clear the form after adding the category
  };

  return (
    <CRow>
      {/* Left Side: Add New Category */}
      <CCol md="6">
        <CCard>
          <CCardBody>
            <h5>Add New Category</h5>
            <Formik
              initialValues={{ catName: "", catImage: null, parentCat: "" }}
              validationSchema={categorySchema}
              onSubmit={handleAddCategory}
            >
              {({ setFieldValue }) => (
                <Form>
                  <CRow className="mt-3">
                    <CCol md="12">
                      <CFormLabel>Category Name</CFormLabel>
                      <Field
                        name="catName"
                        as={CFormInput}
                        placeholder="Enter category name"
                      />
                      <ErrorMessage name="catName" component="div" className="text-danger" />
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol md="12">
                      <CFormLabel>Category Image</CFormLabel>
                      <CFormInput
                        id="catImage"
                        type="file"
                        label="Upload Category Image"
                        onChange={(event) => setFieldValue("catImage", event.currentTarget.files[0])}
                      />
                      <ErrorMessage name="catImage" component="div" className="text-danger" />
                    </CCol>
                  </CRow>
                  <CRow className="mt-3">
                    <CCol md="12">
                      <CFormLabel>Parent Category</CFormLabel>
                      <Field
                        name="parentCat"
                        as={CFormSelect}
                        placeholder="Select Parent Category"
                      >
                        <option value="">None</option>
                        <option value="Technology">Technology</option>
                        <option value="Health">Health</option>
                        <option value="Lifestyle">Lifestyle</option>
                      </Field>
                    </CCol>
                  </CRow>
                  <div className="mt-3">
                    <CButton type="submit" color="primary">
                      Add Category
                    </CButton>
                  </div>
                </Form>
              )}
            </Formik>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Right Side: Categories Table with Search */}
      <CCol md="6">
        <CCard>
          <CCardBody>
            <h5>Category List</h5>

            {/* Search Bar */}
            <CInputGroup className="mb-3">
              <CInputGroupText>Search</CInputGroupText>
              <CFormInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories"
              />
            </CInputGroup>

            {/* Categories Table */}
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Category Name</CTableHeaderCell>
                  <CTableHeaderCell>Parent Category</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {categories
                  .filter((category) =>
                    category.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((category) => (
                    <CTableRow key={category.id}>
                      <CTableDataCell>{category.name}</CTableDataCell>
                      <CTableDataCell>{category.parent}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="danger" size="sm" onClick={() => alert('Delete category')}>
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default BlogCategory;

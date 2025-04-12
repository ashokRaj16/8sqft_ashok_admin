import React, { useState } from "react";
import { CRow, CCol, CFormLabel, CFormText, CFormInput, CListGroup, CListGroupItem } from "@coreui/react";
import { Field, ErrorMessage, useFormikContext } from "formik";

const SearchSelect = ({ label, labelWidth = "col-sm-3", name, options, searchTerm, setSearchTerm, placeholder, className }) => {

  const { setFieldValue, values } = useFormikContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSelect = (value, label) => {
    setFieldValue(name, value);
    setSearchTerm(label);
    setIsDropdownOpen(false);
  };

  return (
    <CRow className="mb-3 position-relative">
      <CFormLabel htmlFor={name} 
        className={`${labelWidth} col-form-label`}>
        {label} :
      </CFormLabel>
      <CCol sm={10} md={6} lg={6}>
        <CFormInput
          type="text"
          name={name}
          id={name}
          autoComplete="off"
          placeholder={placeholder}
          value={searchTerm}
          className={`form-control ${className}`}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200) }
        />
        
        {isDropdownOpen && options.length > 0 && (
          <CListGroup 
            className="position-absolute w-100 shadow bg-white" 
            style={{ zIndex: 10, maxHeight: "200px", overflowY: "auto" }} >
            {options.map(option => (
              <CListGroupItem
                key={option.value}
                style={{ cursor: "pointer" }}
                action
                onClick={() => handleSelect(option.value, option.label)}
              >
                {option.label}
              </CListGroupItem>
            ))}
          </CListGroup>
        )}

        <ErrorMessage name={name} component={CFormText} className="text-danger" />
      </CCol>
    </CRow>
  );
};

export default SearchSelect;

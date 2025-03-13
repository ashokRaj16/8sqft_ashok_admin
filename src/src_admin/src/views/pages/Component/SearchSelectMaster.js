import React, { useState } from "react";
import { CRow, CCol, CFormLabel, CFormText, CFormInput, CListGroup, CListGroupItem } from "@coreui/react";
import { Field, ErrorMessage, useFormikContext } from "formik";

const SearchSelectMaster = ({ 
    label, 
    labelWidth = "col-sm-3", 
    fieldWidth = "300px", 
    name, 
    options, 
    searchTerm, 
    setSearchTerm,
    selectedValue, 
    setSelectedValue, 
    placeholder, 
    className }) => {

  // const [searchTerm, setSearchTerm] = useState(selectedValue || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (value, label) => {
    setSelectedValue(value);
    setSearchTerm(label);
    setIsDropdownOpen(false);
  };

  return (
    <CRow className="">
      {label && 
      <CFormLabel htmlFor={name} 
        className={`${labelWidth} col-form-label`}>
        { label }
      </CFormLabel>
      }
      <CCol sm={10} md={12} lg={12}>
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
          width={{ fieldWidth }}
        />
        
        {isDropdownOpen && options.length > 0 && (
          <CListGroup 
            className={`position-absolute shadow bg-white `}
            style={{ zIndex: 10, maxHeight: "200px", overflowY: "auto", fieldWidth }} >
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

      </CCol>
    </CRow>
  );
};

export default SearchSelectMaster;

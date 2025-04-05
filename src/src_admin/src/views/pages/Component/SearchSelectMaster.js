import React, { useEffect, useRef, useState } from "react";
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
    setSelectedValue = () => {}, 
    placeholder, 
    className }) => {

  const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
  const [ highlightedIndex, setHighlightedIndex ] = useState(-1);
  const highlightedIndexRef = useRef(-1);
  const listRef = useRef(null);
  const itemRefs = useRef([]);

  const handleSelect = (option) => {
    setSelectedValue(option);
    setSearchTerm(option.label);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1); 
    highlightedIndexRef.current = -1;
  };


  useEffect(() => {
    const handleKeyNavigation = (event) => {
      if (!isDropdownOpen || options.length === 0) return;
      if (!isDropdownOpen) {
        itemRefs.current = []; // ✅ Reset refs when dropdown closes
      }
    
      setHighlightedIndex((prevIndex) => {
        let newIndex = prevIndex;
        if (event.key === "ArrowDown") {
          newIndex = prevIndex < options.length - 1 ? prevIndex + 1 : 0;
        } else if (event.key === "ArrowUp") {
          newIndex = prevIndex > 0 ? prevIndex - 1 : options.length - 1;
        } else if (event.key === "Enter" && prevIndex !== -1) {
          handleSelect(options[prevIndex]);
          return prevIndex;
        }
  
        highlightedIndexRef.current = newIndex;

        // if (itemRefs.current[newIndex]) {
        //   itemRefs.current[newIndex].scrollIntoView({
        //     behavior: "smooth",
        //     block: "nearest",
        //   });
        // }

        return newIndex;
      });
    };



    window.addEventListener('keydown', handleKeyNavigation );
    
    return () => {
      window.removeEventListener('keydown', handleKeyNavigation );
    }
  },[ isDropdownOpen, options.length])


  useEffect(() => {
    console.log("highlightt", itemRefs.current, highlightedIndex); // ✅ Now properly populated
    if (highlightedIndex !== -1 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);


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
            setHighlightedIndex(-1);
            highlightedIndexRef.current = -1;
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200) }
          width={{ width : fieldWidth }}
        />
        
        {isDropdownOpen && options.length > 0 && (
          <CListGroup 
            ref={listRef}
            className={`position-absolute shadow bg-white `}
            style={{ zIndex: 10, maxHeight: "200px", overflowY: "auto", width: fieldWidth }} 
            >
            {options.map((option, index) => (
              <CListGroupItem
                key={option.value}
                ref={
                  console.log('reeeefff')
                }
                action
                itemRef={(el) => {
                  console.log(el,"elellle")
                  if (!itemRefs.current) itemRefs.current = []; // ✅ Ensure it's an array
                  if (el) itemRefs.current[index] = el; // ✅ Store ref correctly
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleSelect(option)}
                style={{
                  cursor: "pointer",
                  backgroundColor: index === highlightedIndex ? "#e0dee0" : "transparent",
                }}
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

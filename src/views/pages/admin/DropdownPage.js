import { CCol, CFormLabel, CFormSelect  } from "@coreui/react";


/**
 * 
 * @param {*} optionObject [ 10, 20, 30, 40]
 * @param {*} itemsPerPage : 10
 * @param {*} handleItemsPerPageChange : () => {} Function to handle page change value
 * @returns 
 */

const DropdownPage = ( { 
    itemsPerPage = 2, 
    optionObject = [2, 5, 25, 50], 
    setCurrentPage, 
    setItemsPerPage,
    ...rest
     }, 
     
     ) => {

    console.log("Dropown props: ", rest)

    const handleItemsPerPageChange = async (event) => {
        // console.log(event.target)
        setItemsPerPage(() => parseInt(event.target.value));
        setCurrentPage(1);
    };

    // const { itemsPerPage = 10 } = props;
    return (
        <>
            <CCol md="6" className="d-flex align-items-center justify-content-end">
            <CFormLabel { ...rest } >
                Per Page: 
            </CFormLabel>
          <CFormSelect
            value={itemsPerPage}
            onChange={(e) => rest.handleItemsPerPageChange ? rest.handleItemsPerPageChange(e) : handleItemsPerPageChange(e)}
            style={{ width: 'auto' }}
          > 
            {
                optionObject.map((item, index) => (
                    <option value={item}>{item}</option>
                ))
            }
          </CFormSelect>
        </CCol>
        </>
    )
}


export default DropdownPage;
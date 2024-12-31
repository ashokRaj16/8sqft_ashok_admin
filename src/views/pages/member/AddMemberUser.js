import { CButton, CCol, CContainer, CFormInput, CRow, CSpinner } from "@coreui/react";
import { useState } from "react";
import Loader from "./Loader";

const AddMemberUser = (props) => {
    const [loading, setLoading] = useState(false)
 
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
                    <CCol>
                        <CFormInput placeholder="Name" type="text" />

                    </CCol>
                </CRow>
                <CButton 
                    color='primary' 
                    disabled={loading}
                    onClick={(e) => handleSubmit(e)} >
                   { loading ? (
                        <> 
                            <CSpinner size="sm" /> Submit
                        </> 
                    ) : 'Submit'} 
                </CButton>
            </CContainer>
        </div>
    )
}

export default AddMemberUser;

import CIcon from "@coreui/icons-react";
import { 
    CTable, 
    CTableHead, 
    CTableRow, 
    CTableBody,
    CTableHeaderCell, 
    CTableDataCell,
    CCard, CCardHeader, CCardBody, CCardFooter,
    CButton,
    CCol
} from "@coreui/react";
import { useNavigate } from "react-router-dom";

import { cilBell, cilDelete, cilEyedropper, cilPencil, cilScrubber, cilTrash } from '@coreui/icons'

const ListMemberUser = (props) => {

    const navigate = useNavigate();

    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                <strong>Member Users</strong>
                <CCol className="d-flex justify-content-end">
                
                    <CButton
                    onClick={() => navigate('/member/add')} 
                    color='primary'>Add New</CButton>
                </CCol>
                <CCol className="d-flex justify-content-end">
                
                    <CButton
                    onClick={() => navigate('/member/add')} 
                    color='primary'>Add New</CButton>
                </CCol>
                {/* <h1>Member Users</h1> */}
                </CCardHeader>
                <CCardBody>
                    <CTable striped hover>
                    <CTableHead>
                        <CTableRow>
                        <CTableHeaderCell scope="col">Sr</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Mobile</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        <CTableRow>
                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                        <CTableDataCell>Mark</CTableDataCell>
                        <CTableDataCell>Otto</CTableDataCell>
                        <CTableDataCell>@mdo</CTableDataCell>
                        <CTableDataCell>
                            <CButton color="primary" className="me-2 mb-1" size="sm"><CIcon icon={cilScrubber} className="" /></CButton>
                            <CButton color="primary" className="me-2 mb-1" size="sm"><CIcon icon={cilPencil} className="" /></CButton>
                            <CButton color="danger" className="me-2 mb-1" size="sm"><CIcon icon={cilTrash} style={{'--ci-primary-color': 'white'}} /></CButton>
                        </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                        <CTableHeaderCell scope="row">2</CTableHeaderCell>
                        <CTableDataCell>Jacob</CTableDataCell>
                        <CTableDataCell>Thornton</CTableDataCell>
                        <CTableDataCell>@fat</CTableDataCell>
                        <CTableDataCell>
                            <CButton color="primary" className="me-2 mb-1" size="sm"><CIcon icon={cilScrubber} className="" /></CButton>
                            <CButton color="primary" className="me-2 mb-1" size="sm"><CIcon icon={cilPencil} className="" /></CButton>
                            <CButton color="danger" className="me-2 mb-1" size="sm"><CIcon icon={cilTrash} style={{'--ci-primary-color': 'white'}} /></CButton>
                        </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                        <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                        <CTableDataCell>@twitter</CTableDataCell>
                        <CTableDataCell>
                            <CButton color="primary" className="me-2 mb-1" size="sm"><CIcon icon={cilScrubber} className="" /></CButton>
                            <CButton color="primary" className="me-2 mb-1" size="sm"><CIcon icon={cilPencil} className="" /></CButton>
                            <CButton color="danger" className="me-2 mb-1" size="sm"><CIcon icon={cilTrash} style={{'--ci-primary-color': 'white'}} /></CButton>
                        </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                    </CTable>    
                </CCardBody>
            </CCard>
            
        </>
    )
}

export default ListMemberUser;
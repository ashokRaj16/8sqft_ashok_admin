
import CIcon from "@coreui/icons-react";
import { 
    CTable, 
    CTableHead, 
    CTableRow, 
    CTableBody,
    CTableHeaderCell, 
    CTableDataCell,
    CCard, CCardHeader, CCardBody, CCardFooter,
    CButton
} from "@coreui/react";

import { cilBell, cilDelete, cilEyedropper, cilPencil, cilScrubber, cilTrash } from '@coreui/icons'

const ListMemberUser = (props) => {
    return (
        <>
            <CCard className="mb-4">
                <CCardHeader>
                <strong>Member Users</strong>
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
                            <CButton color="primary" className="me-2 mb-1"><CIcon icon={cilScrubber} className="" /></CButton>
                            <CButton color="primary" className="me-2 mb-1"><CIcon icon={cilPencil} className="" /></CButton>
                            <CButton color="danger" className="me-2 mb-1"><CIcon icon={cilTrash} style={{'--ci-primary-color': 'white'}} /></CButton>
                        </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                        <CTableHeaderCell scope="row">2</CTableHeaderCell>
                        <CTableDataCell>Jacob</CTableDataCell>
                        <CTableDataCell>Thornton</CTableDataCell>
                        <CTableDataCell>@fat</CTableDataCell>
                        <CTableDataCell>
                            <CButton color="primary" className="me-2 mb-1"><CIcon icon={cilScrubber} className="" /></CButton>
                            <CButton color="primary" className="me-2 mb-1"><CIcon icon={cilPencil} className="" /></CButton>
                            <CButton color="danger" className="me-2 mb-1"><CIcon icon={cilTrash} style={{'--ci-primary-color': 'white'}} /></CButton>
                        </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                        <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                        <CTableDataCell>@twitter</CTableDataCell>
                        <CTableDataCell>
                            <CButton color="primary" className="me-2 mb-1"><CIcon icon={cilScrubber} className="" /></CButton>
                            <CButton color="primary" className="me-2 mb-1"><CIcon icon={cilPencil} className="" /></CButton>
                            <CButton color="danger" className="me-2 mb-1"><CIcon icon={cilTrash} style={{'--ci-primary-color': 'white'}} /></CButton>
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
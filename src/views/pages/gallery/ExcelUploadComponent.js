import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import { useState } from "react";
import { FaPencil } from "react-icons/fa6";

import { FaGripVertical } from "react-icons/fa";
import { CSS } from '@dnd-kit/utilities'

import Loader from '../member/Loader'

const itemList = [
    { id: 1, name: 'Ashok Raj', address: 'Nashik', role: 'Admin', sequence_no: 1 },
    { id: 2, name: 'Mr. Y', address: 'Nashik', role: 'Admin', sequence_no: 2 },
    { id: 3, name: 'Mr. X', address: 'Nagar', role: 'Editor', sequence_no: 3 },
    { id: 4, name: 'Sham Dev', address: 'Delhi', role: 'Sub Admin', sequence_no: 4 },
    { id: 5, name: 'Mahesh', address: 'Pune', role: 'Sale Person', sequence_no: 5 },
    { id: 6, name: 'CHetan Bhagat', address: 'Delhi', role: 'Editor', sequence_no: 6 },
    { id: 7, name: 'John Doe', address: 'Pune', role: 'Market Head', sequence_no: 7 },

    { id: 8, name: 'Ashok Raj 0', address: 'Nashik', role: 'Admin', sequence_no: 3 },
    { id: 9, name: 'Mr. Y', address: 'Nashik', role: 'Sub Admin', sequence_no: 9 },
    { id: 10, name: 'Mr. X', address: 'Nagar', role: 'Editor', sequence_no: 10 },
    { id: 11, name: 'Sham Dev', address: 'Delhi', role: 'Sub Admin', sequence_no: 11 },
    { id: 12, name: 'Mahesh', address: 'Pune', role: 'Sale Person', sequence_no: 12 },
    { id: 13, name: 'CHetan Bhagat', address: 'Delhi', role: 'Editor', sequence_no: 13 },
    { id: 14, name: 'John Doe', address: 'Pune', role: 'Market Head', sequence_no: 14 },

    { id: 15, name: 'Ashok Raj 1', address: 'Nashik', role: 'Admin', sequence_no: 4 },
    { id: 16, name: 'Mr. Y', address: 'Nashik', role: 'Sub Admin', sequence_no: 16 },
    { id: 17, name: 'Mr. X', address: 'Nagar', role: 'Editor', sequence_no: 17 },
    { id: 18, name: 'Sham Dev', address: 'Delhi', role: 'Sub Admin', sequence_no: 18 },
    { id: 19, name: 'Mahesh', address: 'Pune', role: 'Sale Person', sequence_no: 19 },
    { id: 20, name: 'CHetan Bhagat', address: 'Delhi', role: 'Editor', sequence_no: 20 },
    { id: 21, name: 'John Doe', address: 'Pune', role: 'Market Head', sequence_no: 21 },

    { id: 22, name: 'Ashok Raj 2', address: 'Nashik', role: 'Admin', sequence_no: 5 },
    { id: 23, name: 'Mr. Y', address: 'Nashik', role: 'Sub Admin', sequence_no: 23 },
    { id: 24, name: 'Mr. X', address: 'Nagar', role: 'Editor', sequence_no: 24 },
    { id: 25, name: 'Sham Dev', address: 'Delhi', role: 'Sub Admin', sequence_no: 24 },
    { id: 26, name: 'Mahesh', address: 'Pune', role: 'Sale Person', sequence_no: 25 },
    { id: 27, name: 'CHetan Bhagat', address: 'Delhi', role: 'Editor', sequence_no: 26 },
    { id: 28, name: 'John Doe', address: 'Pune', role: 'Market Head', sequence_no: 27 },

]

const ExcelUploadComponent = ( { selectedFiles, ...rest}) => {

    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState('ADMIN')
    const [items, setItems] = useState(itemList.filter((i) => i.role.toLowerCase() === role.toLowerCase()))
    console.log("xcel log", selectedFiles);


    return (
        <div>
            {loading && <Loader />}
            <CCard className="mb-4">
                <CCardHeader>
                    <h1>Excel Records</h1>
                </CCardHeader>
                <CCardBody>
                    <div style={{ maxHeight: 300, overflow: 'auto' }} >
                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>
                                        <FaGripVertical size={16} color="gray" style={{ marginRight: 5 }} />
                                    </CTableHeaderCell>
                                    <CTableHeaderCell>Sr</CTableHeaderCell>
                                    <CTableHeaderCell>Name</CTableHeaderCell>
                                    <CTableHeaderCell>Address</CTableHeaderCell>
                                    <CTableHeaderCell>Role</CTableHeaderCell>
                                    <CTableHeaderCell>sequence</CTableHeaderCell>
                                    <CTableHeaderCell>Action</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                            {
                                items && items.map((item, index) => (
                                    <CTableRow >
                                        <CTableDataCell style={{ cursor: 'grab' }}>
                                            <FaGripVertical color="dark-grey" style={{ fontWeight: 'normal', opacity: 0.7 }} />
                                        </CTableDataCell>
                                        <CTableDataCell>{index}</CTableDataCell>
                                        <CTableDataCell>{item.name}</CTableDataCell>
                                        <CTableDataCell>{item.address}</CTableDataCell>
                                        <CTableDataCell>{item.role}</CTableDataCell>
                                        <CTableDataCell>{item.sequence_no}</CTableDataCell>
                                        <CTableDataCell><FaPencil /></CTableDataCell>
                                    </CTableRow>
                                ))
                            }
                            </CTableBody>
                        </CTable>
                    </div>
                </CCardBody>
            </CCard>
        </div>
    )
}


export default ExcelUploadComponent;
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CBadge,
    CFormCheck,
    CPagination,
    CPaginationItem,
    CFormInput,
    CRow,
    CCol,
    CFormSelect,
    CFormLabel,
    CForm,
    CToast,
    CToaster,

} from '@coreui/react';
import { createAdminUser, getAdminRoles } from '../../../models/usersModel';
import { ToastMessage } from '../../../components/ToastMessage';

const AddAdminUser = (props) => {

    const [users, setUsers] = useState({});
    const [roles, setRoles] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            email : '',
            mobile: '',
            password: '',
            role : 1
        }
        const result = createAdminUser(data)
        if(result){
            const toastContent = {
                
            }
            ToastMessage(toastContent)
        }
    }

    useEffect(() => {
        async () => {
            const roles = await getAdminRoles();
            setRoles(() => (roles));
        }
    }, []);

    return (
         <>
             <CCard className="mb-4">
                <CCardHeader className='d-flex'>
                    <strong>Add Admin</strong>
                </CCardHeader>
                <CCardBody>
                <CRow className="mb-3">
                <CFormLabel htmlFor="staticEmail2" className="col-sm-2 col-form-label">
                Email
                </CFormLabel>
                <CCol sm={10} md={6} lg={4}>
                <CFormInput
                    type="text"
                    id="staticEmail2"
                    placeholder="email@example.com"
                />
                </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="inputPassword2" className="col-sm-2 col-form-label">
                    Password:
                    </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                        <CFormInput type="password" id="inputPassword2" />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="inputPassword2" className="col-sm-2 col-form-label">
                    Confirm Password:
                    </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                        <CFormInput type="password" id="inputPassword2" />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="inputPassword2" className="col-sm-2 col-form-label">
                    Mobile:
                    </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                        <CFormInput type="password" id="inputPassword2" />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="inputPassword2" className="col-sm-2 col-form-label">
                    Adhaar:
                    </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                        <CFormInput type="password" id="inputPassword2" />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="inputPassword2" className="col-sm-2 col-form-label">
                    Pan No:
                    </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                        <CFormInput type="password" id="inputPassword2" />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CFormLabel htmlFor="roles" className="col-sm-2 col-form-label">
                    Role:
                    </CFormLabel>
                    <CCol sm={10} md={6} lg={4}>
                        <CFormSelect id="roles"  >
                            <option value={-1}>Select Role</option>
                            { roles.length > 0 && roles.map((role) => (
                                <option value={role?.id}>{ role?.name }</option>
                            ))}
                        </CFormSelect>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol sm={12} md={12} lg={6}>
                    <CButton style={{ width: '100%'}}
                        color='primary'
                        onClick={(e) => handleSubmit(e)}> Submit </CButton>
                    </CCol>
                </CRow>

                </CCardBody>
            </CCard>
        </>
    )
}

export default AddAdminUser;
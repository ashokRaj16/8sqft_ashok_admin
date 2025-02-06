import React from 'react'
import { CToast, CToastBody, CToastHeader, CToaster } from '@coreui/react'
import { FaBan, FaCheck, FaCircleNotch, FaStop, FaTicketAlt } from 'react-icons/fa';
import { CiCircleCheck, CiWarning } from 'react-icons/ci'


export const ToastMessage = (props) => {
  const { title, message, type, onClose} = props;
  // console.log("Props: ",props);
  return (
    <CToaster className="position-static mb-1">
      <CToast autohide={true} visible={true}>
        <CToastHeader style={{backgroundColor: (type === "success") ? 'green': 'red', color: 'white'}} closeButton>
          <svg
            className="rounded me-2"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            role="img"
          >
            { (type == "success") ? <CiCircleCheck color='white' /> : 
            (type == "error") ? <FaBan color='white' /> : 
            (type == "warning") ? <CiWarning color='white' /> : 
            <CiWarning color='white' /> }
          </svg>
          <div className="fw-bold me-auto" style={{ color: 'white'}} color={ 'white'}>{ 
              title ? title : type === "success" ? 'Success' : 'Warning'
            }</div>
          {/* <small>7 min ago</small> */}
        </CToastHeader>
        <CToastBody>{message ? message : 'Toast message.'}</CToastBody>
      </CToast>
    </CToaster>
  )
}

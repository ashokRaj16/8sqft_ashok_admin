// import React from 'react'
// import { CToast, CToastBody, CToastHeader, CToaster } from '@coreui/react'
// import { FaBan, FaCheck, FaCircleNotch, FaStop, FaTicketAlt } from 'react-icons/fa';
// import { CiCircleCheck, CiWarning } from 'react-icons/ci'


// export const ToastMessage = (props) => {
//   const { title, message, type, onClose} = props;
//   // console.log("Props: ",message);
//   return (
//     <CToast autohide={true} visible={true}>
//     <CToastHeader style={{ backgroundColor: type === "success" ? "green" : "red", color: "white" }} closeButton>
//       {type === "success" ? <CiCircleCheck color="white" size={20} /> :
//        type === "error" ? <FaBan color="white" size={20} /> :
//        <CiWarning color="white" size={20} />}
      
//       <div className="fw-bold me-auto" style={{ color: "white" }}>
//         {title || (type === "success" ? "Success" : "Warning")}
//       </div>
//     </CToastHeader>
//     <CToastBody>{message || "Toast message."}</CToastBody>
//   </CToast>
//     // <CToaster className="position-static mb-1">
//       // <CToast autohide={true} visible={true}>
//       //   <CToastHeader style={{backgroundColor: (type === "success") ? 'green': 'red', color: 'white'}} closeButton>
//       //       <svg
//       //         className="rounded me-2"
//       //         width="20"
//       //         height="20"
//       //         xmlns="http://www.w3.org/2000/svg"
//       //         preserveAspectRatio="xMidYMid slice"
//       //         focusable="false"
//       //         role="img"
//       //       >
//       //       { 
//       //         (type == "success") ? <CiCircleCheck color='white' /> : 
//       //         (type == "error") ? <FaBan color='white' /> : 
//       //         (type == "warning") ? <CiWarning color='white' /> : 
//       //         <CiWarning color='white' /> 
//       //       }
//       //       </svg>
//       //       <div className="fw-bold me-auto" style={{ color: 'white'}} color={ 'white'}>{ 
//       //           title ? title : type === "success" ? 'Success' : 'Warning'
//       //         }
//       //       </div>
//       //   </CToastHeader>
//       //   <CToastBody>
//       //     {message ? message : 'Toast message.'}
//       //   </CToastBody>
//       // </CToast>
//     // </CToaster>
//   )
// }


import React, { useState } from "react";
import { CToast, CToastBody, CToastHeader } from "@coreui/react";
import { FaBan } from "react-icons/fa";
import { CiCircleCheck, CiWarning } from "react-icons/ci";

export const ToastMessage = ({ title, message, type }) => {
  const [visible, setVisible] = useState(true);

  return (
    <CToast autohide={true} visible={visible} onClose={() => setVisible(false)}>
    
      {/* <CToastHeader 
      
        style={{ 
            backgroundColor: type === "success" ? "#198754" :
            type === "error" ? "#dc3545" : '#ffc107', 
            color: "white" }} closeButton>
        {type === "success" ? <CiCircleCheck color="white" size={20} /> :
         type === "error" ? <FaBan color="white" size={20} /> :
         <CiWarning color="white" size={20} />}
        
        <div className="fw-bold me-auto" style={{ color: "white" }}>
          {title || (type === "success" ? "Success" : "Warning")}
        </div>
        <button 
        type="button"
        className="btn-close"
        style={{ filter: "invert(1)", opacity: 1 }} // Ensures it's white
        data-coreui-dismiss="toast"
      ></button>
      </CToastHeader> */}

      <CToastHeader
        style={{
          backgroundColor:
            type === "success" ? "#198754" :
            type === "error" ? "#dc3545" : "#ffc107",
          color: "white"
        }}
      >
        {type === "success" ? <CiCircleCheck color="white" size={20} /> :
        type === "error" ? <FaBan color="white" size={20} /> :
        <CiWarning color="white" size={20} />}

        <div className="fw-bold me-auto" style={{ color: "white" }}>
          {title || (type === "success" ? "Success" : "Warning")}
        </div>

        <button 
          type="button"
          className="btn-close"
          style={{ filter: "invert(1)", opacity: 1 }}
          onClick={() => setVisible(false)}
          data-coreui-dismiss="toast"
        ></button>
      </CToastHeader>

      <CToastBody>{message || "Toast message."}</CToastBody>
    </CToast>
  );
};

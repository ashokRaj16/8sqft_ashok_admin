
import { CToast, CToastBody, CToastHeader } from "@coreui/react";
import { FaBan } from "react-icons/fa";
import { CiCircleCheck, CiWarning } from "react-icons/ci";

export const ToastMessage = ({ title, message, type }) => {
  const [visible, setVisible] = useState(true);

  return (
    <CToast autohide={true} visible={visible} onClose={() => setVisible(false)}>
   
      <CToastHeader
        style={{
          backgroundColor:
            type === "success" ? "#198754" :
            type === "error" ? "#dc3545" : "#ffc107",
          color: "white"
        }}
      >
        { 
          type === "success" ? <CiCircleCheck color="white" size={20} /> :
          type === "error" ? <FaBan color="white" size={20} /> :
          <CiWarning color="white" size={20} />
        }

        <div 
          className="fw-bold me-auto ms-2" 
          style={{ color: "white" }}>

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
}
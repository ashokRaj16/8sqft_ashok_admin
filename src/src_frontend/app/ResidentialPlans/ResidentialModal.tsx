import React from "react";

type ModalProps = {
  isOpen: boolean;
  price: string;
  onConfirm: (val:number) => void;
  onCancel: () => void;

};

const Modal: React.FC<ModalProps> = ({ isOpen, price, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const priceMatch = price.match(/₹([\d,]+)/);
  const priceValue = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, "")) : 0;
  const gst = priceValue * 0.18;
 
  const total = priceValue + gst;

const submitHandler=() => {
  // setTotalAmount( ()=> (total));
  onConfirm(total);   

}



  return (
    // <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    //   <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
    //     <h2 className="text-xl font-bold mb-4">Plan Details</h2>
    //     <div className="mb-4">
    //       <p>Plan Price: ₹{priceValue.toFixed(2)}</p>
       
    //       <p>GST(18%): ₹{gst.toFixed(2)}</p>
    //       <p>Total Amt(incl. GST): ₹{total.toFixed(2)}</p>
    //     </div>
    //     <div className="flex justify-end space-x-2">
    //       <button
    //         className="bg-gray px-4 py-2 rounded"
    //         onClick={onCancel}
    //       >
    //         Cancel
    //       </button>
    //       <button
    //         className="bg-primary text-white px-4 py-2 rounded"
    //         onClick={
    //            submitHandler

    //           }
    //       >
    //         Confirm
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
  <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
    <h2 className="text-xl font-bold mb-4 text-center">Confirm your payment details</h2>
    <div className="mb-4 space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Date</span>
        <span className="text-gray-800 font-medium">10-01-2025</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Plan Amount</span>
        <span className="text-gray-800 font-medium">₹{priceValue.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">GST (18%)</span>
        <span className="text-gray-800 font-medium">₹{gst.toFixed(2)}</span>
      </div>
      <div className="flex justify-between border-t pt-2">
        <span className="text-gray-900 font-bold">Total amount</span>
        <span className="text-gray-900 font-bold">₹{total.toFixed(2)}</span>
      </div>
    </div>
    <div className="flex justify-around m-[80px]  mt-4">
      <button
        className="bg-gray px-4 py-2 rounded"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        className="bg-primary text-white px-4 py-2 rounded ml-8px"
        onClick={submitHandler}
      >
        Confirm
      </button>
    </div>
  </div>
</div>

  );
};

export default Modal;

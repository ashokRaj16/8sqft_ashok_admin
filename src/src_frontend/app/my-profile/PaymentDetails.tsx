import React from "react";
import { IoClose } from "react-icons/io5";
import { useMediaQuery } from "usehooks-ts";

interface PaymentData1 {
  user_id: number;
  plan_id: number;
  order_id: string;
  order_amount: string;
  payment_status: string;
  created_at: string;
  id: number;
  plan_title: string;
  property_category: string;
  user_type: string;
  plan_rent_sale: string | null;
  plan_names: string;
  duration_days: number;
  leads_counts: number;
  contact_whatsapp_notification: string;
  promotion_on_web: string;
  promotion_on_meta: string;
  paid_promotion_on_sqft: string;
  paid_video_promotion: string;
  ind_sponsored_ads: string;
  agreement: string;
  assign_rm: string;
  plan_amount: number;
  plan_discounted_amount: number;
  plan_gst_per: number;
  plan_status: string;
  note: string | null;
  description: string | null;
  plan_guarentee: string;
  publish_date: string | null;
  plan_type: string | null;
  project_list_count: number | null;
  plan_validity: string | null;
  engagement: string | null;
  view_count: number | null;
  whatsapp_count: number | null;
  plan_category: string;
  updated_at: string;
  plan: string;
  amount: number;
  totalCounts: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  date: string;
}
interface PaymentDetailsProps {
  payment: PaymentData1 | null;
  onClose: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ payment, onClose }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  if (!payment) return null;

  return (
    <>
      {isMobile ? (<>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md pb-4">
          {/* Header */}
          <div className="bg-gray-100 p-4 relative border-b">
            <h2 className="text-lg font-semibold text-center">Payment details</h2>
            <button className="absolute right-4 top-4" onClick={onClose}>
              <IoClose size={24} />
            </button>
          </div>

          {/* Order ID */}
          <p className="mt-3 font-semibold ml-4">Invoice ID: <span className="font-bold">{payment.order_id}</span></p>

          {/* Payment Table */}
          <div className="border rounded-lg mt-4 p-4 mx-4 bg-gray-50">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Payment ID</span>
              <span>{payment.id}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Plan Name</span>
              <span>{payment.plan}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Plan Amount</span>
              <span>₹{payment.amount}</span>
            </div>
          </div>

          {/* Payment Summary */}
          <h3 className="font-semibold mt-6 p-2 mx-4">Payment Summary</h3>
          <div className="border rounded-lg mt-2 p-4 mx-4 bg-gray-50">
            <p className="flex justify-between"><span>Subtotal</span> <span>₹{payment.amount}</span></p>
            <p className="flex justify-between"><span>Taxes & Fees</span> <span>₹0</span></p>
            <p className="flex justify-between font-bold text-lg"><span>Total</span> <span>₹{payment.amount}</span></p>
          </div>

          {/* Download Invoice Button */}
          <div className="mt-4 text-center">
            <button className="px-4 py-2 bg-orange-500 text-white rounded-md w-11/12">
              Download Invoice
            </button>
          </div>
        </div>
      </>) : (<>
        <div className="fixed inset-0 flex  items-center justify-center bg-black bg-opacity-50 mt-[35px]">
          <div className="bg-white rounded-lg shadow-lg  w-[55%] mt-6 pb-4">
            <div className="bg-[#F0F0F0] w-full">
              <div className="flex justify-center items-center relative border-b pb-2">
                <h2 className="text-lg font-semibold">Payment details</h2>
                <button
                  className="absolute right-2 border rounded-full border-black"
                  onClick={onClose}
                >
                  <IoClose size={20} />
                </button>
              </div>

            </div>


            <p className="mt-3 font-semibold ml-4">Order ID: <span className="font-bold">{payment.order_id}</span></p>

            {/* Payment Table */}
            <div className="border rounded-lg mt-4 p-4 m-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left whitespace-nowrap">Payment ID</th>
                    <th className="p-2 text-left whitespace-nowrap">Plan Name</th>
                    <th className="p-2 text-left whitespace-nowrap">Plan Duration</th>
                    <th className="p-2 text-left whitespace-nowrap">Plan Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">{payment.id}</td>
                    <td className="p-2">{payment.plan}</td>
                    <td className="p-2">{payment.date}</td>
                    <td className="p-2">{payment.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Summary */}
            <h3 className="font-semibold mt-[29px]  font-medium p-2 m-4" >Payment summary</h3>
            <div className="border rounded-lg mt-4 p-4 m-4 bg-[#FAFAFA]">
              <p className="flex justify-between"><span>Subtotal</span> <span>{payment.amount}</span></p>
              <p className="flex justify-between"><span>Taxes & Fees</span> <span>₹{0}</span></p>
              <p className="flex justify-between font-bold"><span>Total</span> <span>{payment.amount + 0}</span></p>
            </div>

            {/* Download Invoice Button */}
            <div className="mt-4 text-right mr-4">
              <button className="px-4 py-2 bg-orange-500 text-primary border-[1px] rounded-md">
                Download Invoice
              </button>
            </div>
          </div>
        </div></>)}
    </>

  );
};

export default PaymentDetails;

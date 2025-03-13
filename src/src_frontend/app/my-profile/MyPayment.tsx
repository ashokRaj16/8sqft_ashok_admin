import { useMediaQuery } from "usehooks-ts";
import { useEffect, useState } from "react";
import axios from "@/hooks/index";
import { useAuthStore } from "@/Store/jwtTokenStore";
import PaymentDetails from "./PaymentDetails";
import { ChevronDown } from "lucide-react";

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
interface BasicProfileProps {
    setActiveSection: (section: string) => void;
    paymentId: number[] | null;  // Accept array

}
const MyPayment: React.FC<BasicProfileProps> = ({ setActiveSection, paymentId }) => {
const isMobile = useMediaQuery("(max-width: 768px)");
    const [payments, setPayments] = useState<PaymentData1[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<PaymentData1 | null>(null);
    const token = useAuthStore((state) => state.token);
    const [propertyId, setPropertyId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 4;
    const [totalCounts, setTotalCounts] = useState(0);


    useEffect(() => {
        fetchPaymentHistory(1, true);
    }, [token]);


    useEffect(() => {
        // console.log("Received paymentId in MyPayment:", paymentId);
    }, [paymentId]);

    const fetchPaymentHistory = async (pageNumber: number, isInitial = false) => {
        try {
            const response = await axios.get(`/api/v1/front/profile/payment_history?limit=${limit}&page=${pageNumber}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "A8SQFT7767",
                    Authorization: `Bearer ${token}`,
                },
            });

            const allPayments = response.data.data.payments || [];
            const formattedPayments: PaymentData1[] = allPayments.map((payment: any) => ({
                id: payment.order_id,
                order_id: payment.order_id,
                plan: `${payment.plan_names} ${payment.plan_title}`,

                date: new Date(payment.created_at).toISOString().split("T")[0],
                amount: `₹${payment.order_amount}`,
            }));

            setPayments(formattedPayments);
        } catch (error) {
            console.error("Error fetching payment history:", error);
        }
    };


    return (
        <>
            {isMobile ? (
  <div className="w-full bg-white p-4 rounded-lg shadow-md">
  <h2 className="text-lg font-semibold border-b-2 border-black pb-3">Payment History</h2>
  {payments.length > 0 ? (
    <div className="p-1 m-4">
      {payments.map((payment, index) => (
        <div key={payment.id} className="bg-gray-100 p-3 mb-3 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold">{payment.plan}</h3>
          
          </div>
          <div className="mt-2 text-sm text-gray-700 flex flex-col">
            {/* <p><span className="font-medium">Duration:</span> {payment.duration}</p> */}
            <p><span className="font-medium">Expiration Date:</span> {payment.amount}</p>
            <p><span className="font-medium">Payment ID:</span> {paymentId?.[index] || "N/A"}</p>
            <p><span className="font-medium">Order ID:</span> {payment.order_id}</p>
            <p><span className="font-medium">Paid Amount:</span> {payment.amount}</p>



          </div>
          {selectedPayment === payment && (
            <div className="mt-2 text-sm text-gray-700">
              <p><span className="font-medium">Paid Date:</span> {payment.date}</p>
            </div>
          )}
            <button
              className="text-black font-semibold"
              onClick={() =>
                setSelectedPayment(selectedPayment === payment ? null : payment)
              }
            >
              {selectedPayment === payment ? "▲" : "▼"}
            </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500 mt-4">No payment logs found.</p>
  )}
</div>
          


            ) : (

                <div className="w-full bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold border-b-2 border-black pb-3">Payment History</h2>
                    {payments.length > 0 ? (
                        <div className="border rounded-lg p-1 m-4">
                            {payments.map((payment, index) => (
                                <div key={payment.id} className="border-b rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-100 text-left">
                                                <th className="p-3 text-gray pb-0 text-sm font-medium text-[500]">Payment ID</th>
                                                <th className="p-3 text-gray pb-0 text-sm font-medium text-[500]">Order ID</th>
                                                <th className="p-3 text-gray pb-0 text-sm font-medium text-[500]">Plan Name</th>
                                                <th className="p-3 text-gray pb-0 text-sm font-medium text-[500]">Paid Date</th>
                                                <th className="p-3 text-gray pb-0 text-sm font-medium text-[500]">Paid Amount</th>
                                                <th className="p-3 pb-0"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white">
                                                <td className="p-3 pt-0 pb-0 text-sm font-semibold text-gray-900">
                                                    {paymentId && paymentId.length > index ? paymentId[index] : "N/A"}
                                                </td>

                                                <td className="p-3 pt-0 pb-0 text-sm font-semibold text-gray-900">{payment.order_id}</td>
                                                <td className="p-3 pt-0 pb-0 text-sm font-semibold text-gray-900">{payment.plan}</td>
                                                <td className="p-3 pt-0 pb-0 text-sm font-semibold text-gray-900">{payment.date}</td>
                                                <td className="p-3 pt-0 pb-0 text-sm font-semibold text-gray-900">{payment.amount}</td>
                                                <td className="p-3 text-right">
                                                    <button
                                                        className="p-3 pb-0 text-primary font-semibold text-gray-900"
                                                        onClick={() => setSelectedPayment(payment)}
                                                    >
                                                        {">"}
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-4">No payment logs found.</p>
                    )}
                     {/* Payment Details Modal */}
            {selectedPayment && <PaymentDetails payment={selectedPayment} onClose={() => setSelectedPayment(null)} />}

                </div>
                
            )}
           
        </>
    )
}
export default MyPayment;
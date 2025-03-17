import { useEffect, useState } from "react";
import axios from "@/hooks/index";
import { useAuthStore } from "@/Store/jwtTokenStore";
import SubscriptionDetails from "./SubscriptionDetails";
import { useMediaQuery } from "usehooks-ts";

interface BasicProfileProps {
  setActiveSection: (section: string) => void;
  setPaymentId: (idList: number[]) => void; // Accepting an array of numbers
}
interface Subscription {
  id: number;
  plan_title: string;
  plan_amount: number;
  duration_days: number;
  expiration_date: string;
  order_id: string;
  razorpay_payment_id: number;
  plan_names: string;
  plan_status: string;
}
const Subscription: React.FC<BasicProfileProps> = ({ setActiveSection, setPaymentId }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      fetchSubscriptions();
    }
  }, [token]);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("/api/v1/front/profile/plan_history", {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "A8SQFT7767",
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedSubscriptions = response.data.data.payments.map((payment: any) => ({
        id: payment.id,
        plan_title: payment.plan_title,
        plan_amount: payment.plan_amount,
        duration_days: payment.duration_days,
        expiration_date: new Date(payment.plan_end_date).toISOString().split("T")[0], // Formatting date
        order_id: payment.order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        plan_names: payment.plan_names,
        plan_status: payment.plan_status === "1" ? "Active" : "Inactive",
      }));




      setSubscriptions(fetchedSubscriptions);

      const idList: number[] = fetchedSubscriptions.map((payment: Subscription) => payment.razorpay_payment_id);
      setPaymentId(idList)
     
    console.log("razor",idList)
    } catch (error) {
      // console.error("Error fetching subscriptions:", error);
    }

  };

  return (
    <>
       {isMobile?(
        <div className="w-full bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3 border-b-2 border-black pb-3 text-center">
          Subscription
        </h2>
        {subscriptions.length > 0 ? (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-center">
                <div className="space-y-2 w-full">
  <div className="flex flex-row justify-between items-center w-full">
    <h3 className="text-base font-semibold">{sub.plan_names}</h3>
    <span className={sub.plan_status === "Active" ? "text-green-600" : "text-red-600"}>
      {sub.plan_status}
    </span>
  </div>

  <div className="flex flex-row justify-between items-center w-full">
    <p className="text-sm font-medium">Duration</p>
    <p className="text-sm text-gray-500 text-right">{sub.duration_days} days</p>
  </div>

  <div className="flex flex-row justify-between items-center w-full">
    <p className="text-sm font-medium">Expires</p>
    <p className="text-sm text-gray-500 text-right">{sub.expiration_date}</p>
  </div>

  <div className="flex flex-row justify-between items-center w-full">
    <p className="text-sm font-medium">Paid Amount</p>
    <p className="text-sm text-gray-500 text-right">₹{sub.plan_amount}</p>
  </div>
</div>

               
                </div>
                <div className="mt-3 flex items-center w-full justify-between">
  <div className="flex gap-2">
    <button className="border px-2 py-1 text-primary border-orange-500 rounded-full text-sm">
      Upgrade
    </button>
    <button className="border px-2 py-1 text-primary border-orange-500 rounded-full text-sm">
      Renew now
    </button>
  </div>
  <button
    className="px-2 py-1 text-primary text-lg"
    onClick={() => setSelectedSubscription(sub)}
  >
    {">"}
  </button>
</div>

                {selectedSubscription && <SubscriptionDetails subscription={selectedSubscription} onClose={() => setSelectedSubscription(null)} />}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No active subscriptions found.</p>
        )}
      </div>
       ):(
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
    <h2 className="text-lg font-semibold mb-3 border-b-2 border-black pb-3">
      Subscription
    </h2>
    {subscriptions.length > 0 ? (
      <div className="border rounded-lg p-2 gap-2">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="border m-2 border-gray rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="text-base font-semibold">
                  {sub.plan_names} - ₹{sub.plan_amount}
                </h3>
                <p className="text-sm text-gray-500">{sub.duration_days} days</p>
                <p className="text-sm text-gray-500">
                  Plan Status:<span className={`${sub.plan_status === "1"
                    ? "text-red"
                    : "text-green"
                    } font-medium`}>{sub.plan_status}</span>
                </p>
              </div>

              <div className="flex flex-row gap-8 mt-[17px]">
                <div className="text-left">
                  <p className="text-sm text-gray-500">Expiration Date</p>
                  <p className="text-sm text-gray-500">{sub.expiration_date}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-500">Paid Amount</p>
                  <p className="text-sm text-gray-500">₹ {sub.plan_amount}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="h-[31px] mt-[31px] border px-2 text-primary border-orange-500 rounded-md text-sm">
                  Upgrade Plan
                </button>
                <button className="h-[31px] mt-[31px] border px-2 text-primary border-orange-500 rounded-md text-sm">
                  Renew now
                </button>
                <div key={sub.id} className="m-2 border-gray rounded-lg p-4">
                  <button
                    className=" px-4 py-1 text-primary  text-sm mt-[4px]"
                    onClick={() => setSelectedSubscription(sub)}
                  >
                   {">"}
                  </button>
                </div>
                {selectedSubscription && (
                  <SubscriptionDetails subscription={selectedSubscription} onClose={() => setSelectedSubscription(null)} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500 mt-4">
        No active subscriptions found.
      </p>
    )}
  </div>
   )}
    </>

   


  );
};

export default Subscription;


// import { useEffect, useState } from "react";
// import axios from "@/hooks/index";
// import { useAuthStore } from "@/Store/jwtTokenStore";
// import SubscriptionDetails from "./SubscriptionDetails";
// import Pagination from "../components/Pagination";

// interface BasicProfileProps {
//   setActiveSection: (section: string) => void;
//   setPaymentId: (idList: number[]) => void;
// }
// interface Subscription {
//   id: number;
//   plan_title: string;
//   plan_amount: number;
//   duration_days: number;
//   expiration_date: string;
//   order_id: string;
//   razorpay_payment_id: number;
//   plan_names: string;
//   plan_status: string;
// }

// const Subscription: React.FC<BasicProfileProps> = ({ setActiveSection, setPaymentId }) => {
//   const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
//   const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
  
//   const token = useAuthStore((state) => state.token);

//   useEffect(() => {
//     if (token) {
//       fetchSubscriptions();
//     }
//   }, [token]);

//   const fetchSubscriptions = async () => {
//     try {
//       const response = await axios.get("/api/v1/front/profile/plan_history", {
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": "A8SQFT7767",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const fetchedSubscriptions = response.data.data.payments.map((payment: any) => ({
//         id: payment.id,
//         plan_title: payment.plan_title,
//         plan_amount: payment.plan_amount,
//         duration_days: payment.duration_days,
//         expiration_date: new Date(payment.plan_end_date).toISOString().split("T")[0],
//         order_id: payment.order_id,
//         razorpay_payment_id: payment.razorpay_payment_id,
//         plan_names: payment.plan_names,
//         plan_status: payment.plan_status === "1" ? "Active" : "Inactive",
//       }));

//       setSubscriptions(fetchedSubscriptions);
//       setPaymentId(fetchedSubscriptions.map((payment: Subscription) => payment.razorpay_payment_id));
//     } catch (error) {
//       console.error("Error fetching subscriptions:", error);
//     }
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = subscriptions.slice(indexOfFirstItem, indexOfLastItem);

//   return (
//     <div className="w-full bg-white p-4 rounded-lg shadow-md">
//       <h2 className="text-lg font-semibold mb-3 border-b-2 border-black pb-3">Subscription</h2>
//       {subscriptions.length > 0 ? (
//         <div className="border rounded-lg p-2">
//           {currentItems.map((sub) => (
//             <div key={sub.id} className="border-b last:border-0 p-4 flex justify-between items-center">
//               <div>
//                 <h3 className="text-base font-semibold">{sub.plan_names}</h3>
//                 <p className="text-sm text-gray-500">Duration: {sub.duration_days} days</p>
             
//               </div>
//               <div>
//                  <p className="text-sm text-gray-500">Expiration Date</p>
//                  <p>{sub.expiration_date}</p>
//               </div>
//               <div className="flex gap-2 items-center">
//                 <span className={`px-3 py-1 rounded-full text-white ${sub.plan_status === "Active" ? "bg-green-500" : "bg-red-500"}`}>
//                   {sub.plan_status}
//                 </span>
//                 <button className="bg-orange-500 text-white px-3 py-1 rounded">Upgrade</button>
//                 <button className="border border-orange-500 px-3 py-1 rounded">Renew</button>
//                 <button className="text-xl" onClick={() => setSelectedSubscription(sub)}>{">"}</button>
//               </div>
//             </div>
//           ))}
//           <Pagination
//             totalItems={subscriptions.length}
//             itemsPerPage={itemsPerPage}
//             currentPage={currentPage}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       ) : (
//         <p className="text-center text-gray-500 mt-4">No active subscriptions found.</p>
//       )}
//       {selectedSubscription && <SubscriptionDetails subscription={selectedSubscription} onClose={() => setSelectedSubscription(null)} />}
//     </div>
//   );
// };

// export default Subscription;


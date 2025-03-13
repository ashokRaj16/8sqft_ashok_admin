import React from "react";

interface SubscriptionDetailsProps {
  subscription: {
    plan_title: string;
    plan_names:string
    order_id: string;
    plan_status: string;
    plan_amount: number;
    expiration_date: string;
    duration_days: number;
  } | null;
  onClose: () => void;
}

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({ subscription, onClose }) => {
  if (!subscription) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">{subscription.plan_names}-{subscription.plan_amount}</h2>
          <button onClick={onClose} className="text-gray-600 text-xl">&times;</button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Subscription ID</span>
            <span className="font-medium">{subscription.order_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="font-medium text-green-600">{subscription.plan_status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Paid Amount</span>
            <span className="font-medium">₹ {subscription.plan_amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Expiration Date</span>
            <span className="font-medium">{subscription.expiration_date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Billing Period</span>
            <span className="font-medium">(Pay Every {subscription.duration_days} Days)</span>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button className="border px-4 py-2 rounded-md text-gray-600 border-gray-400">
            Disable Auto Renewal
          </button>
          <button className="border px-4 py-2 rounded-md text-primary border-red-500">
            Renew Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;

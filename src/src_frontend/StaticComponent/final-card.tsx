import React from "react";

export default function SuccessCard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <svg
            className="w-12 h-12 text-green-500 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m-6 8a9 9 0 110-18 9 9 0 010 18z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold mb-2">Thank You for Property Listing</h2>
        <p className="text-gray-600 text-sm">
          Our team will check and verify your submission. A call will be made within 24 to 48 hours.
        </p>
        <p className="text-gray-600 text-sm mt-2">
          If you have any queries, contact us via WhatsApp at <b>9860391199</b> or email us at{" "}
          <b>sales@8sqft.com</b>.
        </p>
      </div>
    </div>
  );
}

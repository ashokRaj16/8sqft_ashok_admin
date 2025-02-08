import React from "react";

const HomeAnimation = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="relative">
        {/* Animation Circle */}
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-primary border-opacity-75"></div>

        {/* Static Inner Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h11M9 21V3m0 18l-4-4m4 4l4-4"
            />
          </svg>
        </div>
      </div>
      <p className="mt-6 text-lg font-semibold text-primary">
        Loading your experience...
      </p>
    </div>
  );
};

export default HomeAnimation;

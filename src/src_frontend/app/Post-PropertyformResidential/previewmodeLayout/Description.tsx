// components/Description.tsx
'use client'; // Required for Next.js to handle client-side interactions

import React, { useState } from 'react';
interface Description{
  description: string|undefined;
  
}
const Description= ({description}:Description) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

 

  const previewText = description?.slice(0, 120); // Show 120 characters initially

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Description</h2>
      <p className="text-sm text-gray-600">
        {isExpanded ? description : `${previewText}...`}
      </p>
      <button
        onClick={toggleExpand}
        className="mt-2 text-blue-600 text-sm font-medium hover:underline"
      >
        {isExpanded ? 'Show Less' : 'Read More'}
      </button>
    </div>
  );
};

export default Description;

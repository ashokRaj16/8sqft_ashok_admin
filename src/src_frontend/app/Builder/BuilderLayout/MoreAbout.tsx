"use client"; // Required for Next.js to handle client-side interactions

import React, { useState } from "react";
interface Description {
  description?: string | undefined;
  locality?: string | undefined;
  city_name: string | null | undefined;
  property_title: string | null | undefined;
}
const MoreAbout = ({ description, locality, city_name,property_title }: Description) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
const description2=' Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, consequatur. Dolorum, illo incidunt qui, vero quis, ab in a natus obcaecati numquam accusamus temporibus. Accusamus eligendi nemo magni necessitatibus impedit! '
  
const previewText = description?.slice(0, 250).trim(); 

  return (
    <div className="shadow-custom my-4 bg-white">
      <h2 className="font-semibold lg:text-lg border-b border-[#D9D9D9] py-2 mb-2 px-4 shadow-sm">
        More about {property_title || "N/A"}, {city_name}
      </h2>
    <div className="p-4">
    <p className="text-sm text-[#7A7A7A]">
      <div dangerouslySetInnerHTML={{ __html: isExpanded ? description ?? '' : `${previewText ?? ''}...`}} />
      </p>
      {(description?.length ?? 0) > 250 && (
    <button
      onClick={toggleExpand}
      className="mt-2 text-primary text-sm font-medium hover:underline" >
    {isExpanded ? "Show Less" : "Show More"}
    </button>
      )}
  
    </div>
    </div>
  );
};

export default MoreAbout;

{
  /* <Card className="w-full max-w-[689px] bg-white rounded overflow-hidden mx-auto">
<CardHeader className="p-5 border-b shadow-sm">
    
</CardHeader>

<CardContent className="p-5 space-y-4">
    <div className="space-y-2">
        <h3 className="font-semibold text-[#222222] text-base sm:text-lg md:text-xl leading-[26px]">
            Open Plot for Sale in Gatha Nagari, Dehu – Your Dream Location
            Awaits!
        </h3>

        <p className="text-[#22222299] text-base sm:text-sm md:text-base leading-[26px]">
            This 5-acre project offers plots at ₹1600/sqft with premium
            amenities:
        </p>

        <ul className="space-y-1 text-[#22222299] text-base sm:text-sm md:text-base leading-[26px]">
            {amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
            ))}
        </ul>

        <p className="font-bold text-[#222222] text-base sm:text-sm md:text-base leading-[26px]">
            Contact us today for more details!
        </p>
    </div>

    <Button
        variant="ghost"
        className="w-full flex items-center justify-center gap-1 text-[#fc6600] hover:text-[#fc6600] hover:bg-orange-50"
    >
        <span className="text-sm sm:text-xs md:text-sm">Show More About Project</span>
        <ChevronDown className="h-4 w-4" />
    </Button>
</CardContent>
</Card> */
}

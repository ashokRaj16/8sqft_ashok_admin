import { useState } from "react";

interface AboutProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  builderResponseData: any; 
}
export default function About({
  themeColors,
  builderResponseData
}: AboutProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const description = builderResponseData?.property?.description || "";
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  return (
   <>
   <div className="my-4" style={{color:themeColors.themeColorDark}}>
    <h3 className="font-semibold my-2  text-lg">About {builderResponseData?.property?.property_title}</h3>

    <div
        className={`leading-7 break-words transition-all duration-300 ${
          isExpanded ? "" : "line-clamp-3"
        }`}
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {description.length > 0 && (
        <button
          className="mt-2 text-sm hover:text-blue underline"
          onClick={toggleExpanded}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
   </div>
   </>
  );
}

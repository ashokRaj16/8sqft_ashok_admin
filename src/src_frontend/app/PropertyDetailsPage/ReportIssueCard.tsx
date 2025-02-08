// components/ReportIssueCard.tsx

import BadgesSection from "./BadgesSection";
import Image from "next/image";

const ReportIssueCard: React.FC = () => {
    return (
      <div className="p-4 border border-gray-300 rounded-lg border-dotted my-5 flex flex-col">
        {/* <h4 className="text-gray font-medium">Report Incorrect Information</h4> */}
         <div className="flex flex-row">
         <Image
          src="/assets/ReportIssue/exclamation.svg"
          alt="ReportIssue Icon"
         
          width={18}
          height={18}
        />
         <p className="text-sm ">Report what was not correct in this property</p>
        </div>
        <BadgesSection />
       </div>
    );
  };
  
  export default ReportIssueCard;
  
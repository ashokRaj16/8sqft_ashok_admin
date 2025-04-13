


// import BadgesSection from "./BadgesSection";
// import Image from "next/image";
// import useBuilderDetail from "@/hooks/useBuilderDetail";

// interface ReportIssueCardProps {
//   propertyId:number ;
// }

// const ReportIssueCard: React.FC<{ propertyId: number }> = ({ propertyId }) => {
//   const { data, isLoading, error } = useBuilderDetail(propertyId);

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error loading property details</p>;

//   return (
//     <div className="p-4 border border-gray-300 rounded-lg border-dotted my-5 flex flex-col">
//       <div className="flex flex-row">
//         <img src="/assets/ReportIssue/exclamation.svg" alt="ReportIssue Icon" width={18} height={18} />
//         <p className="text-sm">Report what was not correct in this property</p>
//       </div>
//       {/* <BadgesSection propertyId={data?.data?.id} /> */}
//       <BadgesSection propertyId={data?.data?.id ?? 0} />

//     </div>
//   );
// };

// export default ReportIssueCard;


import BadgesSection from "./BadgesSection";
import useBuilderDetail from "@/hooks/useBuilderDetail";
import  usePropertyIdStore from "@/Store/propertyid" // Import Zustand Store
import { useParams } from "next/navigation";

interface ReportIssueCardProps {
  propertyId?: number|null;
}

const ReportIssueCard: React.FC<ReportIssueCardProps> = () => {
  
   const params = useParams(); // Retrieve route parameters
    const propertyId = params?.id ? Number(params.id) : null; // Safely parse id
    console.log("ID",propertyId)
  const { data, isLoading, error } = useBuilderDetail(propertyId);
  const setPropertyId = usePropertyIdStore((state: { setId: any; }) => state.setId); // Zustand function to update propertyId

  // Set propertyId in Zustand when data is available
  if (data?.data?.id) {
    setPropertyId(data.data.id.toString()); // Convert number to string as per Zustand store type
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading property details</p>;

  return (
 <div className="bg-white shadow-custom my-2 p-1">
     <div className=" border border-black/40  border-dashed flex flex-col p-1">
      <div className="flex flex-row">
        <img src="/assets/ReportIssue/exclamation.svg" alt="Report Issue Icon" width={18} height={18} />
        <p className="lg:text-sm text-xs">Report what was not correct in this property</p>
      </div>
      <BadgesSection />
    </div>
 </div>
  );
};

export default ReportIssueCard;



// import { useState } from "react";
// import useBuilderDetail from "@/hooks/useBuilderDetail";
// interface FAQ {
//   question: string;
//   answer: string;
// }

// const Faqs = () => {
//   const [faqs, setFaqs] = useState<FAQ[]>([
//     {
//       question: "Which is the closest metro station to Shivam 19 Grand West?",
//       answer: "The nearest metro station to Shivam 19 Grand West is Wakad chowk metro station.",
//     },
//     {
//       question: "Is Dange Chowk safe?",
//       answer: "You should know that former and existing residents have rated this locality 4/5 on safety. This means, this is a good area where safety is not a concern.",
//     },
//     {
//       question: "Are there any sports facilities in this project?",
//       answer: "Yes, there are Swimming Pool facilities in Shivam 19 Grand West.",
//     },
//     {
//       question: "What are the safety features of Shivam 19 Grand West?",
//       answer: "Shivam 19 Grand West has Intercom and 24x7 Security to ensure all the residents feel safe and secure.",
//     },
//   ]);

//   return (
//     <div className="max-w-3xl p-4">
//     <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
//     <div className="space-y-4">
//       {faqs.map((faq, index) => (
//         <div key={index} className="border-b pb-3">
//           <div className="flex items-center font-medium text-black">
//             <span className="bg-gray text-black px-2 py-1 rounded-full">Q</span>
//             <span className="ml-2 text-black font-semibold ">{faq.question}</span>
//           </div>
//           <p className="text-black mt-2 ml-8">{faq.answer}</p>
//         </div>
//       ))}
//     </div>
//   </div>

//   );
// };

// export default Faqs;


import { useParams } from "next/navigation";
import useBuilderDetail from "@/hooks/useBuilderDetail";
import toast from "react-hot-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui/accordion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const Faqs = () => {
  const params = useParams();
  const extractId = (url:any) => {
    if (!url || typeof url !== "string") return null; // Ensure it's a string
    const match = url.match(/-(\d+)$/);
    return match ? match[1] : null;
  };
  const id = extractId(params.id);
  
  const propertyId = params?.id ? Number(id) : null;
  const { data, isLoading, error } = useBuilderDetail(propertyId);



  // Extract FAQs from API response
  const faqs = data?.data?.faq || [];
  console.log("faqs", data);

  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenItem((prev: string | null) => (prev === id ? null : id));
  };
  if (isLoading) return <p>Loading FAQs...</p>;
  if (error) {
    toast.error("Failed to load FAQs.");
    return <p>Error loading FAQs. Please try again later.</p>;
  }
  return (
    <div className=" p-4">


      <h2 className="text-xl font-semibold mb-4 ml-2 p-4 border-y-[1px] w-full">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">

            {
              faqs.map((faq: any, index) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger onClick={() => handleToggle(faq.id)} className="relative flex font-medium text-black gap-2 hover:no-underline">
                    <div className="flex items-center font-medium text-black gap-2">
                      {/* <span className="bg-[#E9EBEF] text-black px-2 py-1 rounded-full">Q</span> */}
                      <span className="bg-[#E9EBEF] text-black px-2 py-1 rounded-full">{index+1}</span>
                      <span className="ml-2 text-black font-semibold text-base">{faq.faq_question}</span>
                    </div>
                    <ChevronDown
                  className={`right-0 bg-white p-1 absolute transition-transform ${
                    openItem === faq.id ? "rotate-180" : "rotate-0"
                  }`}
                />
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-600 ml-12">{faq.faq_answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))
            }
          </Accordion>
        ) : (
          <p>No FAQs available.</p>
        )}
      </div>
    </div>
  );
};

export default Faqs;

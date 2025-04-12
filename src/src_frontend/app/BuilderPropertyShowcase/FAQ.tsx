import { useParams } from "next/navigation";
import useBuilderDetail from "@/hooks/useBuilderDetail";
import toast from "react-hot-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui/accordion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FaqsProps {
    themeColors: {
      themeColorDark: string;
      [key: string]: any;
    };
    builderResponseData: any;
  }
const Faqs = ({
    themeColors,
    builderResponseData
  }: FaqsProps) => {
 



  // Extract FAQs from API response
  const faqs = builderResponseData?.faq || [];
  console.log("builderResponseData", builderResponseData);

  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenItem((prev: string | null) => (prev === id ? null : id));
  };

  return (
    <>
        {faqs.length > 0 && (
<div  style={{ color: themeColors.themeColorDark }}>
<h2 className="font-semibold my-2  text-lg">Frequently Asked Questions</h2>
<div className="p-2" style={{ backgroundColor: themeColors.themeColorLight }}>
           <div className="shadow-custom bg-white">
       
          <Accordion type="single" collapsible className="w-full p-2">

            {
              faqs.map((faq: any, index:number) => (
                <AccordionItem key={faq.id} value={faq.id} className={`${index===faqs.length-1?'border-none':'border-b'}`}>
                  <AccordionTrigger onClick={() => handleToggle(faq.id)} className="relative flex font-medium gap-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#E9EBEF]  p-1 h-8 w-8 flex items-center justify-center rounded-full">{index+1}</span>
                      <span className="ml-2  font-medium text-base">{faq.faq_question}</span>
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
      </div>
       </div>
</div>
        )}
    </>
  );
};

export default Faqs;
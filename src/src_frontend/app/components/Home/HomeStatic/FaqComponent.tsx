import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui/accordion";
import React from "react";
import { FaChevronDown } from "react-icons/fa";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "What will the Relationship Manager do?",
    answer:
      "Your Relationship Manager will handle all tenant inquiries and shortlist candidates who match your preferences, letting you relax while they find the ideal tenant for you.",
  },
  {
    question: "How does Social Media Marketing work?",
    answer:
      "Our expert team creates attractive ads for your property and shares them on 8sqft.com social media channels, including Facebook, with over thousand's active followers.",
  },
  {
    question: "How will my property be promoted?",
    answer:
      "Subscribing to our services boosts your property’s ranking on 8sqft, ensuring it appears higher on the listing page for better visibility.",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No, there are absolutely no hidden charges. You pay only for the services you choose, saving big on brokerage fees.",
  },
  {
    question: "How will I get faster closures?",
    answer:
      "Your RM will match your property with tenants from over 1 million active users and present you with the best options to choose from.",
  },
];

const FAQComponent: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="flex justify-between items-center text-lg font-medium">
              {faq.question}
              
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-600">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQComponent;

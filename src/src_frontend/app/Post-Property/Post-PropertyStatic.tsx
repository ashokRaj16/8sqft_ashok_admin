"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
export default function PostPropertyStaticComponent() {
  const faqs = [
    {
      id:"1",
      question: "How do I list my property on 8sqft?",
      answer:
        "To list your property on 8sqft, visit the website and sign up for an account. Then, fill in the property details, upload photos, and submit the listing for approval.",
    },
    {
      id:"2",
      question: "How long does it take to find a tenant or buyer?",
      answer:
        "The time to find a tenant or buyer on 8sqft depends on your property's location, pricing, and demand. Typically, listings with competitive pricing and clear photos attract interest faster.",
    },
    {
      id:"3",
      question: "What types of properties can I list?",
      answer:
        "You can list residential, commercial, and rental properties on 8sqft, including apartments, houses, offices, and retail spaces. The platform supports properties for buying, selling, or renting without brokerage.",
    },
    {
      id:"4",
      question: "Does 8sqft charge any brokerage?",
      answer:
        "No, 8sqft does not charge any brokerage fees. It offers a platform for direct property transactions between owners and buyers or tenants.",
    },
    {
      id:"5",
      question: "Can I edit my property details after listing?",
      answer:
        "Yes, you can edit your property details after listing on 8sqft. Simply log in to your account, select the listing, and update the necessary information.",
    },
  ];
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenItem((prev: string | null) => (prev === id ? null : id));
  };
  return (
    <>
      <div className="container mx-auto px-4 py-8">
      <p className="lg:text-2xl text-xl font-medium lg:font-semibold text-center">
          Frequently Asked Questions
        </p>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger onClick={() => handleToggle(faq.id)} className="relative flex lg:text-lg font-medium text-black gap-2 hover:no-underline">
                {faq.question}
                <ChevronDown
                  className={`right-0 bg-white p-1 absolute transition-transform ${
                    openItem === faq.id ? "rotate-180" : "rotate-0"
                  }`}
                />
              </AccordionTrigger>
              <AccordionContent className="lg:text-sm text-xs text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}

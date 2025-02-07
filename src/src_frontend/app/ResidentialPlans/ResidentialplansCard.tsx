"use client";

import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/ui/card";
import { Separator } from "@radix-ui/react-select";
import { FaCheckCircle } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { GrRadialSelected } from "react-icons/gr";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { MdRadioButtonUnchecked } from "react-icons/md";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import Modal from "./ResidentialModal";
import Razorpay from "react-razorpay/dist/razorpay";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "@/Store/jwtTokenStore";
import { CurrencyCode } from "react-razorpay/dist/constants/currency";
import { jwtTokenDecodeAll } from "@/lib/jwtTokenDecodeAll";

type PlanCardProps = {
  title: string;
  price: string;
  originalPrice?: string;
  onSelectplan: (price: string) => void; // This is the required prop
  features?: { label: string; isActive: boolean }[];
  buttonText: string;
};
export const PlanCard: React.FC<PlanCardProps> = ({
  title,
  price,
  originalPrice,
  onSelectplan,
  features,
  buttonText,
}) => {
  const isMobile = useMediaQuery("(max-width: 1024px)");

  return (
    <div className="w-full">
      <Card
        className={`w-full ${
          isMobile ? "border-none" : "border"
        }   max-h-full rounded-lg sm:shadow-md lg:border lg:border-gray-200 overflow-hidden `}
      >
        {/* Header Section */}
        <CardHeader className="p-0">
          <div className="hidden lg:flex flex-col">
            <div className=" bg-white flex justify-center items-center py-1">
              <h2 className="text-[#222222] text-xl md:text-3xl font-semibold">
                {title}
              </h2>
            </div>
            <div className="bg-[#fc6600] flex justify-center items-center py-1">
              <h3 className="text-white text-xl md:text-2xl font-semibold">
                {price}
              </h3>
            </div>
            {originalPrice && (
              <div className="bg-neutral-100 flex justify-center items-center py-1">
                <h4 className="text-[#222222] text-center md:text-lg font-semibold line-through bg-[#F5F5F5] w-full ">
                  {originalPrice}
                </h4>
              </div>
            )}
          </div>
        </CardHeader>

        <Separator />

        {/* Content Section */}
        <CardContent className="flex flex-col border-none gap-1 lg:gap-4 p-0 ">
          <div className="text-sm md:text-base font-normal px-4">
            {/* <strong>Duration:</strong> {duration} */}
          </div>
          {features?.map((feature, index) => (
            <div
              key={index}
              className={`px-1 flex items-center gap-3  ${
                index % 2 !== 0 ? "bg-white" : "bg-[#F5F5F5]"
              } text-sm md:text-base font-normal ${
                feature.isActive ? "text-[#212121]" : "text-neutral-400"
              }`}
            >
              <div
                className="flex justify-center items-center w-5 h-5"
                aria-label={feature.label}
              >
                {feature.isActive ? (
                  <FaCheckCircle className="text-[#1AA260] w-full h-full" />
                ) : (
                  <CiLock className="text-[#A4A4A4] w-full h-full" />
                )}
              </div>
              <span
                className={`${
                  feature.isActive
                    ? "text-black w-full  text-[10px] lg:text-sm"
                    : "text-[#A4A4A4] w-full text-[10px] lg:text-sm"
                }`}
              >
                <div className="px-3  ">{feature.label}</div>
              </span>
            </div>
          ))}
        </CardContent>

        <Separator />

        {/* Footer Section */}
        <CardFooter className="flex justify-center items-center mt-1">
        
          <Button
            id="select_price"
            onClick={() => onSelectplan(price)}
            className="w-full bg-[#222222] hover:bg-[#e05500] text-white text-base md:text-lg font-medium capitalize rounded"
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

type AccordionPlanProps = {
  onSelectplan: (price: string) => void;
};

export const AccordionPlan: React.FC<AccordionPlanProps> = ({
  onSelectplan,
}: AccordionPlanProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSelectPlan = (price: string) => {
    // Use regular expression to extract the numeric price value
    const priceMatch = price.match(/₹([\d,]+)/);
    const priceValue = priceMatch
      ? parseFloat(priceMatch[1].replace(/,/g, ""))
      : 0;

    // Calculate GST
    const gst = priceValue * 0.18;
    const cgst = gst / 2;
    const igst = gst / 2;
    const total = priceValue + gst;

    // Generate a unique ID
    const uniqueId = `plan-${Date.now()}`;

    // Set the selected price and open the modal
    setSelectedPrice(price);
    setIsModalOpen(true);

    console.log(
      `Selected Plan Price: ${priceValue}\nCGST (9%): ${cgst}\nIGST (9%): ${igst}\nTotal Price (incl. GST): ${total}\nID: ${uniqueId}`
    );
  };
  const [totalAmount, setTotalAmount] = useState<number>(0);
  interface RazorpayOrderOptions {
    key: string; // Your Razorpay API key
    amount: number; // Total amount (in paise)
    currency: any; // Currency (e.g., 'INR')
    name: string; // The name of your business or company
    description: string; // A description of the order
    order_id: string; // The order ID returned by Razorpay when creating the order
    handler: (paymentResponse: any) => void; // A function that handles the payment response
    prefill: {
      name: string;
      email: string;
      contact: string;
    };
    theme: {
      color: string; // Color of the payment form
    };
  }
  const token = useAuthStore((state) => state.token);
  const handleConfirm = async (total: number) => {
    

    try {
      // API call to create Razorpay order
      const response = await axios.post(
        "https://api.8sqft.com/api/v1/front/payments/rpay/create",

        { planId: 1, orderAmount: total },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
            Authorization: `Bearer ${token}`, // Replace with a valid token
          },
        }
      );

      const data = response.data;
      const decoded: any = jwtTokenDecodeAll(token || "");

      const email = decoded?.email;
      const mobile = decoded?.mobile;
      const name = decoded?.first_name + " " + decoded?.last_name;
      if (data.order.id) {
        const options: RazorpayOrderOptions = {
          key: "rzp_live_H2npsRmwZz7Kol", // Replace with your Razorpay key
          amount: totalAmount * 100,
          currency: "INR" as CurrencyCode,
          name: "8 SQFT REAL TECH",
          description: "plan.name",
          order_id: data.order.id,
          handler: async function (paymentResponse: any) {
            // Post payment response to server
            const paymentResult: any = await axios.post(
              "https://api.8sqft.com/api/v1/front/payments/rpay/response",
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": "A8SQFT7767",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(paymentResult);

            if (paymentResult.statusText === "OK") {
              alert("Payment Successful!");
            } else {
              alert("Payment Failed. Please try again.");
            }
          },
          prefill: {
            name: name,
            email: email,
            contact: mobile,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        toast.error("Failed to create Razorpay order.");
      }
    } catch (error) {
      // console.error("Payment Error:", error);
      toast.error("You must log in to proceed.");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const plans = [
    {
      title: "ELITE",
      price: "Offer price ₹999 (+18% GST)",
      OriginalPrice: "Original Price ₹2,000",

      features: [
        { label: "Guaranteed Rent Out", isActive: false },
        { label: "Duration: 30 days", isActive: true },
        { label: "10 Tenant Contact Numbers", isActive: true },
        { label: "Property promotion on website", isActive: true },
        { label: "Tenant contact Whatsapp notification", isActive: false },
        { label: "Sponsored promotion on 8SQFT website", isActive: false },
        { label: "Paid promotion on Meta", isActive: false },
        { label: "Paid Video promotion", isActive: false },
        {
          label: "Rent Agreement : Rs. 500 Discount (+ Door Step Service)",
          isActive: false,
        },
        { label: "Relationship Manager", isActive: false },
      ],
      buttonText: "Select this plan",
    },
    {
      title: "PRIME",
      price: "Offer price ₹2,999 (+18% GST)",
      OriginalPrice: "Original Price ₹6,000",

      features: [
        { label: "Guaranteed Rent Out", isActive: false },
        { label: "Duration: 45 days", isActive: true },
        { label: "30 Tenant Contact Numbers", isActive: true },
        { label: "Property promotion on website", isActive: true },
        { label: "Tenant contact Whatsapp notification", isActive: true },
        { label: "Sponsored promotion on 8SQFT website", isActive: true },
        { label: "Paid promotion on Meta", isActive: false },
        { label: "Paid Video promotion", isActive: false },
        {
          label: "Rent Agreement : Rs. 500 Discount (+ Door Step Service)",
          isActive: false,
        },
        { label: "Relationship Manager", isActive: false },
      ],
      buttonText: "Select this plan",
    },
    {
      title: "LUXURY",
      price: "Offer price ₹4,999 (+18% GST)",
      OriginalPrice: "Original Price ₹10,000",

      features: [
        { label: "Guaranteed Rent Out", isActive: true },
        { label: "Duration: 60 days", isActive: true },
        { label: "50 Tenant Contact Numbers", isActive: true },
        { label: "Property promotion on website", isActive: true },
        { label: "Tenant contact Whatsapp notification", isActive: true },
        { label: "Sponsored promotion on 8SQFT website", isActive: true },
        { label: "Paid promotion on Meta", isActive: true },
        { label: "Paid Video promotion", isActive: true },
        {
          label: "Rent Agreement : Rs. 500 Discount (+ Door Step Service)",
          isActive: true,
        },
        { label: "Relationship Manager", isActive: true },
      ],
      buttonText: "Select this plan",
    },
  ];
  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full max-w-2xl mx-auto"
        defaultValue="plan-3"
        onValueChange={(value) => setExpandedItem(value)}
      >
        {plans.map((plan, index) => {
          const isExpanded = expandedItem === `plan-${index}`;

          return (
            <AccordionItem key={index} value={`plan-${index}`}>
              <AccordionTrigger
                className={`flex  justify-between items-center text-lg font-semibold text-white py-2 px-4 my-1 bg-[#FB8331] border-b [&>svg]:hidden`}
              >
                <div className="flex items-center">
                  {/* Custom Round Select Icon */}
                  {isExpanded ? (
                    <GrRadialSelected className="text-white mr-2 text-lg" />
                  ) : (
                    <MdRadioButtonUnchecked className="text-white mr-2 text-lg" />
                  )}
                  <div className="w-28 flex items-center">
                    <span className="w-full max-w-16">
                      {plan.price.split(" ")[0]}
                    </span>
                    <span className="ml-4 text-center w-full">
                      {plan.title}
                    </span>
                  </div>
                </div>
                {/* Chevron Icon */}
                <div>
                  {isExpanded ? (
                    <Image
                      src="/assets/plans/upsvg.svg"
                      alt="up-svg"
                      className="text-white text-lg"
                      width={10}
                      height={10}
                    />
                  ) : (
                    <Image
                      src="/assets/plans/icon40.svg"
                      alt="down-svg"
                      className="text-white text-lg"
                      width={10}
                      height={10}
                    />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className=" lg:p-4">
               
                  <PlanCard
                    key={index}
                    title={plan.title}
                    price={plan.price}
                    originalPrice={plan.OriginalPrice}
                    features={plan.features}
                    buttonText={plan.buttonText}
                    onSelectplan={handleSelectPlan}
                  />
               
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <Modal
        isOpen={isModalOpen}
        price={selectedPrice}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

"use client";
import React, { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import Image from "next/image";
import axios from "axios";
import { useAuthStore } from "@/Store/jwtTokenStore";
import { decodeToken } from "@/lib/jwtDecode";
import { AccordionPlan, PlanCard } from "./ResidentialplansCard";
import Modal from "./ResidentialModal";
import FAQComponent from "@/app/components/Home/HomeStatic/FaqComponent";
import { useRazorpay } from "react-razorpay";
import toast from "react-hot-toast";
import { CurrencyCode } from "react-razorpay/dist/constants/currency";
import { jwtTokenDecodeAll } from "@/lib/jwtTokenDecodeAll";
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
interface PaymentDetails {
  amount: number;
  currency: string;
  name: string;
}




export default function PlansComponent() {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const plansSectionRef = useRef<HTMLDivElement>(null);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { error, isLoading, Razorpay } = useRazorpay();

  useEffect(() => {
    if (plansSectionRef.current) {
      plansSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  interface DecodedToken {
    id: number;
    email: string;
    iat: number;
    exp: number;
  }

  const token = useAuthStore((state) => state.token); 

  const decoded: any = jwtTokenDecodeAll(token || "");

  const email = decoded?.email;
  const mobile = decoded?.mobile;
  const name = decoded?.first_name + " " + decoded?.last_name;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    // Add an event listener to confirm the script is loaded
    script.onload = () => {
      console.log("Razorpay script loaded successfully!");
    };

    // Append the script to the body
    document.body.appendChild(script);
    const paymentDetails: PaymentDetails = {
      amount: totalAmount * 100,
      currency: "INR",
      name: "8 SQFT REAL TECH"
    }
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const handleSelectPlan = (price: string) => {
    setSelectedPrice(price);
    setIsModalOpen(true);
  };

  const handleConfirm = async (total: number) => {
    // const { price, gst } = plan;
    // const totalAmount = 1000;
    // console.log("ttl", totalAmount);

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
  return (
    <div>
      <div className="w-full max-w-full px-5 lg:px-10  flex flex-col ">
        {/* Text Section */}
        <div className="flex justify-evenly w-full ">
          <div className="flex flex-col items-center lg:gap-5 w-[60%]">
            <div className="text-center w-full"></div>
            <div className="text-center pt-3  text-[#222222] text-4xl font-semibold ">
              {`OWNER RESIDENTIAL RENT PLAN`}
            </div>
            <span className="text-gray flex justify-center text-sm mt-[10-px]">
              *The above charges are applicable for each property
            </span>
            <Image
              src={"/assets/plans/small.svg"}
              alt={"residential plans"}
              width={100}
              height={100}
              className=" lg:hidden my-3 w-full flex self-center"
            />
          </div>
          <div className="w-fit h-full">
            <Image
              src={"/assets/plans/50Off.svg"}
              alt={"residential plans"}
              width={100}
              height={100}
              className="hidden lg:block pt-2 pb-2"
            />
          </div>
        </div>

        {/* Conditionally Render Accordion or Cards */}
        {isMobile ? (
          <div ref={plansSectionRef}>
              <AccordionPlan onSelectplan={handleSelectPlan}  /> 
          </div>
        ) : (
          <div className="flex gap-3 w-full  self-center justify-evenly">
            {plans.map((plan, index) => (
              <PlanCard
                key={index}
                title={plan.title}
                price={plan.price}
                originalPrice={plan.OriginalPrice}
                features={plan.features}
                buttonText={plan.buttonText}
                onSelectplan={handleSelectPlan}
              />
            ))}
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        price={selectedPrice}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <FAQComponent />
    </div>
  );
}

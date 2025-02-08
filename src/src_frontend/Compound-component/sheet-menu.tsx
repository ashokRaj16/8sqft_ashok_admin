"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { MdClose } from "react-icons/md";
import { RiMenuLine } from "react-icons/ri";
const navigation = [
  { name: "Owners Rent Plan ", href: "/", current: true },
  { name: "Owners Sell Plan", href: "#services", current: false },
  { name: "For Owners", href: "/plans", current: false },
  { name: "For Builders", href: "#project", current: false },
];
export default function SlideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const [isTrue, setTrue] = useState(false);

  const toggleSubmenu = () => {
    setClicked(!isClicked);
  };
  const toggleSubmenuForSeller = () => {
    setTrue(!isTrue);
  };
  return (
    <div className="z-50">
      {/* Trigger Button */}
      <Button
        variant="ghost"
        className="p-0 transition-transform duration-200 hover:scale-105 flex self-center"
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <MdClose size={30} /> : <RiMenuLine size={30} />}
      </Button>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed mt-6 inset-0 bg-[#a1a1a180] backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        >
          {/* Sidebar */}
          <div
            className={`  bg-white fixed mt-10 right-0 h-screen overflow-y-scroll shadow-lg transform transition-transform duration-500
               ease-in-out w-[200px] ${isOpen ? "" : "-translate-x-full"}`}
          >
            <div className="flex flex-col h-full">
              {/* Menu Links */}
              {/* <div className="flex items-center justify-between p-6">
                menu
                <MdClose size={30} onClick={() => setIsOpen(false)} />
              </div> */}
              <div className="flex-1 overflow-y-auto p-6">
                <Link
                  href="/Post-Property"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    Post Your Property
                  </p>
                </Link>
                <Link
                  href="/Rental-Agreement"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    Rental Agreement
                  </p>
                </Link>
                <div className="relative">
                  {/* Set parent div as relative */}
                  <Link
                    href="#"
                    onClick={toggleSubmenu}
                    className="block transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                      Owners Rent Plan
                    </p>
                  </Link>
                </div>
                <div className="relative">
                  <Link
                    href="/ResidentialPlans"
                    className="block transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                      - Owners Residential Plan
                    </p>
                  </Link>
                </div>
                {/* <Link
                  href="/components/CommercialPlan"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    - Owners Commercial Plan
                  </p>
                </Link> */}
                {/* <Link
                  href="/components/PG_Hostel"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    - Owners PG/Hostel Plan
                  </p>
                </Link> */}
                {/* <Link
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    Owners Seller Plan
                  </p>
                </Link> */}
                {/* <Link
                  href="/components/OwnerSeller_Res_Plan"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    - Seller&apos;s Residential Plan
                  </p>
                </Link> */}
                {/* <Link
                  href="/components/OwnerSeller_Com_Plan"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    - Seller&apos;s Commercial Plan
                  </p>
                </Link> */}
                {/* <Link
                  href="/components/OwnerSeller_Plot_Plan"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    - Seller&apos;s Plot/Land Plan
                  </p>
                </Link> */}
                {/* <Link
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    Project Plans
                  </p>
                </Link> */}
                {/* <Link
                  href="/components/Project_Res_Plan"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    - Project Residential Plan
                  </p>
                </Link> */}
                {/* <Link
                  href="/components/Project_Com_Plan"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    - Project Commercial Plan
                  </p>
                </Link> */}
                {/* <Link
                  href="/components/Project_Plot_Plan"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    - Project Plot/Land Plan
                  </p>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

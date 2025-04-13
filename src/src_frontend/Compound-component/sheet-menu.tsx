"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/ui/Button";
import { MdClose } from "react-icons/md";
import { RiMenuLine } from "react-icons/ri";
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Info,
  Link2,
  LogOut,
  Settings,
  User,
  Users,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/ui/drawer";
import { IoClose } from "react-icons/io5";
import {
  BsBuildingCheck,
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsWhatsapp,
  BsYoutube,
} from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/Store/jwtTokenStore";
import { IoMdLogIn, IoMdPaper } from "react-icons/io";
import useDialogStore from "@/Store/useDialogStore ";
import useGetProfileDetails from "@/hooks/useGetProfileDetails";
import { CgMenuRightAlt } from "react-icons/cg";
import { useMediaQuery } from "usehooks-ts";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { BiSolidMessageAdd } from "react-icons/bi";
import { GrBlog } from "react-icons/gr";
import { getInitials } from "@/utils/getInitialName";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { name: "Owners Rent Plan ", href: "/", current: true },
  { name: "Owners Sell Plan", href: "#services", current: false },
  { name: "For Owners", href: "/plans", current: false },
  { name: "For Builders", href: "#project", current: false },
];
export default function SlideMenu() {
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { profile, loading, error } = useGetProfileDetails();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const [isTrue, setTrue] = useState(false);

  const toggleSubmenu = () => {
    setClicked(!isClicked);
  };
  const toggleSubmenuForSeller = () => {
    setTrue(!isTrue);
  };

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (section: any) => {
    setOpenDropdown(openDropdown === section ? null : section);
  };
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("authToken");
    router.push("/");
    setOpen(false);
  };

  const initials = getInitials(profile?.data.fname, profile?.data.lname);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isDesktopLg = useMediaQuery("(max-width: 1440px)");

  function openWhatsapp() {
    const phoneNumber = "917219009062"; // Ensure this is in international format without '+' or spaces
    const message = "Hi, I want to post my project/property";
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  }
  return (
    <>
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerTrigger asChild>
          <Button className="text-white hover:text-primary bg-transparent p-0 ">
            <CgMenuRightAlt size={35} />
          </Button>
        </DrawerTrigger>
        <DrawerContent
          className="bg-white h-screen rounded-xl fixed top-0 inset-0 right-0"
          style={{ marginLeft: isMobile ? "10%" : isDesktopLg ? "80%" : "83%" }}
        >
          <DrawerHeader className="text-left relative">
            <div>
              {token ? (
                <div className="flex items-center gap-3 p-3 border-b-2">
                  <Avatar>
                    <AvatarImage src="#" alt="@shadcn" />
                    <AvatarFallback
                      className=" text-white"
                      style={{ backgroundColor: "#0000005e" }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <DrawerTitle>
                      {profile?.data.fname} {profile?.data.lname}
                    </DrawerTitle>
                    <DrawerDescription className="text-xs text-gray-500 pt-1">
                      {profile?.data.email}
                    </DrawerDescription>
                  </div>
                </div>
              ) : (
                <div>
                  <DrawerTitle></DrawerTitle>
                  <DrawerDescription> </DrawerDescription>
                  <Button
                    onClick={() => {
                      openDialog();
                      setOpen(false);
                    }}
                    variant={"outline"}
                    className="text-sm rounded-lg"
                  >
                    <IoMdLogIn />
                    SignIn / SignUp
                  </Button>
                </div>
              )}
            </div>

            <DrawerClose asChild className="">
              <Button
                className=" absolute p-1 rounded-lg shadow-md border-0 bg-white w-8 h-12"
                style={{ left: "-20px", top: "55px" }}
              >
                <ChevronRight size={20} />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className=" p-4 flex flex-col">
            <p
              onClick={() => {
                router.push("/Post-Property");
                setOpen(false);
              }}
              className="flex items-center gap-2 p-2 text-white bg-primary rounded-lg cursor-pointer text-sm"
            >
              <BsBuildingCheck size={16} />
              Post Your Property
            </p>
            {/* Menu Items */}
            <div className="mt-4 space-y-2 text-sm">
              {/* <p className="flex items-center gap-2 p-2 text-gray-700 hover:text-primary cursor-pointer">
                <FileText size={16} /> Rental Agreement
              </p> */}

              <div className="p-2">
                <div
                  className="cursor-pointer flex justify-between items-center text-gray-700 hover:text-primary"
                  onClick={() => toggleDropdown("ownerRentPlan")}
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Users size={16} /> Owner Rent Plan
                  </span>
                  <ChevronDown
                    size={16}
                    className={
                      openDropdown === "ownerRentPlan"
                        ? "rotate-180 transition-all duration-500"
                        : " transition-all duration-500"
                    }
                  />
                </div>
                {openDropdown === "ownerRentPlan" && (
                  <div className="space-y-3 mt-4 text-gray-600 pl-5">
                    <p
                      onClick={() => {
                        router.push("/ResidentialPlans");
                        setOpen(false);
                      }}
                      className=" cursor-pointer hover:text-primary text-xs"
                    >
                      Residential Plan
                    </p>
                    <p className=" cursor-pointer hover:text-primary text-xs">
                      Commercial Plan
                    </p>
                    <p className=" cursor-pointer hover:text-primary text-xs">
                      PG/Hostel Plan
                    </p>
                  </div>
                )}
              </div>

              <div className="p-2">
                <div
                  className="cursor-pointer flex justify-between items-center text-gray-700 hover:text-primary"
                  onClick={() => toggleDropdown("projectPlan")}
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Building2 size={16} /> Project Plan
                  </span>
                  <ChevronDown
                    size={16}
                    className={
                      openDropdown === "projectPlan"
                        ? "rotate-180 transition-all duration-500"
                        : " transition-all duration-500"
                    }
                  />
                </div>
                {openDropdown === "projectPlan" && (
                  <div className="space-y-3 mt-4 text-gray-600 pl-5">
                    <p className=" cursor-pointer hover:text-primary text-xs">
                      Residential Plan
                    </p>
                    <p className=" cursor-pointer hover:text-primary text-xs">
                      Commercial Plan
                    </p>
                    <p className=" cursor-pointer hover:text-primary text-xs">
                      Open Plot
                    </p>
                  </div>
                )}
              </div>

              {/* <div className="p-2">
                <div
                  className="cursor-pointer flex justify-between items-center text-gray-700 hover:text-primary"
                  onClick={() => toggleDropdown("quickLinks")}
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Link2 size={16} /> Quick Links
                  </span>
                  <ChevronDown
                    size={16}
                    className={
                      openDropdown === "quickLinks"
                        ? "rotate-180 transition-all duration-500"
                        : "transition-all duration-500"
                    }
                  />
                </div>
                {openDropdown === "quickLinks" && (
                  <div className="space-y-3 mt-4 text-gray-600 pl-5">
                    <p
                      onClick={() => {
                        router.push("/About-Us");
                        setOpen(false);
                      }}
                      className=" cursor-pointer hover:text-primary text-xs"
                    >
                      About Us
                    </p>
                    <p
                      onClick={() => {
                        router.push("/TermsandCondition");
                        setOpen(false);
                      }}
                      className=" cursor-pointer hover:text-primary text-xs"
                    >
                      Terms & Conditions
                    </p>
                    <p
                      onClick={() => {
                        router.push("/blog");
                        setOpen(false);
                      }}
                      className=" cursor-pointer hover:text-primary text-xs"
                    >
                      Blog
                    </p>
                  </div>
                )}
              </div> */}
              <div className="">
                <p
                  className="flex items-center gap-2  text-sm p-2 text-gray-700 hover:text-primary cursor-pointer"
                  onClick={() => {
                    router.push("/About-Us");
                    setOpen(false);
                  }}
                >
                  <Info size={16} />
                  About Us
                </p>
                <p
                  className="flex items-center gap-2  text-sm p-2 text-gray-700 hover:text-primary cursor-pointer"
                  onClick={() => {
                    router.push("/TermsandCondition");
                    setOpen(false);
                  }}
                >
                  <IoMdPaper size={16} />
                  Terms & Conditions
                </p>
                <p
                  className="flex items-center gap-2  text-sm p-2 text-gray-700 hover:text-primary cursor-pointer"
                  onClick={() => {
                    router.push("/blog");
                    setOpen(false);
                  }}
                >
                  <GrBlog /> Blog
                </p>
              </div>

              {/* <Separator /> */}

              {token && (
                <p
                  onClick={() => {
                    router.push("/my-profile");
                    setOpen(false);
                  }}
                  className="flex items-center gap-2  text-sm p-2 text-gray-700 hover:text-primary cursor-pointer"
                >
                  <User size={16} /> My Profile
                </p>
              )}
              {/* <p className="flex items-center gap-2  text-sm p-2 text-gray-700 hover:text-primary cursor-pointer">
                <Settings size={16} /> Settings
              </p> */}
            </div>
          </div>
          <DrawerFooter className="pt-2 border-t border-gray-300 absolute bottom-0 w-full">
            {/* <p className="flex items-center gap-2  text-sm p-2 text-gray-700 hover:text-primary cursor-pointer">
              <HelpCircle size={16} /> Help
            </p> */}
            {token && (
              <p
                onClick={handleLogout}
                className="flex items-center gap-2  text-sm p-2 text-red cursor-pointer"
              >
                <LogOut size={16} /> Logout Account
              </p>
            )}

            <label className="flex gap-2 items-center text-sm px-2">
              <BiSolidMessageAdd className="text-black/50"/>
              Follow us on
            </label>
            <div className="flex gap-2 px-2">
              <Link
                href={"https://www.instagram.com/8_sqft/"}
                className="p-2 rounded-full bg-black/50 hover:bg-primary text-white"
                target="_blank"
              >
                <BsInstagram size={17}/>
              </Link>
              <Link
                href={"https://www.facebook.com/people/8-sqft/61571128571431/"}
                className="p-2 rounded-full bg-black/50 hover:bg-primary text-white"
                target="_blank"
              >
                <FaFacebookF size={17} />
              </Link>
              <Link
                href={"#"}
                className="p-2 rounded-full bg-black/50 hover:bg-primary text-white"
                onClick={openWhatsapp}
              >
                <BsWhatsapp size={17} />
              </Link>
              <Link
                href={"https://www.youtube.com/@8sqft-India"}
                className="p-2 rounded-full bg-black/50 hover:bg-primary text-white"
                target="_blank"
              >
                <BsYoutube size={17} />
              </Link>
              <Link
                href={"https://www.linkedin.com/company/8sqft"}
                className="p-2 rounded-full bg-black/50 hover:bg-primary text-white"
                target="_blank"
              >
                <FaLinkedinIn size={17} />
              </Link>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="z-50 text-black hidden">
        {/* Trigger Button */}
        <Button
          variant="ghost"
          className="text-white p-0 transition-transform duration-200 hover:scale-105 flex self-center"
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <MdClose size={30} /> : <RiMenuLine size={30} />}
        </Button>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed mt-10 inset-0 bg-[#a1a1a180] backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          >
            {/* Sidebar */}
            <div
              className={`bg-white fixed mt-10 right-0 h-screen overflow-y-scroll shadow-lg transform transition-transform duration-500
               ease-in-out w-[300px] ${isOpen ? "" : "-translate-x-full"}`}
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
                    className="block transform transition-all duration-200 hover:scale-[1.02] bg-[#FC6600]"
                  >
                    <p className="text-md font-normal text-white hover:text-white rounded-md p-3 hover:border-primary transition-all duration-300">
                      Post Your Property
                    </p>
                  </Link>
                  {/* <Link
                  href="/Rental-Agreement"
                  onClick={() => setIsOpen(false)}
                  className="block transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <p className="text-md font-normal text-gray-700 hover:text-black rounded-md p-3 hover:border-primary transition-all duration-300">
                    Rental Agreement
                  </p>
                </Link> */}
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
    </>
  );
}

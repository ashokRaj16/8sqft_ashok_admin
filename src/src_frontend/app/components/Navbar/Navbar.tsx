'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { RiMenuLine } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Select, SelectContent, SelectTrigger } from "@/ui/select";

import { useStore } from "@/Store/store";
import { useAuthStore } from "@/Store/jwtTokenStore";
import { Button } from "@/ui/Button";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/ui/menu";

import MultiStepForm from "@/app/CompoundComponent/MultiStepForm";
import UserCard from "@/ui/userCard";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/ui/sheet";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/ui/HoverCard";
import SheetMenu from "@/Compound-component/sheet-menu";
import useDialogStore from "@/Store/useDialogStore ";
import {usejwtAuthStore}  from "@/Store/jwtTokenDecodeAllStore"
import { jwtTokenDecodeAll } from "@/lib/jwtTokenDecodeAll";
import { useRouter } from "next/navigation";
import axios from "@/hooks/index";
import useGetProfileDetails from "@/hooks/useGetProfileDetails";
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Extract Zustand selector functions outside the component

const Navbar = () => {
   const router = useRouter();
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore()

  // Use the extracted selector

  const id = useAuthStore((state) => state.id);
  const email = useAuthStore((state) => state.email);
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { clearProfile  } = useGetProfileDetails();
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useStore((state) => state.location);
  const value = token ? jwtTokenDecodeAll(token) : null;
  const name = value?.first_name 
console.log(value,'valuevalue')
  const handleLogout = () => {
    clearProfile();
    clearAuth();
    localStorage.removeItem("authToken");
    router.push("/");
    console.log("User logged out successfully.");
  };


  const { profile, loading, error, fetchProfile } = useGetProfileDetails();

// console.log(profile,'profileprofile')
  useEffect(() => {
    if (token) {
      fetchProfile(token);
    }
  }, [token, fetchProfile]);


  

  return (
    <>
      <div className=" w-full px-3 sm:px-5 py-3 h-18 shadow-md fixed z-50 bg-[#222222]">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 sm:gap-3 lg:w-[40%]">
            <Link href="/">
              <Image
                src={"/assets/logo/ForWebSiteWhite.svg"}
                alt="SQFT"
                width={130}
                height={100}
              />
            </Link>

            <div className="hidden w-full max-w-fit self-center p-3">
              <Select>
                <SelectTrigger>Select a city</SelectTrigger>
                <SelectContent>{location?.placeName}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 self-center ">
            
            <Link href="/Post-Property">
              <Button
                variant="outline"
                className="hidden bg-[#fff] text-primary text-sm font-thick rounded-md self-center p-2 lg:flex"
              >
                Post Your Property
              </Button>
            </Link>
                      
            <div className="sm:flex self-center border-none">
              {token ? (
                <UserCard
                  name={name || "User"}
                  onLogout={handleLogout}
                />
              ) : (
                <Menubar className="flex self-center px-1 border-none">
                  <MenubarMenu>
                    <MenubarTrigger 
                      className="border-2 rounded-full p-2 border-white"
                      onClick={() => {
                        openDialog();                                                 
                      }}>
                      <FaUser className="text-white  " />
                    </MenubarTrigger>
                    {/* <MenubarContent >
                    <MenubarItem>
                      <div className=" sm:max-w-[350px] sm:block bg-white border-none p-4 relative">
                        <p className="font-bold mb-5">LOGIN/REGISTER</p>

                        <div className="flex gap-5 justify-center items-center">
                          <Button
                            variant="outline"
                            onClick={() => {
                              openDialog();
                                                       
                            }}
                          >
                            LOGIN
                          </Button>
                        </div>
                      </div>
                    </MenubarItem>
                    </MenubarContent> */}
                  </MenubarMenu>
                </Menubar>
              )}
            </div>
            <div className="relative mr-4 ">
              <div className="">
                <SheetMenu />
              </div>
            </div>
          </div>
        </div>

        {isDialogOpen && (
          <div className="absolute top-0 left-0 w-screen h-screen">
            <div className="flex justify-center items-center h-full rounded-md p-4">
              <div className="z-50 max-w-[450px] flex w-full absolute top-10 bg-white rounded-md p-8 h-fit">
                <MultiStepForm closeDialog={closeDialog}/>

                <MdOutlineClose
                  className="absolute top-2 right-2"
                  onClick={() => closeDialog()}
                />
              </div>

              <div className="fixed inset-0 bg-black/80 z-10"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;

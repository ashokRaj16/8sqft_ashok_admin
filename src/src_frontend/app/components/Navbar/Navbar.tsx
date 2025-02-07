'use client';
import Link from "next/link";
import React from "react";
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
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// Extract Zustand selector functions outside the component

const Navbar = () => {
  
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore()

  // Use the extracted selector

  const id = useAuthStore((state) => state.id);
  const email = useAuthStore((state) => state.email);
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const location = useStore((state) => state.location);
  const value = token ? jwtTokenDecodeAll(token) : null;
  const name = value?.first_name 
  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("authToken");
    console.log("User logged out successfully.");
  };

  return (
    <>
      <div className=" w-full px-3 sm:px-5 py-3 h-18 shadow-md fixed z-50 bg-white">
        <div className="flex justify-between">
          <div className="flex gap-1 sm:gap-3 lg:w-[40%]">
            <Link href="/">
              <Image
                src={"/assets/logo/ForWebSite-01.svg"}
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

          <div className=" flex gap-4 self-center ">
            {/* <div className="flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "text-black hover:opacity-100"
                      : "hover:text-black hover:opacity-100",
                    "px-3 py-4 text-md font-normal opacity-75"
                  )}
                  aria-current={item.href ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div> */}
            {/* {token ? ( */}
            <Link href="/Post-Property">
              <Button
                variant="outline"
                className="hidden text-primary text-sm font-thin rounded-md self-center p-2 border-primary lg:flex"
              >
                Post Your Property
              </Button>
            </Link>
           
            <div className=" sm:flex  self-center">
              {token ? (
                <UserCard
                  name={name || "User"}
                  onLogout={handleLogout}
                />
              ) : (
                <Menubar className="flex self-center py-2 px-1">
                  <MenubarMenu>
                    <MenubarTrigger>
                      <FaUser />
                    </MenubarTrigger>
                    <MenubarContent>
                      <div className=" sm:max-w-[350px] sm:block bg-white border-none p-4 relative">
                        <p className="font-bold mb-5">LOGIN/REGISTER</p>

                        <div className="flex gap-5 justify-center items-center">
                          <Button
                            variant="outline"
                            onClick={() => openDialog()}
                          >
                            LOGIN
                          </Button>
                        </div>
                      </div>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              )}
            </div>
            <div className="relative mr-7">
              <div className="absolute right-0 left-1 ">
                <SheetMenu />
              </div>
            </div>
          </div>
        </div>

        {isDialogOpen && (
          <div className="absolute top-0 left-0 w-screen h-screen">
            <div className="flex justify-center items-center h-full rounded-md p-4">
              <div className="z-50 max-w-[450px] flex w-full absolute top-10 bg-white rounded-md p-8 h-fit">
                <MultiStepForm />

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

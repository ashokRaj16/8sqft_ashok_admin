"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardTitle } from "@/ui/card";
export default function RentalAgreementComponent() {
  return (
   
      <div className=" w-full mx-auto  max-w-7xl">
        <div className="w-full p-5">
          <CardTitle className="text-4xl text-black">
            Online Rent Agreement in Pune
          </CardTitle>

          <div className="flex gap-5 mt-5 flex-wrap">
            <Card className="w-full max-w-xl p-5 flex gap-2 rounded-md">
              <Image
                src="/assets/RentalAgreement/Rentalpolice.svg"
                alt="renew.icon"
                width={30}
                height={10}
                className="self-center"
              />
              <div className="grid self-center">
                <CardTitle className="text-md  font-bold">
                Renew Your Agreement
                </CardTitle>
                <p className="text-sm  font-thin text-gray">
                  Renew your existing Agreement
                </p>
              </div>
            </Card>
            <Card className="w-full max-w-xl p-5 flex align-middle gap-2 rounded-md">
              <Image
                src="/assets/RentalAgreement/completeAgreement.svg"
                alt="renew.icon"
                width={30}
                height={10}
              />
              <CardTitle className="text-md font-bold self-start  mt-1">
                Finish your Agreement
              </CardTitle>
            </Card>
          </div>
          <div className="mt-10 flex w-full  gap-8 flex-wrap">
            <p className="text-sm  font-[500] text-gray ">
              SELECT A RENT AGREEMENT
            </p>
            <div className="bg-gray  w-[80%] h-[1px] my-1 self-center sm:block hidden "></div>
          </div>
          <div className="mt-10 flex gap-5 justify-center flex-wrap ">
            <Link href="/Rental-Agreement/Rental">
              <Card className="relative w-full max-w-sm p-5 flex justify-between hover:shadow-md rounded-md">
                <CardTitle className="text-md font-[500] text-gray-dark h-40 w-[50%]">
                  Rental Agreement + Police Intimation
                </CardTitle>
                <Image
                  src="/rental-agreement_15166371.png"
                  width={100}
                  height={30}
                  alt="Rental-Agreement-logo"
                  className="opacity-50"
                />
                <div className="w-full h-fit text-white absolute bg-gradient-to-r from-[#fc6600] to-white bottom-5 text-center left-0" >upto 100% off </div>
              </Card>
            </Link>
            <Card className="relative w-full max-w-sm p-5 flex justify-between hover:shadow-md rounded-md">
              <CardTitle className="text-md font-[500] text-gray-dark h-40 w-[50%]">
                Rental Agreement
              </CardTitle>
              <div>
              <div className="origin-top-left rotate-[75deg] w-[135.99px] h-[133.94px] relative">
               
              </div>
              </div>
              <div className="w-full h-fit text-white absolute bg-gradient-to-r from-[#fc6600] to-white bottom-5 text-center left-0" >upto 100% off </div>
            </Card>
           
          </div>
        </div>
      </div>
   
  );
}

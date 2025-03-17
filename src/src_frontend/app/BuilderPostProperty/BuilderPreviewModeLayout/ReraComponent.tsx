import { Card, CardContent, CardHeader } from "@/ui/card";

import { useMediaQuery } from "usehooks-ts";
import Link from "next/link";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/Button";
import Image from "next/image";

interface ReraComponentProps {
  reraNumber?: string | null; // RERA number passed dynamically
}

export default function ReraComponent({ reraNumber }: ReraComponentProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");

 

  // Desktop Version
  if (reraNumber) {
    return (
      <div className="flex items-start justify-between bg-white lg:border rounded-lg lg:p-5 px-2 lg:gap-5">
      <Image
        src="/assets/rera/RERA.svg"
        alt="RERA Icon"
        className="w-28 h-28 hidden lg:block"
        width={28}
        height={28}
      />
      <div className="flex flex-col gap-2 lg:gap-4  lg:w-auto w-1/2">
        {/* RERA Approved Section */}
        <div className="flex items-center gap-3">
          <Image
            src="/assets/rera/approved.svg"
            alt="Approved Icon"
            className="w-6 h-6"
            width={6}
            height={6}
          />
          <div className="font-semibold lg:text-lg text-sm">RERA Approved</div>
        </div>
        <p className="text-xs lg:text-sm text-[#222222CC] font-light line-clamp-5 lg:line-clamp-none">
          The Real Estate (Regulation and Development) Act, 2016 is an Act of
          the Parliament of India which seeks to protect buyers as well as
          help boost investments in the real estate industry. The Act came
          into force on 1 May 2016.
        </p>

        {/* ID Information Section */}
        <div className="flex flex-wrap lg:flex-col justify-start items-center lg:items-start">   
              <div className="text-[10px] lg:text-sm font-semibold text-[#22222299]">
                Builder Project RERA ID
              </div>
              <Link href={"https://maharera.maharashtra.gov.in/"} className="lg:mt-2 text-primary text-[10px] lg:text-xs font-medium lg:bg-primary-light px-3 w-fit py-1 rounded-md underline">
                {reraNumber || "Not Available"}
              </Link>
         
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-center gap-2 lg:gap-4 text-center lg:w-auto w-1/2">
        <Image
          src="/assets/rera/QRCode.png"
          alt="QR Code"
          className="w-24 h-24"
          width={100}
          height={100}
        />
 
         <p className="text-xs text-[#222222CC]">Scan this code to view Maharera website</p>
       
 
          <Link className="text-[#1DA5F1] text-[10px] lg:text-xs" href="https://maharerait.mahaonline.gov.in/">
          https://maharerait.mahaonline.gov.in/
          </Link>
      </div>
    </div>
    );
  }
  return null;
}

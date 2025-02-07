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

  if (isMobile) {
    // Mobile Version
    return (
      <Card className="p-1 flex flex-col justify-start items-start border-none">
        {/* Header Section */}
        <CardHeader className="w-full p-1 bg-white border-b border-[#fc6600] flex items-center gap-1">
          <span className="text-[#222222] text-sm font-medium text-start w-full">
            Information
          </span>
        </CardHeader>

        {/* Body Section */}
        <CardContent className="w-full h-full px-1 py-2 bg-white flex flex-col gap-4">
          {/* Rera Section */}
          <div className="flex flex-col gap-2">
            <span className="text-[#222222] text-xs font-medium">RERA</span>
            <Link href="https://maharerait.mahaonline.gov.in/">
              <div className="flex justify-between items-center">
                <span className="text-[#222222] text-xs font-light">
                  {reraNumber || "Not Available"}
                </span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Desktop Version
  if (reraNumber) {
    return (
      <div className="flex flex-col md:flex-row items-start justify-between bg-white p-5 gap-5">
        <Image
          src="/assets/rera/RERA.svg"
          alt="RERA Icon"
          className="w-28 h-28"
          width={28}
          height={28}
        />
        <div className="flex flex-col gap-4">
          {/* RERA Approved Section */}
          <div className="flex items-center gap-3">
            <Image
              src="/assets/rera/approved.svg"
              alt="Approved Icon"
              className="w-6 h-6"
              width={6}
              height={6}
            />
            <div className="font-semibold text-lg">RERA Approved</div>
          </div>
          <p className="text-sm text-gray-600">
            The Real Estate (Regulation and Development) Act, 2016 is an Act of
            the Parliament of India which seeks to protect buyers as well as
            help boost investments in the real estate industry. The Act came
            into force on 1 May 2016.
          </p>

          {/* ID Information Section */}
          <div className="flex flex-wrap items-center gap-8">
            {/* Builder Project RERA ID */}
            <Card className="w-64 border-none">
              <CardContent className="p-4">
                <div className="text-sm font-medium">
                  Builder Project RERA ID
                </div>
                <Badge className="mt-2 text-primary bg-primary-light px-3 py-1 rounded-md border-none">
                  {reraNumber || "Not Available"}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/assets/rera/QRCode.svg"
            alt="QR Code"
            className="w-24 h-24"
            width={6}
            height={6}
          />
          <div className="text-sm">
            <p>Scan this code</p>
            <p>to view Maharera website</p>
          </div>
          <Button variant="link" className="text-blue-500 text-xs" asChild>
            <Link href="https://maharerait.mahaonline.gov.in/">
              {reraNumber || "Not Available"}
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  return null;
}

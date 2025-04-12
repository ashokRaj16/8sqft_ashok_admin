import { Card } from "@/ui/card";
import { hexToRgba } from "@/utils/hexToRGB";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";


interface ReraProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  builderResponseData: any; 
}
export default function Rera({
  themeColors,
  builderResponseData
}: ReraProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const propertyData=builderResponseData?.property;
  return (
    <>
      {propertyData?.is_rera_number==1&&(<div className="my-4" style={{ color: themeColors.themeColorDark }}>
        <h3 className="font-semibold my-2  text-lg">
          RERA Approved / PMC Sanction
        </h3>

        <Card
          className="border-none p-1 lg:p-6 flex flex-col md:flex-row justify-between items-center rounded-none w-full"
          style={{ backgroundColor:  themeColors.themeColorLight }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center lg:gap-4 w-full md:w-2/3">
            <div className="flex justify-center w-full">
              <div
                className="rotate-[14deg] lg:rotate-0"
                style={{
                  width: isMobile ? 100 : 180,
                  height: isMobile ? 100 : 180,
                  backgroundColor: themeColors.themeColorDark,
                  maskImage: `url(/assets/BuilderShowcase/rera.svg)`,
                  WebkitMaskImage: `url(/assets/BuilderShowcase/rera.svg)`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
              ></div>
            </div>
            {/* <Image
               src="/assets/BuilderShowcase/rera.svg"
          alt="RERA Approved"
          width={100}
          height={100}
          className="w-80 "
        /> */}
            <div>
              <h3 className="flex items-center text-lg font-semibold">
                <BadgeCheck className="mr-2" /> RERA Approved
              </h3>
              <p className=" mt-1 text-xs">
                The Real Estate (Regulation and Development) Act, 2016 is an Act
                of the Parliament of India which seeks to protect buyers as well
                as help boost investments in the real estate industry. The Act
                came into force from 1 May 2016.
              </p>
              <p className="mt-2 text-sm font-medium">
                Builder Project Rera ID{" "}
                <span className="font-bold">{propertyData?.rera_number}</span>
              </p>
            </div>
          </div>
          <div className="flex lg:flex-col flex-row items-center mt-4 md:mt-0">
            <Image
              src="/assets/BuilderShowcase/qr.svg"
              alt="QR Code"
              width={100}
              height={100}
              className="object-contain"
            />
            <div className="text-center">
              <p className="text-xs mt-2">
                Scan this code to view MahaRERA website
              </p>
              <a
                href="https://maharerait.mahaonline.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className=" text-xs underline mt-1"
              >
                https://maharerait.mahaonline.gov.in/
              </a>
            </div>
          </div>
        </Card>
      </div>)}
    </>
  );
}

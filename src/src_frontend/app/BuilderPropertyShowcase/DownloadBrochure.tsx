import Image from "next/image";
import LogoBlack from "@/public/assets/BuilderShowcase/LogoBlack.svg";
import { useEffect, useState } from "react";
import useShareContactDetail from "@/hooks/Postpropertyhooks/useShareContact";
import useShareWhatsappDetail from "@/hooks/Postpropertyhooks/useShareWhatsappDetail";
import useDialogStore from "@/Store/useDialogStore ";
import { useAuthStore } from "@/Store/jwtTokenStore";
import usePdfStore from "@/Store/fileStore";

interface themeColorsProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  builderResponseData: any; 
  reviewData: any; 
  propertyId: any;
}

export default function DownloadBrochure({
  themeColors,
  builderResponseData,
  reviewData,
  propertyId
}: themeColorsProps) {
  const propertyData=builderResponseData?.property;
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
    const token = useAuthStore((state) => state.token);
    const { pdfUrl } = usePdfStore();
  
  
    const handleOpenInNewTab = () => {
      if (pdfUrl && token) {
        window.open(pdfUrl, "_blank", "noopener,noreferrer");
      } else {
        openDialog();
      }
    };

    const handleOwnerContactClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (token) {
  
        handleClick();
      } else {
        openDialog();
      }
    }
  
    const handleClick = () => {
      if (propertyId !== null) {
        shareContact({ propertyId: propertyId });
        shareWhatsapp({ propertyId: propertyId });
      }
      setDialogOpen(true);
    };
    const { mutate: shareContact } = useShareContactDetail({
      onSuccess: (data) => {
        console.log("Successfully sent contact details", data);
      },
      onError: (error) => {
        console.log("Error in sending contact details", error);
      },
    });
  
    const { mutate: shareWhatsapp } = useShareWhatsappDetail({
      onSuccess: (data) => {
        console.log("Successfully sent contact details", data);
      },
      onError: (error) => {
        console.log("Error in sending contact details", error);
      },
    });

  return (
    <>
    <div
      className="border rounded-lg p-4 flex flex-col lg:gap-2 md:flex-row items-center  shadow-sm"
      style={{ borderColor: themeColors.themeColorDark }}
    >
      <div className="flex flex-col items-center justify-center">
        <Image src={propertyData.property_logo_url} width={190} height={135} alt="logo" className="w-28" />
        <p
          className="opacity-50 text-sm"
          style={{ color: themeColors.themeColorDark }}
        >
          {propertyData.landmark},  {propertyData.locality}, {propertyData.city_name}
        </p>
      </div>

      <div>
        <div className="grid grid-cols-2 lg:grid-cols-5 justify-center gap-2 my-4 md:my-0">

         {propertyData?.is_rera_number==1&&( <div
            className="flex flex-col justify-center items-center gap-2 w-28 h-20 border-2 rounded-lg shadow-sm"
            style={{ borderColor: themeColors.themeColorDark }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                backgroundColor: themeColors.themeColorDark,
                maskImage: `url(/assets/BuilderShowcase/rera_approved.svg)`,
                WebkitMaskImage: `url(/assets/BuilderShowcase/rera_approved.svg)`,
                maskSize: "cover",
                WebkitMaskSize: "cover",
              }}
            ></div>

            <span
              className="text-xs font-medium"
              style={{ color: themeColors.themeColorDark }}
            >
              RERA Approved
            </span>
          </div>)}
          
          <div
            className="flex flex-col justify-center items-center gap-2 w-28 h-20 border-2 rounded-lg shadow-sm"
            style={{ borderColor: themeColors.themeColorDark }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                backgroundColor: themeColors.themeColorDark,
                maskImage: `url(/assets/BuilderShowcase/power_pack.svg)`,
                WebkitMaskImage: `url(/assets/BuilderShowcase/power_pack.svg)`,
                maskSize: "cover",
                WebkitMaskSize: "cover",
              }}
            ></div>

            <span
              className="text-xs font-medium"
              style={{ color: themeColors.themeColorDark }}
            >
              Power Pack
            </span>
          </div>
         {reviewData?.average_rating>0&&( <div
            className="flex flex-col justify-center items-center gap-2 w-28 h-20 border-2 rounded-lg shadow-sm"
            style={{ borderColor: themeColors.themeColorDark }}
          >
           <h2
              className="text-lg font-medium"
              style={{ color: themeColors.themeColorDark }}
            >
              {reviewData?.average_rating}/5
            </h2>

            <span
              className="text-xs font-medium"
              style={{ color: themeColors.themeColorDark }}
            >
              Rating
            </span>
          </div>)}
          <div
            className="flex flex-col justify-center items-center gap-2 w-28 h-20 border-2 rounded-lg shadow-sm"
            style={{ borderColor: themeColors.themeColorDark }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                backgroundColor: themeColors.themeColorDark,
                maskImage: `url(/assets/BuilderShowcase/assure.svg)`,
                WebkitMaskImage: `url(/assets/BuilderShowcase/assure.svg)`,
                maskSize: "cover",
                WebkitMaskSize: "cover",
              }}
            ></div>

            <span
              className="text-xs font-medium"
              style={{ color: themeColors.themeColorDark }}
            >
              Assure
            </span>
          </div>
          <div
            className="flex flex-col justify-center items-center gap-2 w-28 h-20 border-2 rounded-lg shadow-sm"
            style={{ borderColor: themeColors.themeColorDark }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                backgroundColor: themeColors.themeColorDark,
                maskImage: `url(/assets/BuilderShowcase/no_brokrage.svg)`,
                WebkitMaskImage: `url(/assets/BuilderShowcase/no_brokrage.svg)`,
                maskSize: "cover",
                WebkitMaskSize: "cover",
              }}
            ></div>

            <span
              className="text-xs font-medium"
              style={{ color: themeColors.themeColorDark }}
            >
              No Brokerage
            </span>
          </div>
        </div>
        <div className="hidden lg:flex gap-4 mt-4">
          <button
           onClick={handleOwnerContactClick}
            className="text-white px-4 py-2 text-sm rounded Imgshine"
            style={{ backgroundColor: themeColors.themeColorDark }}
          >
            Contact Builder
          </button>
        {pdfUrl&&(  <button
            className="text-white px-4 py-2 text-sm rounded Imgshine"
            style={{ backgroundColor: themeColors.themeColorDark }}
            onClick={handleOpenInNewTab}
          >
            Download Brochure
          </button>)}
        </div>
      </div>
    </div>
    <div className="relative  ">
            {dialogOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
                <div className="bg-white p-5 border border-gray-300 rounded-md shadow-md max-w-sm w-full">
                  <h1 className="font-bold">Contact Details Sent</h1>
                  <p className="text-sm">
                    We have successfully sent the owner contact details on your
                    WhatsApp and Email. Feel free to contact the owner directly.
                  </p>
                  <div className="w-full ">
                    <button
                      className="bg-primary text-white px-4 py-2 rounded-md my-3 self-center w-full"
                      onClick={() => setDialogOpen(false)} // Close the dialog
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
    </>
  );
}

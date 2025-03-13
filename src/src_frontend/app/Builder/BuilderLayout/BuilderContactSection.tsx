"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import usePropertyDetail from "@/hooks/usePropertygetDetail";
import { FaWhatsapp } from "react-icons/fa";

import useShareContactDetail from "@/hooks/Postpropertyhooks/useShareContact";
import useShareWhatsappDetail from "@/hooks/Postpropertyhooks/useShareWhatsappDetail";
import { useAuthStore } from "@/Store/jwtTokenStore";
import useDialogStore from "@/Store/useDialogStore ";
import { MdOutlineClose } from "react-icons/md";
import { Card, CardContent } from "@/ui/card";
import { Button } from "@/ui/Button";
import { Download, Phone, X } from "lucide-react";
import usePdfStore from "@/Store/fileStore";
import { ImWhatsapp } from "react-icons/im";
import { jwtTokenDecodeAll } from "@/lib/jwtTokenDecodeAll";

const BuilderContactSection: React.FC = () => {
  // const property = data?.data;

  const [dialogOpen, setDialogOpen] = useState(false); // State to handle dialog visibility
  const params = useParams(); // Retrieve route parameters
  const extractId = (url:any) => {
    if (!url || typeof url !== "string") return null; // Ensure it's a string
    const match = url.match(/-(\d+)$/);
    return match ? match[1] : null;
  };
  const id = extractId(params.id);
  
  const propertyId = params?.id ? Number(id) : null;
  // const propertyIdNumber = Array.isArray(propertyId)
  //   ? Number(propertyId[0])
  //   : Number(propertyId);
  const { data, isLoading, error } = usePropertyDetail(Number(propertyId));

  const property = data?.data;
  // Use the custom hook to share contact details
  const { pdfUrl } = usePdfStore(); // Access the stored PDF URL from Zustand
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  console.log(pdfUrl,'propertyproperty123')

  const handleButtonClick = (
    button: string,
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void
  ) => (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedButton(button); // Update the selected button
    callback(e); // Execute the original click function
  };

  const handleOpenInNewTab = () => {
    if (pdfUrl && token) {
      // Open the PDF in a new tab
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    } else {
      openDialog();
    }
  };

    useEffect(() => {
      setShowPopup(true);
    }, []);

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
  // WhatsApp message generation
  const whatsappNumber = "+7219009062"; // Replace with the desired number
  const whatsappMessage = `Hello, I am interested in your property: ${data?.data.property_title}`; // Replace with the desired message
  const handleClick = () => {
    if (propertyId !== null) {
      shareContact({ propertyId: propertyId });
      shareWhatsapp({ propertyId: propertyId });
    }
    setDialogOpen(true);
  };


  const handleOwnerContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (token) {
      // If logged in, call handleClick
      handleClick();
    } else {
      openDialog(); // Open login dialog if not logged in
    }
  };


  const handleOwnerContactWhatsappClick = (e: React.MouseEvent) => {
    e.preventDefault();
  
    const phoneNumber = property?.mobile;
    console.log("mobile nummmm",phoneNumber)
    console.log("phoneNumber", phoneNumber);
  
    if (!phoneNumber) {
      console.error("Phone number is missing.");
      return;
    }
  
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${phoneNumber}`;
  console.log(whatsappUrl,'whatsappUrl')
    if (token) {
      handleClick();
      window.open(whatsappUrl, "_blank");
    } else {
      openDialog();
    }
  };
  

  const token = useAuthStore((state) => state.token);
  console.log("token")
 const value = token ? jwtTokenDecodeAll(token) : null;

  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
  return (
    <>
      <div className="relative flex  lg:gap-2  lg:w-fit">

        <div className="flex w-full lg:w-auto flex-row gap-2 m-2 lg:mr-6">
          {pdfUrl &&(<Button
            variant="outline"
            className={`flex items-center gap-[2px] rounded-none lg:rounded w-full lg:w-42 ${selectedButton === "download"
              ? "text-white bg-primary"
              : "lg:text-primary lg:bg-white text-white bg-primary"
              }`}
            onClick={handleButtonClick("download", handleOpenInNewTab)}
          >
            <Download className="w-5 h-5 mr-2" />
            <p className="text-xs lg:text-sm">Brochure</p>
          </Button>)}

          {/* Contact Developer Button */}
          <Button
            variant="outline"
            className={`flex items-center gap-2 w-full rounded-none lg:rounded lg:w-42  ${selectedButton === "contact"
              ? "text-white bg-primary"
              : "text-primary bg-white"
              }`}
            onClick={handleButtonClick("contact", handleOwnerContactClick)}
          >
            <Phone className="w-5 h-5 mr-2" />
            <p className="text-xs lg:text-sm">Builder</p>
          </Button>

          {/* WhatsApp Button */}
        <div className="fixed lg:static right-20 bottom-24">
        <Button
            variant="outline"
            className={`fixed lg:static flex items-center gap-3 lg:w-full lg:h-[40px] h-[2.5rem] lg:px-4 lg:py-2 p-1 w-[2.5rem] rounded-full lg:rounded lg:border border-0  ${selectedButton === "whatsapp"
              ? "text-white bg-primary"
              : "text-primary lg:bg-white bg-[#65D072]"
              }`}
            onClick={handleButtonClick("whatsapp", handleOwnerContactWhatsappClick)}
          >
            <ImWhatsapp className="w-5 h-5 lg:text-green text-white" />
            <p className="text-[10px] lg:text-sm text-[#222222] hidden lg:block">WhatsApp</p>
          </Button>
        </div>
        </div>
          {/* Pop-up Message */}
      {showPopup && (
      <div className="bottom-[108px] lg:bottom-auto absolute bg-black text-white lg:w-fit w-[180px] px-4 py-2 rounded-full  lg:left-1/2 right-4 transform lg:-translate-x-1/2 mt-[3.5rem] lg:ml-12 ml-[6.7rem] z-[1]">
      <div className="absolute lg:top-0 top-[51px] rotate-180 lg:rotate-0 lg:left-[70%] left-[75%] transform -translate-x-1/2 -translate-y-full border-8 border-transparent border-b-black"></div>

     <div className="flex flex-row gap-1">
     <span className="text-sm text-center hidden lg:block whitespace-nowrap">Chat with Builder</span>
     <span className="text-sm text-center block lg:hidden">Chat with Builder</span>
      <button onClick={() => setShowPopup(false)}>
        <X className="w-5 h-5 text-white border-2 rounded-full  " />
      </button>
     </div>
    </div>
      )}


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
      </div>
    </>
  );
};

export default BuilderContactSection;

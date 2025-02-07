"use client";

import { useState } from "react";
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
import { Download, Phone } from "lucide-react";
import usePdfStore from "@/Store/fileStore";

const BuilderContactSection: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false); // State to handle dialog visibility

  const params = useParams(); // Retrieve route parameters
  const propertyId = params?.id; // Get the `id` parameter from the route
  const propertyIdNumber = Array.isArray(propertyId)
    ? Number(propertyId[0])
    : Number(propertyId);
  const { data, isLoading, error } = usePropertyDetail(Number(propertyId));
  const PropertyId = Number(propertyId);
  // Use the custom hook to share contact details
  const { pdfUrl } = usePdfStore(); // Access the stored PDF URL from Zustand

  const handleOpenInNewTab = () => {
    if (pdfUrl && token) {
      // Open the PDF in a new tab
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    } else {
      openDialog();
    }
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
  // WhatsApp message generation
  const whatsappNumber = "+7219009062"; // Replace with the desired number
  const whatsappMessage = `Hello, I am interested in your property: ${data?.data.property_title}`; // Replace with the desired message
  const handleClick = () => {
    shareContact({ propertyId: propertyIdNumber });
    shareWhatsapp({ propertyId: propertyIdNumber });
    setDialogOpen(true);
  };


  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
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
  
  const token = useAuthStore((state) => state.token);

  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
  return (
    <>
      <div className="relative flex  gap-2 lg:w-fit">
        <Button
          variant="outline"
          className=" flex items-center gap-2 bg-primary text-white "
          onClick={handleOpenInNewTab}
        >
          <Download className="w-5 h-5 mr-2" />
          <p className="text-[10px] lg:text-sm">Download Brochure</p>
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 bg-primary text-white  "
          onClick={handleOwnerContactClick} // Check if logged in before opening dialog // Check if logged in before opening dialog
        >
          <Phone className="w-5 h-5 mr-2" />
          <p className="text-[10px] lg:text-sm">Contact Developer</p>
        </Button>

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

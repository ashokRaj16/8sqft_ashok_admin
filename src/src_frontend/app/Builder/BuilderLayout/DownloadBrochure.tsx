"use client";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import { Heart, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { formatPrice } from "./overview-mobile";
import { useAuthStore } from "@/Store/jwtTokenStore";
import useShareContactDetail from "@/hooks/Postpropertyhooks/useShareContact";
import { useParams } from "next/navigation";
import useShareWhatsappDetail from "@/hooks/Postpropertyhooks/useShareWhatsappDetail";
import useDialogStore from "@/Store/useDialogStore ";
import 'font-awesome/css/font-awesome.min.css';
import Image from "next/image"


import axios from 'axios';
import { jwtTokenDecodeAll } from "@/lib/jwtTokenDecodeAll";

interface DownloadBrochure {
  title: string | undefined;
  projectArea: string | null | undefined;
  configration: configuration[] | undefined;
  per_sqft_amount: string | null | undefined;
  property_variety: string | undefined;
  possession_date: string | null | undefined;
  unit_type?: string | null;
  rera?: string | null | undefined;
}

interface configuration {
  id: number;
  unit_type?: string | null;
  unit_name?: string | null;
  length?: number;
  width?: number;
  carpet_area?: number;
  carpet_price?: number;
  width_unit?: string;
  length_unit?: string;
  unit_img_url: string;
  file_type?: string;
}
[];

const DownloadBrochure = ({
  title,
  projectArea,
  configration,
  per_sqft_amount,
  property_variety,
  possession_date,
  unit_type,
  rera,
}: DownloadBrochure) => {
  const email = "https://8sqft.com/";
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
  const params = useParams(); // Retrieve route parameters
  const propertyId = params?.id; // Get the `id` parameter from the route
  // State for success message
 const token = useAuthStore((state) => state.token);
  const decoded: any = jwtTokenDecodeAll(token || "");
  const propertyIdNumber = Array.isArray(propertyId)
    ? Number(propertyId[0])
    : Number(propertyId);

  const [buttonState, setButtonState] = useState("");  // Renamed state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);


  const handleButtonClick = async () => {
    setLoading(true);

    // Simulating an API call
    setTimeout(() => {
      setLoading(false);
      setButtonState("save"); // Change button state
      setShowPopup(true); // Show popup

      // Hide message after 3 seconds
      setTimeout(() => setShowPopup(false), 3000);
    }, 1000); // Simulating delay

    try {
      const response = await axios.post(
        "https://api.8sqft.com/api/v1/front/shortlist",
        { propertyId: propertyIdNumber },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
            Authorization: `Bearer ${token}`,

          }
        }
      );

      if (response.data.status) {
        setButtonState("save"); // Button should change if the property is added successfully
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to add property to wishlist. Please try again.");
    } finally {
      setLoading(false);
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

  const handleShortListClick =(e: React.MouseEvent)=>{
    e.preventDefault();
    if (token) {
      
      handleButtonClick();
    } else {
      openDialog();
    }
  }
  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    alert("Email copied to clipboard!");
  };

  const handleClick = () => {
    shareContact({ propertyId: propertyIdNumber });
    shareWhatsapp({ propertyId: propertyIdNumber });
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

  // Safely access configration[0].carpet_price
  const maxCarpetArea = configration
    ? Math.max(...configration.map((item) => item.carpet_area || 0))
    : null;

  const minCarpetArea = configration
    ? Math.min(...configration.map((item) => item.carpet_area || 0))
    : null;
  const unit = configration
    ? configration.map((item) => item.length_unit || 0)
    : null;
  // Property Details
  const propertyDetails = [
    {
      row: 1,
      items: [
        {
          label: "Project Area",
          value: projectArea ? `${projectArea} ${unit_type}` : "N/A",
        },
        {
          label: "Size",
          value: `${minCarpetArea} - ${maxCarpetArea} sq ft` || "N/A",
        },
        {
          label: "RERA ID",
          value: rera || "N/A",
        },
      ],
    },
    {
      row: 2,
      items: [
        {
          label: "Avg. Price",
          value: per_sqft_amount
            ? `${formatPrice(Number(per_sqft_amount))}/sq.ft`
            : "N/A",
        },
        { label: "Added", value: possession_date || "N/A" },
        { label: "Project Type", value: property_variety || "N/A" },
      ],
    },
  ];
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (isVisible) {
      // Ensure script is loaded
      const scriptId = "sharethis-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src =
          "https://platform-api.sharethis.com/js/sharethis.js#property=679778caeec4bb0012d85a05&product=inline-share-buttons";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          if (window.__sharethis__) {
            window.__sharethis__.initialize();
          }
        };
      } else {
        // Reinitialize ShareThis buttons on every open
        setTimeout(() => {
          if (window.__sharethis__) {
            window.__sharethis__.initialize();
          }
        }, 500);
      }
    }
  }, [isVisible]);


  return (
    <Card className="flex flex-col  gap-5 p-0 bg-white">
      <CardContent className="w-full p-0">
        {/* Header */}
        <div className="flex items-center px-5 py-1 bg-white shadow-sm border-b">
          <h2 className="font-medium text-base text-[#222222]">
            {title || "N/A"}
          </h2>
        </div>

        {/* Property Details */}
        <div className="flex flex-col gap-6 p-2">
          {propertyDetails.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-start gap-16">
              {row.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex flex-col gap-4 w-full">
                  <span className="text-sm text-[#22222280] font-light">
                    {item.label}
                  </span>
                  <span className="text-sm text-black font-light">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 justify-center p-4">
          <Button
            variant="secondary"
            onClick={() => {
              setActiveButton("share"), setIsVisible(true);
            }}
            className={`w-40 h-10 gap-2 rounded-sm ${activeButton === "share"
              ? "bg-primary text-white"
              : "bg-[#e6e6e6]"
              }`}
          >
            <Share2 className="h-4 w-4" />
            <span
              className={`text-xs font-light ${activeButton === "share" ? "text-white" : ""
                }`}
            >
              SHARE
            </span>
          </Button>
          {isVisible && (
            <div className="relative  ">
              {isVisible && (
           

                <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 flex flex-col justify-center items-center z-50 p-4">
                  <div className="bg-black  w-full max-w-sm p-6 rounded-lg shadow-lg">

                    <div className="flex justify-between items-center mb-4">
                      <p className="text-lg font-semibold text-white">Share</p>
                      <button
                        className="text-white px-4 py-2 rounded-md"
                        onClick={() => setIsVisible(false)}
                      >
                        x
                      </button>
                    </div>
                 <div className=" p-5   rounded-md shadow-md max-w-sm w-full flex justify-between">

                      <div className=" sharethis-inline-share-buttons gap-1" style={{ marginLeft: "8px", gap: "6px" }}></div>

                    </div>

                   <div className="mb-4">
                      <div className="flex items-center space-x-2 p-4  rounded-full  border-[1px] border-gray" >
                        <input
                          type="email"
                          value={email}
                          readOnly
                          className="p-2 w-full  rounded-md  "
                        />
                        <button
                          onClick={handleCopy}
                          className="bg-blue text-white px-4 py-2 rounded-full  border-white"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
                // <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
                //   <div className="bg-black p-5 border border-gray-300 rounded-md shadow-md max-w-sm w-full flex justify-between">

                //     <div className=" sharethis-inline-share-buttons"></div>
                //     <button
                //       className=" text-black px-4 py-2 rounded-md my-3 self-center border "
                //       onClick={() => setIsVisible(false)} // Close the dialog
                //     >
                //       x
                //     </button>
                //   </div>
                // </div>
              )}
            </div>
          )}

       

          <Button
            variant="secondary"
            onClick={handleShortListClick}
            className={`w-40 h-10 gap-2 rounded-sm ${buttonState === "save"
              ? "bg-[#fc6600] text-white"
              : "bg-[#e6e6e6]"
              }`}
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                <span
                  className={`text-xs font-light ${buttonState === "save" ? "text-white" : ""
                    }`}
                >
                  Shortlist
                </span>
              </>
            )}
          </Button>
          
        

          <Button

            onClick={handleOwnerContactClick}

            className="flex items-center gap-2 bg-primary text-white  "
          >
            <span
              className={`text-xs font-light ${activeButton === "details" ? "text-white" : "text-black"
                }`}
            >
              Ask for details
            </span>
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
       
      </CardContent>
      {showPopup && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-[#222222] p-4 rounded-lg shadow-lg">
      <p className="text-sm font-semibold text-center text-white mr-4">
       Property Shortlisted
      </p>
    </div>
  </div>
)}

      
    </Card >
  );
};

export default DownloadBrochure;

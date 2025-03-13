import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import useBuilderPropertylist from "@/hooks/useBuilderPropertyList";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BiRightArrowAlt } from "react-icons/bi";
import { formatPrice } from "./overview-mobile";
import { useEffect, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { useAuthStore } from "@/Store/jwtTokenStore";
import useDialogStore from "@/Store/useDialogStore ";
import axios from "@/hooks";
import ShareShortlist from "@/app/components/common/ShareShortlist";

declare global {
  interface Window {
    __sharethis__?: { initialize: () => void };
  }
}
interface propertyDataProps {
  propertyId: any;
}

export default function SimilarComponent({
  propertyId,
}: propertyDataProps) {
  const { data, isLoading, error } = useBuilderPropertylist({
    property_rent_buy: "PROJECT",
  });
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState<{ [key: number]: boolean }>({});
  const token = useAuthStore((state) => state.token);
  const properties = data?.data?.property || [];
  const filterdData = properties.filter((item) => item.id !== propertyId);
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`/Builder/${id}`);
  };
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const currentPath = "https://8sqft.com/Builder/" + selectedPropertyId;
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

  const handleButtonClick = async (id: number) => {

    try {
      const response = await axios.post("/api/v1/front/shortlist",
        { propertyId: id },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status) {
        setShowPopup((prev) => ({ ...prev, [id]: true }));

        setTimeout(() => {
          setShowPopup((prev) => ({ ...prev, [id]: false }));
        }, 2000);
      }
    } catch (err) {
      console.warn("Failed to add property to wishlist. Please try again.");
    }
  };

  const handleShortListClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (token) {
      handleButtonClick(id);
    } else {
      openDialog();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading properties</div>;
  }

  return (
    <>
      <h2 className="font-medium text-sm lg:text-lg text-[#222222] text-start w-full">
        Similar
      </h2>
      <div className="flex items-center p-1 bg-white border-b-2 border-[#fc6600] w-full "></div>
      <ReusableCarousel
        itemsPerView={{ default: 1, sm: 1, md: 2 }}
        className=""
      >
        {filterdData.map((property) => (
          <Card
            key={property.id}
            className="w-80 h-96 flex-shrink-0 shadow-md border border-gray-300 my-5"
            onClick={() => handleClick(property?.title_slug)}
          >
            <CardContent className="p-0 relative">
              {/* Image Section */}
              <div className="relative w-full h-56 rounded-t-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={property?.property_img_url || "default-image.png"}
                  alt={property.property_title || "Property Image"}
                />

                {/* Action Buttons */}
                <div className="flex items-center gap-4 justify-center p-4  absolute top-0 right-0">
                <ShareShortlist
           background={"bg-white"}
           shadow={"shadow-lg"}
           rounded={"rounded-lg"}
           fontSize={"text-xs"}
           textTransform={"uppercase"}
           fontWeight={"font-light"}
           hoverBackground={"hover:bg-primary"}
           hoverTextColor={"hover:text-white"}
           iconColor={"text-primary"}
           iconHoverColor={"group-hover:text-white"}
           propertyId={property?.id}
           propertyIdSlug={property?.title_slug}
           btnSaveText={"Save"}
           showBtnText={false}
           tooltip={"absolute  top-9 -translate-x-1/2 left-1/2"}
           tooltipArrow={"bottom-1 rotate-0 absolute left-[50%] transform -translate-x-1/2 -translate-y-full border-8 border-transparent border-b-black"}
          />
                  {/* <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVisible(true);
                      setSelectedPropertyId(property.id);
                    }}
                    className={`h-8 w-8 gap-2 rounded-full shadow-lg bg-white p-1`}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <div className="">
                    <Button
                      variant="secondary"
                      onClick={(e) => handleShortListClick(e, property.id)}
                      className={`h-8 w-8 gap-2 rounded-full shadow-lg bg-white p-1`}
                    >
                      <Heart className="h-4 w-4" />

                    </Button>

                    {showPopup[property.id] && (
                      <div className="absolute top-14 -translate-x-1/2 left-1/2">
                        <div className="bg-[#222222] p-2 shadow-lg rounded-2xl">
                          <p className="text-xs text-center text-white">
                            Property Shortlisted
                          </p>
                          <div className="absolute top-0 left-[73%] transform -translate-x-1/2 -translate-y-full border-8 border-transparent border-b-black"></div>
                        </div>
                      </div>
                    )}
                  </div> */}



                </div>

              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex flex-col items-start">
                  <h3 className="text-sm lg:text-md font-semibold">
                    {property.property_title || "No Title"}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Image
                      src="/assets/Similar/landmark.svg"
                      alt="Heart Icon"
                      className="w-5 h-4"
                      width={5}
                      height={5}
                    />
                    <span>
                      {property.locality}, {property.city_name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-start gap-1 border border-gray-400 rounded-md px-2 py-1">
                    <div className="text-sm font-medium">For Sale</div>
                    <div className="flex items-center gap-1 text-xs">
                      <b className="text-lg">
                        {property?.config_carpet_price
                          ? `${formatPrice(
                            Number(property.config_carpet_price)
                          )}`
                          : "N/A"}
                      </b>

                      {/* "Starting" with `text-sm` */}
                      {property?.config_carpet_price && (
                        <span className="text-sm">Starting</span>
                      )}
                    </div>
                  </div>

                  <Button className="bg-primary text-white h-full py-3 cursor-pointer ">
                    <BiRightArrowAlt size={30} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </ReusableCarousel>

      {isVisible && (
        <div className="  " onClick={(e) => e.stopPropagation()}>
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
                      type="text"
                      value={currentPath}
                      readOnly
                      className="p-2 w-full  rounded-md  "
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentPath);
                        alert("Link copied to clipboard!");
                      }}
                      className="bg-blue text-white px-4 py-2 rounded-full  border-white"
                    >
                      Copy
                    </button>
                  </div>
                </div>

              </div>
            </div >

          )}
        </div >
      )}
    </>
  );
}

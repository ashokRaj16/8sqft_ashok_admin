import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import useBuilderPropertylist from "@/hooks/useBuilderPropertyList";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiRightArrowAlt } from "react-icons/bi";
import { formatPrice } from "./overview-mobile";
import { useEffect, useState } from "react";
declare global {
  interface Window {
    __sharethis__?: { initialize: () => void };
  }
}
export default function SimilarComponent() {
  const { data, isLoading, error } = useBuilderPropertylist({
    property_rent_buy: "PROJECT",
  });

  const properties = data?.data?.property || [];
  const router = useRouter();
  const handleClick = (id: number) => {
    router.push(`/Builder/${id}`);
  };
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
        className="p-5"
      >
        {properties.map((property) => (
          <Card
            key={property.id}
            className="w-80 h-96 flex-shrink-0 shadow-md border border-gray-300 my-5"
            onClick={() => handleClick(property.id)}
          >
            <CardContent className="p-0 relative">
              {/* Image Section */}
              <div className="relative w-full h-60 rounded-t-xl overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={property?.property_img_url || "default-image.png"}
                  alt={property.property_title || "Property Image"}
                />
                <div className="absolute top-3 right-3   rounded-full flex items-center justify-center shadow-md">
                  <div className=" w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Image
                      src="/assets/Similar/Heart.svg"
                      alt="Heart Icon"
                      className="w-5 h-4 cursor-pointer"
                      width={5}
                      height={5}
                      onClick={() => {
                        setIsVisible(true);
                      }}
                    />
                  </div>
                  {isVisible && (
                    <div className="relative  ">
                      {isVisible && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
                          <div className="bg-white p-5 ">
                            <div className=" sharethis-inline-share-buttons"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className=" w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Image
                      src="/assets/Similar/share.svg"
                      alt="Heart Icon"
                      className="w-5 h-4"
                      width={5}
                      height={5}
                    />
                  </div>
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
    </>
  );
}

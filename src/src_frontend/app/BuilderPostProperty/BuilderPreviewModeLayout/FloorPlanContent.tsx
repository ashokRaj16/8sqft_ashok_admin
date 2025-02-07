"use client";
import { formatPrice } from "@/app/Builder/BuilderLayout/overview-mobile";
import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/tabs";
import Image from "next/image";
import React, { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
interface Configuration {
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

interface FloorPlanContentProps {
  configration?: Configuration[];
  possession_date?: string | null | undefined;
  propertytype?:string | null | undefined
}

export default function FloorPlanContent({
  configration,
  possession_date,
  propertytype
}: FloorPlanContentProps) {
  const [activeTabId, setActiveTabId] = useState(
    configration && configration.length > 0 ? configration[0].id : 0
  );

  const plotOptions = configration?.map((item) => {
    return {
      id: item.id,
      propertytype:'',
      size: `${item.carpet_area}`,
      price: `${formatPrice(Number(item.carpet_price))}`,
    };
  });

  const activeConfiguration = configration?.find(
    (item) => item.id === activeTabId
  );

  const propertyDetails = activeConfiguration
    ? [
        {
          label: "Builtup Area",
          value: `${activeConfiguration.carpet_area} sq ft`,
        },
        {
          label: "Dimension",
          value: `${activeConfiguration.width} x ${activeConfiguration.length}`,
        },
        { label: "Possession Status", value: possession_date || "N/A" },
      ]
    : [];
  const isMobile = useMediaQuery("(max-width: 640px)");
  const renderCardContent = (config: Configuration) => (
    <Card className=" px-2 mt-4 rounded-md p-0 w-[200px] h-[230px]">
      <CardContent className="p-0">
        <div className="flex flex-col items-start bg-white p-4 rounded-md">
          {/* Show the image above the text */}
          <div className="mb-4 flex justify-center w-full h-[6rem]">
            <Image
              src={config.unit_img_url} // Ensure this URL is valid
              alt="Plot Plan"
              width={200} // Image width
              height={140} // Image height
              layout="intrinsic" // This ensures the aspect ratio is maintained
              className="object-contain rounded-md w-full" // 'object-contain' will make sure the image fits inside the container without cropping
            />
          </div>

          <p className="text-xs mb-2 text-[#AAAAAA]">
            Plot Area:
            <span className="text-black">{config.carpet_area} sq.ft</span>
          </p>
          <p className="text-xs mb-2 text-[#AAAAAA]">
            Price:<span className="text-black"> ₹ {config.carpet_price}</span>
          </p>
          <button
            className="text-primary text-sm border-primary border px-2 py-1 rounded w-full"
            onClick={() => alert("Pressed!")}
          >
            Contact
          </button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4">
      {isMobile ? (
        <>
          <div>Price & Floor Plan</div>

          <ReusableCarousel itemsPerView={{ default: 1, sm: 1, md: 2 }}>
            {configration?.map((config) => (
              <div key={config.id}>{renderCardContent(config)}</div>
            ))}
          </ReusableCarousel>
        </>
      ) : (
        <div className="p-4">
          <Card className="w-[689px]">
            <CardHeader className="border-b">
              <CardTitle className="text-base font-semibold">
                Price & Plot Plan
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs
                value={activeTabId.toString()}
                onValueChange={(value) => setActiveTabId(Number(value))}
                className="w-full"
              >
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto">
                  {plotOptions?.map((plot) => (
                    <TabsTrigger
                      key={plot.id}
                      value={plot.id.toString()}
                      className={`data-[state=active]:border-b-2 data-[state=active]:border-[#fc6600] data-[state=active]:bg-white data-[state=active]:text-[#fc6600] rounded-none px-5 py-2`}
                    >
                      <div className="text-center">
                        <div className="text-sm">{plot.size} sqft </div>
                        <div className="text-xs">{plot.price}</div>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeTabId.toString()}>
                  <div className="p-4 flex gap-[42px]">
                    {propertyDetails.map((detail) => (
                      <div key={detail.label} className="flex flex-col gap-3">
                        <div className="text-sm font-normal text-black">
                          {detail.label}
                        </div>
                        <div className="text-sm font-light text-[#22222280]">
                          {detail.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeConfiguration && (
                    <div className="p-10 flex justify-center">
                      <img
                        className="w-[358px] h-[235px] object-cover"
                        alt="Plot Plan"
                        src={activeConfiguration.unit_img_url}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

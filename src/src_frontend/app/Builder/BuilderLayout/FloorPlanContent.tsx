"use client";
import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/tabs";
import Image from "next/image";
import React, { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { formatPrice } from "./overview-mobile";
interface Configuration {
  id: number;
  unit_type?: string | null;
  unit_name?: string | null;
  unit_price_type?: string | null;
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
  propertytype?: string | null | undefined;
  propertyVariety?: string | null | undefined;
}

export default function FloorPlanContent({
  configration,
  possession_date,
  propertytype,
  propertyVariety,
}: FloorPlanContentProps) {
  console.log("Configuration]",configration)

  const [activeTabId, setActiveTabId] = useState(
    configration ? configration[0]?.id : 0
  );

  const plotOptions = configration?.map((item) => {
    return {
      id: item.id,
      size: `${item.carpet_area}`,
      price: `${item.carpet_price}`,
      unitName: `${item.unit_name}`,
      unitPriceType: `${item.unit_price_type?item.unit_price_type:''}`,
    };
  });

  const activeConfiguration = configration?.find(
    (item) => item.id === activeTabId
  );

  // const propertyDetails = activeConfiguration
  //   ? [
  //     {
  //       label: "Builtup Area",
  //       value: `${activeConfiguration.carpet_area} sq ft`,
  //     },
  //     {
  //       label: "Dimension",
  //       value: `${activeConfiguration.width} x ${activeConfiguration.length}`,
  //     },
  //     { label: "Possession Status", value: possession_date || "N/A" },
  //   ]
  //   : [];

    const propertyDetails = activeConfiguration
  ? [
      {
        label: "Builtup Area",
        value: `${activeConfiguration.carpet_area} sq ft`,
      },
      ...(activeConfiguration.width && activeConfiguration.length
        ? [
            {
              label: "Dimension",
              value: `${activeConfiguration.width} x ${activeConfiguration.length}`,
            },
          ]
        : []),
      { label: "Possession Status", value: possession_date || "N/A" },
    ]
  : [];
  const isMobile = useMediaQuery("(max-width: 640px)");
  const renderCardContent = (config: Configuration) => (
    <Card className=" px-2 mt-4 rounded-md p-0 w-[165px] lg:w-[200px] h-[190px]">
      <CardContent className="p-0">
        <div className="flex flex-col items-start bg-white p-2 rounded-md">
          {/* Show the image above the text */}
          <div className="mb-9 flex justify-center w-full h-[6rem]">
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
            <span className="text-[#222222]">{config.carpet_area} sq.ft</span>
          </p>
          {/* <p className="text-xs mb-2 text-[#AAAAAA]">
            Price:<span className="text-black"> ₹ {config.carpet_price}</span>
          </p> */}
          <div className="text-xs text-[#AAAAAA]">Price:
            <span className="text-[#222222]"> {formatPrice(Number(config.carpet_price))}</span>

          </div>
          {/* <button
            className="text-primary text-sm border-primary border px-2 py-1 rounded w-full"
            onClick={() => alert("Pressed!")}
          >
            Contact
          </button> */}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="lg:mt-4 p-4 lg:p-0">
      {isMobile ? (
        <>
          <div className="text-lg font-semibold">Price & Floor Plan</div>

          <div>
            <ReusableCarousel className="w-full max-w-sm" itemsPerView={{ default: 1, sm: 1, md: 2 }}>
              {configration?.map((config) => (
                <div key={config.id}>{renderCardContent(config)}</div>
              ))}
            </ReusableCarousel>
          </div>
        </>
      ) : (
        <div className="">
          <Card className="">
            <CardHeader className="border-b">
              <CardTitle className="text-base font-semibold">
                Price & Plot Plan
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs
                value={activeTabId?.toString()}
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
                      {propertytype?.toLowerCase() ==="open land" &&( <div className="text-sm">{plot.size} sq ft </div>)}
                       {propertytype?.toLowerCase() ==="residential" &&( <div className="text-sm">{plot.unitName}</div>)}
                       {propertytype?.toLowerCase() ==="commercial" &&( <div className="text-sm">{propertyVariety}</div>)}
                        <div className="text-xs">{formatPrice(
                          Number(plot.price))}</div>
                         {plot.unitPriceType && ( <div className="text-xs font-light">{`(${plot.unitPriceType})`}</div>)}
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeTabId?.toString()}>
                  <div className="p-4 flex gap-[42px]">
                    {propertyDetails.map((detail,index) => (
                      <div key={index} className="flex flex-col gap-3">
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
                    <div className="p-4 flex justify-center">
                      <img
                        className="w-[400px]  object-cover"
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

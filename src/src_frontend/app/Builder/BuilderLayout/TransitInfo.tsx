import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/tabs";
import { Card } from "@/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scrollarea";

interface Location {
  id: number;
  distance: string;
  latitude: string;
  longitude: string;
  time_to_reach: string;
  location_title: string;
}

interface LocationCategory {
  icon_url: string;
  locations: Location[];
}

interface NearbyLocations {
  location_categories: string;
  [key: string]: string | LocationCategory;
}

interface TransitInfoProps {
  color?: string;
  NearbyLocations: NearbyLocations[];
}

export default function TransitInfo({ NearbyLocations,color }: TransitInfoProps) {
  const [activeTab, setActiveTab] = useState(
    NearbyLocations.length > 0 ? NearbyLocations[0].location_categories : "Essential"
  );
  useEffect(() => {
    if (NearbyLocations.length > 0) {
      setActiveTab(NearbyLocations[0].location_categories);
    }
  }, [NearbyLocations]);
  return (
    <>
    {(NearbyLocations && NearbyLocations.length > 0) &&(
      <div className="shadow-custom p-2  my-2 bg-white">
        <h2 className="font-semibold lg:text-lg border-b border-[#D9D9D9] py-1  px-4 shadow-sm">Find Places Around</h2>
 <div className="">
 <Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList className="flex justify-between border-b  border-black/20 rounded-none px-0">
    {NearbyLocations.map((category) => (
      <TabsTrigger
        key={category.location_categories}
        value={category.location_categories}
        className={`rounded-none flex-1 py-2 px-4 transition-all ${
          activeTab === category.location_categories
            ? "border-b-2 border-primary"
            : ""
        }`}
      >
        {category.location_categories}
      </TabsTrigger>
    ))}
  </TabsList>

  {NearbyLocations.map((category) => {
    const firstKey = Object.keys(category).find(
      (key) => key !== "location_categories" && typeof category[key] === "object"
    );

    return (
      <TabsContent
        key={category.location_categories}
        value={category.location_categories}
      >
        <ScrollArea  className="lg:h-[346px]">
        <Accordion type="single" collapsible defaultValue={firstKey}>
          {Object.entries(category).map(([key, value]) => {
            if (
              key !== "location_categories" &&
              typeof value === "object" &&
              value !== null
            ) {
              return (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3 font-semibold px-1">
                      {value.icon_url && (
                        <Image
                          src={value.icon_url}
                          alt={key}
                          width={24}
                          height={24}
                        />
                      //   <div
                      //   style={{
                      //     width: 24,
                      //     height: 24,
                      //     backgroundColor: 'red',
                      //     maskImage: `url(${value.icon_url})`,
                      //     WebkitMaskImage: `url(${value.icon_url})`,
                      //     maskSize: "contain",
                      //     WebkitMaskSize: "contain",
                      //     maskRepeat: "no-repeat",
                      //     WebkitMaskRepeat: "no-repeat",
                      //     maskPosition: "center",
                      //     WebkitMaskPosition: "center",
                      //   }}
                      // ></div>
                      )}
                      {key}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="p-1 border-none shadow-none">
                      {value.locations?.map((location) => (
                        <div
                          key={location.id}
                          className="flex justify-between py-2"
                        >
                          <span className="line-clamp-2 text-[13px]">{location.location_title.slice(0, 60)}</span>
                          <span className="text-gray-500 min-w-28 text-[13px] text-end">
                            {location.distance} |{" "}
                            {location.time_to_reach}
                          </span>
                        </div>
                      ))}
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              );
            }
            return null;
          })}
        </Accordion>
        </ScrollArea>
      </TabsContent>
    );
  })}
</Tabs>
 </div>

    </div>
    )}
    </>
  );
}

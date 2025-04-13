"use client";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { useState } from "react";
import BuilderLayout from "./BuilderLayout/page";
import MoreAbout from "./BuilderLayout/MoreAbout";
import FloorPlanContent from "./BuilderLayout/FloorPlanContent";
import AmenitiesContent from "./BuilderLayout/AmenitiesContent";
import RatingsContent from "./BuilderLayout/RatingsContent";
import useBuilderPreviewDetail from "@/hooks/useBuilderPreviewmode";
// Import the tab content components

export default function OverviewFunction() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data, error, isLoading } = useBuilderPreviewDetail(229);

  const property = data?.data;
  const navigationTabs = [
    { value: "overview", label: "Overview" },
    { value: "about", label: "About Project" },
    { value: "floor-plan", label: "Floor Plan" },
    { value: "amenities", label: "Amenities" },
    { value: "ratings", label: "Ratings and Reviews" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <BuilderLayout />;
      case "about":
        return (
          <MoreAbout
          property_title={property?.property_title}
            description={property?.description}
            city_name={undefined}
          />
        );
      case "floor-plan":
        return (
          <FloorPlanContent configration={[]} possession_date={undefined} />
        );
      // case "amenities":
      //   return <AmenitiesContent />;
      case "ratings":
        return <RatingsContent />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white shadow-[0px_2px_10px_#00000033]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="pl-32">
        <TabsList className="h-[50px] bg-transparent gap-2">
          {navigationTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`data-[state=active]:border-b-2 data-[state=active]:border-[#fc6600] data-[state=active]:text-[#fc6600] data-[state=inactive]:text-[#22222280] rounded-none px-1 py-2`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Render content based on active tab */}
      <div className="p-4">{renderTabContent()}</div>
    </div>
  );
}

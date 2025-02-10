"use client";
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { hydrateAuthStore } from "@/Store/jwtTokenStore";
import { FaCheckCircle } from "react-icons/fa";
import { useMediaQuery } from "usehooks-ts";
import BuilderPropertyDetailsComponent from "./BuilderPropertyDetailsComponent";
import BuilderAmenitiesComponent from "./BuilderAmenitiesComponent";
import BuilderGallary from "./BuilderGallary";
import PreviewModeComponent from "./PreviewMode";
import { title } from "process";

// Define the Tab component type
type TabComponent = {
  num: string;
  title: string;
  Component: React.ComponentType<{ onNext: () => void }>;
};

export default function BuilderPostProperty(): JSX.Element {

  const [activeTab, setActiveTab] = useState<string>("Property Details");

  const [completedTabs, setCompletedTabs] = useState<{
    [key: string]: boolean;
  }>({
    "Property Details" : false,
    "Amenities" : false,
    "Gallery & Verification" : false,
    "Preview Mode" : false,
  });

  const handleCompleteAndNext = (title : string) => {
    setCompletedTabs((prev) => {
      const updatedTabs = {
        ...prev,
        [title] : true,
      }

      const currentIndex = Tablinks.findIndex(({ title }) => title === activeTab);
      if (currentIndex < Tablinks.length - 1 && updatedTabs[title]) {
        setActiveTab(Tablinks[currentIndex + 1].title);
      }

      return updatedTabs;
    })
  }

  console.log("completed tabs", completedTabs);

  // Handle the completion of the current tab
  // const handleCompleteTab = (title: string) => {
  //   console.log("tab title:", title)
  //   setCompletedTabs((prev) => ({
  //     ...prev,
  //     [title]: true,
  //   }));
  // };

  // const handleNext = (): void => {

  //   const currentIndex = Tablinks.findIndex(({ title }) => title === activeTab);
  //   console.log('Current index:', currentIndex, Tablinks.length, completedTabs[activeTab]);
  //   if (currentIndex < Tablinks.length - 1 && completedTabs[activeTab]) {
  //     setActiveTab(Tablinks[currentIndex + 1].title);
  //   }
  // };

  const Tablinks: TabComponent[] = [
    {
      num: "1",
      title: "Property Details",
      Component: BuilderPropertyDetailsComponent,
    },
    { num: "2", title: "Amenities", Component: BuilderAmenitiesComponent },
    { num: "3", title: "Gallery & Verification", Component: BuilderGallary },
    { num: "4", title: "Preview Mode", Component: PreviewModeComponent },
  ];

  useEffect(() => {
    hydrateAuthStore();
  }, []);


  const isMobile = useMediaQuery("(max-width: 1024px)");
  return (
    <Tabs value={activeTab} className="w-full flex flex-col items-center">
      {/* Render Tab Links */}
      <TabsList className="flex flex-row lg:gap-4 w-fit shadow-md rounded-full my-2 lg:p-4">
        {Tablinks.map(({ num, title }, index) => {
          const isCompleted = completedTabs[title];
          const isEnabled =
            index === 0 ||
            Tablinks.slice(0, index).every(({ title }) => completedTabs[title]);

          return (
            <TabsTrigger
              key={title}
              value={title}
              className={`flex items-center gap-2 lg:px-4 lg:py-2 rounded-full ${
                title === activeTab ? "text-black bg-blue-100" : "text-gray"
              } cursor-pointer ${
                isEnabled ? "" : "opacity-50 pointer-events-none"
              }`}
              onClick={() => isEnabled && setActiveTab(title)}
            >
              {isCompleted ? (
                <FaCheckCircle className="text-green" />
              ) : (
                <span className="font-bold bg-black text-white rounded-full px-3 py-1 text-sm">
                  {num}
                </span>
              )}
              {isMobile ? null : <span>{title}</span>}
              <span>
                {index < Tablinks.length - 1 && (
                  <div
                    className={`w-10 lg:w-32  h-[3px] flex-1 ${
                      isCompleted ? "bg-green" : "bg-black"
                    }`}
                    style={{ marginLeft: "1px", marginRight: "1px" }}
                  ></div>
                )}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Render Tab Content */}
      <div className="relative w-full lg:mt-8">
        {Tablinks.map(({ title, Component }) => (
          <TabsContent
            key={title}
            value={title}
            className={`transition-opacity duration-300 ${
              title === activeTab
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Component
              onNext={() => {
                // handleCompleteTab(title);
                //handleNext();
                handleCompleteAndNext(title)
              }}
            />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

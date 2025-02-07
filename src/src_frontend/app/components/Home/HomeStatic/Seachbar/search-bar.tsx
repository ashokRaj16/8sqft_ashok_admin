import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import BuyTab from "./BuyTab";
import RentTab from "./RentTab";
import ProjectsTab from "./ProjectsTab";

import { debounce } from "lodash";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

import { useMediaQuery } from "usehooks-ts";
import useSearchQuery from "@/hooks/useSearchQuery";
import usePropertylist from "@/hooks/usepropertylist";
import useFilterStore from "@/Store/useFilterStore";
import useActiveTabStore from "@/Store/activeTab";

interface TabItem {
  value: string;
  label: string;
}

const cities: string[] = [
  "Pune",
  "Mumbai",
  "Delhi",
  "Goa",
  "Kolhapur",
  "Nagpur",
  "Nashik",
  "Sambhaji nagar",
  "Ahilya nagar",
  "Indore",
  "Bhopal",
  "Jaipur",
  "Gandhi nagar",
  "Ahemdabad",
];

const allTabItems: TabItem[] = [
  { value: "rent", label: "Rent" },
  { value: "buy", label: "Buy" },
  { value: "project", label: "Projects" },
];

const mobileTabItems: TabItem[] = [
  { value: "rent", label: "Rent" },
  { value: "buy", label: "Buy" },
  { value: "project", label: "Projects" },
];

type SearchResult = {
  id: number;
  city_name: string;
  postal_name: string;
};

type SearchQueryResponse = {
  status: boolean;
  message: string;
  data: SearchResult[];
};

type Suggestion = {
  city_name: string;
  postal_name: string;
};

export default function SearchComponent() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("project");
  const filters = useFilterStore();
  const { setFilter } = filters;

  const latestActiveTab = activeTab.toUpperCase();
  const { data: Propertydata } = usePropertylist({
    property_rent_buy: latestActiveTab,
  });
  const isMobile = useMediaQuery("(max-width: 640px)");
  const tabItems = isMobile ? mobileTabItems : allTabItems;
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // ✅ Use Search Hook with both city_name and searchKeyword
  const { data, isLoading, error, refetch } = useSearchQuery({
    city: selectedCity,
    searchKeyword: searchQuery,
  });

  // ✅ Update suggestions when data changes
  useEffect(() => {
    if (data?.data) {
      const mappedSuggestions = data.data.map((item: any) => ({
        city_name: item.city_name,
        postal_name: item.postal_name,
      }));
      setSuggestions(mappedSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [data]);

  // ✅ Debounced Search Handler
  const debouncedSearch = useCallback(
    debounce(() => {
      if (searchQuery.trim() !== "") {
        refetch();
      }
    }, 500),
    [searchQuery, refetch]
  );

  // ✅ Trigger debounced search on query change
  useEffect(() => {
    debouncedSearch();
    return () => {
      debouncedSearch.cancel(); // Cleanup on unmount
    };
  }, [searchQuery, debouncedSearch]);

  const renderTabContent = (): JSX.Element | null => {
    switch (activeTab) {
      case "buy":
        return <BuyTab />;
      case "rent":
        return <RentTab />;
      case "project":
        return <ProjectsTab />;
      default:
        return null;
    }
  };
  const setPropertyRentBuy = useActiveTabStore(
    (state) => state.setPropertyRentBuy
  );
  useEffect(() => {
    // setFilter({ property_rent_buy: activeTab.toUpperCase() });
  }, [activeTab, setFilter]);
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center h-fit space-y-4 bg-white p-4 rounded shadow sm:p-6">
      <Tabs
        defaultValue="project"
        onValueChange={(value: string) => {
          setActiveTab(value);
          // setFilter({ property_rent_buy: latestActiveTab });
          setPropertyRentBuy(latestActiveTab);
        }}
        className="w-full"
      >
        <TabsList className="flex   rounded-sm text-[#AFAAAA] p-0 w-full sm:justify-around">
          {tabItems.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="text-black  data-[state=active]:bg-primary data-[state=active]:text-white py-1 px-2 sm:px-4 rounded-none my-1 sm:my-2 flex-shrink-0"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex flex-col space-y-2 sm:space-y-1 w-full">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
            <Select onValueChange={(value) => setSelectedCity(value)}>
              <SelectTrigger className="w-full sm:w-32 border border-gray-300 rounded">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent className="bg-white h-56 scroll-smooth  sm:w-32">
                {cities.map((city) => (
                  <SelectItem
                    key={city}
                    value={city}
                    className="bg-white hover:bg-primary-links p-2 hover:text-white cursor-pointer"
                  >
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search up to 3 localities or landmarks"
              className="flex-1 p-2 border border-gray-300 rounded placeholder:text-sm w-full sm:max-w-[60vw]"
              disabled={!selectedCity} // Input is disabled if no city is selected
            />
            {suggestions.length > 0 && (
              <ul className="absolute  lg:top-[110px] top-[130px] container left-[3rem] lg:left-[400px] w-full z-10 p-1 sm:w-full max-w-[40vw] bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-48 overflow-hidden">
                {suggestions.map((suggestion, index) => (
                  <Link
                    href={
                      activeTab === "project"
                        ? `/ListofBuilder_List?city_name=${selectedCity}&searchKeyword=${suggestion.postal_name}`
                        : `/ListofProperty_List?city_name=${selectedCity}&searchKeyword=${suggestion.postal_name}`
                    }
                    key={index}
                  >
                    <p
                      className="text-[10px] text-ellipsis  overflow-hidden w-full sm:w-full   whitespace-nowrap my-3  px-2 sm:px-4 sm:py-2 hover:bg-primary hover:text-white cursor-pointer sm:text-sm rounded-sm "
                      onClick={() => {
                        setSearchQuery(suggestion.postal_name);
                        setSuggestions([]);
                      }}
                    >
                      {suggestion.postal_name}
                    </p>
                  </Link>
                ))}
              </ul>
            )}
            <button
              onClick={() => refetch()}
              className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded hover:bg-black"
              disabled={!selectedCity}
            >
              Search
            </button>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          {renderTabContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

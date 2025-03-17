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
import { useRouter } from "next/navigation";
import { Button } from "@/ui/Button";
import useGetCitylist from "@/hooks/getStates";
import { FiSearch } from "react-icons/fi";

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
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("project");
  const [propertyType, setPropertyType] = useState<string>("Residential");
  const filters = useFilterStore();
  const router= useRouter()
  const { setFilter } = filters;


    const { data: City } = useGetCitylist();

    console.log(City?.data,'city12')
  const latestActiveTab = activeTab.toUpperCase();
  const { data: Propertydata } = usePropertylist({
    property_rent_buy: latestActiveTab,
  });
  const isMobile = useMediaQuery("(max-width: 640px)");
  const tabItems = isMobile ? mobileTabItems : allTabItems;
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
const [isOptionSelected , setIsOptionSelected] = useState(false)
  // ✅ Use Search Hook with both city_name and searchKeyword
  const { data, isLoading, error, refetch } = useSearchQuery({
    city: selectedCity,
    searchKeyword: searchQuery,
  });

  useEffect(() => {
    if(!searchQuery){
      setIsOptionSelected(false)      
    }
  }, [searchQuery])
  

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
        return <ProjectsTab setPropertyType={setPropertyType} propertyType={propertyType}/>;
      default:
        return null;
    }
  };
  const setPropertyRentBuy = useActiveTabStore(
    (state) => state.setPropertyRentBuy
  );
  useEffect(() => {
    setFilter({ property_type: propertyType });
    setFilter({ property_rent_buy: latestActiveTab });
  }, [propertyType]);

  const handleSearch=()=>{
    if(selectedCity && searchQuery){
      setShowErrorMsg(false)
      refetch()
      router.push(
        activeTab === "project"
        ? `/ListofBuilder_List?city_name=${selectedCity}&searchKeyword=${searchQuery}&property_type=${propertyType}`
        : `/ListofProperty_List?city_name=${selectedCity}&searchKeyword=${searchQuery}`
      )
    }else{
      setShowErrorMsg(true)
    }
 
  }
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center h-fit space-y-4 bg-white py-2 px-4 rounded-lg shadow-custom">
      <Tabs
        defaultValue="project"
        onValueChange={(value: string) => {
          setActiveTab(value);
          // setFilter({ property_rent_buy: latestActiveTab });
          setPropertyRentBuy(latestActiveTab);
        }}
        className="w-full"
      >
        <TabsList className="flex gap-10  h-auto rounded-sm text-[#AFAAAA] p-0 w-full justify-start mb-2">
          {tabItems.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="text-black  data-[state=active]:border-b-2 border-black data-[state=active]:text-black py-0 px-2 uppercase rounded flex-shrink-0"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex flex-col space-y-2 sm:space-y-1 w-full">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full shadow-custom rounded-3xl overflow-hidden py-1 px-3">
            <Select onValueChange={(value) => setSelectedCity(value)}>
              <SelectTrigger className="w-full sm:w-32 border-0 focus:outline-none focus:ring-0">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent className="bg-white h-56 scroll-smooth  sm:w-32">
                {City?.data.map((city) => (
                  <SelectItem
                    key={city.id}
                    value={city.city_name}
                    className="bg-white hover:bg-primary-links p-2 hover:text-white cursor-pointer"
                  >
                    {city.city_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search up to 3 localities or landmarks"
              className="flex-1 p-2  placeholder:text-sm w-full sm:max-w-[60vw] m-0 focus:outline-none border-s border-[#22222233]"
              // disabled={!selectedCity} 
            />
           {suggestions.length > 0 && !isOptionSelected && (
              <ul className="absolute  lg:top-[110px] top-[130px] container left-[3rem] lg:left-1/2 -translate-x-1/2 w-full z-10 p-1 sm:w-full max-w-[30vw] bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-48 overflow-x-hidden overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <Link
                    href={"" }
                    key={index}
                  >
                    <p
                      className="text-[10px] text-ellipsis  overflow-hidden w-full sm:w-full   whitespace-nowrap my-3  px-2 sm:px-4 sm:py-2 hover:bg-primary hover:text-white cursor-pointer sm:text-sm rounded-sm "
                      onClick={() => {
                        setSearchQuery(suggestion.postal_name);
                        setSuggestions([]);
                        setIsOptionSelected(true);
                      }}
                    >
                      {suggestion.postal_name}
                    </p>
                  </Link>
                ))}
              </ul>
            )}
               <Button                   
              onClick={handleSearch}
              className="w-full sm:w-auto p-2 lg:bg-white bg-primary text-[#222222CC] rounded hover:text-primary mx-0"
              // disabled={!selectedCity}
            >
             <FiSearch className="text-2xl"/>
              </Button>
          </div>
        </div>
        {showErrorMsg &&(<p className="text-center pt-1 text-xs text-notification-error">{!selectedCity ? "Please select city" : !searchQuery?"Please select locality" : ""}</p>)}
        <TabsContent value={activeTab} className="">
          {renderTabContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

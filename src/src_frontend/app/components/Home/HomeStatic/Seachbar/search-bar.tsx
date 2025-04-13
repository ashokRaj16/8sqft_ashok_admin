import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { useState, useEffect, useCallback, useRef } from "react";
import BuyTab from "./BuyTab";
import RentTab from "./RentTab";
import ProjectsTab from "./ProjectsTab";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/ui/drawer";
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
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Button } from "@/ui/Button";
import useGetCitylist from "@/hooks/getStates";
import { FiSearch } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosArrowRoundForward, IoMdClose } from "react-icons/io";
import { TbArrowBackUp } from "react-icons/tb";
import { RiH1 } from "react-icons/ri";
import { Label } from "@/ui/label";
import { CiFilter } from "react-icons/ci";
import BuilderFilterComponent from "@/app/ListofBuilder_List/BuilderFilterComponent";
import { Input } from "@/ui/input";
import { ChevronDown, ChevronUp, ChevronUpCircle } from "lucide-react";
import { getUserLocation } from "@/app/components/common/GetAddressByLatLong";
interface TabItem {
  value: string;
  label: string;
}

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
  const [cityQuery, setCityQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [cityId, setCityID] = useState(0);
  const [showLocality, setShowLocality] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("project");
  const [propertyType, setPropertyType] = useState<string>("Residential");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const filters = useFilterStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramLocalityName = searchParams.get("searchKeyword");
  const paramCityName = searchParams.get("city_name");
  const pathname = usePathname();
  const isPropertyList = pathname === "/ListofBuilder_List";
  const { setFilter } = filters;
  const { data: City } = useGetCitylist();
  const latestActiveTab = activeTab;
  const { data: Propertydata } = usePropertylist({
    property_rent_buy: latestActiveTab,
  });
  const isMobile = useMediaQuery("(max-width: 640px)");
  const tabItems = isMobile ? mobileTabItems : allTabItems;
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [hasTyped, setHasTyped] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const { data, isLoading, error, refetch } = useSearchQuery({
    city: selectedCity,
    searchKeyword: searchQuery,
  });
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [showCityList, setShowCityList] = useState(false);
  const filteredCities: { id: number; city_name: string }[] = City?.data
    ? City.data.filter((city: { city_name: string }) =>
        city.city_name.toLowerCase().includes(cityQuery.toLowerCase())
      )
    : [];

    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event:any) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setShowCityList(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityQuery(value);
    setSelectedCity("");
    setShowCityList(true)
  };
  const handleSelectCity = (cityName: string, cityId: number) => {
    setSelectedCity(cityName);
    setCityID(cityId);
    setCityQuery("");
    setShowCityList(false)
  };

  useEffect(() => {
    setSelectedCity(paramCityName || "");
    setSearchQuery(paramLocalityName || "");
    setShowLocality(true);
  }, [paramLocalityName]);

  useEffect(() => {
    if (!isOpenDrawer && !paramCityName) {
      setCityQuery("");
      setSelectedCity("");
      setSearchQuery("");
      setShowLocality(false);
      setSelectedLocalities([]);
    }
  }, [isOpenDrawer]);

  useEffect(() => {
    if (!searchQuery) {
      setIsOptionSelected(false);
    }
  }, [searchQuery]);

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
        return (
          <ProjectsTab
            setPropertyType={setPropertyType}
            propertyType={propertyType}
          />
        );
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

  const handleSelectLocality = (locality: string) => {
    if (
      !selectedLocalities.includes(locality) &&
      selectedLocalities.length < 3
    ) {
      const newLocalities = [...selectedLocalities, locality];
      setSelectedLocalities(newLocalities);
      setSearchQuery(""); // Clear input field
      setIsOptionSelected(false);
      setHasTyped(false);
      // updateURLParams(newLocalities);
    }
  };

  const handleRemoveLocality = (locality: string) => {
    const updatedLocalities = selectedLocalities.filter(
      (loc) => loc !== locality
    );
    setSelectedLocalities(updatedLocalities);
    // updateURLParams(updatedLocalities);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setHasTyped(true);
  };

  const handleSearch = () => {
    if (selectedCity) {
      setShowErrorMsg(false);
      refetch();
      router.push(
        activeTab === "project"
          ? `/ListofBuilder_List?city_name=${selectedCity}&searchKeyword=${selectedLocalities.join(
              ", "
            )}&property_type=${propertyType}`
          : `/ListofProperty_List?city_name=${selectedCity}&searchKeyword=${selectedLocalities.join(
              ", "
            )}`
      );
      setIsOpenDrawer(false);
    } else {
      setShowErrorMsg(true);
    }
  };

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    getUserLocation(
      (lat, lng, address, city) => {
        setSelectedLocation({ lat, lng });

        const matchedCity = City?.data.find(
          (item) => item.city_name.toLowerCase() === city.toLowerCase()
        );
        if (matchedCity) {
          setSelectedCity(matchedCity.city_name);
        } else {
          setSelectedCity(""); 
        }
      },
      (error) => console.error("Location Error:", error)
    );
  }, [City?.data]);
  return (
    <>
      <div>
        <Drawer onOpenChange={setIsOpenDrawer}>
          <DrawerTrigger asChild>
            {isPropertyList ? (
              <CiFilter size={27} color="#22222280" />
            ) : (
              <div className="flex lg:hidden justify-between items-center bg-white rounded-3xl pl-3 pr-1 overflow-hidden shadow-custom py-1 h-9">
                <div className="w-full ml-2 border-0 focus:outline-none text-sm flex items-center text-[#22222250]">
                  Search here...
                </div>
                <Button className="h-[30px] w-[30px] p-1 rounded-full flex items-center justify-center bg-primary text-white hover:bg-primary/70">
                  <FiSearch className="text-2xl" />
                </Button>
              </div>
            )}
          </DrawerTrigger>
          <DrawerContent className="h-screen border-0">
            <div className="mx-auto w-full">
              <DrawerHeader className="bg-[#222222] py-14 px-2">
                <DrawerTitle></DrawerTitle>
                <DrawerDescription></DrawerDescription>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="bg-white hover:bg-primary rounded-full p-1 mt-2"
                    onClick={() => {
                      setCityQuery("");
                      setSelectedCity("");
                      setSearchQuery("");
                      setShowLocality(false);
                    }}
                  >
                    <TbArrowBackUp size={14} />
                  </span>

                  <Tabs
                    defaultValue="project"
                    onValueChange={(value: string) => {
                      setActiveTab(value);
                      // setFilter({ property_rent_buy: latestActiveTab });
                      setPropertyRentBuy(latestActiveTab);
                    }}
                    className="w-full"
                  >
                    <TabsList className="flex gap-4 h-9 rounded-xl text-[#AFAAAA] p-1 items-center justify-between bg-[#57575799]">
                      {tabItems.map(({ value, label }) => (
                        <TabsTrigger
                          key={value}
                          value={value}
                          className="text-[#E3E3E3] font-light bg-transparent data-[state=active]:bg-white data-[state=active]:text-[#222222] w-full"
                        >
                          {label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent value={activeTab} className="">
                      {renderTabContent()}
                    </TabsContent>
                  </Tabs>
                  <DrawerClose asChild>
                    <span className="bg-white hover:bg-primary rounded-full p-1 mt-2">
                      <IoMdClose size={14} />
                    </span>
                  </DrawerClose>
                </div>

                {selectedCity && (
                  <Label className="text-white w-fit flex text-xs items-center gap-2 pt-3">
                    You are exploring within{" "}
                    <span className="border-b">{selectedCity}</span>
                    <IoCloseSharp
                      size={15}
                      className="cursor-pointer"
                      onClick={() => {
                        setCityQuery("");
                        setSelectedCity("");
                        setSearchQuery("");
                        setShowLocality(false);
                        setSelectedLocalities([]);
                      }}
                    />
                  </Label>
                )}
              </DrawerHeader>

              <DrawerFooter className="bg-white h-screen">
                {!showLocality ? (
                  <div className="mx-4">
                    <div className="flex lg:hidden justify-between bg-white rounded-3xl px-3 overflow-hidden shadow-custom -mt-[38px]">
                      <input
                        autoComplete="off"
                        type="text"
                        placeholder="Enter city name"
                        value={selectedCity || cityQuery}
                        onChange={handleCityInputChange}
                        className="w-full ml-2 border-0 focus:outline-none h-10 text-sm"
                      />
                      <Button className="ml-3 w-fit sm:w-auto border-0 p-2 bg-white text-[#222222CC] rounded mx-0">
                        <FiSearch className="text-2xl" />
                      </Button>
                    </div>

                    {isLoading ? (
                      <div className="flex items-center justify-center mt-5">
                        <div className="w-12 h-12 border-4 border-primary border-dashed rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      cityQuery && (
                        <ul className="mt-2 rounded-lg shadow-custom  z-10 bg-white overflow-y-auto max-h-48">
                          {filteredCities.length > 0 ? (
                            filteredCities.map((item) => (
                              <li
                                key={item.id}
                                className="flex justify-between text-xs text-ellipsis border-b border-[#22222250]  overflow-hidden w-full p-2"
                                onClick={() => {
                                  handleSelectCity(item.city_name, item.id);
                                  setShowLocality(true);
                                }}
                              >
                                {item.city_name}{" "}
                                <span className="text-[#222222cc]">City</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm sm:w-full   whitespace-nowrap my-3  px-2 rounded-sm ">
                              No cities found
                            </li>
                          )}
                        </ul>
                      )
                    )}
                  </div>
                ) : (
                  <div className="mx-4">
                    <div className="flex lg:hidden justify-between bg-white rounded-3xl px-3 overflow-hidden shadow-custom -mt-[38px]">
                      <Input
                        disabled={selectedLocalities.length >= 3}
                        value={searchQuery}
                        onChange={handleInputChange}
                        className="flex-1 px-4 lg:py-2 py-1 border-0 focus:ring-0 focus:outline-none z-10 rounded-none lg:text-sm text-xs"
                        placeholder={`${
                          selectedLocalities.length >= 3
                            ? "Can't select more..."
                            : "Search locality..."
                        }`}
                      />
                      <Button className="ml-3 w-fit sm:w-auto border-0 p-2 bg-white text-[#222222CC] rounded mx-0">
                        <FiSearch className="text-2xl" />
                      </Button>
                    </div>

                    {isLoading ? (
                      <div className="flex items-center justify-center mt-5">
                        <div className="w-12 h-12 border-4 border-primary border-dashed rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      suggestions.length > 0 &&
                      !isOptionSelected &&
                      hasTyped && (
                        <ul className="mt-2 rounded-lg shadow-custom  z-50 bg-white overflow-y-auto max-h-44">
                          {suggestions.map((suggestion, index) => (
                            <p
                              key={index}
                              className="flex justify-between text-xs text-ellipsis border-b border-[#22222250]  overflow-hidden w-full p-2"
                              onClick={() =>
                                handleSelectLocality(suggestion.postal_name)
                              }
                            >
                              {suggestion.postal_name}{" "}
                              <span className="text-[10px] text-[#22222280]">
                                LOCALITY
                              </span>
                            </p>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                )}

                {selectedLocalities.length > 0 && (
                  <div className="mt-2 mx-4 flex flex-wrap gap-2">
                    {selectedLocalities.map((locality, index) => (
                      <span
                        key={index}
                        className="border border-[#22222260] rounded-2xl px-1 flex items-center"
                      >
                        <span className="lg:text-xs text-[10px] text-[#222222cc] shine-text">
                          {" "}
                          {locality}
                        </span>
                        <button
                          onClick={() => handleRemoveLocality(locality)}
                          className="ml-1 text-primary font-semibold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {paramCityName && <BuilderFilterComponent />}
                <DrawerClose asChild>
                  <div className="absolute bottom-0 px-4 py-2 right-0 text-end shadow-custom w-full z-50">
                    <Button
                      disabled={!selectedLocalities}
                      onClick={handleSearch}
                      className={`text-white w-fit ${
                        selectedLocalities.length < 1
                          ? "bg-gray-300"
                          : "bg-primary"
                      }`}
                    >
                      NEXT <IoIosArrowRoundForward size={20} />
                    </Button>
                  </div>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* FOR DESKTOP VIEW */}
      <div className="w-full max-w-3xl mx-auto hidden lg:flex flex-col items-center h-fit space-y-4 bg-white py-2 px-4 rounded-2xl shadow-custom relative">
        <Tabs
          defaultValue="project"
          onValueChange={(value: string) => {
            setActiveTab(value);
            // setFilter({ property_rent_buy: latestActiveTab });
            setPropertyRentBuy(latestActiveTab);
          }}
          className="w-full"
        >
          <TabsList className="flex  h-auto rounded-sm text-[#AFAAAA] p-0 w-96 items-center justify-between mb-2">
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
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full shadow-custom rounded-3xl overflow-hidden py-1 pl-3 pr-1">
              {/* <Select onValueChange={(value) => setSelectedCity(value)}>
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
            </Select> */}

              <div className="w-full sm:w-32" ref={containerRef}>
                <div className="flex items-center">
                  <input
                    autoComplete="off"
                    type="text"
                    placeholder="Search city"
                    value={selectedCity || cityQuery}
                    onChange={handleCityInputChange}
                    onFocus={() => setShowCityList(true)}
                    // onBlur={() => setShowCityList(false)}
                    className="w-full  border-0 focus:outline-none h-10 text-sm"
                  />
                  {/* {selectedCity ? (
                    <ChevronUp
                      className="cursor-pointer text-[#22222270]"
                      onClick={() => {
                        setCityQuery("");
                        setSelectedCity("");
                        setSelectedLocalities([]);
                        setShowCityList(false)
                      }}
                    />
                  ) : ( */}
                    <ChevronDown className=" text-primary cursor-pointer" onClick={()=>setShowCityList(!showCityList)}/>
                
                </div>
                

                { showCityList && (
                  <ul className=" mt-4 border rounded-lg shadow-sm absolute z-10 bg-white overflow-y-auto max-h-48 left-3 w-36">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((item) => (
                        <li
                          key={item.id}
                          className="text-[10px] text-ellipsis  overflow-hidden w-full sm:w-full   whitespace-nowrap my-3  px-2 sm:px-4 sm:py-2 hover:bg-primary hover:text-white cursor-pointer sm:text-sm rounded-sm "
                          onClick={() =>
                            handleSelectCity(item.city_name, item.id)
                          }
                        >
                          {item.city_name}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm sm:w-full   whitespace-nowrap my-3  px-2 rounded-sm ">
                        No cities found
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search up to 3 localities or landmarks"
                className="flex-1 p-2 text-sm placeholder:text-sm w-full sm:max-w-[60vw] m-0 focus:outline-none border-s border-[#22222233]"
                // disabled={!selectedCity}
              /> */}

              <Input
                disabled={selectedLocalities.length >= 3}
                value={searchQuery}
                onChange={handleInputChange}
                className="flex-1 px-4 lg:py-2 py-1 border-0 focus:ring-0 focus:outline-none z-10 rounded-none lg:text-sm text-xs border-s border-[#22222233]"
                placeholder={`${
                  selectedLocalities.length >= 3
                    ? "Can't select more..."
                    : "Search upto 3 localities"
                }`}
              />

              {/* {suggestions.length > 0 && !isOptionSelected && (
                <ul className="absolute  lg:top-[100px] top-[130px] container left-[3rem] lg:left-1/2 -translate-x-1/2 w-full z-10 p-1 sm:w-full max-w-[30vw] bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-48 overflow-x-hidden overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <Link href={""} key={index}>
                      <p
                        className="flex justify-between text-[10px] text-ellipsis  overflow-hidden w-full sm:w-full   whitespace-nowrap my-3  px-2 sm:px-4 sm:py-2 hover:bg-primary hover:text-white cursor-pointer sm:text-sm rounded-sm "
                        onClick={() => {
                          setSearchQuery(suggestion.postal_name);
                          setSuggestions([]);
                          setIsOptionSelected(true);
                        }}
                      >
                        {suggestion.postal_name}{" "}
                        <span className="text-[10px] text-[#22222280]">
                          LOCALITY
                        </span>
                      </p>
                    </Link>
                  ))}
                </ul>
              )} */}
              {suggestions.length > 0 && !isOptionSelected && hasTyped && (
                <ul className=" mt-4 border rounded-lg shadow-sm  absolute top-24 container w-full z-10 p-1 sm:w-full max-w-[528px] right-16 bg-white border-gray-300  max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <p
                      key={index}
                      className="flex justify-between text-[10px] sm:text-sm px-2 sm:px-4 py-2 hover:bg-primary hover:text-white cursor-pointer rounded-sm"
                      onClick={() =>
                        handleSelectLocality(suggestion.postal_name)
                      }
                    >
                      {suggestion.postal_name}{" "}
                      <span className="text-[10px] text-[#22222280]">
                        LOCALITY
                      </span>
                    </p>
                  ))}
                </ul>
              )}
              {selectedLocalities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedLocalities.map((locality, index) => (
                    <span
                      key={index}
                      className="border border-[#22222260] rounded-2xl px-1 flex items-center"
                    >
                      <span className="lg:text-xs text-[10px] text-[#222222cc] shine-text">
                        {" "}
                        {locality}
                      </span>
                      <button
                        onClick={() => handleRemoveLocality(locality)}
                        className="ml-1 text-primary font-semibold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <Button
                onClick={handleSearch}
                className="w-full sm:w-auto p-2 text-white rounded-full hover:bg-primary/70 mx-0 bg-primary"
                // disabled={!selectedCity}
              >
                <FiSearch className="text-2xl" />
              </Button>
            </div>
          </div>
          {!showErrorMsg && searchQuery && !selectedCity && (
            <p className="text-start pt-1 text-xs text-notification-error">
              Please select city{" "}
            </p>
          )}
          {showErrorMsg && (
            <p className="text-start pt-1 text-xs text-notification-error">
              {!selectedCity
                ? "Please select city"
                : // : !searchQuery
                  // ? "Please select locality"
                  ""}
            </p>
          )}
          <TabsContent value={activeTab} className="">
            {renderTabContent()}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

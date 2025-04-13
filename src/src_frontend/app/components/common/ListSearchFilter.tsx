// import { useState } from "react";
// import { ChevronDown, Search } from "lucide-react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown";
// import { Input } from "@/ui/input";
// import { Button } from "@/ui/Button";

// const rentOptions = ["Buy", "Rent", "Projects"];
// const propertyOptions: { [key: string]: string[] } = {
//   Buy: ["Residential", "Commercial", "PG / Hostel"],
//   Rent: ["Residential", "Commercial", "Open Plot"],
//   Projects: ["Residential", "Commercial", "Open Project"],
// };

// export default function SearchBar() {
//   const [selectedRent, setSelectedRent] = useState<keyof typeof propertyOptions>("Buy");
//   const [selectedProperty, setSelectedProperty] = useState("Residential");

//   return (
//     <div className="relative flex items-center border-2 border-primary rounded-full overflow-hidden w-full max-w-lg">
//       {/* First Dropdown */}
//       <DropdownMenu>
//         <DropdownMenuTrigger className="flex items-center px-4 py-2 text-[#222222]">
//           {selectedRent} <ChevronDown className="w-4 h-4 ml-1" />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="bg-white border rounded shadow-lg">
//           {rentOptions.map((option) => (
//             <DropdownMenuItem
//               key={option}
//               className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
//               onSelect={() => {
//                 setSelectedRent(option);
//                 setSelectedProperty(propertyOptions[option][0]);
//               }}
//             >
//               {option}
//             </DropdownMenuItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>
//       <span className="border-l border-gray-300 h-6" />
//       {/* Second Dropdown */}
//       <DropdownMenu>
//         <DropdownMenuTrigger className="flex items-center px-4 py-2 text-[#222222]">
//           {selectedProperty} <ChevronDown className="w-4 h-4 ml-1" />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="bg-white border rounded shadow-lg">
//           {propertyOptions[selectedRent].map((option) => (
//             <DropdownMenuItem
//               key={option}
//               className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
//               onSelect={() => setSelectedProperty(option)}
//             >
//               {option}
//             </DropdownMenuItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>
//       <span className="border-l border-gray-300 h-6" />
//       <Input className="flex-1 px-4 py-2 border-none focus:ring-0 z-10 rounded-none" placeholder="Search..." />
//       <Button className="bg-primary text-white pr-2 pl-7 py-2 rounded-full flex items-center -ml-4 ">
//         <Search className="w-4 h-4 mr-1" /> Search
//       </Button>
//     </div>
//   );
// }

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown";
import { Input } from "@/ui/input";
import { Button } from "@/ui/Button";
import useFilterStore from "@/Store/useFilterStore";
import useSearchQuery from "@/hooks/useSearchQuery";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "lodash";
import Link from "next/link";

type Suggestion = {
  city_name: string;
  postal_name: string;
};

const propertyCategories: { [key: string]: string[] } = {
  Residential: ["buy", "rent", "PG/Hostel", "project"],
  Commercial: ["buy", "rent", "project"],
  OpenSpace: ["Open Land"],
};
export default function SearchBar() {
  const [isOptionSelected , setIsOptionSelected] = useState(false)
  const router = useRouter();
  const searchParams = useSearchParams();
  const city_name = searchParams.get("city_name");
  const property_rent_buy = searchParams.get("property_rent_buy");
  const property_type = searchParams.get("property_type");
  const [isManuallySelected, setIsManuallySelected] = useState(false);

  const searchKeyword = searchParams.get("searchKeyword");
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(searchKeyword || "");
  const filters = useFilterStore(); // Access entire store
  const { setFilter, resetFilters } = filters; // Extract setFilter for convenience
  const [selectedCategory, setSelectedCategory] = useState("Residential");
  const [selectedOption, setSelectedOption] = useState("Buy");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [hasTyped, setHasTyped] = useState(false);


  // ✅ Use Search Hook with both city_name and searchKeyword
  const { data, isLoading, error, refetch } = useSearchQuery({
    city: city_name as string,
    searchKeyword: searchQuery,
  });
  useEffect(() => {
    if (!isManuallySelected) {
      setSelectedCategory(property_type || "");
      setSelectedOption(property_rent_buy || "");
    }
  }, [property_type, property_rent_buy, isManuallySelected]);


  useEffect(() => {
    setSearchQuery("");
    if (searchKeyword) {
      setSelectedLocalities(searchKeyword.split(",").map(loc => loc.trim()));
    } else {
      setSelectedLocalities([]);
    }
  }, [searchKeyword]);
  
  useEffect(() => {
 if(property_rent_buy){
  setSelectedOption(property_rent_buy)
 }
  }, [property_rent_buy])
  

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
  const debouncedSearch = useCallback(
    debounce(() => {
      if (searchQuery.trim() !== "") {
        refetch();
      }
    }, 500),
    [searchQuery, refetch]
  );

  useEffect(() => {
    debouncedSearch();
    return () => {
      debouncedSearch.cancel(); // Cleanup on unmount
    };
  }, [searchQuery, debouncedSearch]);

    // Function to handle locality selection
    const handleSelectLocality = (locality: string) => {
      if (!selectedLocalities.includes(locality) && selectedLocalities.length < 3) {
        const newLocalities = [...selectedLocalities, locality];
        setSelectedLocalities(newLocalities);
        setSearchQuery(""); // Clear input field
        setIsOptionSelected(false);
        setHasTyped(false)
        updateURLParams(newLocalities);
      }
    };
  
    const handleRemoveLocality = (locality: string) => {
      const updatedLocalities = selectedLocalities.filter((loc) => loc !== locality);
      setSelectedLocalities(updatedLocalities);
      updateURLParams(updatedLocalities);
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      setHasTyped(true);
    };
  
    const updateURLParams = (localities: string[]) => {
      const newUrl = `/ListofBuilder_List?city_name=${city_name}&searchKeyword=${localities.join(",")}`;
      router.push(newUrl);
    };

  const handleSearch = () => {
    resetFilters();
    setFilter({
      property_type: selectedOption === "Open Land" ? selectedOption : selectedCategory,
      property_rent_buy: selectedOption !== "Open Land" ? selectedOption : "",
      // property_type: selectedCategory,
      // property_rent_buy: selectedOption,
    });
    

    const newUrl = `/ListofBuilder_List?city_name=${city_name}&searchKeyword=${selectedLocalities.join(", ")}`;
    router.push(newUrl);    
  };
  return (
    <div className="relative">
      <div className="relative flex items-center border lg:border-2 border-primary rounded-full w-full lg:min-w-[600px] h-8 overflow-hidden lg:h-auto mt-2">
      <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-4 lg:py-2 text-[#222222] rounded-md focus:outline-none">
        <span className="font-normal lg:text-sm text-xs capitalize text-primary whitespace-nowrap">
          {selectedOption || "Select Option"}
        </span>
        <ChevronDown className="w-4 h-4 ml-2 text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border rounded shadow-lg p-2">
        {Object.entries(propertyCategories).map(([category, options]) => (
          <div key={category} className="mb-2">
            <span className="block px-4 py-1 text-[#22222250] text-sm uppercase">{category}</span>
            {options.map((option) => {
              const isHighlighted =
                !isManuallySelected && option === property_rent_buy && category === property_type;
              const isSelected = option === selectedOption && category === selectedCategory;

              return (
                <DropdownMenuItem
                  key={option}
                  className={`px-4 py-2 hover:bg-gray-300 cursor-pointer uppercase ${
                    isHighlighted || isSelected ? "text-primary" : "text-primary-black"
                  }`}
                  onSelect={() => {
                    setSelectedCategory(category);
                    setSelectedOption(option);
                    setIsManuallySelected(true); 
                  }}
                >
                  {option}
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
      <span className="border-l border-gray-300 h-6" />
   <div className="flex items-center bg-white z-10 pr-1 w-full">
   <Input
    disabled={selectedLocalities.length >= 3}
          value={searchQuery}
          onChange={handleInputChange}
          className="flex-1 px-4 lg:py-2 py-1 border-none focus:ring-0 focus:outline-none z-10 rounded-none lg:text-sm text-xs"
          placeholder={`${
            selectedLocalities.length >= 3
              ? "Can't select more..."
              : "Search upto 3 localities"
          }`}
        />
            {selectedLocalities.length > 0 && (
        <div className="lg:flex flex-wrap gap-2 hidden ">
          {selectedLocalities.map((locality, index) => (
            <span key={index} className="border border-[#22222260] rounded-2xl px-1 flex items-center">
             <span className="lg:text-xs text-[10px] text-[#222222cc] shine-text"> {locality}</span>
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
   </div>
      <Button
        onClick={handleSearch}
        className="bg-primary text-white pr-2 pl-7 lg:py-2 py-1 rounded-full flex items-center -ml-4 lg:text-sm text-xs"
      >
        <Search className="w-4 h-4 mr-1" /> <span className="hidden lg:block">Search</span>
      </Button>
      
    </div>
  
       {suggestions.length > 0 && !isOptionSelected && hasTyped && selectedLocalities.length !== 3 && (
        <ul className="absolute top-10 container w-full z-10 p-1 sm:w-full max-w-[90vw] bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <p
              key={index}
              className="flex justify-between text-[10px] sm:text-sm px-2 sm:px-4 py-2 hover:bg-primary hover:text-white cursor-pointer rounded-sm"
              onClick={() => handleSelectLocality(suggestion.postal_name)}
            >
              {suggestion.postal_name} <span className="text-[10px] text-[#22222280]">LOCALITY</span>
            </p>
          ))}
        </ul>
      )}
           <div className="flex flex-wrap gap-2 lg:hidden  mt-2">
          {selectedLocalities.map((locality, index) => (
            <span key={index} className="border border-[#22222260] rounded-2xl px-1 flex items-center">
             <span className="lg:text-xs text-[10px] text-[#222222cc] shine-text"> {locality}</span>
              <button
                onClick={() => handleRemoveLocality(locality)}
                className="ml-1 text-primary font-semibold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
  
    </div>
  );
}

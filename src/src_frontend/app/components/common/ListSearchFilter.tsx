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
  Residential: ["Buy", "Rent", "PG/Hostel", "Project"],
  Commercial: ["Buy", "Rent", "Open Land", "Project"],
};
export default function SearchBar() {
  const [isOptionSelected , setIsOptionSelected] = useState(false)
  const router = useRouter();
  const searchParams = useSearchParams();
  const city_name = searchParams.get("city_name");
  const searchKeyword = searchParams.get("searchKeyword");
  const [searchQuery, setSearchQuery] = useState<string>(searchKeyword || "");
  const filters = useFilterStore(); // Access entire store
  const { setFilter, resetFilters } = filters; // Extract setFilter for convenience
  const [selectedCategory, setSelectedCategory] = useState("Residential");
  const [selectedOption, setSelectedOption] = useState("Buy");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [hasTyped, setHasTyped] = useState(false);
  console.log(searchKeyword, "selectedOption");

  // ✅ Use Search Hook with both city_name and searchKeyword
  const { data, isLoading, error, refetch } = useSearchQuery({
    city: city_name as string,
    searchKeyword: searchQuery,
  });

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

  const handleSearch = () => {
    setFilter({
      property_type: selectedCategory,
      property_rent_buy: selectedOption,
    });
    

    const newUrl = `/ListofBuilder_List?city_name=${city_name}&searchKeyword=${searchQuery}`;
    router.push(newUrl);
    
  };
  return (
    <div className="relative flex items-center border-2 border-primary rounded-full w-full max-w-lg">
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center px-4 py-2 text-[#222222] rounded-md">
          <span className="font-normal text-sm">{selectedOption}</span>
          <ChevronDown className="w-4 h-4 ml-2 text-primary" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border rounded shadow-lg p-2">
          {Object.entries(propertyCategories).map(([category, options]) => (
            <div key={category} className="mb-2">
              <span className="block px-4 py-1 text-[#22222250] text-sm">
                {category}
              </span>
              {options.map((option) => (
                <DropdownMenuItem
                  key={option}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                  onSelect={() => {
                    setSelectedCategory(category);
                    setSelectedOption(option);
                    // setFilter({ property_type: category, property_rent_buy: option });
                  }}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="border-l border-gray-300 h-6" />
      <Input
        value={searchQuery}
        onChange={(e) =>{ setSearchQuery(e.target.value); if (!hasTyped) setHasTyped(true);}}
        className="flex-1 px-4 py-2 border-none focus:ring-0 z-10 rounded-none"
        placeholder="Search..."
      />
      <Button
        onClick={handleSearch}
        className="bg-primary text-white pr-2 pl-7 py-2 rounded-full flex items-center -ml-4"
      >
        <Search className="w-4 h-4 mr-1" /> Search
      </Button>
      {suggestions.length > 0 && !isOptionSelected && hasTyped &&  (
        <ul className="absolute top-10  container w-full z-10 p-1 sm:w-full max-w-[40vw] bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <Link href={""} key={index}>
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
    </div>
  );
}

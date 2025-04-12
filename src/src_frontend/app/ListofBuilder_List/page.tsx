"use client";
import FilterComponent from "./BuilderFilterComponent";
import PropertyCard from "./BuilderPropertyCard";
import BreadcrumbsFilter from "./BreadcrumbsFilter";
import { useParams } from "next/navigation";
import BuilderPropertyCard from "./BuilderPropertyCard";
import SearchBar from "../components/common/ListSearchFilter";
import Sponsor from "./Sponsor";
import { useState } from "react";
import SearchComponent from "../components/Home/HomeStatic/Seachbar/search-bar";
import { BsSortUp } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/ui/dropdown";
import useFilterStore from "@/Store/useFilterStore";
// import PropertyShowingCard from './PropertyShowingCard';

const ListOfProperties_List = () => {
  const params = useParams(); // Retrieve route parameters
    const city = params?.city_name; // Safely parse id
    const searchKeyword = params?.searchKeyword;
    const [getTotalCount, setGetTotalCount] = useState(0)
    const filters = useFilterStore();
    console.log(getTotalCount,'getTotalCount')
  return (
<div className="px-5">
<div className="sticky top-12 lg:top-20 bg-white z-10 py-3 flex justify-between lg:justify-center items-start">
<SearchBar/> <div className="lg:hidden block mt-3"><SearchComponent/></div>
<div className="lg:hidden block mt-3">
<DropdownMenu>
      <DropdownMenuTrigger asChild>
      <BsSortUp size={27} color="#22222280" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white mr-2">
        <DropdownMenuLabel className="text-sm text-primary-black">Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray h-px" />
          <DropdownMenuItem onClick={()=>filters.setFilter({ sortOrder:'asc' })} className=" text-xs p-1 border-b">
          Posted On (Newest first)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>filters.setFilter({ sortOrder: 'desc' })} className=" text-xs p-1">
          Posted On (Oldest first)
          </DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
</div>
</div>
    <div className="grid grid-cols-4 gap-4">
      
      <div className="col-span-4 hidden lg:block lg:col-span-1 bg-white  border-gray-300">
        <FilterComponent />
      </div>

      <div className="lg:col-span-2 col-span-4">
        <BreadcrumbsFilter getTotalCount={getTotalCount}/>

        <div className="my-4 w-full">
          <BuilderPropertyCard setGetTotalCount={setGetTotalCount}/>
        </div>
        {/* Properties List */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {mockProperties.map((property) => (
            <PropertyShowingCard key={property.id} property={property} />
          ))}
        </div> */}
      </div>
      <div className="col-span-4 lg:col-span-1 bg-white  border-gray-300">
        <Sponsor />
      </div>
    </div>
    </div>
  );
};

export default ListOfProperties_List;

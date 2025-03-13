"use client";
import FilterComponent from "./BuilderFilterComponent";
import PropertyCard from "./BuilderPropertyCard";
import BreadcrumbsFilter from "./BreadcrumbsFilter";
import { useParams } from "next/navigation";
import BuilderPropertyCard from "./BuilderPropertyCard";
import SearchBar from "../components/common/ListSearchFilter";
import Sponsor from "./Sponsor";
import { useState } from "react";
// import PropertyShowingCard from './PropertyShowingCard';

const ListOfProperties_List = () => {
  const params = useParams(); // Retrieve route parameters
    const city = params?.city_name; // Safely parse id
    const searchKeyword = params?.searchKeyword;
    const [getTotalCount, setGetTotalCount] = useState(0)

    console.log(getTotalCount,'getTotalCount')
  return (
<div className="px-5">
<div className="sticky top-20 bg-white z-10 py-3 flex justify-center">
<SearchBar/>
</div>
    <div className="grid grid-cols-4 gap-4">
      
      <div className="col-span-4 lg:col-span-1 bg-white  border-gray-300">
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

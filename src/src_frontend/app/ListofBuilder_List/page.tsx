"use client";
import FilterComponent from "./BuilderFilterComponent";
import PropertyCard from "./BuilderPropertyCard";
import BreadcrumbsFilter from "./BreadcrumbsFilter";
import { useParams } from "next/navigation";
import BuilderPropertyCard from "./BuilderPropertyCard";
// import PropertyShowingCard from './PropertyShowingCard';

const ListOfProperties_List = () => {
  const params = useParams(); // Retrieve route parameters
    const city = params?.city_name; // Safely parse id
    const searchKeyword = params?.searchKeyword;
    
  return (
    <div className="flex flex-row bg-gray-100 p-5 w-full max-w-7xl mx-auto">
      {/* Left Filter Section */}
      <div className="hidden lg:block w-1/4 bg-white border-r border-gray-300">
        <FilterComponent />
      </div>

      {/* Right Content Section */}
      <div className="flex-1 lg:p-5 overflow-hidden">
        {/* Breadcrumb and Filter */}

        <BreadcrumbsFilter />

        <div className="my-4 w-full max-w-[719px]">
          <BuilderPropertyCard />
        </div>
        {/* Properties List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {/* {mockProperties.map((property) => (
            // <PropertyShowingCard key={property.id} property={property} />
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default ListOfProperties_List;

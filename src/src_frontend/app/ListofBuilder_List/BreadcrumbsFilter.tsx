"use client";
import useFilterStore from "@/Store/useFilterStore";
import { useSearchParams } from "next/navigation";
import React from "react";
interface BreadcrumbProps {
  getTotalCount: number;
}

const BuilderBreadcrumbsFilter = ({ getTotalCount }: BreadcrumbProps) => {
  const filters = useFilterStore();
  const searchParams = useSearchParams();
  const city_name = searchParams.get("city_name");
  const searchKeyword = searchParams.get("searchKeyword");
  const property_type = searchParams.get("property_type");
  return (
    <div className="hidden lg:flex justify-between items-center p-2 rounded-md mx-1 border border-gray-200">
     

      <p className="text-sm text-[#222222E5]">
        {/* {getTotalCount} -  */}
        {property_type} properties for {searchKeyword} {city_name}{" "}
      </p>
      {/* Sort Dropdown */}
      <div className="flex items-center space-x-2">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort By:
        </label>
        <select
          id="sort"
          name="sort"
          value={filters.sortOrder || "newest"}
          onChange={(e) => filters.setFilter({ sortOrder: e.target.value })}
          className="p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="asc">Posted On (Newest first)</option>
          <option value="desc">Posted On (Oldest first)</option>
          {/* <option value="rent-high">Rent (High to Low)</option>
          <option value="rent-low">Rent (Low to High)</option> */}
          {/* <option value="available-earliest">
            Available from (Earliest first)
          </option>
          <option value="available-latest">
            Available from (Oldest first)
          </option> */}
        </select>
      </div>
    </div>
  );
};

export default BuilderBreadcrumbsFilter;

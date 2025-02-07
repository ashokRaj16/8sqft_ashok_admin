"use client";
import useFilterStore from "@/Store/useFilterStore";
import React from "react";

const BuilderBreadcrumbsFilter = () => {
  const filters = useFilterStore();

  return (
    <div className="hidden lg:flex justify-between items-center p-4 border-b border-gray-200">
      <nav aria-label="breadcrumb" className="text-sm text-gray-600">
        {/* <ol className="flex space-x-2">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          <span>/</span>
          <li>
            <a href="/pune" className="hover:underline">
              Pune
            </a>
          </li>
          <span>/</span>
          <li>Multiple</li>
        </ol> */}
      </nav>

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
          <option value="rent-high">Rent (High to Low)</option>
          <option value="rent-low">Rent (Low to High)</option>
          <option value="available-earliest">
            Available from (Earliest first)
          </option>
          <option value="available-latest">
            Available from (Oldest first)
          </option>
        </select>
      </div>
    </div>
  );
};

export default BuilderBreadcrumbsFilter;

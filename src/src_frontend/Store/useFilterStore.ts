import { create } from "zustand";

interface PropertylistParams {
  city_name: string;
  limit: number;
  amount_range?: string;
  locality?: string;
  property_variety_type?: string;
  property_variety?: string;
  furnishing?: string;
  availability_date?: string;
  sortOrder?: string;
  sortColumn?: string;
  preferred_tenent?: string[]
  property_availibility_type?: string
  parking?: string
  property_type?: string,
  property_rent_buy?: string
}

interface FilterStoreState extends PropertylistParams {
  setFilter: (newFilters: Partial<PropertylistParams>) => void;
  resetFilters: () => void; // Reset method
}

const useFilterStore = create<FilterStoreState>((set) => ({
  // Default required filters
  city_name: "Default City",
  limit: 100,
  // Optional filters
  amount_range: undefined,
  locality: undefined,
  property_variety_type: undefined,
  property_variety: undefined,
  furnishing: undefined,
  availability_date: undefined,
  sortOrder: undefined,
  sortColumn: undefined,
  preferred_tenent: undefined,
  property_availibility_type: undefined,
  parking: undefined,
  property_type:undefined,
  property_rent_buy: undefined,
  // Method to update filters
  setFilter: (newFilters) =>
    set((state) => ({
      ...state,
      ...newFilters,
    })),
  resetFilters: () =>
    set(() => ({
      city_name: "Default City",
      limit: 100,
      amount_range: undefined,
      locality: undefined,
      property_variety_type: undefined,
      property_variety: undefined,
      furnishing: undefined,
      availability_date: undefined,
      sortOrder: undefined,
      sortColumn: undefined,
      preferred_tenent: undefined,
      property_availibility_type: undefined,
      parking: undefined,
    })),
}));

export default useFilterStore;

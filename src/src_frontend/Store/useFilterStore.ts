import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PropertylistParams {
  city_name: string;
  limit: number;
  price_range?: string;
  amount_range?: string;
  project_area?: string;
  locality?: string;
  property_variety_type?: string;
  property_variety?: string;
  furnishing?: string;
  availability_date?: string;
  sortOrder?: string;
  sortColumn?: string;
  preferred_tenent?: string[];
  property_availibility_type?: string;
  parking?: string;
  property_type?: string;
  property_rent_buy?: string;
  property_current_status?: string;
  width_facing_road?: string;
  is_rera_number?: string;
  other_amenities?: any;
  property_config_type?: any;
}

interface FilterStoreState extends PropertylistParams {
  setFilter: (newFilters: Partial<PropertylistParams>) => void;
  resetFilters: () => void;
}

const useFilterStore = create<FilterStoreState>()(
  persist(
    (set) => ({
      // Default required filters
      city_name: "Default City",
      limit: 100,
      // Optional filters
      price_range: undefined,
      amount_range: undefined,
      project_area: undefined,
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
      property_type: undefined,
      property_rent_buy: undefined,
      property_current_status: undefined,
      width_facing_road: undefined,
      other_amenities: undefined,
      is_rera_number: undefined,
      property_config_type: undefined,
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
          price_range: undefined,
          amount_range: undefined,
          project_area: undefined,
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
          // property_type: undefined,
          // property_rent_buy: undefined,
          property_current_status: undefined,
          width_facing_road: undefined,
          other_amenities: undefined,
          is_rera_number: undefined,
          property_config_type: undefined,
        })),
    }),
    {
      name: "filter-store", // Key for localStorage
    }
  )
);

export default useFilterStore;

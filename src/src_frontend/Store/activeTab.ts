import { create } from 'zustand';

// Define the state type
interface ActiveTabState {
  property_rent_buy: string; // Active tab value as a string
  setPropertyRentBuy: (value: string) => void; // Setter function
}

// Explicitly provide the type to Zustand's create function
const useActiveTabStore = create<ActiveTabState>((set) => ({
  property_rent_buy: '', // Default to an empty string
  setPropertyRentBuy: (value: string) => set({ property_rent_buy: value }), 
}));

export default useActiveTabStore;

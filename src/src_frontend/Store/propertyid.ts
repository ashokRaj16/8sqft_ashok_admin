// useStore.ts
import { create } from 'zustand';
import { persist } from "zustand/middleware";
interface PropertyIdStore {
  id: string | null; // Define the type for id (string | null in this case)
  setId: (newId: string) => void; // Define the type for the setId function
}

const usePropertyIdStore = create<PropertyIdStore>()(
  persist(
    (set) => ({
      id: null, // Initial value
      setId: (newId) => set({ id: newId }), // Update function
    }),
    {
      name: "property-id-store", // Key for localStorage
    }
  )
);

export default usePropertyIdStore;

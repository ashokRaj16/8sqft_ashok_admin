// useStore.ts
import { create } from 'zustand';

interface PropertyIdStore {
  id: string | null; // Define the type for id (string | null in this case)
  setId: (newId: string) => void; // Define the type for the setId function
}

const usePropertyIdStore = create<PropertyIdStore>((set) => ({
  id: null, // Initial value for id
  setId: (newId) => set({ id: newId }), // Function to update the id
}));

export default usePropertyIdStore;

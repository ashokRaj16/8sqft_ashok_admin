import { create } from "zustand";

interface PropertyState {
  details: {
    phone: string;
    email: string;
    propertyType: string;
    lookingFor: string;
  };
  addDetails: (details: PropertyState["details"]) => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  details: {
    phone: "",
    email: "",
    propertyType: "",
    lookingFor: "",
  },
  addDetails: (details) =>
    set(() => ({
      details,
    })),
}));

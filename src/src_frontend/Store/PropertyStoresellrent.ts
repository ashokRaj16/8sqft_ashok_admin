import { create } from 'zustand';

interface PropertyState {
  phone: string;
  email: string;
  propertyType: string;
  lookingFor: string;
  setPropertyDetails: (details: Partial<PropertyState>) => void;
}

export const PropertyStoresellrent = create<PropertyState>((set) => ({
  phone: '',
  email: '',
  propertyType: 'Residential',
  lookingFor: 'Rent',
  setPropertyDetails: (details) => set((state) => ({ ...state, ...details })),
}));

// src/store/useAuthStore.ts
import { create } from "zustand";

// Define the store's state and actions
interface EmailState {
  email: string; // Email value in state
  setEmail: (email: string) => void; // Action to update email
}

export const useEmailStore = create<EmailState>((set) => ({
  email: "", // Initial state for email
  setEmail: (email) => set({ email }), // Action to set email value
}));

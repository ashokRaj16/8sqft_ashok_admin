import { create } from "zustand";
import { decodeToken } from "@/lib/jwtDecode";

interface AuthState {
  id: number | null;
  email: string | null;
  token: string | null;
  setAuth: (id: number, email: string, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  id: null,
  email: null,
  token: null,

  // Method to set authentication data
  setAuth: (id, email, token) => set({ id, email, token }),

  // Method to clear authentication data
  clearAuth: () => {
    sessionStorage.removeItem("authToken");
    set({ id: null, email: null, token: null });
  },
}));

// Function to initialize Zustand state with localStorage data
export const hydrateAuthStore = () => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    const decoded = decodeToken(token);
    if (decoded) {
      const { id, email } = decoded;
      const useStore = useAuthStore.getState();
      useStore.setAuth(id, email, token); // Populate Zustand store
    } else {
      sessionStorage.removeItem("authToken"); // Remove invalid/expired token
    }
  }
};

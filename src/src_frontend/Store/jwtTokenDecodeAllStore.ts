import { jwtTokenDecodeAll } from "@/lib/jwtTokenDecodeAll";
import { create } from "zustand";


interface AuthState {
  id: number | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  mobile: number | null;
  iat: number | null;
  exp: number | null;
  token: string | null;
  setAuth: (
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    mobile: number,
    iat: number,
    exp: number,
    token: string
  ) => void;
  clearAuth: () => void;
}

export const usejwtAuthStore = create<AuthState>((set) => ({
  id: null,
  email: null,
  first_name: null,
  last_name: null,
  mobile: null,
  iat: null,
  exp: null,
  token: null,

  // Method to set authentication data
  setAuth: (id, email, first_name, last_name, mobile, iat, exp, token) =>
    set({ id, email, first_name, last_name, mobile, iat, exp, token }),

  // Method to clear authentication data
  clearAuth: () => {
    localStorage.removeItem("authToken");
    set({
      id: null,
      email: null,
      first_name: null,
      last_name: null,
      mobile: null,
      iat: null,
      exp: null,
      token: null,
    });
  },
}));

// Function to initialize Zustand state with localStorage data
export const hydrateAuthStore = () => {
  const token = localStorage.getItem("authToken"); // Get token from localStorage
  
  if (token) {
    const decoded = jwtTokenDecodeAll(token); // Decode token
    if (decoded) {
      const { id, email, first_name, last_name, mobile, iat, exp } = decoded;
      const useStore = usejwtAuthStore.getState();
      useStore.setAuth(id, email, first_name, last_name, mobile, iat, exp, token); // Populate Zustand store
    } else {
      localStorage.removeItem("authToken"); // Remove invalid/expired token
    }
  }
};

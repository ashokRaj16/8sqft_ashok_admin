import { useAuthStore } from "@/Store/jwtTokenStore";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  mobile: number;
  iat: number;
  exp: number;
}

export const jwtTokenDecodeAll = (token: string | null): DecodedToken | null => {
    
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    return null;
  }
};


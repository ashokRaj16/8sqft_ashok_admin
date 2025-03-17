import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  email?: string;
  mobile?: string,
  iat: number;
  exp: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

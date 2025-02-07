"use client"; // Mark this as a client component

import { hydrateAuthStore } from "@/Store/jwtTokenStore";
import React from "react";

const HydrateAuth: React.FC = () => {
  React.useEffect(() => {
    hydrateAuthStore(); // Your function here
  }, []);

  return null; // No UI, just logic
};

export default HydrateAuth;

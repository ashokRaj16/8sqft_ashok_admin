"use client";
import { hydrateAuthStore } from "@/Store/jwtTokenStore";
import MainComponent from "./components/Home/Main";
import React, { useEffect } from "react";
import FooterComponent from "./components/Footer/Footer";

export default function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, []);
  return (
    <main className=" w-screen">
      <MainComponent />
    </main>
  );
}

"use client";
import { hydrateAuthStore } from "@/Store/jwtTokenStore";
import MainComponent from "./components/Home/Main";
import React from "react";
import FooterComponent from "./components/Footer/Footer";

export default function Home() {
  return (
    <main className=" w-screen">
      <MainComponent />
    </main>
  );
}

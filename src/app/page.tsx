"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PartnerProgramSection from "@/components/PartnerProgramSection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header isLoggedIn={isLoggedIn} />
      <main
        id="app-scroll"
        className="flex-grow overflow-y-auto snap-y snap-proximity scroll-smooth"
      >
        <HeroSection />
        <PartnerProgramSection isLoggedIn={isLoggedIn} />
        <FeaturesSection />
        <AboutSection />
        <Footer />
      </main>
    </div>
  );
}

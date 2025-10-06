import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PartnerProgramSection from "@/components/PartnerProgramSection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col h-screen">
      <Header session={session} />
      <main id="app-scroll" className="flex-grow overflow-y-auto scroll-smooth">
        <HeroSection />
        <PartnerProgramSection session={session} />
        <FeaturesSection />
        <AboutSection />
        <Footer />
      </main>
    </div>
  );
}

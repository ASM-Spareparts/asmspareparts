import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center scroll-mt-16"
      style={{
        backgroundImage: `url(/images/hero-background.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/40" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-md mb-4">
          Solusi Terpercaya Suku Cadang Motor Anda
        </h1>
        <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-3xl mx-auto mb-8">
          Mitra andalan untuk bisnis bengkel (B2B) dan pengendara motor (B2C) di
          seluruh Indonesia. Dapatkan produk berkualitas dengan harga terbaik.
        </p>
        <Button
          size="lg"
          className="group relative inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-white/10 shadow-[0_8px_30px_rgba(16,185,129,0.35)] hover:from-emerald-600 hover:to-emerald-700 hover:shadow-[0_8px_40px_rgba(16,185,129,0.45)] focus-visible:ring-emerald-400/40 overflow-hidden"
          asChild
        >
          <a
            href="https://wa.me/6287842812082"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Minta katalog via WhatsApp"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">Minta Katalog via WhatsApp</span>
          </a>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;

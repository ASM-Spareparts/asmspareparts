import { Button } from "@/components/ui/button";

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

      <div className="container relative z-10 mx-auto px-6 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-md mb-4">
          Solusi Terpercaya Suku Cadang Motor Anda
        </h1>
        <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-3xl mx-auto mb-8">
          Mitra andalan untuk bisnis bengkel (B2B) dan pengendara motor (B2C) di
          seluruh Indonesia. Dapatkan produk berkualitas dengan harga terbaik.
        </p>
        <Button
          size="lg"
          className="shadow-lg hover:shadow-xl transition"
          asChild
        >
          <a
            href="https://wa.me/6281234567890?text=Halo%20ASM,%20saya%20tertarik%20dengan%20katalog%20produk%20Anda."
            target="_blank"
            rel="noopener noreferrer"
          >
            Minta Katalog via WhatsApp
          </a>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;

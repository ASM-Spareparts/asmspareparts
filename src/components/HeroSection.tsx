import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <section
      id="home"
      className="h-screen bg-slate-50 flex items-center snap-start scroll-mt-16"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
          Solusi Terpercaya Suku Cadang Motor Anda
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
          Mitra andalan untuk bisnis bengkel (B2B) dan pengendara motor (B2C) di
          seluruh Indonesia. Dapatkan produk berkualitas dengan harga terbaik.
        </p>
        <Button size="lg" asChild>
          <a
            href="https://wa.me/6281234567890?text=Halo%20ASM,%20saya%20tertarik%20dengan%20katalog%20produk%20Anda."
            target="_blank"
          >
            Minta Katalog via WhatsApp
          </a>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;

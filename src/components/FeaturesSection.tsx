import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShieldCheck, Truck, CircleDollarSign } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-slate-500" />,
    title: "Pengalaman Terbukti (20+ Tahun)",
    description:
      "Kami bukan pemain baru. Pengalaman lebih dari dua dekade menjadikan kami ahli dalam distribusi suku cadang, memastikan Anda mendapatkan produk yang tepat dan andal.",
  },
  {
    icon: <Truck className="h-8 w-8 text-slate-500" />,
    title: "Jaringan Distribusi Luas",
    description:
      "Telah menjadi pemasok terpercaya bagi ratusan toko dan bengkel di berbagai kota. Kami siap melayani kebutuhan bisnis Anda, di mana pun lokasi Anda.",
  },
  {
    icon: <CircleDollarSign className="h-8 w-8 text-slate-500" />,
    title: "Harga Kompetitif & Jujur",
    description:
      "Hubungan langsung dengan produsen memungkinkan kami untuk memberikan harga terbaik bagi Anda, baik untuk pembelian grosir (B2B) maupun eceran (B2C).",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-slate-50 py-16 md:py-24 scroll-mt-16">
      <div className="container mx-auto px-4 md:px-8 max-w-8xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-medium text-amber-700">Keunggulan Kami</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900">
            Mengapa Memilih ASM?
          </h2>
          <p className="mt-3 text-slate-600">
            Pengalaman, jaringan, dan harga yang kompetitif untuk mendukung
            pertumbuhan bisnis Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="pt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

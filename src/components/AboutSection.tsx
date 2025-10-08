import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle } from "lucide-react";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative py-20 md:py-28 bg-gradient-to-b from-white to-slate-50 scroll-mt-16 overflow-hidden"
    >
      {/* decorative glow removed per request */}
      <div className="container mx-auto px-4 md:px-8 max-w-8xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex h-6 items-center rounded-full bg-amber-50 px-2 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200 mb-4">
            Tentang Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Perjalanan Kami
          </h2>
          <p className="mt-4 text-slate-600">
            Dua dekade lebih mendukung pertumbuhan ekosistem suku cadang motor
            di Indonesia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: Story / Copy */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-slate-100/30 via-white to-slate-100/40" />
            <div className="backdrop-blur-sm rounded-3xl border border-slate-200/70 bg-white/60 p-8 md:p-12 shadow-sm">
              <div className="prose prose-slate max-w-none text-slate-600 dark:prose-invert">
                <p>
                  Selama lebih dari 20 tahun, ASM JAYA telah menjadi mitra
                  terpercaya dalam distribusi sparepart motor OEM berkualitas di
                  Indonesia. Kami berkomitmen untuk menyediakan berbagai suku
                  cadang motor yang lengkap, original, dan berstandar
                  internasional yang mendukung kelancaran dan performa kendaraan
                  pelanggan kami.
                  <br />
                  <br />
                  Deangan pengalaman sealama lebih dari 2 dekade, ASM JAYA
                  tumbuh dan berkembang bersama industri otomotif yang dinamis,
                  dengan fokus pada pelayanan prima, kecepatan distribusi, dan
                  harga yang kompetitif. Dengan jaringan distribusi yang luas
                  dan tim profesional yang berpengalaman pada industri
                  spareparts motor, kami memastikan setiap kebutuhan spareparts
                  motor dapat terpenuhi dengan cepat dan tepat.
                  <br />
                  <br />
                  Kepercayaan dan kepuasan pelanggan adalah prioritas utama
                  kami. Kami terus berinovasi dan beradaptasi dengan
                  perkembangan teknologi untuk menghadirkan solusi terbaik bagi
                  mitra bisnis dan konsumen kami di seluruh nusantara.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Stats / Values / CTA */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
                  <div className="px-3">
                    <div className="text-3xl font-bold text-slate-900">20+</div>
                    <div className="mt-1 text-xs text-slate-600">
                      Tahun Pengalaman
                    </div>
                  </div>
                  <div className="px-3">
                    <div className="text-3xl font-bold text-slate-900">
                      100+
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      Mitra Bengkel
                    </div>
                  </div>
                  <div className="px-3">
                    <div className="text-3xl font-bold text-slate-900">
                      10K+
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      Pesanan Terkirim
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ul className="space-y-3">
              {[
                "Produk original & terkurasi",
                "Pengiriman cepat ke berbagai kota",
                "Harga transparan & dukungan purna jual",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-slate-700"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-amber-600" />
                  <span className="text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
                  asChild
                >
                  <a
                    href="https://wa.me/6287842812082"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Hubungi ASM via WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="ml-1 font-semibold">Hubungi Kami</span>
                  </a>
                </Button>
                <Button variant="link" className="px-0 text-slate-700" asChild>
                  <a href="#partner">Pelajari Program Mitra</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

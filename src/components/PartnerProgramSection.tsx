import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chrome } from "lucide-react";

type PartnerProgramProps = {
  isLoggedIn: boolean;
};

const PartnerProgramSection = ({ isLoggedIn }: PartnerProgramProps) => {
  const backgroundImageUrl =
    "https://plus.unsplash.com/premium_photo-1678495324281-b6e39deea8cc?q=80&w=677&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <section
      id="partner"
      className="min-h-screen bg-white flex snap-start scroll-mt-16"
    >
      {/* Image Side (Visible on md screens and up) */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      ></div>

      {/* Content Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="max-w-md w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Program Mitra ASM: Raih Hadiah Emas!¹
          </h2>
          <p className="text-slate-600 mb-8">
            Sebagai apresiasi bagi mitra setia, setiap pembelanjaan senilai{" "}
            <strong>Rp 1.000.000,-</strong> (berlaku kelipatan), Anda berhak
            mendapatkan <strong>1 kupon undian</strong> untuk memenangkan hadiah
            utama.
          </p>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>
                {isLoggedIn
                  ? "Submit Kode Undian Anda"
                  : "Login untuk Partisipasi"}
              </CardTitle>
              <CardDescription>
                {isLoggedIn
                  ? "Masukkan kode unik dari kupon Anda di bawah ini."
                  : "Sudah punya kupon? Masuk untuk submit kode Anda dan lihat statusnya."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoggedIn ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lottery-code">Kode Kupon</Label>
                    <Input
                      id="lottery-code"
                      placeholder="Contoh: ASM-XYZ-123"
                    />
                  </div>
                  <Button className="w-full">Submit Kode</Button>
                </div>
              ) : (
                <Button className="w-full" size="lg">
                  <Chrome className="mr-2 h-4 w-4" /> Login dengan Google
                </Button>
              )}
              <p className="text-xs text-slate-500 mt-4 text-center">
                ¹Hadiah utama akan diumumkan di awal setiap periode program.
                Syarat & ketentuan berlaku.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PartnerProgramSection;

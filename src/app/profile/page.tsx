"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState<string>("");
  const [namaLengkap, setNamaLengkap] = useState<string>("");
  const [nomorTelepon, setNomorTelepon] = useState<string>("");
  const [alamat, setAlamat] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleDeleteAccount = () => {
    // Placeholder action: clear the email to simulate unlink
    setEmail("");
    alert("Akun berhasil dihapus (simulasi). Hubungkan API untuk produksi.");
  };

  const handleSave = async () => {
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: namaLengkap,
          address: alamat,
          phone_number: nomorTelepon,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Gagal menyimpan profil");
      setMessage("Profil berhasil disimpan.");
    } catch (err: any) {
      setMessage(err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prefill email from session
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (!ignore && data?.profile) {
          const p = data.profile as any;
          if (typeof p.email === "string") setEmail(p.email);
          if (typeof p.full_name === "string") setNamaLengkap(p.full_name);
          if (typeof p.phone_number === "string")
            setNomorTelepon(p.phone_number);
          if (typeof p.address === "string") setAlamat(p.address);
        }
      } catch {
        // ignore fetch errors
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <DashboardLayout
      title="Profil Saya"
      description="Kelola informasi akun Anda."
    >
      <div className="space-y-6 text-slate-700">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-1">
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              id="nama"
              placeholder="Masukkan nama lengkap"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
            />
          </div>
          <div className="grid gap-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email</Label>
              <span className="text-xs text-slate-500">
                Terkait Google • terkunci
              </span>
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              disabled
              className="bg-slate-50"
            />
          </div>
          <div className="grid gap-2 sm:col-span-1">
            <Label htmlFor="telepon">Nomor Telepon</Label>
            <Input
              id="telepon"
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={nomorTelepon}
              onChange={(e) => setNomorTelepon(e.target.value)}
            />
          </div>
          <div className="grid gap-2 sm:col-span-1">
            <Label htmlFor="alamat">Alamat</Label>
            <Input
              id="alamat"
              placeholder="Nama jalan, kecamatan, kota"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:justify-between sm:items-center">
          <div className="text-sm h-6 text-slate-600">{message}</div>
          <Button onClick={handleSave} className="sm:w-auto" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={!email}
            className="sm:w-auto"
          >
            Hapus Akun
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

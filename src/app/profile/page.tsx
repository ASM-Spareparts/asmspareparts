"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  // Placeholder: simulate linked Google account
  const [email, setEmail] = useState<string>("andy.motor@example.com");
  const [namaLengkap, setNamaLengkap] = useState<string>("");
  const [nomorTelepon, setNomorTelepon] = useState<string>("");
  const [alamat, setAlamat] = useState<string>("");

  const handleDeleteAccount = () => {
    // Placeholder action: clear the email to simulate unlink
    setEmail("");
    alert("Akun berhasil dihapus (simulasi). Hubungkan API untuk produksi.");
  };

  const handleSave = () => {
    // Placeholder save: show a summary of values
    alert(
      `Disimpan (simulasi)\n\nNama Lengkap: ${namaLengkap}\nEmail: ${email}\nNomor Telepon: ${nomorTelepon}\nAlamat: ${alamat}`
    );
  };

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

        <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:justify-end">
          <Button onClick={handleSave} className="sm:w-auto">
            Simpan Perubahan
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

"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

type Coupon = {
  code: string;
  prize: string;
  status: "aktif" | "digunakan" | "kedaluwarsa";
};

const prizeBySpend = (code: string): string => {
  const clean = code.trim().toUpperCase();
  if (clean.includes("2M") || clean.includes("2000000")) return "Motor Matic";
  if (clean.includes("1M") || clean.includes("1000000")) return "Emas 10 gram";
  if (clean.includes("500K") || clean.includes("500000")) return "Smartphone";
  if (clean.includes("200K") || clean.includes("200000")) return "Voucher 100K";
  if (clean.includes("100K") || clean.includes("100000"))
    return "Aksesoris/Powerbank";
  return "Hadiah Hiburan";
};

export default function UndianSayaPage() {
  const [code, setCode] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const probablePrize = useMemo(() => (code ? prizeBySpend(code) : ""), [code]);

  const addCode = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setCoupons((prev) => [
      {
        code: trimmed.toUpperCase(),
        prize: prizeBySpend(trimmed),
        status: "aktif",
      },
      ...prev,
    ]);
    setCode("");
  };

  return (
    <DashboardLayout
      title="Undian Saya"
      description="Masukkan kode undian Anda dan lihat status serta kemungkinan hadiah."
    >
      <Card className="rounded-2xl border-slate-200 shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Masukkan kode (contoh: ASM-500K-XYZ)"
              className="flex-1"
            />
            <Button onClick={addCode} disabled={!code.trim()}>
              Tambahkan
            </Button>
          </div>
          {probablePrize && (
            <p className="mt-3 text-sm text-slate-600">
              Perkiraan hadiah:{" "}
              <span className="font-medium text-slate-900">
                {probablePrize}
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      {coupons.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-6 text-slate-700 bg-white">
          <p className="mb-2">
            Belum ada kupon. Masukkan kode di atas untuk menambah kupon.
          </p>
          <p className="text-sm text-slate-500">
            Kode format contoh: ASM-100K-XXXX, ASM-1M-YYYY, dll.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-50 text-slate-600 text-sm font-medium">
            <div className="col-span-5 px-4 py-3">Kode</div>
            <div className="col-span-4 px-4 py-3">Perkiraan Hadiah</div>
            <div className="col-span-3 px-4 py-3">Status</div>
          </div>
          {coupons.map((c, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 border-t last:border-b-0"
            >
              <div className="col-span-5 px-4 py-3 font-mono text-sm">
                {c.code}
              </div>
              <div className="col-span-4 px-4 py-3">{c.prize}</div>
              <div className="col-span-3 px-4 py-3">
                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2 py-0.5 text-xs">
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

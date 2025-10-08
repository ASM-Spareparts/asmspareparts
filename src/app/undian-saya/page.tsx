"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

type Coupon = {
  code: string;
  prize: string;
  status: "aktif" | "digunakan" | "kedaluwarsa";
};

export default function UndianSayaPage() {
  const [code, setCode] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/lottery-codes/mine");
        const data = await res.json().catch(() => ({}));
        if (!ignore && Array.isArray(data?.codes)) {
          const mapped: Coupon[] = data.codes.map((row: any) => ({
            code: String(row.code),
            prize: row?.prize?.description || "",
            status: "aktif",
          }));
          setCoupons(mapped);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const addCode = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    const now = Date.now();
    if (now < cooldownUntil) {
      setMessage("Terlalu banyak percobaan. Coba lagi sebentar.");
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/lottery-codes/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        setCoupons((prev) => [
          {
            code: String(data.code),
            prize: data?.prize?.description || "",
            status: "aktif",
          },
          ...prev,
        ]);
        setCode("");
        setMessage("Kode berhasil diklaim.");
      } else {
        // common errors: 400 invalid, 404 not found, 409 claimed, 429 rate limit
        setMessage(
          typeof data?.error === "string" ? data.error : "Gagal mengklaim kode."
        );
        // apply small client cooldown for brute-force protection UI-side (server enforces too)
        setCooldownUntil(Date.now() + 3000);
      }
    } finally {
      setSubmitting(false);
    }
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
            <Button onClick={addCode} disabled={!code.trim() || submitting}>
              Tambahkan
            </Button>
          </div>
          {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
        </CardContent>
      </Card>

      {loading ? (
        <div className="rounded-xl border border-slate-200 p-6 text-slate-700 bg-white">
          Memuat...
        </div>
      ) : coupons.length === 0 ? (
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

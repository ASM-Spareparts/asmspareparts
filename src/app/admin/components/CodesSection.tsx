"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Campaign = { id: number; name: string };
type Prize = {
  id: number;
  campaign_id: number;
  rank: number;
  description: string;
  quantity: number;
};

type EnrichedCode = {
  id: number;
  created_at: string;
  code: string;
  campaign_id: number;
  prize_id: number;
  user_id: string | null;
  campaign: { id: number; name: string } | null;
  prize: { id: number; description: string; rank: number } | null;
  user: { id: string; email: string | null; name: string | null } | null;
};

export default function CodesSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | "">("");
  const [selectedPrizeId, setSelectedPrizeId] = useState<number | "">("");
  const [codeCount, setCodeCount] = useState(10);

  const [codes, setCodes] = useState<EnrichedCode[]>([]);
  const [codesLoading, setCodesLoading] = useState(false);
  const [codesOffset, setCodesOffset] = useState(0);
  const codesLimit = 50;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showNewCodes, setShowNewCodes] = useState(false);
  const [newCodes, setNewCodes] = useState<string[]>([]);

  function handleDeleteCode(id: number) {
    setDeleteId(id);
    setDeleteOpen(true);
  }

  async function confirmDeleteCode() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/lottery-codes?id=${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const nextOffset =
          codes.length <= 1 && codesOffset > 0
            ? Math.max(0, codesOffset - codesLimit)
            : codesOffset;
        await loadCodes(nextOffset);
        setDeleteOpen(false);
        setDeleteId(null);
        toast.success("Kode dihapus.");
      } else {
        toast.error(`Gagal menghapus kode: ${data?.error || "Unknown error"}`);
      }
    } finally {
      setDeleting(false);
    }
  }

  const prizesForSelected = useMemo(
    () => prizes.filter((p) => p.campaign_id === (selectedCampaignId || 0)),
    [prizes, selectedCampaignId]
  );

  async function loadCampaigns() {
    const res = await fetch("/api/admin/campaigns");
    if (!res.ok) return;
    const data = await res.json();
    setCampaigns(Array.isArray(data?.campaigns) ? data.campaigns : []);
  }

  async function loadPrizes(campaignId?: number) {
    const url = campaignId
      ? `/api/admin/prizes?campaign_id=${campaignId}`
      : "/api/admin/prizes";
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    setPrizes(Array.isArray(data?.prizes) ? data.prizes : []);
  }

  async function loadCodes(offset = 0) {
    setCodesLoading(true);
    try {
      const res = await fetch(
        `/api/admin/lottery-codes?limit=${codesLimit}&offset=${offset}`
      );
      const data = await res.json();
      if (res.ok) {
        setCodes(
          Array.isArray(data?.codes) ? (data.codes as EnrichedCode[]) : []
        );
        setCodesOffset(offset);
      }
    } finally {
      setCodesLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
    loadPrizes();
    loadCodes(0);
  }, []);

  async function handleGenerateCodes() {
    if (!selectedCampaignId || !selectedPrizeId)
      return toast.info("Pilih campaign dan hadiah");
    if (codeCount <= 0) return toast.info("Jumlah kode harus lebih dari 0");
    const payload = {
      campaign_id: Number(selectedCampaignId),
      prize_id: Number(selectedPrizeId),
      count: Math.max(1, Math.floor(Number(codeCount))),
    };
    const res = await fetch("/api/admin/lottery-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      const inserted =
        typeof data?.inserted === "number" ? data.inserted : payload.count;
      const created = Array.isArray(data?.codes)
        ? (data.codes as string[])
        : [];
      if (created.length > 0) {
        setNewCodes(created);
        setShowNewCodes(true);
      }
      toast.success(`Berhasil membuat ${inserted} kode.`);
      loadCodes(codesOffset);
    } else {
      toast.error(`Gagal membuat kode: ${data?.error || "Unknown error"}`);
    }
  }

  return (
    <div id="codes" className="space-y-6">
      {/* Generate form Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>Kode Undian</CardTitle>
              <CardDescription>
                Lihat semua kode, campaign, hadiah, dan pemilik.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => loadCodes(0)}
                disabled={codesLoading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid gap-2">
              <Label>Campaign</Label>
              <select
                className="border rounded px-3 py-2"
                value={selectedCampaignId}
                onChange={(e) =>
                  setSelectedCampaignId(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              >
                <option value="">Pilih campaign</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Hadiah</Label>
              <select
                className="border rounded px-3 py-2"
                value={selectedPrizeId}
                onChange={(e) =>
                  setSelectedPrizeId(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
              >
                <option value="">Pilih hadiah</option>
                {prizesForSelected.map((p) => (
                  <option key={p.id} value={p.id}>
                    Rank {p.rank} - {p.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Jumlah Kode</Label>
              <Input
                type="number"
                min={1}
                step={1}
                value={codeCount}
                onChange={(e) => {
                  const n = Math.floor(Number(e.target.value));
                  setCodeCount(Number.isFinite(n) ? Math.max(1, n) : 1);
                }}
              />
            </div>
            <div className="self-end pb-1">
              <Button
                onClick={handleGenerateCodes}
                disabled={
                  !selectedCampaignId || !selectedPrizeId || codeCount <= 0
                }
              >
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daftar codes Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kode</CardTitle>
          <CardDescription>
            Semua kode undian beserta campaign, hadiah, dan pemilik.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Hadiah</TableHead>
                  <TableHead>Pemilik (user)</TableHead>
                  <TableHead className="text-right">Dibuat</TableHead>
                  <TableHead className="w-[90px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>#{row.id}</TableCell>
                    <TableCell className="font-mono">
                      <div className="flex items-center gap-2">
                        <span>{row.code}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            navigator.clipboard.writeText(row.code)
                          }
                          title="Copy code"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {row.campaign?.name ?? row.campaign_id}
                    </TableCell>
                    <TableCell>
                      {row.prize
                        ? `Rank ${row.prize.rank} - ${row.prize.description}`
                        : row.prize_id}
                    </TableCell>
                    <TableCell>
                      {row.user ? (
                        row.user.name || row.user.email || row.user.id
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-500">
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCode(row.id)}
                      >
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {codes.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-slate-500"
                    >
                      {codesLoading ? "Memuat..." : "Belum ada data"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div>Menampilkan {codes.length} item</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadCodes(Math.max(0, codesOffset - codesLimit))}
                disabled={codesOffset === 0 || codesLoading}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadCodes(codesOffset + codesLimit)}
                disabled={codesLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* New Codes Dialog */}
      <Dialog open={showNewCodes} onOpenChange={setShowNewCodes}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Kode Berhasil Dibuat</DialogTitle>
            <DialogDescription>
              Salin kode-kode di bawah ini dan bagikan ke pengguna.
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded p-3 bg-slate-50 max-h-80 overflow-auto">
            <ul className="space-y-1">
              {newCodes.map((c, idx) => (
                <li
                  key={`${c}-${idx}`}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="font-mono text-sm">{c}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => navigator.clipboard.writeText(c)}
                    title="Copy code"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(newCodes.join("\n"));
              }}
            >
              Copy Semua
            </Button>
            <Button onClick={() => setShowNewCodes(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kode Undian</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Kode yang dihapus tidak bisa
              dipulihkan.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-slate-600">
            Anda yakin ingin menghapus kode #{deleteId}?
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteCode}
              disabled={deleting}
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

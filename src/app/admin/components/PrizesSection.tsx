"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Campaign = {
  id: number;
  name: string;
};

type Prize = {
  id: number;
  campaign_id: number;
  rank: number;
  description: string;
  quantity: number;
};

export default function PrizesSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | "">("");
  const [editingPrizeId, setEditingPrizeId] = useState<number | null>(null);

  const [prizeRank, setPrizeRank] = useState(1);
  const [prizeDesc, setPrizeDesc] = useState("");
  const [prizeQty, setPrizeQty] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    loadCampaigns();
    loadPrizes();
  }, []);

  async function handleCreatePrize() {
    if (!selectedCampaignId)
      return toast.info("Pilih campaign terlebih dahulu");
    const payload = {
      campaign_id: selectedCampaignId,
      rank: prizeRank,
      description: prizeDesc,
      quantity: prizeQty,
    };
    const res = await fetch("/api/admin/prizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setPrizeRank(1);
      setPrizeDesc("");
      setPrizeQty(1);
      await loadPrizes(Number(selectedCampaignId));
      toast.success("Hadiah berhasil dibuat.");
    } else {
      const t = await res.text();
      toast.error(`Gagal membuat hadiah: ${t}`);
    }
  }

  async function handleEditPrize(p: Prize) {
    setEditingPrizeId(p.id);
    setPrizeRank(p.rank);
    setPrizeDesc(p.description);
    setPrizeQty(p.quantity);
    setSelectedCampaignId(p.campaign_id);
  }

  async function handleSavePrizeEdit() {
    if (!editingPrizeId) return;
    const payload = {
      id: editingPrizeId,
      campaign_id: selectedCampaignId,
      rank: prizeRank,
      description: prizeDesc,
      quantity: prizeQty,
    };
    const res = await fetch("/api/admin/prizes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setEditingPrizeId(null);
      setPrizeRank(1);
      setPrizeDesc("");
      setPrizeQty(1);
      await loadPrizes(Number(selectedCampaignId));
      toast.success("Perubahan hadiah disimpan.");
    } else {
      const t = await res.text();
      toast.error(`Gagal menyimpan perubahan: ${t}`);
    }
  }

  function handleDeletePrize(id: number) {
    setDeleteId(id);
    setDeleteOpen(true);
  }

  async function confirmDeletePrize() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/prizes?id=${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadPrizes(Number(selectedCampaignId));
        toast.success("Hadiah dihapus.");
        setDeleteOpen(false);
        setDeleteId(null);
      } else {
        const t = await res.text();
        toast.error(`Gagal menghapus: ${t}`);
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div id="prizes" className="space-y-6">
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{editingPrizeId ? "Edit Hadiah" : "Hadiah"}</CardTitle>
          <CardDescription>
            {editingPrizeId
              ? "Ubah data hadiah yang dipilih."
              : "Tambah hadiah untuk campaign."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
              <Label>Ranking</Label>
              <Input
                type="number"
                value={prizeRank}
                onChange={(e) => setPrizeRank(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Deskripsi</Label>
              <Input
                value={prizeDesc}
                onChange={(e) => setPrizeDesc(e.target.value)}
                placeholder="iPhone 13 128GB"
              />
            </div>
            <div className="grid gap-2">
              <Label>Kuantitas</Label>
              <Input
                type="number"
                value={prizeQty}
                onChange={(e) => setPrizeQty(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {editingPrizeId ? (
            <>
              <Button
                onClick={handleSavePrizeEdit}
                disabled={!selectedCampaignId || !prizeDesc.trim()}
              >
                Simpan Perubahan
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingPrizeId(null);
                  setPrizeRank(1);
                  setPrizeDesc("");
                  setPrizeQty(1);
                }}
              >
                Batal
              </Button>
            </>
          ) : (
            <Button
              onClick={handleCreatePrize}
              disabled={!selectedCampaignId || !prizeDesc.trim()}
            >
              Simpan Hadiah
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Daftar Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Hadiah</CardTitle>
          <CardDescription>
            Semua hadiah untuk campaign terpilih.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {prizesForSelected.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 border rounded px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">Rank {p.rank}:</span>
                  <span>{p.description}</span>
                  <span className="text-xs text-slate-500">x{p.quantity}</span>
                  <span className="text-xs text-slate-500">(#{p.id})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPrize(p)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePrize(p.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </li>
            ))}
            {prizesForSelected.length === 0 && (
              <li className="text-sm text-slate-500 list-none">
                Belum ada hadiah untuk campaign ini
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Hadiah</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Pastikan hadiah ini tidak
              lagi diperlukan.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-slate-600">
            Anda yakin ingin menghapus hadiah #{deleteId}?
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
              onClick={confirmDeletePrize}
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

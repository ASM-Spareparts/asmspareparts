"use client";

import { useEffect, useState } from "react";
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
  start_date?: string | null;
  end_date?: string | null;
  raffle_date?: string | null;
  is_active: boolean;
};

export default function CampaignsSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [raffleDate, setRaffleDate] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadCampaigns() {
    const res = await fetch("/api/admin/campaigns");
    if (!res.ok) return;
    const data = await res.json();
    setCampaigns(Array.isArray(data?.campaigns) ? data.campaigns : []);
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function handleCreateCampaign() {
    const payload = {
      name,
      start_date: startDate || null,
      end_date: endDate || null,
      raffle_date: raffleDate || null,
      is_active: isActive,
    };
    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setName("");
      setStartDate("");
      setEndDate("");
      setRaffleDate("");
      setIsActive(false);
      await loadCampaigns();
      toast.success("Campaign berhasil dibuat.");
    } else {
      const t = await res.text();
      toast.error(`Gagal membuat campaign: ${t}`);
    }
  }

  async function handleEditCampaign(c: Campaign) {
    setEditingId(c.id);
    setName(c.name || "");
    setStartDate(c.start_date || "");
    setEndDate(c.end_date || "");
    setRaffleDate(c.raffle_date || "");
    setIsActive(!!c.is_active);
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    const payload = {
      id: editingId,
      name,
      start_date: startDate || null,
      end_date: endDate || null,
      raffle_date: raffleDate || null,
      is_active: isActive,
    };
    const res = await fetch("/api/admin/campaigns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setEditingId(null);
      setName("");
      setStartDate("");
      setEndDate("");
      setRaffleDate("");
      setIsActive(false);
      await loadCampaigns();
      toast.success("Perubahan campaign disimpan.");
    } else {
      const t = await res.text();
      toast.error(`Gagal menyimpan perubahan: ${t}`);
    }
  }

  function handleDeleteCampaign(id: number) {
    setDeleteId(id);
    setDeleteOpen(true);
  }

  async function confirmDeleteCampaign() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/campaigns?id=${deleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadCampaigns();
        toast.success("Campaign dihapus.");
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
    <div id="campaigns" className="space-y-6">
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Campaign" : "Campaigns"}</CardTitle>
          <CardDescription>
            {editingId
              ? "Ubah data campaign yang dipilih."
              : "Tambah dan kelola campaign undian."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-2">
              <Label>Nama</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramadhan 2026"
              />
            </div>
            <div className="grid gap-2">
              <Label>Mulai</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Selesai</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tanggal Pengundian</Label>
              <Input
                type="datetime-local"
                value={raffleDate}
                onChange={(e) => setRaffleDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <select
                className="border rounded px-3 py-2"
                value={isActive ? "1" : "0"}
                onChange={(e) => setIsActive(e.target.value === "1")}
              >
                <option value="0">Non-aktif</option>
                <option value="1">Aktif</option>
              </select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {editingId ? (
            <>
              <Button onClick={handleSaveEdit} disabled={!name.trim()}>
                Simpan Perubahan
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setStartDate("");
                  setEndDate("");
                  setRaffleDate("");
                  setIsActive(false);
                }}
              >
                Batal
              </Button>
            </>
          ) : (
            <Button onClick={handleCreateCampaign} disabled={!name.trim()}>
              Simpan Campaign
            </Button>
          )}
        </CardFooter>
      </Card>
      {/* Daftar Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Campaign</CardTitle>
          <CardDescription>Semua campaign yang sudah dibuat.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {campaigns.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 border rounded px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{c.name}</span>
                    <span className="text-xs text-slate-500">#{c.id}</span>
                    {c.is_active ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Non-aktif
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Mulai: {safeDate(c.start_date)}</span>
                    <span>Selesai: {safeDate(c.end_date)}</span>
                    <span>Undian: {safeDateTime(c.raffle_date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditCampaign(c)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCampaign(c.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </li>
            ))}
            {campaigns.length === 0 && (
              <li className="text-sm text-slate-500 list-none">
                Belum ada campaign
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Campaign</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Campaign dan data terkait
              mungkin terpengaruh.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-slate-600">
            Anda yakin ingin menghapus campaign #{deleteId}?
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
              onClick={confirmDeleteCampaign}
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

function safeDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

function safeDateTime(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleString();
}

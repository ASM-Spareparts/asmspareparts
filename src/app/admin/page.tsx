import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Overview</h1>
      <p className="text-slate-600">Pilih salah satu modul untuk dikelola.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/campaigns"
          className="border rounded-md p-4 hover:bg-slate-50"
        >
          <div className="font-medium mb-1">Campaigns</div>
          <div className="text-sm text-slate-600">
            Tambah dan kelola campaign undian.
          </div>
        </Link>
        <Link
          href="/admin/prizes"
          className="border rounded-md p-4 hover:bg-slate-50"
        >
          <div className="font-medium mb-1">Prizes</div>
          <div className="text-sm text-slate-600">
            Kelola hadiah untuk setiap campaign.
          </div>
        </Link>
        <Link
          href="/admin/codes"
          className="border rounded-md p-4 hover:bg-slate-50"
        >
          <div className="font-medium mb-1">Lottery Codes</div>
          <div className="text-sm text-slate-600">
            Generate dan lihat semua kode undian.
          </div>
        </Link>
      </div>
    </div>
  );
}

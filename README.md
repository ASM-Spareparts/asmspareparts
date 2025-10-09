<div align="center">
	<img src="./public/images/logo.svg" alt="ASM Spareparts" height="80" />
  
	<h1>ASM Spareparts Platform</h1>
	<p><strong>Distributor terpercaya untuk bisnis bengkel</strong><br/>Manajemen kampanye, kode undian, dan hadiah dalam satu platform.</p>
  
	<a href="#getting-started">Mulai Cepat</a> •
	<a href="#features">Fitur</a> •
	<a href="#architecture">Arsitektur</a> •
	<a href="#api-routes">API</a> •
	<a href="#environment-variables">Env</a> •
	<a href="#development">Development</a>
</div>

---

## 📌 Ringkasan

ASM Spareparts adalah aplikasi berbasis Next.js (App Router) untuk mengelola kampanye promosi, kode undian (lottery codes), klaim hadiah, dan profil pengguna. Autentikasi menggunakan Google melalui NextAuth dengan opsi penyimpanan (adapter) ke Supabase. UI dibangun dengan Tailwind CSS dan komponen headless (Radix UI) yang telah dikustomisasi.

## ✨ Features

- Autentikasi Google (NextAuth) dengan fallback JWT-only jika Supabase belum dikonfigurasi
- Manajemen Kampanye (admin)
- Manajemen Hadiah / Prizes (admin)
- Generasi & listing kode undian (admin)
- Klaim kode & daftar kode saya (pengguna terautentikasi)
- Enrichment data kode dengan kampanye & hadiah terkait
- Halaman profil dengan update data (PATCH)
- Program Mitra / sekmen marketing di landing page
- Halaman legal: Terms & Privacy Policy (Bahasa Indonesia)
- Desain responsif & aksesibel (Tailwind + komponen UI)

## 🏗️ Architecture

Project menggunakan Next.js 15 (App Router) dengan struktur berikut (disederhanakan):

```
src/
	app/
		(public pages & route handlers)
		api/
			admin/
				campaigns/route.ts
				prizes/route.ts
				lottery-codes/route.ts
			lottery-codes/
				claim/route.ts
				mine/route.ts
			profile/route.ts
	components/
		(UI sections & shared components)
	lib/
		auth.ts (NextAuth config + Supabase adapter)
		admin.ts (helper admin fetch utilities)
		utils.ts (utility helpers)
```

Karakteristik penting:

- Server Components digunakan secara default; client components ditandai dengan `"use client"`.
- API Routes di bawah `app/api/*` memakai Web standard Request/Response (bukan pages/api).
- Typing TypeScript ketat, menghindari `any` (lint enforced).

## 🔐 Authentication

`src/lib/auth.ts` mengatur NextAuth dengan Google Provider. Jika `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` tersedia, Supabase Adapter diaktifkan untuk persistensi user & session. Jika tidak, aplikasi tetap berjalan dengan strategi session JWT.

Session ID (`user.id`) diekspose ke `session.user.id` via callback untuk konsumsi client.

## 🗃️ Data Layer (Supabase)

Menggunakan REST endpoints Supabase (`/rest/v1/...`) dengan header `apikey` dan `Authorization: Bearer <SERVICE_ROLE>`. Endpoint admin mengelola campaigns, prizes, dan lottery codes. Beberapa proses enrichment dilakukan di server route sebelum di-return ke client.

## 🚦 API Routes

Ringkasan endpoint utama (HTTP method → path → deskripsi ringkas):

Admin:

- `GET /api/admin/campaigns` – Daftar kampanye
- `POST /api/admin/campaigns` – Buat kampanye baru
- `PATCH /api/admin/campaigns` – Update sebagian (body berisi { id, ...fields })
- `GET /api/admin/prizes` – Daftar hadiah
- `POST /api/admin/prizes` – Buat hadiah baru
- `PATCH /api/admin/prizes` – Update hadiah
- `GET /api/admin/lottery-codes` – Daftar kode undian + enrichment
- `POST /api/admin/lottery-codes` – Generate / tambah kode

User:

- `GET /api/lottery-codes/mine` – Kode milik user login (enriched)
- `POST /api/lottery-codes/claim` – Klaim kode (validasi + atomic update)
- `GET /api/profile` – Ambil profil
- `PATCH /api/profile` – Update profil (full_name, address, phone_number)
- `DELETE /api/profile` – Hapus akun beserta kode undian, profil, akun OAuth (accounts), dan entri user auth

Catatan: Authentication guard & authorization perlu dipastikan di production (misal: memeriksa role admin) – implementasi lanjutan bisa ditambahkan.

## 🧩 UI & Components

- Tailwind CSS v4 (config via `globals.css` dan preset modern)
- Komponen UI (button, card, dialog, table, dropdown-menu, avatar, input, label) berada di `src/components/ui`.
- Layout admin menggunakan `DashboardLayout` dengan navigasi dan responsivitas.
- Landing page sections: Hero, PartnerProgramSection, Features, About, Footer.

## 📦 Tech Stack

- Next.js 15 (App Router, Turbopack build)
- React 19
- TypeScript 5+
- NextAuth (Google Provider, optional Supabase Adapter)
- Supabase REST API
- Tailwind CSS 4
- Radix UI (headless primitives)
- Lucide Icons
- Sonner (toast notifications)

## ⚙️ Environment Variables

Buat file `.env.local` dan isi sesuai kebutuhan:

```
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Optional (aktifkan persistensi Supabase Adapter)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service_role_key

# (Opsional jika memakai var berbeda)
SUPABASE_SERVICE_ROLE=service_role_key_alias
SUPABASE_SECRET=legacy_or_alt_key

# Optional: allow admin panel access (comma-separated emails)
ADMIN_EMAILS=owner@example.com,staff@example.com
```

Jika Supabase env tidak diset di dev, aplikasi menampilkan peringatan dan berjalan dengan JWT-only sessions.

## 🛠️ Development

Install dependencies:

```
npm install
```

Jalankan dev server (Turbopack):

```
npm run dev
```

Lint & type check:

```
npm run lint
```

Build production:

```
npm run build
```

Start production server (setelah build):

```
npm start
```

## 🧪 Testing (Planned)

Belum ada test automatis. Rencana sederhana:

- Unit: util helpers (`src/lib/utils.ts`)
- Integration: API route claim & mine codes
- E2E: Flow login → klaim kode → lihat kode saya.

## 🚀 Deployment

Didesain untuk deployment di Vercel.

Langkah umum:

1. Set environment variables di dashboard Vercel
2. Deploy branch `main` atau lakukan PR preview
3. Pastikan build logs bersih (lint & types OK)
4. Tes endpoint API via `curl` atau browser

## 🔒 Security Notes

- Simpan SERVICE_ROLE Supabase hanya di server (jangan expose ke client).
- Pertimbangkan rate limiting pada endpoint klaim.
- Tambahkan verifikasi role untuk route admin (middleware atau server guard).
- Gunakan `ADMIN_EMAILS` untuk whitelist akses admin; tanpa ini fitur admin bersifat non-privilege.

## 🧭 Roadmap (Ide)

- Role-based access control (admin vs user)
- Pagination & filtering pada daftar kode
- Penjadwalan kampanye (start_at / end_at)
- Export CSV untuk data kampanye & peserta
- Dashboard statistik (claimed vs unclaimed)
- Email / WhatsApp notification hooks
- E2E tests with Playwright

## 🐛 Troubleshooting

| Masalah                     | Penyebab Umum                 | Solusi                                             |
| --------------------------- | ----------------------------- | -------------------------------------------------- |
| Peringatan Supabase Adapter | Env tidak di-set              | Tambahkan SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY |
| Gagal klaim kode            | Kode sudah di-claim / invalid | Verifikasi status & integritas data di Supabase    |
| 401 saat akses API          | Session tidak ada             | Login ulang via Google                             |
| Styling tidak muncul        | Tailwind belum build          | Pastikan file global & content paths benar         |

## 🤝 Contribution

Pull Request & issue welcome. Mohon sertakan deskripsi jelas & langkah reproduksi bila bug.

## 📜 License

Private / Internal.

---

Terima kasih telah menggunakan platform ASM Spareparts. 🙌

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Syarat & Ketentuan
        </h1>
        <p className="text-slate-600 mb-8">
          Terakhir diperbarui: 5 Oktober 2025
        </p>
        <div className="prose prose-slate max-w-none text-slate-700">
          <p>
            Dengan menggunakan layanan ASM, Anda setuju untuk mematuhi syarat
            dan ketentuan berikut.
          </p>
          <h2>Ketentuan Penggunaan</h2>
          <p>Contoh: kebijakan pesanan, pengembalian, dan akun pengguna.</p>
          <h2>Batasan Tanggung Jawab</h2>
          <p>
            Contoh: layanan diberikan sebagaimana adanya sesuai hukum yang
            berlaku.
          </p>
          <h2>Perubahan</h2>
          <p>
            Kami dapat memperbarui ketentuan ini dari waktu ke waktu dan akan
            mengumumkannya di situs.
          </p>
        </div>
        <div className="mt-10">
          <a href="/" className="text-sm text-emerald-700 hover:underline">
            ← Kembali ke Beranda
          </a>
        </div>
      </div>
    </main>
  );
}

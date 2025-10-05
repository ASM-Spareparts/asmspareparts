export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Kebijakan Privasi
        </h1>
        <p className="text-slate-600 mb-8">
          Terakhir diperbarui: 5 Oktober 2025
        </p>
        <div className="prose prose-slate max-w-none text-slate-700">
          <p>
            Kami menghargai privasi Anda. Halaman ini menjelaskan bagaimana kami
            mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat
            menggunakan layanan ASM.
          </p>
          <h2>Informasi yang Kami Kumpulkan</h2>
          <p>
            Contoh: data akun, aktivitas pemesanan, dan preferensi yang Anda
            berikan.
          </p>
          <h2>Penggunaan Informasi</h2>
          <p>
            Contoh: untuk memproses pesanan, dukungan pelanggan, dan peningkatan
            layanan.
          </p>
          <h2>Kontak</h2>
          <p>
            Jika Anda memiliki pertanyaan, hubungi kami melalui email atau
            WhatsApp resmi.
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

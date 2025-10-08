import Link from "next/link";
export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Syarat & Ketentuan
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Terakhir diperbarui: 8 Oktober 2025
        </p>
        <div className="mt-8 space-y-6 text-slate-700 leading-relaxed">
          <p>
            Dengan mengakses atau menggunakan situs dan layanan ASM Spareparts
            (&quot;Layanan&quot;), Anda menyetujui untuk terikat pada Syarat &
            Ketentuan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan
            Layanan.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Deskripsi Layanan
          </h2>
          <p>
            ASM menyediakan situs web yang menampilkan informasi produk dan
            program promosi, termasuk kampanye undian berbasis kode. Pengguna
            terautentikasi dapat mengelola profil dasar (nama, nomor telepon,
            alamat) dan mengklaim kode undian yang valid untuk berpartisipasi
            dalam kampanye tertentu.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Kelayakan & Akun Pengguna
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Anda harus memiliki kapasitas hukum untuk berkontrak sesuai hukum
              Indonesia.
            </li>
            <li>
              Masuk (login) dilakukan melalui penyedia pihak ketiga (misalnya
              Google).
            </li>
            <li>
              Anda bertanggung jawab menjaga kerahasiaan akses akun dan
              aktivitas yang terjadi.
            </li>
            <li>
              Data profil yang Anda berikan harus akurat, lengkap, dan terkini.
            </li>
          </ul>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Program Undian & Kode
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Kode undian bersifat unik, sekali pakai, dan tidak dapat
              dipindahtangankan.
            </li>
            <li>
              Kode hanya dapat diklaim jika masih tersedia dan terkait dengan
              kampanye yang aktif.
            </li>
            <li>
              Kami dapat menerapkan pembatasan (rate limiting) dan mekanisme
              anti-penyalahgunaan.
            </li>
            <li>
              Percobaan peretasan, brute force, atau klaim tidak sah akan
              diblokir dan didiskualifikasi.
            </li>
            <li>
              Kode yang rusak, tidak terbaca, atau dimodifikasi dianggap tidak
              valid.
            </li>
            <li>
              Keputusan penyelenggara mengenai keabsahan klaim bersifat final.
            </li>
          </ul>
          <p>
            Setiap kampanye memiliki periode mulai dan berakhir. Klaim di luar
            periode kampanye tidak akan diproses. Detail kampanye dan hadiah
            dapat berubah sewaktu-waktu.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Hadiah & Pemenuhan
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Pemenang dapat diminta melakukan verifikasi identitas dan
              kelayakan.
            </li>
            <li>
              Hadiah tidak dapat diuangkan, kecuali dinyatakan lain oleh
              penyelenggara.
            </li>
            <li>
              Kami berhak mengganti hadiah dengan item bernilai setara jika
              diperlukan.
            </li>
            <li>
              Kewajiban pajak dan biaya yang timbul atas hadiah menjadi tanggung
              jawab pemenang sesuai hukum yang berlaku.
            </li>
            <li>
              Metode penyerahan hadiah (pengiriman/penjemputan) akan
              diinformasikan kepada pemenang.
            </li>
          </ul>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Perilaku yang Dilarang
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Menyalahgunakan Layanan, termasuk percobaan akses tidak sah atau
              gangguan sistem.
            </li>
            <li>
              Memberikan informasi yang menyesatkan atau melanggar hak pihak
              ketiga.
            </li>
            <li>
              Menggunakan Layanan untuk tujuan ilegal atau melanggar kebijakan
              ini.
            </li>
          </ul>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Kepemilikan & Hak Kekayaan Intelektual
          </h2>
          <p>
            Konten, merek, logo, dan materi lain pada situs ini adalah milik ASM
            atau pemberi lisensinya. Anda tidak diperkenankan menyalin,
            memodifikasi, mendistribusikan, atau membuat karya turunan tanpa
            izin tertulis sebelumnya.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Privasi
          </h2>
          <p>
            Penggunaan Layanan juga diatur oleh Kebijakan Privasi kami. Silakan
            tinjau
            <a
              href="/privacy-policy"
              className="text-emerald-700 hover:underline"
            >
              {" "}
              Kebijakan Privasi
            </a>{" "}
            untuk memahami bagaimana kami mengumpulkan, menggunakan, dan
            melindungi data Anda.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Pengakhiran
          </h2>
          <p>
            Kami berhak menangguhkan atau menghentikan akses Anda ke Layanan
            kapan saja jika Anda melanggar Syarat & Ketentuan ini atau jika
            diperlukan untuk melindungi keamanan dan integritas sistem.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Penafian & Batasan Tanggung Jawab
          </h2>
          <p>
            Layanan disediakan &quot;sebagaimana adanya&quot; tanpa jaminan apa
            pun, tersurat maupun tersirat. Sejauh diizinkan oleh hukum, kami
            tidak bertanggung jawab atas kerugian langsung, tidak langsung,
            insidental, atau konsekuensial yang timbul dari penggunaan atau
            ketidakmampuan menggunakan Layanan.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Perubahan Layanan & Syarat
          </h2>
          <p>
            Kami dapat memperbarui Layanan dan/atau Syarat & Ketentuan ini dari
            waktu ke waktu. Perubahan akan berlaku sejak dipublikasikan di
            halaman ini. Anda disarankan meninjau secara berkala.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Hukum yang Berlaku
          </h2>
          <p>
            Syarat & Ketentuan ini diatur oleh hukum Republik Indonesia.
            Sengketa yang timbul akan diselesaikan sesuai mekanisme yang berlaku
            di yurisdiksi tersebut.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-slate-900">
            Kontak
          </h2>
          <p>
            Pertanyaan terkait Syarat & Ketentuan ini dapat dikirim ke
            <a
              href="mailto:contact@asmspareparts.com"
              className="text-emerald-700 hover:underline"
            >
              {" "}
              contact@asmspareparts.com
            </a>
            .
          </p>
        </div>
        <div className="mt-10">
          <Link href="/" className="text-sm text-emerald-700 hover:underline">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}

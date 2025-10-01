const AboutSection = () => {
  return (
    <section
      id="about"
      className="min-h-screen bg-white py-12 md:py-24 flex items-center snap-start scroll-mt-16"
    >
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
          Perjalanan Kami
        </h2>
        <div className="text-slate-600 space-y-4 text-left md:text-center">
          <p>
            Berawal dari semangat untuk menyediakan suku cadang berkualitas
            dengan akses yang mudah, Andy Sparepart Motor (ASM) didirikan lebih
            dari 20 tahun yang lalu. Kami memulai sebagai distributor sederhana
            dengan mimpi besar: menjadi jembatan antara produsen suku cadang
            terbaik dengan setiap bengkel dan pengendara motor di Indonesia.
          </p>
          <p>
            Misi kami sederhana: menjadi mitra terbaik yang tidak hanya
            menyediakan produk, tetapi juga solusi pertumbuhan bagi bisnis
            bengkel dan jaminan kualitas bagi setiap pengendara. Kepercayaan
            Anda adalah aset terbesar kami.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

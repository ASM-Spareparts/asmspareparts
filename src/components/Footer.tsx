import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm">
            &copy; 2025 Andy Sparepart Motor. Seluruh Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

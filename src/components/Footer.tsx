import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-8 bg-slate-900 text-slate-400 snap-start">
      <div className="container mx-auto px-6 text-center">
        <p className="mb-2">
          &copy; 2025 Andy Sparepart Motor. Seluruh Hak Cipta Dilindungi.
        </p>
        <Link
          href="/privacy-policy"
          className="text-sm hover:text-white transition-colors"
        >
          Kebijakan Privasi
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

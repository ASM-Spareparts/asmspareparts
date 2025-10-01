import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { UserNav } from "./UserNav";
import asmLogo from "@/assets/images/logo.svg";

interface HeaderProps {
  isLoggedIn: boolean;
}

const Header = ({ isLoggedIn }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const container = document.getElementById("app-scroll") || window;
    const getScrollTop = () =>
      container instanceof Window
        ? container.scrollY
        : (container as HTMLElement).scrollTop;

    const handleScroll = () => {
      // Use a small threshold so header switches quickly after user actually scrolls
      setScrolled(getScrollTop() > 10);
    };

    // Force initial transparent state (don't call handleScroll before mount paints)
    requestAnimationFrame(() => handleScroll());
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={asmLogo}
            alt="ASM Spare Part Logo"
            width={75}
            height={75}
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/#home"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Home
          </Link>
          <Link
            href="/#partner"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Program Mitra
          </Link>
          <Link
            href="/#features"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Keunggulan
          </Link>
          <Link
            href="/#about"
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Tentang Kami
          </Link>
        </nav>
        <div>
          {isLoggedIn ? <UserNav /> : <Button variant="default">Login</Button>}
        </div>
      </div>
    </header>
  );
};

export default Header;

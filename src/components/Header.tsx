import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { UserNav } from "./UserNav";
import { Menu, X } from "lucide-react";
import logoBlack from "@/assets/images/logo.svg";
import logoWhite from "@/assets/images/logo-white.svg";

interface HeaderProps {
  isLoggedIn: boolean;
}

const NAV_ITEMS = [
  { href: "/#home", label: "Home" },
  { href: "/#partner", label: "Program Mitra" },
  { href: "/#features", label: "Keunggulan" },
  { href: "/#about", label: "Tentang Kami" },
];

const Header = ({ isLoggedIn }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const container = document.getElementById("app-scroll") || window;
    const getScrollTop = () =>
      container instanceof Window
        ? container.scrollY
        : (container as HTMLElement).scrollTop;
    const handleScroll = () => setScrolled(getScrollTop() > 10);
    requestAnimationFrame(handleScroll);
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleHash = () => setMobileOpen(false);
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const navLinkBase =
    "text-sm font-medium tracking-tight transition-colors duration-300";
  const navColor = scrolled
    ? "text-slate-700 hover:text-slate-900"
    : "text-white/90 hover:text-white";

  const loginButtonClass = scrolled
    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md"
    : "bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/40 shadow-sm";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-20 transition-colors duration-300 ${
        scrolled ? "bg-white/100 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center space-x-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 rounded-md"
        >
          <Image
            src={scrolled ? logoBlack : logoWhite}
            alt="ASM Spare Part Logo"
            width={220}
            height={72}
            priority
            className="h-[72px] w-auto select-none pointer-events-none"
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${navLinkBase} ${navColor}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            {isLoggedIn ? (
              <UserNav />
            ) : (
              <Button
                className={`${loginButtonClass} transition-all duration-300 rounded-full px-5`}
              >
                Login
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className={`md:hidden transition-colors h-12 w-12 rounded-xl ${
              scrolled
                ? "text-slate-700 hover:text-slate-900"
                : "text-white hover:text-white/80"
            }`}
          >
            {mobileOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </Button>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-20 left-0 right-0 origin-top transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-75 pointer-events-none"
        }`}
      >
        <div
          className={`mx-4 rounded-xl border ${
            scrolled
              ? "bg-white/95 backdrop-blur-sm border-slate-200 shadow-lg"
              : "bg-slate-900/80 backdrop-blur border-white/10"
          } p-5 flex flex-col gap-4`}
        >
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-white/10 md:border-none">
            {isLoggedIn ? (
              <UserNav />
            ) : (
              <Button className={`w-full ${loginButtonClass} rounded-full`}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

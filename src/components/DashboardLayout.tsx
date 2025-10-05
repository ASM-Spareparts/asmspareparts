"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/assets/images/logo.svg";

type Props = {
  title?: string;
  description?: string;
  children: ReactNode;
};

const nav = [
  { href: "/profile", label: "Profil Saya" },
  { href: "/undian-saya", label: "Undian Saya" },
];

export default function DashboardLayout({
  title,
  description,
  children,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Top bar: logo + back to home */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center cursor-pointer"
              aria-label="Kembali ke Beranda"
            >
              <Image
                src={logo}
                alt="ASM Spare Part"
                width={240}
                height={80}
                priority
                className="h-14 md:h-16 w-auto select-none"
              />
            </Link>
          </div>
          <Link href="/" className="shrink-0">
            <Button variant="outline">← Kembali ke Beranda</Button>
          </Link>
        </div>

        {(title || description) && (
          <header className="mb-6">
            {title && (
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-2 text-slate-600">{description}</p>
            )}
          </header>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-3 lg:col-span-3">
            {/* Mobile toggle */}
            <div className="md:hidden mb-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? "Tutup Menu" : "Buka Menu"}
              </Button>
            </div>
            <nav
              className={
                (open ? "block" : "hidden") +
                " md:block rounded-xl border border-slate-200 bg-white p-2"
              }
            >
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 " +
                      (active
                        ? "bg-slate-100 text-slate-900 font-medium ring-1 ring-slate-200"
                        : "text-slate-700")
                    }
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <section className="md:col-span-9 lg:col-span-9">
            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="p-4 md:p-6">{children}</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

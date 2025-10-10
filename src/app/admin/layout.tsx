import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import Link from "next/link";
import Image from "next/image";
import logoBlack from "@/assets/images/logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect("/");
  }
  return (
    <div className="min-h-screen bg-white text-slate-800 flex">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-slate-50/60 backdrop-blur-md sticky top-0 h-screen hidden md:flex md:flex-col">
        <div className="flex items-center gap-3 px-6 py-5 border-b">
          <Link
            href="/"
            className="flex items-center space-x-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 rounded-md"
          >
            <Image
              src={logoBlack}
              alt="ASM Spare Part Logo"
              width={220}
              height={72}
              priority
              className="h-[72px] w-auto select-none pointer-events-none"
            />
          </Link>
          <div className="font-semibold">Admin Dashboard</div>
        </div>
        <nav className="flex-1 p-4 space-y-1 text-sm">
          <Link
            href="/admin"
            className="block px-3 py-2 rounded hover:bg-slate-100"
          >
            Overview
          </Link>
          <div className="mt-4 text-xs uppercase tracking-wide text-slate-500 px-3">
            Manage
          </div>
          <Link
            href="/admin/campaigns"
            className="block px-3 py-2 rounded hover:bg-slate-100"
          >
            Campaigns
          </Link>
          <Link
            href="/admin/prizes"
            className="block px-3 py-2 rounded hover:bg-slate-100"
          >
            Prizes
          </Link>
          <Link
            href="/admin/codes"
            className="block px-3 py-2 rounded hover:bg-slate-100"
          >
            Lottery Codes
          </Link>
        </nav>
        <div className="p-4 border-t text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ASM
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 md:hidden">
              <Image
                src={logoBlack}
                alt="ASM"
                width={96}
                height={32}
                className="h-8 w-auto"
              />
              <span className="font-semibold">Admin Dashboard</span>
            </div>
            {/* Desktop back link */}
            <Link
              href="/"
              className="hidden md:inline-block text-sm text-slate-600 hover:text-slate-900"
            >
              Kembali ke Beranda
            </Link>
            {/* Mobile menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" aria-label="Menu Admin">
                    Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Overview</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/campaigns">Campaigns</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/prizes">Prizes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/codes">Lottery Codes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/">Kembali ke Beranda</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}

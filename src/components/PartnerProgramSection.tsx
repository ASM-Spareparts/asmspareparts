"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome, MoveRight } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PartnerProgramSection() {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);

  return (
    <section
      id="partner"
      className="py-24 bg-gradient-to-b from-slate-50 to-white scroll-mt-20"
    >
      <div className="container mx-auto px-4 md:px-8 max-w-8xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Visual */}
          <div className="w-full">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <Image
                src="/images/gift.jpg"
                alt="Partner program visual"
                width={1632}
                height={918}
                className="h-full w-full object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
          </div>

          {/* Right: Content Card */}
          <Card className="w-full rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <span className="inline-flex h-6 items-center rounded-full bg-amber-50 px-2 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200 w-fit">
                Kemitraan
              </span>
              <CardTitle className="text-2xl">Program Mitra ASM</CardTitle>
              <CardDescription>
                Mitra tepercaya untuk skala bisnis Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-pretty">
                Bergabunglah dengan program mitra ASM untuk mendapatkan akses
                prioritas, dukungan khusus, dan kesempatan mengikuti program
                undian berhadiah. Dirancang sederhana dan transparan untuk
                membantu bisnis Anda tumbuh.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-1">
              {isLoggedIn ? (
                <Button asChild className="inline-flex items-center gap-2">
                  <Link href="/undian-saya">Lihat Undian Saya</Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="inline-flex items-center gap-2"
                  aria-label="Login dengan Google"
                >
                  <Link href="/api/auth/signin/google?callbackUrl=/undian-saya">
                    <Chrome className="h-4 w-4" />
                    Bergabung dengan Google
                  </Link>
                </Button>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="px-0 text-slate-700 group">
                    <span>Pelajari Lebih Lanjut</span>
                    <MoveRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Detail Program Undian</DialogTitle>
                    <DialogDescription>
                      Minimum pembelian dan hadiah undian yang mungkin Anda
                      dapatkan.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-2 overflow-x-auto">
                    <Table>
                      <TableCaption className="text-slate-500">
                        Program berjalan hingga Juni 2026. S&amp;K berlaku.
                        Benefit dapat berubah sesuai periode promosi.
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[260px]">Kriteria</TableHead>
                          <TableHead className="w-[160px]">Periode</TableHead>
                          <TableHead>Benefit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            Setiap belanja Rp 1.000.000
                          </TableCell>
                          <TableCell>Setiap transaksi</TableCell>
                          <TableCell>1 kupon undian iPhone 13 New</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Akumulasi belanja Rp 70.000.000
                          </TableCell>
                          <TableCell>Per bulan</TableCell>
                          <TableCell>
                            iPhone 13 New (atau konversi ke emas)
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Akumulasi belanja Rp 40.000.000
                          </TableCell>
                          <TableCell>Per bulan</TableCell>
                          <TableCell>Emas 24K 1 gram</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Akumulasi belanja Rp 300.000.000
                          </TableCell>
                          <TableCell>Hingga Juni 2026</TableCell>
                          <TableCell>
                            Tiket undian All New Yamaha NMAX
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

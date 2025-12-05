import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Users, Calculator, Trophy, ListFilter, FileText } from "lucide-react";

export default function Home() {
  const { criteria, alternatives } = useStore();

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="absolute -top-24 -right-24 size-[280px] rounded-full bg-primary/20 blur-3xl" />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3 animate-in fade-in slide-in-from-top-2">
            <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20 shadow-sm">
              Sistem Pakar
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-2">BANSOS Dashboard</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            Sistem Penilaian Kelayakan Penerima Bantuan Sosial menggunakan metode VIKOR (VlseKriterijumska Optimizacija I Kompromisno Resenje).
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/criteria">
              <Button variant="outline" className="h-10 shadow-sm hover:shadow-md transition-all">
                Atur Kriteria
              </Button>
            </Link>
            <Link href="/alternatives">
              <Button variant="outline" className="h-10 shadow-sm hover:shadow-md transition-all">
                Data Penerima
              </Button>
            </Link>
            <Link href="/calculation">
              <Button className="h-10 shadow-lg shadow-primary/25">
                Hitung Kelayakan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kriteria Penilaian</CardTitle>
            <ListFilter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{criteria.length}</div>
            <p className="text-xs text-muted-foreground">
              Parameter kelayakan aktif
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calon Penerima</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{alternatives.length}</div>
            <p className="text-xs text-muted-foreground">
              Warga terdaftar dalam sistem
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Status Sistem</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary tracking-tight">Siap</div>
            <p className="text-xs text-primary/80">
              Data siap untuk dikalkulasi
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass-card hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Tentang Metode VIKOR</CardTitle>
            <CardDescription>
              Metode pengambilan keputusan multikriteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sistem ini menggunakan metode VIKOR untuk meranking calon penerima bantuan sosial. Metode ini berfokus pada perankingan dan pemilihan dari sekumpulan alternatif dengan kriteria yang saling bertentangan (misalnya: Penghasilan vs Tanggungan), untuk mencapai solusi kompromi yang paling mendekati ideal.
            </p>
            <div className="bg-secondary/50 p-4 rounded-lg border border-border space-y-2 shadow-sm">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="size-4" />
                Alur Proses:
              </h4>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-1">
                <li>Input Data Warga (Calon Penerima)</li>
                <li>Tentukan Kriteria & Bobot (Misal: Penghasilan, Kondisi Rumah)</li>
                <li>Input Nilai setiap warga terhadap kriteria</li>
                <li>Sistem menghitung Nilai Utilitas (S), Penyesalan (R), dan Indeks VIKOR (Q)</li>
                <li>Ranking teratas adalah yang paling layak menerima bantuan</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 glass-card flex flex-col hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Menu Utama</CardTitle>
            <CardDescription>Akses cepat manajemen data</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center gap-3">
            <Link href="/criteria">
              <Button variant="outline" className="w-full justify-between h-12 hover:border-primary hover:text-primary transition-all hover:shadow-md">
                <span className="flex items-center gap-2"><ListFilter className="size-4" /> Atur Kriteria</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/alternatives">
              <Button variant="outline" className="w-full justify-between h-12 hover:border-primary hover:text-primary transition-all hover:shadow-md">
                <span className="flex items-center gap-2"><Users className="size-4" /> Data Penerima</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/calculation">
              <Button className="w-full justify-between h-12 shadow-lg shadow-primary/25 hover:shadow-xl transition-all">
                <span className="flex items-center gap-2"><Calculator className="size-4" /> Hitung Kelayakan</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

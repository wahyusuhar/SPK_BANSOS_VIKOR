import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Users, Calculator, Trophy, ListFilter, FileText } from "lucide-react";

export default function Home() {
  const { criteria, alternatives } = useStore();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
            Sistem Pakar
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">BANSOS Dashboard</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Sistem Penilaian Kelayakan Penerima Bantuan Sosial menggunakan metode VIKOR (VlseKriterijumska Optimizacija I Kompromisno Resenje).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kriteria Penilaian</CardTitle>
            <ListFilter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criteria.length}</div>
            <p className="text-xs text-muted-foreground">
              Parameter kelayakan aktif
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calon Penerima</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alternatives.length}</div>
            <p className="text-xs text-muted-foreground">
              Warga terdaftar dalam sistem
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card hover:shadow-md transition-all duration-300 bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Status Sistem</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Siap</div>
            <p className="text-xs text-primary/80">
              Data siap untuk dikalkulasi
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass-card">
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
            <div className="bg-secondary/50 p-4 rounded-lg border border-border space-y-2">
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

        <Card className="col-span-3 glass-card flex flex-col">
          <CardHeader>
            <CardTitle>Menu Utama</CardTitle>
            <CardDescription>Akses cepat manajemen data</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center gap-3">
            <Link href="/criteria">
              <Button variant="outline" className="w-full justify-between h-12 hover:border-primary hover:text-primary transition-colors">
                <span className="flex items-center gap-2"><ListFilter className="size-4" /> Atur Kriteria</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/alternatives">
              <Button variant="outline" className="w-full justify-between h-12 hover:border-primary hover:text-primary transition-colors">
                <span className="flex items-center gap-2"><Users className="size-4" /> Data Penerima</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/calculation">
              <Button className="w-full justify-between h-12 shadow-lg shadow-primary/25">
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

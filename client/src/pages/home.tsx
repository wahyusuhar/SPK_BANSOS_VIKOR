import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Database, Calculator, Trophy, ListFilter } from "lucide-react";

export default function Home() {
  const { criteria, alternatives } = useStore();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Sistem Pendukung Keputusan Rekomendasi Laptop Terbaik Metode VIKOR
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kriteria</CardTitle>
            <ListFilter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criteria.length}</div>
            <p className="text-xs text-muted-foreground">
              Parameter penilaian aktif
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alternatif</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alternatives.length}</div>
            <p className="text-xs text-muted-foreground">
              Laptop terdaftar dalam sistem
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
              Data cukup untuk perhitungan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass-card">
          <CardHeader>
            <CardTitle>Tentang Metode VIKOR</CardTitle>
            <CardDescription>
              VlseKriterijumska Optimizacija I Kompromisno Resenje
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Metode VIKOR adalah metode kompromi ranking multikriteria yang dikembangkan untuk menyelesaikan masalah keputusan dengan kriteria yang bertentangan dan non-commensurable. Metode ini berfokus pada meranking dan memilih dari sekumpulan alternatif dengan kriteria yang saling bertentangan.
            </p>
            <div className="bg-secondary/50 p-4 rounded-lg border border-border space-y-2">
              <h4 className="font-semibold text-sm">Langkah Perhitungan:</h4>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                <li>Normalisasi Matriks Keputusan</li>
                <li>Menentukan Nilai Terbaik (f*) dan Terburuk (f-)</li>
                <li>Menghitung Nilai S (Group Utility) dan R (Individual Regret)</li>
                <li>Menghitung Nilai Indeks VIKOR (Q)</li>
                <li>Perankingan Berdasarkan Nilai Q Terkecil</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 glass-card flex flex-col">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Kelola data dan mulai perhitungan</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center gap-3">
            <Link href="/criteria">
              <Button variant="outline" className="w-full justify-between h-12 hover:border-primary hover:text-primary transition-colors">
                <span className="flex items-center gap-2"><ListFilter className="size-4" /> Kelola Kriteria</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/alternatives">
              <Button variant="outline" className="w-full justify-between h-12 hover:border-primary hover:text-primary transition-colors">
                <span className="flex items-center gap-2"><Database className="size-4" /> Kelola Alternatif</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/calculation">
              <Button className="w-full justify-between h-12 shadow-lg shadow-primary/25">
                <span className="flex items-center gap-2"><Calculator className="size-4" /> Mulai Perhitungan</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

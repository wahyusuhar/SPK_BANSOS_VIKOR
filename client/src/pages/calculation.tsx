import { useStore } from "@/lib/store";
import { calculateVikor, VikorResult } from "@/lib/vikor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Play, Trophy, BarChart3, Download, CheckCircle2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function CalculationPage() {
  const { criteria, alternatives } = useStore();
  const [result, setResult] = useState<VikorResult | null>(null);

  const handleCalculate = () => {
    const res = calculateVikor(criteria, alternatives);
    setResult(res);
  };

  const handleExportPDF = () => {
    const style = document.createElement("style");
    style.innerHTML = `@media print { body * { visibility: hidden; } #priority-print, #priority-print * { visibility: visible; } #priority-print { position: absolute; left: 0; top: 0; width: 100%; } }`;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  };

  // Prepare chart data
  const chartData = result?.ranking
    .map((r) => {
      const alt = alternatives.find((a) => a.id === r.alternativeId);
      return {
        name: alt?.name || `ID ${r.alternativeId}`,
        Q: r.qValue,
        S: r.sValue,
        R: r.rValue,
      };
    })
    .sort((a, b) => a.Q - b.Q); // Sort by Q for display

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-2 sm:mt-5">
            Hasil Perhitungan <br />
            VIKOR
          </h1>
          <p className="text-muted-foreground">
            Analisis peringkat kelayakan penerima bantuan sosial
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="lg"
            onClick={handleCalculate}
            className="shadow-lg shadow-primary/25 animate-in zoom-in duration-300"
          >
            <Play className="mr-2 h-5 w-5 fill-current" /> Hitung Kelayakan
          </Button>
        </div>
      </div>

      {!result && (
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-xl bg-secondary/20 text-muted-foreground">
          <BarChart3 className="size-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">Belum ada hasil perhitungan</p>
          <p className="text-sm">
            Pastikan data warga sudah terisi, lalu klik tombol "Hitung
            Kelayakan".
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Top Winner Card */}
          <Card className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background border-emerald-500/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="size-64 text-emerald-600" />
            </div>
            <CardHeader>
              <CardTitle className="text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="size-5" /> Paling Layak Menerima
                Bantuan
              </CardTitle>
              <CardDescription>
                Berdasarkan nilai indeks VIKOR (Q) terendah (Kompromi Terbaik)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-foreground">
                {
                  alternatives.find(
                    (a) => a.id === result.ranking[0].alternativeId
                  )?.name
                }
              </div>
              <p className="text-muted-foreground mb-6">
                {
                  alternatives.find(
                    (a) => a.id === result.ranking[0].alternativeId
                  )?.address
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 bg-card/50 p-4 rounded-lg border border-border/50 w-full sm:w-fit backdrop-blur-sm">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Nilai Q (Index)
                  </div>
                  <div className="text-xl font-mono font-bold text-emerald-600">
                    {result.ranking[0].qValue.toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Nilai S (Utility)
                  </div>
                  <div className="text-xl font-mono text-muted-foreground">
                    {result.ranking[0].sValue.toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Nilai R (Regret)
                  </div>
                  <div className="text-xl font-mono text-muted-foreground">
                    {result.ranking[0].rValue.toFixed(4)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="ranking" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="ranking">Ranking & Visualisasi</TabsTrigger>
              <TabsTrigger value="details">Matriks & Data Teknis</TabsTrigger>
            </TabsList>

            <TabsContent value="ranking" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card Tabel Prioritas */}
                <Card className="glass-card" id="priority-print">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Tabel Prioritas</CardTitle>
                      <CardDescription>
                        Urutan warga prioritas penerima bantuan
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportPDF}
                    >
                      <Download className="size-4 mr-2" /> PDF
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="w-full overflow-x-auto">
                      <Table className="min-w-[600px] table-auto">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[60px] text-center">
                              Rank
                            </TableHead>
                            <TableHead>Nama Warga</TableHead>
                            <TableHead className="text-right">Skor Q</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.ranking.map((item, index) => (
                            <TableRow
                              key={item.alternativeId}
                              className={
                                item.rank === 1 ? "bg-emerald-500/5" : ""
                              }
                            >
                              <TableCell className="text-center font-bold text-lg">
                                #{item.rank}
                              </TableCell>
                              <TableCell className="font-medium">
                                {
                                  alternatives.find(
                                    (a) => a.id === item.alternativeId
                                  )?.name
                                }
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {item.qValue.toFixed(4)}
                              </TableCell>
                              <TableCell className="text-right">
                                {index < 3 ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    Prioritas Utama
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                    Cadangan
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Card Grafik */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Grafik Indeks VIKOR</CardTitle>
                    <CardDescription>
                      Semakin rendah bar, semakin layak menerima bantuan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          type="number"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={100}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          itemStyle={{ color: "hsl(var(--foreground))" }}
                          cursor={{ fill: "hsl(var(--muted)/0.2)" }}
                        />
                        <Bar dataKey="Q" radius={[0, 4, 4, 0]} barSize={20}>
                          {chartData?.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === 0
                                  ? "hsl(var(--primary))"
                                  : "hsl(var(--muted-foreground)/0.3)"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Matriks Normalisasi */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Matriks Normalisasi</CardTitle>
                  <CardDescription>
                    Nilai jarak ternormalisasi per kriteria untuk tiap warga
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="w-full">
                    <Table className="min-w-[720px] table-auto">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Warga</TableHead>
                          {criteria.map((c) => (
                            <TableHead
                              key={c.id}
                              className="text-right whitespace-nowrap"
                            >
                              {c.name}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result?.normalized.map((row, i) => {
                          const alt = alternatives[i];
                          return (
                            <TableRow key={alt.id}>
                              <TableCell className="font-medium">
                                {alt.name}
                              </TableCell>
                              {row.map((val, j) => (
                                <TableCell
                                  key={`${alt.id}-${j}`}
                                  className="text-right font-mono text-muted-foreground"
                                >
                                  {val.toFixed(4)}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
              {/* Matriks Nilai S,R,Q */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Matriks Nilai S, R, Q</CardTitle>
                  <CardDescription>
                    Detail perhitungan matematis untuk validasi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-x-auto">
                    <Table className="min-w-[600px] table-auto">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Warga</TableHead>
                          <TableHead className="text-right">
                            S (Group Utility)
                          </TableHead>
                          <TableHead className="text-right">
                            R (Individual Regret)
                          </TableHead>
                          <TableHead className="text-right">
                            Q (VIKOR Index)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.ranking.map((item) => {
                          const alt = alternatives.find(
                            (a) => a.id === item.alternativeId
                          );
                          return (
                            <TableRow key={item.alternativeId}>
                              <TableCell className="font-medium">
                                {alt?.name}
                              </TableCell>
                              <TableCell className="text-right font-mono text-muted-foreground">
                                {item.sValue.toFixed(4)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-muted-foreground">
                                {item.rValue.toFixed(4)}
                              </TableCell>
                              <TableCell className="text-right font-mono font-bold">
                                {item.qValue.toFixed(4)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Nilai Referensi */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Nilai Referensi (f* dan f-)</CardTitle>
                  <CardDescription>
                    Titik acuan normalisasi matriks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-x-auto">
                    <Table className="min-w-[600px] table-auto">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kriteria</TableHead>
                          <TableHead>Tipe</TableHead>
                          <TableHead className="text-right">
                            Nilai Terbaik (f*)
                          </TableHead>
                          <TableHead className="text-right">
                            Nilai Terburuk (f-)
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {criteria.map((c, idx) => (
                          <TableRow key={c.id}>
                            <TableCell>{c.name}</TableCell>
                            <TableCell className="text-xs uppercase text-muted-foreground">
                              {c.type}
                            </TableCell>
                            <TableCell className="text-right font-mono text-emerald-600 dark:text-emerald-400">
                              {result.bestValues[idx]}
                            </TableCell>
                            <TableCell className="text-right font-mono text-rose-600 dark:text-rose-400">
                              {result.worstValues[idx]}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

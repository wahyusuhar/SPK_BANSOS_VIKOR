import { useStore } from "@/lib/store";
import { calculateVikor, VikorResult } from "@/lib/vikor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, Trophy, BarChart3, Table as TableIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function CalculationPage() {
  const { criteria, alternatives } = useStore();
  const [result, setResult] = useState<VikorResult | null>(null);

  const handleCalculate = () => {
    const res = calculateVikor(criteria, alternatives);
    setResult(res);
  };

  // Prepare chart data
  const chartData = result?.ranking.map(r => {
    const alt = alternatives.find(a => a.id === r.alternativeId);
    return {
      name: alt?.name || `ID ${r.alternativeId}`,
      Q: r.qValue,
      S: r.sValue,
      R: r.rValue
    };
  }).sort((a, b) => a.Q - b.Q); // Sort by Q for display

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perhitungan VIKOR</h1>
          <p className="text-muted-foreground">Jalankan algoritma VIKOR untuk mendapatkan rekomendasi</p>
        </div>
        <Button 
          size="lg" 
          onClick={handleCalculate} 
          className="shadow-lg shadow-primary/25 animate-in zoom-in duration-300"
        >
          <Play className="mr-2 h-5 w-5 fill-current" /> Hitung Sekarang
        </Button>
      </div>

      {!result && (
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-xl bg-secondary/20 text-muted-foreground">
          <BarChart3 className="size-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">Belum ada hasil perhitungan</p>
          <p className="text-sm">Klik tombol "Hitung Sekarang" untuk memproses data.</p>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Top Winner Card */}
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="size-64 text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Trophy className="size-5" /> Rekomendasi Terbaik
              </CardTitle>
              <CardDescription>Berdasarkan nilai indeks VIKOR (Q) terendah</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">
                {alternatives.find(a => a.id === result.ranking[0].alternativeId)?.name}
              </div>
              <div className="flex gap-6 mt-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Nilai Q</div>
                  <div className="text-xl font-mono font-medium">{result.ranking[0].qValue.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Nilai S</div>
                  <div className="text-xl font-mono text-muted-foreground">{result.ranking[0].sValue.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Nilai R</div>
                  <div className="text-xl font-mono text-muted-foreground">{result.ranking[0].rValue.toFixed(4)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="ranking" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="ranking">Hasil Ranking</TabsTrigger>
              <TabsTrigger value="details">Detail Perhitungan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ranking" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Tabel Peringkat</CardTitle>
                    <CardDescription>Urutan prioritas rekomendasi (Q terkecil adalah terbaik)</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px] text-center">Rank</TableHead>
                          <TableHead>Alternatif</TableHead>
                          <TableHead className="text-right">Nilai Q</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.ranking.map((item) => (
                          <TableRow key={item.alternativeId} className={item.rank === 1 ? "bg-primary/5" : ""}>
                            <TableCell className="text-center font-bold">#{item.rank}</TableCell>
                            <TableCell className="font-medium">
                              {alternatives.find(a => a.id === item.alternativeId)?.name}
                            </TableCell>
                            <TableCell className="text-right font-mono">{item.qValue.toFixed(4)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Visualisasi Skor Q</CardTitle>
                    <CardDescription>Perbandingan nilai indeks VIKOR antar alternatif</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis dataKey="name" type="category" width={100} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                          cursor={{fill: 'hsl(var(--muted)/0.2)'}}
                        />
                        <Bar dataKey="Q" radius={[0, 4, 4, 0]} barSize={20}>
                          {chartData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground)/0.3)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Matriks Hasil Perhitungan</CardTitle>
                  <CardDescription>Nilai S (Utility) dan R (Regret) untuk setiap alternatif</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Alternatif</TableHead>
                        <TableHead className="text-right">S (Group Utility)</TableHead>
                        <TableHead className="text-right">R (Individual Regret)</TableHead>
                        <TableHead className="text-right">Q (VIKOR Index)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.ranking.map((item) => {
                         const alt = alternatives.find(a => a.id === item.alternativeId);
                         return (
                           <TableRow key={item.alternativeId}>
                             <TableCell className="font-medium">{alt?.name}</TableCell>
                             <TableCell className="text-right font-mono text-muted-foreground">{item.sValue.toFixed(4)}</TableCell>
                             <TableCell className="text-right font-mono text-muted-foreground">{item.rValue.toFixed(4)}</TableCell>
                             <TableCell className="text-right font-mono font-bold">{item.qValue.toFixed(4)}</TableCell>
                           </TableRow>
                         );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Nilai Terbaik (f*) dan Terburuk (f-)</CardTitle>
                  <CardDescription>Referensi perhitungan normalisasi</CardDescription>
                </CardHeader>
                <CardContent>
                   <Table>
                     <TableHeader>
                       <TableRow>
                         <TableHead>Kriteria</TableHead>
                         <TableHead>Tipe</TableHead>
                         <TableHead className="text-right">Nilai Terbaik (f*)</TableHead>
                         <TableHead className="text-right">Nilai Terburuk (f-)</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {criteria.map((c, idx) => (
                         <TableRow key={c.id}>
                           <TableCell>{c.name}</TableCell>
                           <TableCell className="text-xs uppercase text-muted-foreground">{c.type}</TableCell>
                           <TableCell className="text-right font-mono text-emerald-600 dark:text-emerald-400">{result.bestValues[idx]}</TableCell>
                           <TableCell className="text-right font-mono text-rose-600 dark:text-rose-400">{result.worstValues[idx]}</TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

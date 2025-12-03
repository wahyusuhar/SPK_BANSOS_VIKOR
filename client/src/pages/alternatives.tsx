import { useStore, Alternative } from "@/lib/store";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit, Laptop } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const alternativeBaseSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  description: z.string().optional(),
});

export default function AlternativesPage() {
  const { criteria, alternatives, addAlternative, updateAlternative, deleteAlternative } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  // Dynamic schema generation based on current criteria
  const formSchema = alternativeBaseSchema.and(z.record(z.any())); // Loose validation for dynamic fields, handled manually

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      values: {} as Record<number, number>,
    },
  });

  const onSubmit = (data: any) => {
    // Extract dynamic values
    const values: Record<number, number> = {};
    criteria.forEach(c => {
      values[c.id] = Number(data[`crit_${c.id}`] || 0);
    });

    const payload = {
      name: data.name,
      description: data.description,
      values: values
    };

    if (editingId !== null) {
      updateAlternative(editingId, payload);
      toast({ title: "Berhasil", description: "Alternatif berhasil diperbarui" });
    } else {
      addAlternative(payload);
      toast({ title: "Berhasil", description: "Alternatif berhasil ditambahkan" });
    }
    setIsDialogOpen(false);
    setEditingId(null);
    form.reset();
  };

  const handleEdit = (item: Alternative) => {
    setEditingId(item.id);
    const valuesFlat: Record<string, any> = {};
    criteria.forEach(c => {
      valuesFlat[`crit_${c.id}`] = item.values[c.id];
    });

    form.reset({
      name: item.name,
      description: item.description || "",
      ...valuesFlat
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus alternatif ini beserta nilai-nilainya?")) {
      deleteAlternative(id);
      toast({ title: "Dihapus", description: "Alternatif berhasil dihapus", variant: "destructive" });
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      name: "",
      description: "",
      values: {}
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Alternatif</h1>
          <p className="text-muted-foreground">Kelola data laptop dan nilai spesifikasinya</p>
        </div>
        <Button onClick={handleAddNew} className="shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Tambah Alternatif
        </Button>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <CardTitle>Daftar Laptop & Penilaian</CardTitle>
          <CardDescription>
            Data spesifikasi laptop terhadap setiap kriteria
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="w-[50px] pl-6">ID</TableHead>
                  <TableHead className="min-w-[200px]">Nama Alternatif</TableHead>
                  {criteria.map(c => (
                    <TableHead key={c.id} className="whitespace-nowrap text-center">
                      {c.name}
                      <div className="text-[10px] font-normal text-muted-foreground">{c.type}</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-right pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alternatives.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-secondary/20">
                    <TableCell className="font-mono text-xs text-muted-foreground pl-6">#{item.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-secondary flex items-center justify-center">
                          <Laptop className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]">{item.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    {criteria.map(c => (
                      <TableCell key={c.id} className="text-center font-mono">
                        {item.values[c.id]?.toLocaleString() || "-"}
                      </TableCell>
                    ))}
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {alternatives.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={criteria.length + 3} className="text-center py-12 text-muted-foreground">
                      Belum ada data alternatif.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Alternatif" : "Tambah Alternatif Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 p-4 bg-secondary/30 rounded-lg border border-border/50">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Nama wajib diisi" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Laptop</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: MacBook Pro M3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi / Spesifikasi Singkat</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: RAM 16GB, SSD 512GB..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Input Nilai Kriteria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {criteria.map((c) => (
                    <div key={c.id} className="space-y-2">
                       <FormLabel className="text-xs font-medium">{c.name} <span className="text-muted-foreground">({c.type})</span></FormLabel>
                       {/* Using raw register because these fields are dynamic */}
                       <Input 
                         type="number" 
                         step="any"
                         placeholder={`Nilai untuk ${c.name}`}
                         {...form.register(`crit_${c.id}`, { valueAsNumber: true })}
                       />
                    </div>
                  ))}
                  {criteria.length === 0 && (
                    <div className="col-span-2 text-center text-sm text-muted-foreground py-4 bg-secondary/50 rounded-md border border-dashed">
                      Belum ada kriteria. Silakan tambahkan kriteria terlebih dahulu.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button type="submit">{editingId ? "Simpan Perubahan" : "Tambah Data"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useStore, Criterion } from "@/lib/store";
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
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const criterionSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  weight: z.coerce.number().min(0).max(1, "Bobot harus antara 0 - 1"),
  type: z.enum(["benefit", "cost"]),
  description: z.string().optional(),
});

type CriterionFormValues = z.infer<typeof criterionSchema>;

export default function CriteriaPage() {
  const { criteria, addCriterion, updateCriterion, deleteCriterion } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<CriterionFormValues>({
    resolver: zodResolver(criterionSchema),
    defaultValues: {
      name: "",
      weight: 0.1,
      type: "benefit",
      description: "",
    },
  });

  const onSubmit = (data: CriterionFormValues) => {
    if (editingId !== null) {
      updateCriterion(editingId, data);
      toast({ title: "Berhasil", description: "Kriteria berhasil diperbarui" });
    } else {
      addCriterion(data);
      toast({ title: "Berhasil", description: "Kriteria berhasil ditambahkan" });
    }
    setIsDialogOpen(false);
    setEditingId(null);
    form.reset();
  };

  const handleEdit = (item: Criterion) => {
    setEditingId(item.id);
    form.reset({
      name: item.name,
      weight: item.weight,
      type: item.type,
      description: item.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kriteria ini?")) {
      deleteCriterion(id);
      toast({ title: "Dihapus", description: "Kriteria berhasil dihapus", variant: "destructive" });
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      name: "",
      weight: 0.1,
      type: "benefit",
      description: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Kriteria</h1>
          <p className="text-muted-foreground">Kelola kriteria penilaian dan bobot</p>
        </div>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 mt-20">
          <Plus className="mr-2 h-4 w-4" /> Tambah Kriteria
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Daftar Kriteria</CardTitle>
          <CardDescription>
            Pastikan total bobot disarankan mendekati 1.0 (Saat ini: {criteria.reduce((a, b) => a + b.weight, 0).toFixed(2)})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Nama Kriteria</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Bobot</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.map((item) => (
                <TableRow key={item.id} className="group">
                  <TableCell className="font-mono text-xs text-muted-foreground">#{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'benefit' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                      {item.type === 'benefit' ? <ArrowUpDown className="w-3 h-3 mr-1 rotate-180" /> : <ArrowUpDown className="w-3 h-3 mr-1" />}
                      {item.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono">{item.weight}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{item.description}</TableCell>
                  <TableCell className="text-right">
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
              {criteria.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Belum ada data kriteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Kriteria" : "Tambah Kriteria Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kriteria</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Harga, RAM..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bobot (0-1)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipe Atribut</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="benefit">Benefit (Makin besar makin baik)</SelectItem>
                          <SelectItem value="cost">Cost (Makin kecil makin baik)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Keterangan tambahan..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4">
                <Button type="submit">{editingId ? "Simpan Perubahan" : "Tambah Data"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

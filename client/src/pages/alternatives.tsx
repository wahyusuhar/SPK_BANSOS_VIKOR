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
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, User, MapPin, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const alternativeBaseSchema = z.object({
  name: z.string().min(2, "Nama wajib diisi"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  description: z.string().optional(),
});

export default function AlternativesPage() {
  const {
    criteria,
    alternatives,
    addAlternative,
    updateAlternative,
    deleteAlternative,
  } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      description: "",
      values: {} as Record<number, number>,
    },
  });

  const onSubmit = (data: any) => {
    const values: Record<number, number> = {};
    criteria.forEach((c) => {
      values[c.id] = Number(data[`crit_${c.id}`] || 0);
    });

    const payload = {
      name: data.name,
      address: data.address,
      description: data.description,
      values: values,
    };

    if (editingId !== null) {
      updateAlternative(editingId, payload);
      toast({
        title: "Berhasil",
        description: "Data warga berhasil diperbarui",
      });
    } else {
      addAlternative(payload);
      toast({
        title: "Berhasil",
        description: "Warga baru berhasil ditambahkan",
      });
    }
    setIsDialogOpen(false);
    setEditingId(null);
    form.reset();
  };

  const handleEdit = (item: Alternative) => {
    setEditingId(item.id);
    const valuesFlat: Record<string, any> = {};
    criteria.forEach((c) => {
      valuesFlat[`crit_${c.id}`] = item.values[c.id];
    });

    form.reset({
      name: item.name,
      address: item.address || "",
      description: item.description || "",
      ...valuesFlat,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Hapus data warga ini beserta nilai penilaiannya?")) {
      deleteAlternative(id);
      toast({
        title: "Dihapus",
        description: "Data berhasil dihapus",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    form.reset({
      name: "",
      address: "",
      description: "",
      values: {},
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Data Calon Penerima
          </h1>
          <p className="text-muted-foreground">
            Kelola data warga dan input nilai kriteria
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 mt-30"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Warga
        </Button>
      </div>

      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <CardTitle>Daftar Warga & Penilaian</CardTitle>
          <CardDescription>
            Data demografi dan nilai bobot untuk setiap kriteria
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <ScrollArea className="w-full">
              <Table className="min-w-full table-auto">
                <TableHeader>
                  <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                    <TableHead className="w-[50px] pl-6">ID</TableHead>
                    <TableHead className="min-w-[200px]">
                      Informasi Warga
                    </TableHead>
                    {criteria.map((c) => (
                      <TableHead
                        key={c.id}
                        className="whitespace-nowrap text-center min-w-[120px]"
                      >
                        {c.name}
                        <div className="text-[10px] font-normal text-muted-foreground">
                          {c.type}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-right pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alternatives.map((item) => (
                    <TableRow
                      key={item.id}
                      className="group hover:bg-secondary/20"
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground pl-6">
                        #{item.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-3 py-2">
                          <div className="size-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="size-5 text-muted-foreground" />
                          </div>
                          <div className="space-y-1">
                            <div className="font-semibold text-base">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="size-3" />
                              <span className="truncate max-w-[180px]">
                                {item.address}
                              </span>
                            </div>
                            {item.description && (
                              <div className="text-xs text-muted-foreground italic">
                                "{item.description}"
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      {criteria.map((c) => (
                        <TableCell
                          key={c.id}
                          className="text-center font-mono text-sm"
                        >
                          <span className="bg-secondary/50 px-2 py-1 rounded-md">
                            {item.values[c.id]?.toLocaleString() || "-"}
                          </span>
                        </TableCell>
                      ))}
                      <TableCell className="text-right pr-6 align-middle">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {alternatives.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={criteria.length + 3}
                        className="text-center py-12 text-muted-foreground"
                      >
                        Belum ada data warga. Klik "Tambah Warga" untuk memulai.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Data Warga" : "Input Warga Baru"}
            </DialogTitle>
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
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Kepala Keluarga" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  rules={{ required: "Alamat wajib diisi" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jl. Contoh No. 123, RT/RW..."
                          className="resize-none"
                          {...field}
                        />
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
                      <FormLabel>Keterangan Tambahan (Opsional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Lansia, Disabilitas, Janda..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Input Nilai Kriteria
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Pastikan nilai sesuai satuan kriteria
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {criteria.map((c) => (
                    <div
                      key={c.id}
                      className="space-y-2 bg-card p-3 rounded-md border border-border/50"
                    >
                      <Label className="text-xs font-medium flex justify-between">
                        {c.name}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            c.type === "benefit"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {c.type}
                        </span>
                      </Label>
                      <Input
                        type="number"
                        step="any"
                        placeholder={`Masukkan nilai...`}
                        className="h-9"
                        {...form.register(`crit_${c.id}` as any, {
                          valueAsNumber: true,
                        })}
                      />
                      {c.description && (
                        <p className="text-[10px] text-muted-foreground">
                          {c.description}
                        </p>
                      )}
                    </div>
                  ))}
                  {criteria.length === 0 && (
                    <div className="col-span-2 text-center text-sm text-muted-foreground py-4 bg-secondary/50 rounded-md border border-dashed">
                      Belum ada kriteria. Silakan tambahkan kriteria terlebih
                      dahulu.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button type="submit">
                  {editingId ? "Simpan Perubahan" : "Simpan Data"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

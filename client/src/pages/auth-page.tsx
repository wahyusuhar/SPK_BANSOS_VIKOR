import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldCheck,
  LogIn,
  User,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const { user, loginMutation, registerMutation, canRegister } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Column: Form Section */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center items-center p-8 lg:p-16 relative overflow-hidden">
        {/* Decorative Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-slate-950 -z-20" />
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-[100px] -z-10 animate-pulse-slow delay-1000" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm space-y-8 z-10"
        >
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto w-16 h-16 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              SPK BANSOS VIKOR
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              Sistem pendukung keputusan cerdas untuk penyaluran bantuan sosial
              yang tepat sasaran.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl shadow-slate-200/50 dark:shadow-none">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-6 h-12 p-1 bg-muted/50 rounded-xl">
                <TabsTrigger
                  value="login"
                  className="rounded-lg font-medium transition-all"
                >
                  Masuk
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="login"
                className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
              >
                <LoginForm
                  onSubmit={(data) => loginMutation.mutate(data)}
                  isLoading={loginMutation.isPending}
                />
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-center text-blue-600 dark:text-blue-300 font-medium">
                    Default Login: <br />
                    Username: <span className="font-bold">admin</span> |
                    Password: <span className="font-bold">admin</span>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground/60 font-medium">
              &copy; {new Date().getFullYear()} Pemerintah Desa Setempat
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Hero Visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-900/90 to-slate-900/90" />

        {/* Animated Shapes */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[15%] right-[15%] w-96 h-96 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-[20%] left-[10%] w-64 h-64 bg-blue-500/20 backdrop-blur-2xl rounded-full blur-2xl"
        />

        <div className="relative z-10 flex flex-col justify-center h-full px-16 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-100 text-xs font-medium backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Sistem Aktif & Terpantau
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.15] tracking-tight">
              Transparansi adalah <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                Kunci Kepercayaan
              </span>
            </h2>

            <p className="text-lg text-blue-100/80 leading-relaxed font-light max-w-xl">
              Metode VIKOR membantu mengeliminasi bias subjektif dalam penentuan
              penerima bantuan, memastikan setiap keputusan dapat
              dipertanggungjawabkan secara matematis.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 max-w-md">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm">Objektif</h4>
                  <p className="text-xs text-blue-200/60 mt-1">
                    Bebas kepentingan pribadi
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white text-sm">
                    Akurasi Tinggi
                  </h4>
                  <p className="text-xs text-blue-200/60 mt-1">
                    Perhitungan multikriteria
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: InsertUser) => void;
  isLoading: boolean;
}) {
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-semibold text-foreground/80 ml-1">
                Username
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Masukkan username"
                    className="pl-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-semibold text-foreground/80 ml-1">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg shadow-blue-500/25 rounded-xl transition-all duration-300 transform active:scale-[0.98] mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">Memproses...</span>
          ) : (
            <span className="flex items-center gap-2">
              Masuk ke Sistem <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}

function RegisterForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: InsertUser) => void;
  isLoading: boolean;
}) {
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-semibold text-foreground/80 ml-1">
                Username Admin Baru
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Buat username"
                    className="pl-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-xs font-semibold text-foreground/80 ml-1">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="password"
                    placeholder="Buat password kuat"
                    className="pl-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all rounded-xl"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-500/90 hover:to-teal-600/90 text-white shadow-lg shadow-emerald-500/25 rounded-xl transition-all duration-300 transform active:scale-[0.98] mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Mendaftarkan..." : "Daftarkan Akun Admin"}
        </Button>
      </form>
    </Form>
  );
}

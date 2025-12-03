import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ListFilter, 
  Users, 
  Calculator, 
  Menu,
  Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/criteria", label: "Kriteria", icon: ListFilter },
  { href: "/alternatives", label: "Alternatif", icon: Users },
  { href: "/calculation", label: "Perhitungan VIKOR", icon: Calculator },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <Laptop className="size-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">LaptopSys</h1>
          <p className="text-xs text-muted-foreground font-medium">VIKOR Method</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a 
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className={cn("size-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border/50">
        <div className="bg-card border border-border p-4 rounded-xl">
          <p className="text-xs text-muted-foreground mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 border-r border-border bg-card/50 backdrop-blur-xl fixed h-full z-50">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shadow-md">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto min-h-screen">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}

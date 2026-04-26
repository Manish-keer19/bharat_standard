import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  LogOut, 
  FileText, 
  LayoutList, 
  LayoutDashboard,
  Menu,
  X,
  ImageIcon,
  LayoutGrid
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate({ to: "/auth/admin/login" });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate({ to: "/auth/admin/login" });
    toast.success("Logged out successfully");
  };

  const navItems = [
    { label: "Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Articles", path: "/admin/articles", icon: FileText },
    { label: "Listicles", path: "/admin/listicles", icon: LayoutGrid },
    { label: "Categories", path: "/admin/categories", icon: LayoutList },
    { label: "Magazine", path: "/admin/magazine", icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-72 bg-surface border-r border-rule flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-rule">
          <Link to="/" className="block">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Bharat <span className="text-primary">Standard</span>
            </h1>
            <span className="eyebrow text-[10px] block mt-1">Admin Control Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-4 px-4">Management</p>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all border-l-4 ${
                location.pathname === item.path 
                  ? "bg-white border-primary text-primary shadow-sm" 
                  : "border-transparent text-ink-muted hover:text-ink hover:bg-white/50"
              }`}
            >
              <item.icon className={`w-4 h-4 ${location.pathname === item.path ? "text-primary" : "text-ink-muted"}`} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-rule bg-white/50">
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="w-full justify-start gap-3 text-ink-muted hover:text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-xs rounded-none"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-surface border-b border-rule text-ink p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-serif font-bold">Bharat <span className="text-primary">Standard</span></h1>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-ink"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[65px] left-0 right-0 bg-surface border-b border-rule z-40 p-4 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-4 text-sm font-bold uppercase tracking-wider ${
                  location.pathname === item.path 
                    ? "bg-primary text-white" 
                    : "text-ink-muted active:bg-black/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-rule mt-4">
                <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    className="w-full justify-start gap-3 text-primary font-bold uppercase tracking-widest text-xs py-6"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Actual Content */}
      <main className="flex-1 min-h-screen bg-background">
        <div className="p-6 md:p-12 max-w-6xl mx-auto">
            <Outlet />
        </div>
      </main>
    </div>
  );
}

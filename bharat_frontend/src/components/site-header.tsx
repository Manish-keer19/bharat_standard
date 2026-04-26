import { Link } from "@tanstack/react-router";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo-bharat-standard.jpeg";
import { publicService } from "@/services/public.service";

function formattedDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("admin_token");

  useEffect(() => {
    publicService.getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
  };

  const navItems = [
    { to: "/", label: "Home" },
    ...categories
      .filter(c => ["Business", "Economy", "Finance", "Startups", "Technology"].includes(c.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(c => ({
        to: "/category/$cat",
        label: c.name,
        params: { cat: c.name.toLowerCase() }
      })),
    { to: "/listicles", label: "Listicles" },
    { to: "/latest", label: "Latest News" },
  ];

  return (
    <header className="bg-background">
      {/* Top utility bar */}
      <div className="border-b border-rule">
        <div className="container-bs flex h-9 items-center justify-between text-xs text-ink-muted">
          <span className="hidden sm:block">{formattedDate()}</span>
          <span className="sm:hidden">India edition</span>
          <nav className="flex items-center gap-4">
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link to="/publish" className="hover:text-primary transition-colors">Publish with us</Link>
          </nav>
        </div>
      </div>
      <div className="h-[2px] bg-primary" />

      {/* Sticky main nav */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-rule">
        <div className="container-bs flex items-center justify-between gap-6 py-3">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logo}
              alt="Bharat Standard"
              className="h-8 md:h-10 w-auto"
              width={280}
              height={70}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((n) => (
              <Link
                key={n.label}
                {...(n as any)}
                className="link-underline text-sm font-semibold text-ink hover:text-primary transition-colors"
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-sm hover:bg-surface transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            <Link
              to="/publish"
              className="hidden md:inline-flex items-center bg-primary text-primary-foreground text-xs font-bold tracking-wide uppercase px-4 py-2 hover:bg-primary/90 transition-colors"
            >
              Subscribe
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/admin"
                  className="hidden md:inline-flex items-center bg-surface text-ink text-[10px] font-bold tracking-widest uppercase px-4 py-2 hover:bg-rule transition-colors border border-rule"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:inline-flex items-center bg-destructive/10 text-destructive text-[10px] font-bold tracking-widest uppercase px-4 py-2 hover:bg-destructive/20 transition-colors border border-destructive/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth/admin/login"
                className="hidden md:inline-flex items-center bg-surface text-ink text-[10px] font-bold tracking-widest uppercase px-4 py-2 hover:bg-rule transition-colors border border-rule"
              >
                login
              </Link>
            )}
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-sm hover:bg-surface"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-rule bg-background">
            <nav className="container-bs flex flex-col py-3">
              {navItems.map((n) => (
                <Link
                  key={n.label}
                  {...(n as any)}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-semibold text-ink hover:text-primary"
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-rule space-y-2">
                {isLoggedIn ? (
                  <>
                    <Link 
                      to="/admin" 
                      onClick={() => setOpen(false)}
                      className="block py-2 text-sm font-bold uppercase tracking-widest text-ink hover:text-primary"
                    >
                      Admin Dashboard
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setOpen(false); }}
                      className="block w-full text-left py-2 text-sm font-bold uppercase tracking-widest text-destructive hover:text-destructive/80"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth/admin/login" 
                    onClick={() => setOpen(false)}
                    className="block py-2 text-sm font-bold uppercase tracking-widest text-ink hover:text-primary"
                  >
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

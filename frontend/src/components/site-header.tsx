import { Link } from "@tanstack/react-router";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo-bs-mark.jpeg";
import { publicService } from "@/services/public.service";
import { Input } from "@/components/ui/input";

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
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    publicService.getCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      // Use window.history to update URL without full reload if already on search page
      if (window.location.pathname === "/search") {
         const newUrl = `${window.location.pathname}?q=${encodeURIComponent(debouncedSearch.trim())}`;
         window.history.replaceState({ path: newUrl }, '', newUrl);
         // Dispatch an event so the search page can listen and update
         window.dispatchEvent(new Event('popstate'));
      }
    }
  }, [debouncedSearch]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
    }
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

          {!showSearch ? (
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
          ) : (
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-md mx-auto relative animate-in fade-in slide-in-from-right-4 duration-300">
              <Input 
                autoFocus
                placeholder="Search Bharat Standard archives..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-none border-rule pr-20 h-10 font-serif italic"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchTerm && (
                   <button type="button" onClick={() => setSearchTerm("")} className="text-ink-muted hover:text-primary p-1">
                      <X className="w-4 h-4" />
                   </button>
                )}
                <button 
                  type="button" 
                  onClick={() => setShowSearch(false)}
                  className="text-ink-muted hover:text-primary p-1"
                >
                  <X className="w-5 h-5 border-l border-rule pl-2" />
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              onClick={() => setShowSearch(!showSearch)}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-sm transition-colors ${showSearch ? 'bg-primary text-white' : 'hover:bg-surface'}`}
            >
              <Search className="w-4 h-4" />
            </button>
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

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="lg:hidden border-t border-rule bg-surface p-3 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Input 
                  autoFocus
                  placeholder="Search stories..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-none border-rule pr-10 h-11 bg-white shadow-inner"
                />
                {searchTerm && (
                  <button 
                    type="button" 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button 
                type="submit" 
                className="bg-primary text-white px-4 h-11 flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

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

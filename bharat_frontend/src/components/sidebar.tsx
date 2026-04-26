import { Link } from "@tanstack/react-router";
import { publicService } from "@/services/public.service";
import { useState, useEffect } from "react";

export function Sidebar() {
  const [trending, setTrending] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artRes, listRes] = await Promise.all([
          publicService.getArticles(),
          publicService.getListicles()
        ]);

        if (artRes.success) {
          setTrending(artRes.data.slice(0, 5));
        }
        if (listRes.success) {
          setRecent(listRes.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Sidebar data fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <aside className="space-y-10">
      <section>
        <h3 className="section-title">Trending</h3>
        <ol className="space-y-4">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-10 bg-surface animate-pulse" />)
          ) : trending.map((a, i) => (
            <li key={a.id} className="flex gap-3 animate-fade-up">
              <span className="font-serif text-3xl font-bold text-primary leading-none w-8 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Link
                to="/article/$id"
                params={{ id: a.id }}
                className="text-sm font-semibold text-ink hover:text-primary leading-snug"
              >
                {a.title}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3 className="section-title">Recent listicles</h3>
        <ul className="space-y-4">
          {isLoading ? (
            [1, 2].map(i => <div key={i} className="h-20 bg-surface animate-pulse" />)
          ) : recent.map((l) => (
            <li key={l.id} className="card-news p-3 flex gap-3 items-center">
              <div className="img-zoom w-20 h-16 shrink-0 bg-surface overflow-hidden">
                <img src={l.coverUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd"} alt={l.title} loading="lazy" className="w-full h-full object-cover" width={120} height={96} />
              </div>
              <Link
                to="/listicle/$slug"
                params={{ slug: l.id }}
                className="text-sm font-semibold text-ink hover:text-primary leading-snug"
              >
                {l.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface border border-rule p-6">
        <span className="eyebrow">Featured</span>
        <h3 className="font-serif text-xl font-bold mt-2 mb-2 leading-snug">
          Get the morning brief delivered to your inbox.
        </h3>
        <p className="text-sm text-ink-muted mb-4">
          The day’s most important business news from India and the world, in 5 minutes.
        </p>
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="flex-1 border border-rule bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-none"
          />
          <button className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 hover:bg-primary/90 rounded-none h-10 transition-colors">
            Subscribe
          </button>
        </form>
      </section>
    </aside>
  );
}


import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { publicService } from "@/services/public.service";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/listicles")({
  head: () => ({
    meta: [
      { title: "Listicles — Top Founders, Startups & Brands | Bharat Standard" },
      { name: "description", content: "Curated rankings of India’s top entrepreneurs, startups and brands by Bharat Standard." },
      { property: "og:title", content: "Listicles — Bharat Standard" },
      { property: "og:description", content: "Top 10, Top 5 and Top 3 rankings across Indian business." },
    ],
  }),
  component: ListiclesIndex,
});

function ListiclesIndex() {
  const [listicles, setListicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchListicles = async (pageNum: number, isInitial: boolean = false) => {
    try {
      if (isInitial) setIsLoading(true);
      else setIsFetchingMore(true);

      // Fetch 9 at a time for a nice 3-column layout
      const res = await publicService.getListicles({ page: pageNum, limit: 9 });
      
      if (res.success) {
        if (isInitial) {
          setListicles(res.data);
        } else {
          setListicles(prev => [...prev, ...res.data]);
        }

        if (res.meta) {
          setHasMore(res.meta.page < res.meta.totalPages);
        } else {
          setHasMore(res.data.length === 9);
        }
      }
    } catch (error) {
      console.error("Failed to fetch listicles", error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchListicles(1, true);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListicles(nextPage);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-bs py-10">
        <span className="eyebrow">Bharat Standard rankings</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mt-2 text-ink">Listicles</h1>
        <p className="text-ink-muted mt-3 max-w-2xl">
          Curated rankings of India’s top entrepreneurs, startups and brands — updated regularly by the Bharat Standard editorial team.
        </p>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[1, 2, 3].map(i => <div key={i} className="aspect-[16/10] bg-surface animate-pulse border border-rule" />)}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {listicles.map((l) => (
                <Link
                  key={l.id}
                  to="/listicle/$slug"
                  params={{ slug: l.id }}
                  className="card-news block group animate-fade-up"
                >
                  <div className="img-zoom aspect-[16/10] bg-surface relative">
                    <img src={l.coverUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd"} alt={l.title} loading="lazy" className="w-full h-full object-cover" width={1024} height={640} />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-bold leading-snug text-ink group-hover:text-primary transition-colors">
                      {l.title}
                    </h3>
                    <p className="text-sm text-ink-muted mt-2 line-clamp-2">{l.intro}</p>
                  </div>
                </Link>
              ))}
              {listicles.length === 0 && (
                <div className="col-span-full py-20 text-center border border-dashed border-rule">
                  <p className="font-serif text-xl text-ink-muted italic">Check back soon for new Bharat Standard rankings.</p>
                </div>
              )}
            </div>

            {hasMore && listicles.length > 0 && (
              <div className="mt-12 flex justify-center">
                <button 
                  onClick={handleLoadMore}
                  disabled={isFetchingMore}
                  className="px-10 py-3 border-2 border-ink text-ink font-bold hover:bg-ink hover:text-white transition-all rounded-full disabled:opacity-50"
                >
                  {isFetchingMore ? "Loading..." : "View More Rankings"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArticleCard } from "@/components/article-card";
import { Sidebar } from "@/components/sidebar";
import { publicService } from "@/services/public.service";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search as SearchIcon } from "lucide-react";

type SearchParams = {
  q?: string;
};

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      q: (search.q as string) || "",
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!q) {
        setArticles([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await publicService.getArticles({ search: q, limit: 20 });
        if (res.success) {
          const mappedArticles = res.data.map((art: any) => ({
            id: art.id,
            title: art.title,
            excerpt: art.excerpt || "",
            image: art.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
            category: art.category?.name || "News",
            author: art.author || "Bharat Standard",
            date: new Date(art.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
            readMin: Math.ceil((art.content?.length || 0) / 1000) || 3
          }));
          setArticles(mappedArticles);
        }
      } catch (error) {
        toast.error("Search failed");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-bs py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <span className="eyebrow">Search Results</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight mt-2 text-ink mb-8">
            {q ? `Showing results for "${q}"` : "Search Bharat Standard"}
          </h1>
          
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-surface animate-pulse border-b border-rule" />
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {articles.length > 0 ? (
                articles.map((a) => (
                  <ArticleCard key={a.id} a={a} variant="row" />
                ))
              ) : (
                <div className="py-20 text-center bg-surface border border-dashed border-rule">
                  <SearchIcon className="w-12 h-12 text-rule mx-auto mb-4" />
                  <p className="text-ink-muted font-serif text-xl italic">No stories found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
        <Sidebar />
      </main>
      <SiteFooter />
    </div>
  );
}

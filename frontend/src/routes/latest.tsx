import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArticleCard } from "@/components/article-card";
import { Sidebar } from "@/components/sidebar";
import { publicService } from "@/services/public.service";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/latest")({
  head: () => ({
    meta: [
      { title: "Latest News — Bharat Standard" },
      { name: "description", content: "All the latest business, finance, startups and economy news from India." },
      { property: "og:title", content: "Latest News — Bharat Standard" },
      { property: "og:description", content: "The newest stories from across Bharat Standard." },
    ],
  }),
  component: LatestPage,
});

function LatestPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await publicService.getArticles();
        if (res.success) {
          // Map backend data to ArticleCard format
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
        toast.error("Failed to fetch latest news");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-bs py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <span className="eyebrow">Updated continuously</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mt-2 text-ink mb-8">Latest news</h1>
          
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
                <p className="italic text-ink-muted py-10">No articles found in the newsroom yet.</p>
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

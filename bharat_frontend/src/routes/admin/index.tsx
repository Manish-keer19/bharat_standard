import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, LayoutList, ArrowRight } from "lucide-react";
import { adminService } from "@/services/admin.service";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState<any>({
    categories: 0,
    articles: 0,
    lastArticle: null as any
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catsRes, artsRes] = await Promise.all([
          adminService.getCategories(),
          adminService.getArticles()
        ]);

        if (catsRes.success && artsRes.success) {
          setStats({
            categories: catsRes.data.length,
            articles: artsRes.data.length,
            lastArticle: artsRes.data[0] || null
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Articles", value: stats.articles, icon: FileText, color: "text-blue-500", path: "/admin/articles" },
    { label: "Categories", value: stats.categories, icon: LayoutList, color: "text-purple-500", path: "/admin/categories" },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <header className="border-b border-rule pb-6">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-ink">Intelligence Dashboard</h1>
        <p className="text-ink-muted mt-2 font-medium">
          Global editorial metrics and site performance overview.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isLoading ? (
          [1, 2].map((i) => (
            <div key={i} className="h-40 bg-surface rounded-none animate-pulse border border-rule" />
          ))
        ) : (
          cards.map((card) => (
            <Card key={card.label} className="border-rule rounded-none shadow-none card-news bg-white overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {card.label}
                </CardTitle>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-5xl font-serif font-bold text-ink mb-4">{card.value}</div>
                <Link to={card.path} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-ink hover:text-primary transition-colors group/link">
                  Detailed Management <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-rule rounded-none shadow-none bg-surface p-8">
          <CardHeader className="p-0 mb-6">
            <h2 className="section-title mb-0">Live Feed Activity</h2>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-6 w-full bg-white rounded-none animate-pulse" />
                <div className="h-6 w-3/4 bg-white rounded-none animate-pulse" />
              </div>
            ) : stats.lastArticle ? (
              <div className="flex gap-8 items-center bg-white p-6 border border-rule card-news">
                {stats.lastArticle.imageUrl && (
                  <div className="w-24 h-24 flex-shrink-0 border border-rule overflow-hidden">
                    <img src={stats.lastArticle.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                )}
                <div>
                  <span className="eyebrow text-[9px] mb-1 block">Most Recent Publication</span>
                  <p className="font-serif font-bold text-xl text-ink line-clamp-1">{stats.lastArticle.title}</p>
                  <p className="text-[10px] font-bold text-ink-muted uppercase tracking-widest mt-2">Circulated on {new Date(stats.lastArticle.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center border border-dashed border-rule">
                 <p className="font-serif text-lg text-ink-muted italic">No editorial activity recorded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

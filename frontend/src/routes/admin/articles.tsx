import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ArticlesTab from "@/components/admin/ArticlesTab";
import { FileText } from "lucide-react";
import { adminService } from "@/services/admin.service";

export const Route = createFileRoute("/admin/articles")({
  component: AdminArticles,
});

function AdminArticles() {
  const [categories, setCategories] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setPage(1);
    try {
      const [catsRes, artsRes] = await Promise.all([
        adminService.getCategories(),
        adminService.getArticles({ page: 1, limit: 20 })
      ]);
      if (catsRes.success) setCategories(catsRes.data);
      if (artsRes.success) {
        setArticles(artsRes.data);
        if (artsRes.meta) {
          setHasMore(artsRes.meta.page < artsRes.meta.totalPages);
        } else {
          setHasMore(artsRes.data.length === 20);
        }
      }
    } catch (error) {
      toast.error("Failed to load articles data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isFetchingMore || !hasMore) return;
    setIsFetchingMore(true);
    try {
      const nextPage = page + 1;
      const res = await adminService.getArticles({ page: nextPage, limit: 20 });
      if (res.success) {
        setArticles(prev => [...prev, ...res.data]);
        setPage(nextPage);
        if (res.meta) {
          setHasMore(res.meta.page < res.meta.totalPages);
        } else {
          setHasMore(res.data.length === 20);
        }
      }
    } catch (error) {
      toast.error("Failed to load more articles");
    } finally {
      setIsFetchingMore(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-10 border-b border-rule pb-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          Press Registry
        </h1>
        <p className="text-ink-muted mt-2 font-medium">Curating and managing the digital publication archives.</p>
      </header>
        <ArticlesTab 
            articles={articles} 
            categories={categories} 
            refreshData={fetchInitialData} 
            loadMore={handleLoadMore}
            hasMore={hasMore}
            isFetchingMore={isFetchingMore}
        />
    </div>
  );
}

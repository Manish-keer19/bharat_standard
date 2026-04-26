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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catsRes, artsRes] = await Promise.all([
        adminService.getCategories(),
        adminService.getArticles()
      ]);
      if (catsRes.success) setCategories(catsRes.data);
      if (artsRes.success) setArticles(artsRes.data);
    } catch (error) {
      toast.error("Failed to load articles data");
    } finally {
      setIsLoading(false);
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
            refreshData={fetchData} 
        />
    </div>
  );
}

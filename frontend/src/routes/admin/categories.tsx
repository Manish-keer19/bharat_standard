import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import CategoriesTab from "@/components/admin/CategoriesTab";
import { LayoutList } from "lucide-react";
import { adminService } from "@/services/admin.service";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getCategories();
      if (res.success) setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-10 border-b border-rule pb-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink flex items-center gap-3">
          <LayoutList className="w-8 h-8 text-primary" />
          Thematic Taxonomy
        </h1>
        <p className="text-ink-muted mt-2 font-medium">Categorizing the flow of information across segments.</p>
      </header>
        <CategoriesTab 
            categories={categories} 
            refreshData={fetchData} 
        />
    </div>
  );
}

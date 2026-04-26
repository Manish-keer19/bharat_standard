import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ListiclesTab from "@/components/admin/ListiclesTab";
import { LayoutGrid } from "lucide-react";
import { adminService } from "@/services/admin.service";

export const Route = createFileRoute("/admin/listicles")({
  component: AdminListicles,
});

function AdminListicles() {
  const [listicles, setListicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getListicles();
      if (res.success) setListicles(res.data);
    } catch (error) {
      toast.error("Failed to load listicles data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-10 border-b border-rule pb-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink flex items-center gap-3">
          <LayoutGrid className="w-8 h-8 text-primary" />
          Listicle Gallery
        </h1>
        <p className="text-ink-muted mt-2 font-medium">Curating multi-part featured stories and deep-dives.</p>
      </header>
      <ListiclesTab 
        listicles={listicles} 
        refreshData={fetchData} 
      />
    </div>
  );
}

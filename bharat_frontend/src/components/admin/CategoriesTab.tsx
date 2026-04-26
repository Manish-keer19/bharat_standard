import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { mediaService } from "@/services/media.service";

interface CategoriesTabProps {
  categories: any[];
  refreshData: () => void;
}

const CategoriesTab = ({ categories, refreshData }: CategoriesTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Form State
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [bulkNames, setBulkNames] = useState("");

  const startEdit = (category: any) => {
    setEditingCategory(category);
    setCatName(category.name);
    setCatDesc(category.description || "");
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setCatName("");
    setCatDesc("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return toast.error("Name is required");
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const res = await adminService.updateCategory(editingCategory.id, { 
          name: catName, 
          description: catDesc 
        });
        if (res.success) {
          toast.success("Category updated!");
          cancelEdit();
          refreshData();
        }
      } else {
        const res = await adminService.createCategory({ 
          name: catName, 
          description: catDesc 
        });
        if (res.success) {
          toast.success("Category created!");
          cancelEdit();
          refreshData();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkNames.trim()) return toast.error("Please enter some category names");
    setIsSubmitting(true);
    try {
      const res = await adminService.bulkCreateCategories({ names: bulkNames });
      if (res.success) {
        toast.success(res.message || "Categories established!");
        setBulkNames("");
        refreshData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Bulk operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This cannot be undone if articles exist.")) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.deleteCategory(id);
      if (res.success) {
        toast.success("Category deleted!");
        refreshData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <section>
        <h2 className="section-title">Classify Content</h2>
        <Card className="rounded-none border-rule shadow-none bg-surface">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-serif text-ink">{editingCategory ? "Edit Category" : "New Segment"}</CardTitle>
            <CardDescription className="text-ink-muted">
              {editingCategory ? "Updating existing segment parameters." : "Define a new thematic segment for news distribution."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 md:items-end">
              <div className="flex-1 space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Segment Name</Label>
                <Input disabled={isSubmitting} value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Political Pulse" required className="rounded-none border-rule bg-white h-12 font-bold" />
              </div>
              <div className="flex-[2] space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Description (Internal)</Label>
                <Input disabled={isSubmitting} value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Optional context for this segment..." className="rounded-none border-rule bg-white h-12" />
              </div>
              <div className="flex gap-2">
                {editingCategory && (
                  <Button type="button" variant="outline" onClick={cancelEdit} disabled={isSubmitting} className="rounded-none border-rule h-12 font-bold uppercase tracking-widest text-[10px] px-6">
                    Discard
                  </Button>
                )}
                <Button disabled={isSubmitting} type="submit" className="rounded-none bg-primary text-white h-12 font-bold uppercase tracking-widest text-[10px] px-8 hover:bg-primary/90 min-w-[120px]">
                  {isSubmitting ? "..." : (
                    <>
                      {editingCategory ? "Update" : "Establish"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="section-title">Bulk Expansion</h2>
        <Card className="rounded-none border-rule shadow-none bg-surface">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-serif text-ink">Rapid Taxonomy Growth</CardTitle>
            <CardDescription className="text-ink-muted">
              Add multiple segments at once by separating names with commas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBulkSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Comma-Separated Segments</Label>
                <textarea 
                  disabled={isSubmitting} 
                  value={bulkNames} 
                  onChange={(e) => setBulkNames(e.target.value)} 
                  placeholder="Politics, Economy, Technology, Culture..." 
                  className="w-full min-h-[100px] p-4 rounded-none border border-rule bg-white font-medium focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <Button disabled={isSubmitting} type="submit" className="rounded-none bg-primary text-white h-12 font-bold uppercase tracking-widest text-[10px] px-8 hover:bg-primary/90">
                {isSubmitting ? "Processing..." : "Mass Establish Segments"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="pt-8">
        <h2 className="section-title">Segment Directory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.length === 0 ? (
              [1, 2, 3, 4].map(i => (
                  <div key={i} className="h-28 bg-surface rounded-none animate-pulse border border-rule" />
              ))
          ) : (
              categories.map(cat => (
                  <Card key={cat.id} className="flex justify-between items-center p-0 card-news rounded-none border-rule overflow-hidden group">
                    <div className="flex-1 p-6">
                      <h3 className="font-bold text-lg font-serif text-ink group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-xs text-ink-muted mt-2 line-clamp-2 italic">{cat.description || "No internal description defined."}</p>
                      {cat._count && (
                          <div className="flex items-center gap-2 mt-4">
                              <span className="eyebrow text-[8px]">Articles: {cat._count.articles}</span>
                          </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-px w-14 bg-rule h-full self-stretch border-l border-rule">
                      <Button disabled={isSubmitting} variant="ghost" className="flex-1 rounded-none bg-white hover:bg-primary/5 text-ink hover:text-primary transition-all p-0" onClick={() => startEdit(cat)}>
                        <Edit className="w-4 h-4"/>
                      </Button>
                      <Button disabled={isSubmitting} variant="ghost" className="flex-1 rounded-none bg-white hover:bg-destructive/5 text-ink hover:text-destructive transition-all p-0" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    </div>
                  </Card>
              ))
          )}
          {categories.length === 0 && (
            <div className="col-span-2 text-center py-20 bg-surface border border-dashed border-rule">
              <p className="font-serif text-xl text-ink-muted italic">No segments have been defined yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoriesTab;

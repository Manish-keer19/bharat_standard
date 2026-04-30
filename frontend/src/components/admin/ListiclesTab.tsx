import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, X, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { mediaService } from "@/services/media.service";

interface ListiclesTabProps {
  listicles: any[];
  refreshData: () => void;
  loadMore?: () => void;
  hasMore?: boolean;
  isFetchingMore?: boolean;
}

interface ListicleItem {
  id: string; // temporary local id
  title: string;
  body: string;
  imageUrl?: string;
  imageFile?: File | null;
}

const ListiclesTab = ({ listicles, refreshData, loadMore, hasMore, isFetchingMore }: ListiclesTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingListicle, setEditingListicle] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [listDate, setListDate] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [items, setItems] = useState<ListicleItem[]>([
    { id: Math.random().toString(36).substr(2, 9), title: "", body: "", imageFile: null }
  ]);
  
  const coverInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (listicle: any) => {
    setEditingListicle(listicle);
    setTitle(listicle.title);
    setIntro(listicle.intro || "");
    setItems(listicle.items.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    })));

    if (listicle.createdAt) {
      const date = new Date(listicle.createdAt);
      const formatted = date.toISOString().slice(0, 16);
      setListDate(formatted);
    } else {
      setListDate("");
    }
  };

  const cancelEdit = () => {
    setEditingListicle(null);
    setTitle("");
    setIntro("");
    setListDate("");
    setCoverImage(null);
    setItems([{ id: Math.random().toString(36).substr(2, 9), title: "", body: "", imageFile: null }]);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), title: "", body: "", imageFile: null }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return toast.error("A listicle must have at least one item.");
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ListicleItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return toast.error("Title is required");
    if (items.some(item => !item.title || !item.body)) {
      return toast.error("All listicle items must have a title and content");
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(editingListicle ? "Updating..." : "Creating...");
    
    try {
      // 1. Upload Cover Image
      let uploadedCoverUrl = editingListicle?.coverUrl || null;
      if (coverImage) {
        uploadedCoverUrl = await mediaService.uploadImage(coverImage);
      }

      // 2. Upload Item Images
      const finalItems = await Promise.all(items.map(async (item) => {
        let itemImageUrl = item.imageUrl || "";
        if (item.imageFile) {
          itemImageUrl = await mediaService.uploadImage(item.imageFile);
        }
        return {
          title: item.title,
          body: item.body,
          imageUrl: itemImageUrl
        };
      }));

      const payload = {
        title,
        intro,
        coverUrl: uploadedCoverUrl,
        items: finalItems,
        published: true,
        createdAt: listDate || undefined
      };

      if (editingListicle) {
        const res = await adminService.updateListicle(editingListicle.id, payload);
        if (res.success) {
          toast.success("Listicle updated!");
          cancelEdit();
          refreshData();
        }
      } else {
        const res = await adminService.createListicle(payload);
        if (res.success) {
          toast.success("Listicle created!");
          cancelEdit();
          refreshData();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listicle?")) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.deleteListicle(id);
      if (res.success) {
        toast.success("Listicle deleted!");
        refreshData();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete listicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <section>
        <h2 className="section-title">Compose Featured Listicle</h2>
        <Card className="rounded-none border-rule shadow-none bg-surface">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-ink">Listicle Architect</CardTitle>
            <CardDescription className="text-ink-muted">
              Design multi-part stories with images and detailed descriptions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Listicle Headline</Label>
                    <Input 
                      disabled={isSubmitting} 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="e.g., Top 10 Startups in 2024" 
                      required 
                      className="rounded-none border-rule bg-white h-12 text-lg font-serif" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Introduction Paragraph</Label>
                    <Textarea 
                      disabled={isSubmitting} 
                      value={intro} 
                      onChange={(e) => setIntro(e.target.value)} 
                      placeholder="Write a brief introduction..." 
                      className="rounded-none border-rule bg-white min-h-[100px] resize-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Publication Date (Manual Override)</Label>
                    <Input 
                      disabled={isSubmitting} 
                      type="datetime-local" 
                      value={listDate} 
                      onChange={(e) => setListDate(e.target.value)} 
                      className="rounded-none border-rule bg-white h-12 text-sm font-bold" 
                    />
                    <p className="text-[10px] text-ink-muted italic">Leave empty to use current time. Use this to backdate listicles.</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Main Cover Image</Label>
                  <div className="flex flex-col gap-4 mt-1">
                    {(coverImage || (editingListicle && editingListicle.coverUrl)) && (
                      <div className="relative w-full rounded-none overflow-hidden border border-rule bg-surface shadow-sm flex justify-center">
                        <img 
                          src={coverImage ? URL.createObjectURL(coverImage) : editingListicle.coverUrl} 
                          alt="cover preview" 
                          className="max-w-full max-h-[400px] w-auto h-auto block"
                        />
                        {coverImage && (
                          <button
                            type="button"
                            onClick={() => {
                              setCoverImage(null);
                              if (coverInputRef.current) coverInputRef.current.value = "";
                            }}
                            className="absolute top-2 right-2 bg-primary text-white p-2 hover:bg-primary/90 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                    <Input
                      disabled={isSubmitting}
                      type="file"
                      accept="image/*"
                      ref={coverInputRef}
                      className="rounded-none border-rule bg-white cursor-pointer file:bg-primary file:text-white file:border-none file:px-4 file:h-full file:mr-4 file:font-bold file:uppercase file:text-[10px] file:tracking-widest"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.size > 3 * 1024 * 1024) {
                            toast.error("Cover image must be less than 3MB");
                            if (coverInputRef.current) coverInputRef.current.value = "";
                            return;
                          }
                          setCoverImage(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-rule">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted font-serif text-lg">Listicle Items ({items.length})</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addItem}
                    className="rounded-none border-primary text-primary font-bold uppercase tracking-widest text-[10px] gap-2 hover:bg-primary hover:text-white"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </Button>
                </div>

                <div className="space-y-8">
                  {items.map((item, index) => (
                    <div key={item.id} className="relative group p-6 bg-white border border-rule shadow-sm">
                      <div className="absolute -left-3 top-6 w-8 h-8 bg-ink text-white flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Item Title</Label>
                            <Input 
                              disabled={isSubmitting} 
                              value={item.title} 
                              onChange={(e) => updateItem(item.id, "title", e.target.value)} 
                              placeholder="e.g., 01. Zomato" 
                              className="rounded-none border-rule font-bold" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Item Description</Label>
                            <Textarea 
                              disabled={isSubmitting} 
                              value={item.body} 
                              onChange={(e) => updateItem(item.id, "body", e.target.value)} 
                              placeholder="Describe this item..." 
                              className="rounded-none border-rule min-h-[100px] text-sm leading-relaxed" 
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Item Image</Label>
                          <div className="aspect-square bg-surface border border-rule overflow-hidden relative">
                            {(item.imageFile || item.imageUrl) ? (
                              <img 
                                src={item.imageFile ? URL.createObjectURL(item.imageFile) : item.imageUrl} 
                                className="w-full h-full object-cover" 
                                alt="item"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-ink-muted p-4 text-center">
                                <Plus className="w-6 h-6 mb-2 opacity-20" />
                                <span className="text-[9px] uppercase font-bold tracking-widest">No Image</span>
                              </div>
                            )}
                          </div>
                          <Input 
                            type="file" 
                            accept="image/*"
                            disabled={isSubmitting}
                            className="text-[10px] h-8 rounded-none border-rule bg-surface p-0"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                if (file.size > 3 * 1024 * 1024) {
                                  toast.error("Item image must be less than 3MB");
                                  e.target.value = "";
                                  return;
                                }
                                updateItem(item.id, "imageFile", file);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeItem(item.id)}
                        className="absolute -right-3 -top-3 bg-white border border-rule text-ink-muted hover:text-destructive hover:border-destructive p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-8 border-t border-rule mt-8">
                {editingListicle && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={cancelEdit} 
                    disabled={isSubmitting} 
                    className="rounded-none border-rule text-ink-muted font-bold uppercase tracking-widest text-xs px-10 h-12"
                  >
                    Discard Changes
                  </Button>
                )}
                <Button 
                  disabled={isSubmitting} 
                  type="submit" 
                  className="rounded-none bg-primary text-white font-bold uppercase tracking-widest text-xs px-12 h-12 hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? "Generating Listicle..." : (editingListicle ? "Finalize Update" : "Publish Listicle")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="pt-8">
        <h2 className="section-title">Published Listicles</h2>
        <div className="grid grid-cols-1 gap-4">
          {listicles.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-dashed border-rule">
              <p className="font-serif text-xl text-ink-muted italic">No listicles found in the archives.</p>
            </div>
          ) : (
            listicles.map(listicle => (
              <Card key={listicle.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-0 gap-0 card-news rounded-none border-rule overflow-hidden group">
                <div className="flex gap-6 items-center flex-1 p-4">
                  {listicle.coverUrl && (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-none overflow-hidden bg-surface flex-shrink-0 border-r border-rule">
                      <img src={listicle.coverUrl} alt="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="eyebrow text-[9px] mb-1 block">Featured Listicle · {listicle.items?.length || 0} Items</span>
                    <h3 className="font-bold text-lg sm:text-xl font-serif text-ink line-clamp-2 leading-snug group-hover:text-primary transition-colors">{listicle.title}</h3>
                    <div className="flex items-center gap-4 text-[10px] text-ink-muted font-bold uppercase tracking-wider mt-3">
                      <span>{new Date(listicle.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-px w-full sm:w-20 bg-rule border-t sm:border-t-0 sm:border-l border-rule">
                  <Button disabled={isSubmitting} variant="ghost" className="flex-1 rounded-none h-16 bg-white hover:bg-primary/5 text-ink hover:text-primary transition-all p-0" onClick={() => startEdit(listicle)}>
                    <Edit className="w-5 h-5"/>
                  </Button>
                  <Button disabled={isSubmitting} variant="ghost" className="flex-1 rounded-none h-16 bg-white hover:bg-destructive/5 text-ink hover:text-destructive transition-all p-0" onClick={() => handleDelete(listicle.id)}>
                    <Trash2 className="w-5 h-5"/>
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {hasMore && listicles.length > 0 && loadMore && (
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={loadMore} 
              disabled={isFetchingMore}
              variant="outline"
              className="rounded-none border-ink text-ink font-bold px-10 h-12 hover:bg-ink hover:text-white transition-all"
            >
              {isFetchingMore ? "Loading..." : "Load Older Listicles"}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ListiclesTab;

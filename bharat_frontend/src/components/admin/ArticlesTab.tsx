import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, X } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { mediaService } from "@/services/media.service";
import { INDIAN_NAMES } from "./adminConstants";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';


interface ArticlesTabProps {
  articles: any[];
  categories: any[];
  refreshData: () => void;
}

const ArticlesTab = ({ articles, categories, refreshData }: ArticlesTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  // Form State
  const [artTitle, setArtTitle] = useState("");
  const [artExcerpt, setArtExcerpt] = useState("");
  const [artContent, setArtContent] = useState("");
  const [artCat, setArtCat] = useState("");
  const [artDate, setArtDate] = useState("");
  const [artImage, setArtImage] = useState<File | null>(null);
  const [artImages, setArtImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (article: any) => {
    setEditingArticle(article);
    setArtTitle(article.title);
    setArtExcerpt(article.excerpt || "");
    setArtContent(article.content);
    setArtCat(article.categoryId);
    setExistingImages(article.images || []);

    if (article.createdAt) {
      const date = new Date(article.createdAt);
      const formatted = date.toISOString().slice(0, 16);
      setArtDate(formatted);
    } else {
      setArtDate("");
    }
  };

  const cancelEdit = () => {
    setEditingArticle(null);
    setArtTitle("");
    setArtExcerpt("");
    setArtContent("");
    setArtCat("");
    setArtDate("");
    setArtImage(null);
    setArtImages([]);
    setExistingImages([]);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artCat) return toast.error("Title and category are required");

    setIsSubmitting(true);
    let uploadedImageUrl = editingArticle?.imageUrl || null;
    let uploadedGalleryUrls: string[] = [...existingImages];

    const loadingToast = toast.loading(editingArticle ? "Updating..." : "Creating...");
    try {
      if (artImage) {
        uploadedImageUrl = await mediaService.uploadImage(artImage);
      }

      if (artImages.length > 0) {
        const galleryUrls = await mediaService.uploadImages(artImages);
        uploadedGalleryUrls = [...uploadedGalleryUrls, ...galleryUrls];
      }

      const articleData = {
        title: artTitle,
        categoryId: artCat,
        excerpt: artExcerpt,
        content: artContent,
        imageUrl: uploadedImageUrl,
        images: uploadedGalleryUrls,
        published: true,
        createdAt: artDate || undefined
      };

      if (editingArticle) {
        const res = await adminService.updateArticle(editingArticle.id, articleData);
        if (res.success) {
          toast.success("Article updated!");
          cancelEdit();
          refreshData();
        }
      } else {
        const randomAuthor = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
        const res = await adminService.createArticle({
          ...articleData,
          author: randomAuthor
        });
        if (res.success) {
          toast.success(`Article created! Author: ${randomAuthor}`);
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
    if (!confirm("Are you sure you want to delete this article?")) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.deleteArticle(id);
      if (res.success) {
        toast.success("Article deleted!");
        refreshData();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <section>
        <h2 className="section-title">Publish New Story</h2>
        <Card className="rounded-none border-rule shadow-none bg-surface">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-serif text-ink">Article Composer</CardTitle>
            <CardDescription className="text-ink-muted">
              {editingArticle ? "Refining your draft content." : "Crafting a new story for the Bharat Standard audience."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Article Headline</Label>
                  <Input disabled={isSubmitting} value={artTitle} onChange={(e) => setArtTitle(e.target.value)} placeholder="Enter a compelling headline..." required className="rounded-none border-rule bg-white h-12 text-lg font-serif" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Category Segment</Label>
                  <select
                    disabled={isSubmitting}
                    className="flex h-12 w-full rounded-none border border-rule bg-white px-3 py-2 text-sm font-bold uppercase tracking-widest text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={artCat}
                    onChange={(e) => setArtCat(e.target.value)}
                    required
                  >
                    <option value="">Select Category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Publication Date (Manual Override)</Label>
                  <Input
                    disabled={isSubmitting}
                    type="datetime-local"
                    value={artDate}
                    onChange={(e) => setArtDate(e.target.value)}
                    className="rounded-none border-rule bg-white h-12 text-sm font-bold"
                  />
                  <p className="text-[10px] text-ink-muted italic">Leave empty to use current time. Use this to backdate stories.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Featured Image (Cover)</Label>
                  <div className="flex flex-col gap-4 mt-1">
                    {(artImage || (editingArticle && editingArticle.imageUrl)) && (
                      <div className="relative aspect-video w-full rounded-none overflow-hidden border border-rule bg-white shadow-sm">
                        <img
                          src={artImage ? URL.createObjectURL(artImage) : editingArticle.imageUrl}
                          alt="cover preview"
                          className="w-full h-full object-cover"
                        />
                        {artImage && (
                          <button
                            type="button"
                            onClick={() => {
                              setArtImage(null);
                              if (imageInputRef.current) imageInputRef.current.value = "";
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
                      ref={imageInputRef}
                      className="rounded-none border-rule bg-white cursor-pointer file:bg-primary file:text-white file:border-none file:px-4 file:h-full file:mr-4 file:font-bold file:uppercase file:text-[10px] file:tracking-widest"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.size > 3 * 1024 * 1024) {
                            toast.error("File size must be less than 3MB");
                            if (imageInputRef.current) imageInputRef.current.value = "";
                            return;
                          }
                          setArtImage(file);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Gallery / Supplemental Images</Label>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {existingImages.map((url, i) => (
                      <div key={i} className="relative aspect-square border border-rule bg-white overflow-hidden group">
                        <img src={url} alt={`gallery ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setExistingImages(prev => prev.filter((_, index) => index !== i))}
                          className="absolute inset-0 bg-destructive/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {artImages.map((file, i) => (
                      <div key={`new-${i}`} className="relative aspect-square border border-rule bg-white overflow-hidden group">
                        <img src={URL.createObjectURL(file)} alt={`new gallery ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setArtImages(prev => prev.filter((_, index) => index !== i))}
                          className="absolute inset-0 bg-primary/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Input
                    disabled={isSubmitting}
                    type="file"
                    multiple
                    accept="image/*"
                    ref={galleryInputRef}
                    className="rounded-none border-rule bg-white cursor-pointer file:bg-primary file:text-white file:border-none file:px-4 file:h-full file:mr-4 file:font-bold file:uppercase file:text-[10px] file:tracking-widest"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        const tooLarge = files.find(f => f.size > 3 * 1024 * 1024);
                        if (tooLarge) {
                          toast.error("All gallery images must be less than 3MB");
                          if (galleryInputRef.current) galleryInputRef.current.value = "";
                          return;
                        }
                        setArtImages(prev => [...prev, ...files]);
                        if (galleryInputRef.current) galleryInputRef.current.value = "";
                      }
                    }}
                  />
                  <p className="text-[10px] text-ink-muted italic">Add multiple images to display within the article body or gallery.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted">Short Excerpt</Label>
                  <Textarea disabled={isSubmitting} value={artExcerpt} onChange={(e) => setArtExcerpt(e.target.value)} placeholder="Write a brief, engaging summary..." className="rounded-none border-rule bg-white min-h-[100px] resize-none" />
                </div>
              </div>

              <div className="space-y-6 flex flex-col">
                <div className="flex-grow flex flex-col min-h-[400px]">
                  <Label className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-2">Main Content Body</Label>
                  <div className="flex-grow bg-white rounded-none border border-rule overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={artContent}
                      onChange={setArtContent}
                      className="h-full quill-bs"
                      placeholder="Share the full story here..."
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                          ['link', 'clean']
                        ],
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  {editingArticle && (
                    <Button type="button" variant="outline" onClick={cancelEdit} disabled={isSubmitting} className="rounded-none border-rule text-ink-muted font-bold uppercase tracking-widest text-xs px-8">
                      Discard
                    </Button>
                  )}
                  <Button disabled={isSubmitting} type="submit" className="rounded-none bg-primary text-white font-bold uppercase tracking-widest text-xs px-10 h-12 hover:bg-primary/90 shadow-lg shadow-primary/20">
                    {isSubmitting ? "Processing..." : (
                      <>
                        {editingArticle ? "Finalize Update" : "Publish to Press"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="pt-8">
        <h2 className="section-title">Editorial Archives</h2>
        <div className="grid grid-cols-1 gap-4">
          {articles.length === 0 ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-surface rounded-none animate-pulse border border-rule" />
            ))
          ) : (
            articles.map(article => (
              <Card key={article.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-0 gap-0 card-news rounded-none border-rule overflow-hidden group">
                <div className="flex gap-6 items-center flex-1 p-4">
                  {article.imageUrl && (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-none overflow-hidden bg-surface flex-shrink-0 border-r border-rule">
                      <img src={article.imageUrl} alt="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="eyebrow text-[9px] mb-1 block">{article.category?.name || "Uncategorized"}</span>
                    <h3 className="font-bold text-lg sm:text-xl font-serif text-ink line-clamp-2 leading-snug group-hover:text-primary transition-colors">{article.title}</h3>
                    <div className="flex items-center gap-4 text-[10px] text-ink-muted font-bold uppercase tracking-wider mt-3">
                      <span className="flex items-center gap-1.5"><Edit className="w-3 h-3 text-primary" /> {article.author || "Staff Writer"}</span>
                      <span className="text-rule">|</span>
                      <span>{new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {article.images && article.images.length > 0 && (
                        <>
                          <span className="text-rule">|</span>
                          <span className="text-primary">{article.images.length} Images</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-4 w-full sm:w-20 bg-rule border-t sm:border-t-0 sm:border-l border-rule">
                  <Button disabled={isSubmitting} variant="ghost" className="flex-1 rounded-none h-16 bg-white hover:bg-primary/5 text-ink hover:text-primary transition-all p-0" onClick={() => startEdit(article)}>
                    <Edit className="w-5 h-5" />
                  </Button>
                  <Button disabled={isSubmitting} variant="ghost" className="flex-1 rounded-none h-16 bg-white hover:bg-destructive/5 text-ink hover:text-destructive transition-all p-0" onClick={() => handleDelete(article.id)}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            )))}
          {articles.length === 0 && (
            <div className="text-center py-20 bg-surface border border-dashed border-rule">
              <p className="font-serif text-xl text-ink-muted italic">The archives are currently empty.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ArticlesTab;

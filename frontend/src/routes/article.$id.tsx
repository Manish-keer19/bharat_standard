import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { publicService } from "@/services/public.service";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Share2 } from "lucide-react";

export const Route = createFileRoute("/article/$id")({
  loader: async ({ params }) => {
    try {
      const res = await publicService.getArticle(params.id);
      if (!res.success || !res.data) throw notFound();
      
        const art = res.data;
        const mappedArticle = {
          id: art.id,
          title: art.title,
          excerpt: art.excerpt || "",
          content: art.content,
          image: art.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
          images: art.images || [],
          category: art.category?.name || "News",
          author: art.author || "Bharat Standard",
          date: new Date(art.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          readMin: Math.ceil((art.content?.length || 0) / 1000) || 3
        };

      return { article: mappedArticle };
    } catch (error) {
      console.error("Loader error for article:", error);
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article — Bharat Standard" }] };
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.title} — Bharat Standard` },
        { name: "description", content: a.excerpt },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.excerpt },
        { property: "og:image", content: a.image },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: a.image },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-bs py-24 text-center flex-1">
        <h1 className="font-serif text-4xl font-bold">Article not found</h1>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">Back to home</Link>
      </main>
      <SiteFooter />
    </div>
  ),
  pendingComponent: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-bs py-10 max-w-4xl flex-1">
        <div className="h-4 w-32 bg-surface animate-pulse mb-6" />
        <div className="h-12 w-3/4 bg-surface animate-pulse mb-4" />
        <div className="h-12 w-1/2 bg-surface animate-pulse mb-8" />
        <div className="h-6 w-full bg-surface animate-pulse mb-10" />
        <div className="aspect-video w-full bg-surface animate-pulse mb-12" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-surface animate-pulse" />
          <div className="h-4 w-full bg-surface animate-pulse" />
          <div className="h-4 w-3/4 bg-surface animate-pulse" />
        </div>
      </main>
      <SiteFooter />
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  
  // Since we don't have easy access to related articles from this route without another fetch,
  // we'll handle it by either showing a placeholder or leaving it out for now.
  // Ideally, the backend would return related articles too.
  const related: any[] = []; 

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <article className="container-bs py-10 max-w-4xl">
          <nav className="text-xs text-ink-muted mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-medium">{article.category}</span>
          </nav>

          <span className="eyebrow">{article.category}</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mt-2 text-ink animate-fade-up">
            {article.title} 
          </h1>
          <p className="text-lg md:text-xl text-ink-muted mt-4 leading-relaxed">{article.excerpt}</p>

          <div className="flex items-center justify-between flex-wrap gap-4 border-y border-rule mt-6 py-4">
            <div className="text-sm">
              <p className="font-semibold text-ink">By {article.author}</p>
              <p className="text-ink-muted">{article.date} · {article.readMin} min read</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-muted mr-1">Share:</span>
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="w-9 h-9 inline-flex items-center justify-center border border-rule hover:bg-black hover:text-white hover:border-black transition-colors"
                title="Share on X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="w-9 h-9 inline-flex items-center justify-center border border-rule hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="w-9 h-9 inline-flex items-center justify-center border border-rule hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: article.excerpt,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    import('sonner').then(({ toast }) => toast.success("Link copied to clipboard!"));
                  }
                }}
                className="w-9 h-9 inline-flex items-center justify-center border border-rule hover:bg-primary hover:text-white hover:border-primary transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  import('sonner').then(({ toast }) => toast.success("Link copied to clipboard!"));
                }}
                className="w-9 h-9 inline-flex items-center justify-center border border-rule hover:bg-primary hover:text-white hover:border-primary transition-colors"
                title="Copy Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="img-zoom mt-6 bg-surface overflow-hidden border border-rule flex justify-center">
            <img src={article.image} alt={article.title} className="max-w-full max-h-[500px] w-auto h-auto block" />
          </div>

          {article.images && article.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {article.images.map((img: string, idx: number) => (
                <div key={idx} className="img-zoom bg-surface aspect-video overflow-hidden border border-rule">
                  <img src={img} alt={`Additional image ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          )}

          {/* Render content as HTML if it's from a rich text editor, or split into paragraphs if it's plain text */}
          <div className="overflow-hidden w-full">
            <div 
              className="prose prose-lg max-w-none mt-8 space-y-5 text-ink leading-relaxed text-[1.05rem]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {related.length > 0 && (
          <section className="bg-surface border-t border-rule py-12 mt-10">
            <div className="container-bs">
              <h2 className="section-title">Related stories</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((a) => (
                  <Link
                    key={a.slug}
                    to="/article/$slug"
                    params={{ slug: a.slug }}
                    className="card-news bg-background group block"
                  >
                    <div className="img-zoom bg-surface">
                      <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover" width={800} height={500} />
                    </div>
                    <div className="p-4">
                      <span className="eyebrow">{a.category}</span>
                      <h3 className="font-serif text-lg font-bold mt-1.5 leading-snug text-ink group-hover:text-primary">
                        {a.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { publicService } from "@/services/public.service";
import { Facebook, Twitter, Linkedin, Share2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/listicle/$slug")({
  loader: async ({ params }) => {
    try {
      const res = await publicService.getListicle(params.slug);
      if (!res.success) throw notFound();
      return { listicle: res.data };
    } catch (error) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Listicle — Bharat Standard" }] };
    const l = loaderData.listicle;
    return {
      meta: [
        { title: `${l.title} — Bharat Standard` },
        { name: "description", content: l.intro },
        { property: "og:title", content: l.title },
        { property: "og:description", content: l.intro },
        { property: "og:image", content: l.coverUrl },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: l.coverUrl },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-bs py-24 text-center flex-1">
        <h1 className="font-serif text-4xl font-bold">Listicle not found</h1>
        <Link to="/listicles" className="text-primary hover:underline mt-4 inline-block">Browse all listicles</Link>
      </main>
      <SiteFooter />
    </div>
  ),
  component: ListiclePage,
});

function ListiclePage() {
  const { listicle } = Route.useLoaderData();

  const handleShare = (platform?: string) => {
    const url = window.location.href;
    const title = listicle.title;

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } else {
      if (navigator.share) {
        navigator.share({ title, url }).catch(() => {});
      } else {
        handleShare('copy');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <header className="container-bs py-10 max-w-4xl">
          <nav className="text-xs text-ink-muted mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/listicles" className="hover:text-primary">Listicles</Link>
          </nav>
          <span className="eyebrow">Listicle · {listicle.items?.length || 0} entries</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mt-2 text-ink animate-fade-up">
            {listicle.title}
          </h1>
          <p className="text-lg text-ink-muted mt-4 leading-relaxed">{listicle.intro}</p>
          <div className="flex items-center gap-2 mt-5">
            <span className="text-xs text-ink-muted mr-1">Share:</span>
            <button onClick={() => handleShare()} className="w-9 h-9 inline-flex items-center justify-center border border-rule hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={() => handleShare('facebook')} className="w-9 h-9 inline-flex items-center justify-center border border-rule hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
              <Facebook className="w-4 h-4" />
            </button>
            <button onClick={() => handleShare('twitter')} className="w-9 h-9 inline-flex items-center justify-center border border-rule hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
              <Twitter className="w-4 h-4" />
            </button>
            <button onClick={() => handleShare('linkedin')} className="w-9 h-9 inline-flex items-center justify-center border border-rule hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
              <Linkedin className="w-4 h-4" />
            </button>
            <button onClick={() => handleShare('copy')} className="w-9 h-9 inline-flex items-center justify-center border border-rule hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="img-zoom container-bs flex justify-center">
          <img src={listicle.coverUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd"} alt={listicle.title} className="max-w-full max-h-[500px] w-auto h-auto block border border-rule" />
        </div>

        <section className="container-bs py-12 max-w-4xl space-y-10">
          {(listicle.items || []).map((item: any, i: number) => (
            <article key={i} className="card-news p-5 md:p-6 grid md:grid-cols-[120px_180px_1fr] gap-5 items-start animate-fade-up">
              <div className="flex md:block items-baseline gap-3">
                <span className="font-serif text-6xl md:text-7xl font-bold text-primary leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="img-zoom aspect-square bg-surface border border-rule">
                <img src={item.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c"} alt={item.title} loading="lazy" className="w-full h-full object-cover" width={400} height={400} />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-ink">{item.title}</h2>
                <p className="text-ink-muted mt-3 leading-relaxed whitespace-pre-wrap">{item.body}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

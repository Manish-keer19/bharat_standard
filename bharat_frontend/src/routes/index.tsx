import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BreakingTicker } from "@/components/breaking-ticker";
import { ArticleCard } from "@/components/article-card";
import { Sidebar } from "@/components/sidebar";
import { Link } from "@tanstack/react-router";
import { publicService } from "@/services/public.service";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bharat Standard — Business, Markets & Economy News from India" },
      {
        name: "description",
        content:
          "Authoritative business news, market analysis, startup coverage and policy reporting from India. Trusted by decision-makers.",
      },
      { property: "og:title", content: "Bharat Standard — India’s Business News Platform" },
      {
        property: "og:description",
        content:
          "Daily business, finance, startups, technology and economy news from India.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [listicles, setListicles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artRes, listRes, catRes] = await Promise.all([
          publicService.getArticles(),
          publicService.getListicles(),
          publicService.getCategories()
        ]);

        if (artRes.success) {
          const mapped = artRes.data.map((art: any) => ({
            id: art.id,
            title: art.title,
            excerpt: art.excerpt || "",
            image: art.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
            category: art.category?.name || "News",
            author: art.author || "Bharat Standard",
            date: new Date(art.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
            readMin: Math.ceil((art.content?.length || 0) / 1000) || 3
          }));
          setArticles(mapped);
        }

        if (listRes.success) {
          setListicles(listRes.data.slice(0, 3)); // Show top 3 featured listicles
        }

        if (catRes.success) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const lead = articles[0];
  const sideTrend = articles.slice(0, 5); // Show top 5 articles including the lead
  const feed = articles.slice(0, 10);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 container-bs py-20 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <BreakingTicker />

      <main className="flex-1">
        {/* HERO */}
        {lead && (
          <section className="container-bs py-8 grid lg:grid-cols-3 gap-8 animate-fade-in">
            <Link
              to="/article/$id"
              params={{ id: lead.id }}
              className="lg:col-span-2 group block"
            >
              <div className="img-zoom bg-surface mb-5 overflow-hidden aspect-[16/9] md:aspect-[21/9] max-h-[450px]">
                <img
                  src={lead.image}
                  alt={lead.title}
                  className="w-full h-full object-cover"
                  width={1280}
                  height={720}
                />
              </div>
              <span className="eyebrow">{lead.category} · Top story</span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight mt-2 text-ink group-hover:text-primary transition-colors">
                {lead.title}
              </h1>
              <p className="text-base md:text-lg text-ink-muted mt-4 max-w-3xl leading-relaxed">
                {lead.excerpt}
              </p>
              <p className="text-xs text-ink-muted mt-3">
                {lead.author} · {lead.date} · {lead.readMin} min read
              </p>
            </Link>

            <div className="lg:border-l lg:border-rule lg:pl-8">
              <h3 className="section-title">Trending now</h3>
              <ul className="divide-y divide-rule">
                {sideTrend.length > 0 ? sideTrend.map((a, i) => (
                  <li key={a.id} className="py-4 first:pt-0">
                    <Link
                      to="/article/$id"
                      params={{ id: a.id }}
                      className="group flex gap-4"
                    >
                      <span className="font-serif text-2xl font-bold text-primary leading-none">
                        0{i + 1}
                      </span>
                      <div>
                        <span className="eyebrow">{a.category}</span>
                        <h4 className="font-serif text-base font-bold leading-snug mt-1 text-ink group-hover:text-primary transition-colors line-clamp-2">
                          {a.title}
                        </h4>
                      </div>
                    </Link>
                  </li>
                )) : (
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-8 h-8 bg-surface" />
                        <div className="flex-1 space-y-2">
                          <div className="h-2 w-16 bg-surface" />
                          <div className="h-4 w-full bg-surface" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ul>
              <Link
                to="/latest"
                className="inline-flex items-center mt-4 text-sm font-bold text-primary hover:underline"
              >
                View all latest news →
              </Link>
            </div>
          </section>
        )}

        {/* MAIN FEED + SIDEBAR */}
        <section className="container-bs py-8 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="section-title">Latest in business</h2>
            <div className="space-y-5">
              {feed.length > 0 ? (
                feed.map((a) => (
                  <ArticleCard key={a.id} a={a} variant="row" />
                ))
              ) : (
                !lead && <p className="italic text-ink-muted py-10 text-center col-span-full">No articles published yet.</p>
              )}
            </div>
          </div>
          <Sidebar />
        </section>

        {/* TOP FEATURED LISTICLES */}
        {listicles.length > 0 && (
          <section className="bg-surface border-y border-rule py-12">
            <div className="container-bs">
              <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
                <h2 className="section-title mb-0">Top Featured</h2>
                <Link to="/listicles" className="text-sm font-bold text-primary hover:underline">
                  Browse all listicles →
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listicles.map((l) => (
                  <Link
                    key={l.id}
                    to="/listicle/$slug"
                    params={{ slug: l.id }}
                    className="card-news block group animate-fade-up bg-background"
                  >
                    <div className="img-zoom bg-surface relative overflow-hidden">
                      <img
                        src={l.coverUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd"}
                        alt={l.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        width={1024}
                        height={640}
                      />
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                        Listicle
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl font-bold leading-snug text-ink group-hover:text-primary transition-colors">
                        {l.title}
                      </h3>
                      <p className="text-sm text-ink-muted mt-2 line-clamp-2">{l.intro}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CATEGORY BLOCKS */}
        {categories.slice(0, 3).map((catObj) => {
          const cat = catObj.name;
          const items = articles.filter((a) => a.category === cat).slice(0, 3);
          if (items.length === 0) return null;
          return (
            <section key={cat} className="container-bs py-10">
              <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
                <h2 className="section-title mb-0">{cat}</h2>
                <Link
                  to="/category/$cat"
                  params={{ cat: cat.toLowerCase() }}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  More in {cat} →
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {items.map((a) => (
                  <ArticleCard key={a.id} a={a} variant="stack" />
                ))}
              </div>
            </section>
          );
        })}

        {/* HERO BANNER strip */}
        <section className="relative h-[280px] md:h-[360px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop"
            alt="India policy and economy"
            className="absolute inset-0 w-full h-full object-cover"
            width={1600}
            height={1024}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          <div className="container-bs relative h-full flex items-center">
            <div className="max-w-xl animate-fade-up">
              <span className="eyebrow">Publish with Bharat Standard</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 leading-tight text-ink">
                Reach India’s most engaged business audience.
              </h2>
              <p className="text-ink-muted mt-3">
                PR articles and listicles starting at ₹2,000. Editor-reviewed, indexed within 24 hours.
              </p>
              <Link
                to="/publish"
                className="inline-flex items-center mt-5 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider px-5 py-3 hover:bg-primary/90 transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}


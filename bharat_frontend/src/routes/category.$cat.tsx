import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArticleCard } from "@/components/article-card";
import { Sidebar } from "@/components/sidebar";
import { publicService } from "@/services/public.service";

export const Route = createFileRoute("/category/$cat")({
  loader: async ({ params }) => {
    try {
      const catRes = await publicService.getCategories();
      if (!catRes.success) throw notFound();

      const match = catRes.data.find((c: any) => c.name.toLowerCase() === params.cat.toLowerCase());
      if (!match) throw notFound();

      const artRes = await publicService.getArticles({ category: match.name });
      const items = (artRes.data || []).map((art: any) => ({
        id: art.id,
        title: art.title,
        excerpt: art.excerpt || "",
        image: art.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
        category: art.category?.name || match.name,
        author: art.author || "Bharat Standard",
        date: new Date(art.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        readMin: Math.ceil((art.content?.length || 0) / 1000) || 3
      }));

      return { category: match.name, items };
    } catch (error) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.category ?? "Category";
    return {
      meta: [
        { title: `${cat} News — Bharat Standard` },
        { name: "description", content: `Latest ${cat.toLowerCase()} news, analysis and reporting from Bharat Standard.` },
        { property: "og:title", content: `${cat} — Bharat Standard` },
        { property: "og:description", content: `Latest ${cat.toLowerCase()} news from India.` },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-bs py-24 text-center flex-1">
        <h1 className="font-serif text-4xl font-bold">Category not found</h1>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">Back to home</Link>
      </main>
      <SiteFooter />
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, items } = Route.useLoaderData();
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-bs py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <span className="eyebrow">Section</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mt-2 text-ink mb-8">{category}</h1>
          {items.length === 0 ? (
            <p className="text-ink-muted italic py-10">No stories in this category yet. Check back soon for updates from our newsroom.</p>
          ) : (
            <div className="space-y-5">
              {items.map((a: any) => (
                <ArticleCard key={a.id} a={a} variant="row" />
              ))}
            </div>
          )}
        </div>
        <Sidebar />
      </main>
      <SiteFooter />
    </div>
  );
}

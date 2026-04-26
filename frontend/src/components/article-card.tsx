import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/news-data";

export function ArticleCard({ a, variant = "row" }: { a: any; variant?: "row" | "stack" }) {
  if (variant === "stack") {
    return (
      <Link
        to="/article/$id"
        params={{ id: a.id }}
        className="card-news block group animate-fade-up"
      >
        <div className="img-zoom aspect-[16/10] bg-surface">
          <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover" width={1024} height={640} />
        </div>
        <div className="p-4">
          <span className="eyebrow">{a.category}</span>
          <h3 className="font-serif text-lg md:text-xl font-bold mt-2 leading-snug text-ink group-hover:text-primary transition-colors">
            {a.title}
          </h3>
          <p className="text-sm text-ink-muted mt-2 line-clamp-2">{a.excerpt}</p>
          <p className="text-xs text-ink-muted mt-3">{a.author} · {a.date} · {a.readMin} min read</p>
        </div>
      </Link>
    );
  }
  return (
    <Link
      to="/article/$id"
      params={{ id: a.id }}
      className="card-news grid sm:grid-cols-[200px_1fr] gap-4 p-3 group animate-fade-up"
    >
      <div className="img-zoom aspect-[16/10] sm:aspect-[4/3] bg-surface">
        <img src={a.image} alt={a.title} loading="lazy" className="w-full h-full object-cover" width={400} height={300} />
      </div>
      <div>
        <span className="eyebrow">{a.category}</span>
        <h3 className="font-serif text-lg md:text-xl font-bold mt-1.5 leading-snug text-ink group-hover:text-primary transition-colors">
          {a.title}
        </h3>
        <p className="text-sm text-ink-muted mt-2 line-clamp-2">{a.excerpt}</p>
        <p className="text-xs text-ink-muted mt-3">{a.author} · {a.date} · {a.readMin} min read</p>
      </div>
    </Link>
  );
}

import { breakingNews } from "@/lib/news-data";

export function BreakingTicker() {
  const items = [...breakingNews, ...breakingNews];
  return (
    <div className="border-y border-rule bg-background">
      <div className="container-bs flex items-stretch">
        <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-2 flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Breaking
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-10 py-2 whitespace-nowrap animate-ticker text-sm text-ink">
            {items.map((t, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="w-1 h-1 bg-primary rounded-full" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Check } from "lucide-react";

export const Route = createFileRoute("/publish")({
  head: () => ({
    meta: [
      { title: "Publish with Bharat Standard — PR Articles & Listicles" },
      { name: "description", content: "Publish PR articles and listicles on Bharat Standard. Editor-reviewed, indexed within 24 hours. Plans from ₹2,000." },
      { property: "og:title", content: "Publish with Bharat Standard" },
      { property: "og:description", content: "Reach India’s most engaged business audience." },
    ],
  }),
  component: PublishPage,
});

const plans = [
  {
    name: "PR Article",
    price: "₹2,000",
    desc: "Single brand or founder story.",
    features: ["Editor-reviewed copy", "1 featured image", "Permanent URL", "Indexed within 24 hours", "Social share kit"],
  },
  {
    name: "Listicle Feature",
    price: "₹3,000",
    desc: "Be featured in a Top 5 / Top 10 list.",
    features: ["Curated alongside peers", "High-authority backlinks", "Image + 120-word profile", "Premium placement", "Cross-promotion"],
    highlight: true,
  },
  {
    name: "Premium Spotlight",
    price: "₹4,000",
    desc: "Dedicated long-form coverage.",
    features: ["Up to 1,200 words", "3 images + pull-quotes", "Homepage placement (24h)", "Newsletter mention", "Analytics report"],
  },
];

function PublishPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-surface border-b border-rule">
          <div className="container-bs py-14 max-w-3xl">
            <span className="eyebrow">Publish with us</span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mt-2">
              Get your story in front of India’s decision-makers.
            </h1>
            <p className="text-lg text-ink-muted mt-4 leading-relaxed">
              Bharat Standard publishes founder-led PR articles and curated listicles for Indian
              startups, brands and entrepreneurs. Editor-reviewed, search-indexed, and read by
              investors and operators across the country.
            </p>
          </div>
        </section>

        <section className="container-bs py-12">
          <h2 className="section-title">Choose a plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`card-news p-6 flex flex-col ${p.highlight ? "border-primary border-2" : ""}`}
              >
                {p.highlight && (
                  <span className="self-start eyebrow mb-3">Most popular</span>
                )}
                <h3 className="font-serif text-2xl font-bold">{p.name}</h3>
                <p className="text-ink-muted text-sm mt-1">{p.desc}</p>
                <p className="font-serif text-4xl font-bold text-primary mt-4">{p.price}</p>
                <p className="text-xs text-ink-muted">per published piece</p>
                <ul className="mt-5 space-y-2 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex justify-center bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider px-5 py-3 hover:bg-primary/90 transition-colors"
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

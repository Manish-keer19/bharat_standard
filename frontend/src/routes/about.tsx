import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Bharat Standard" },
      { name: "description", content: "Bharat Standard is an independent business news platform covering the Indian economy." },
      { property: "og:title", content: "About Bharat Standard" },
      { property: "og:description", content: "Independent business journalism for India’s decision-makers." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-bs py-12 max-w-3xl">
        <span className="eyebrow">About us</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mt-2">An independent voice in Indian business journalism.</h1>
        <div className="prose prose-lg max-w-none mt-6 space-y-5 text-ink leading-relaxed">
          <p>
            Bharat Standard is an independent business news platform headquartered in New Delhi.
            Our newsroom covers the companies, markets, policy and people that shape India’s economy
            — with rigour, fairness and a deep institutional memory.
          </p>
          <p>
            Founded by a group of former editors and reporters from India’s leading financial dailies,
            we publish daily reporting across business, startups, finance, technology and economy,
            alongside curated rankings and long-form analysis.
          </p>
          <p>
            Our work is read by founders, investors, policymakers and senior executives across India.
            We hold ourselves to the standards of the country’s most respected mastheads, and operate
            under a published editorial code.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

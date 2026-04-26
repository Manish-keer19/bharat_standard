import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Bharat Standard" },
      { name: "description", content: "Reach the Bharat Standard newsroom, advertising and partnerships team." },
      { property: "og:title", content: "Contact Bharat Standard" },
      { property: "og:description", content: "Get in touch with our newsroom and partnerships team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container-bs py-12 grid md:grid-cols-2 gap-12 max-w-5xl">
        <div>
          <span className="eyebrow">Get in touch</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mt-2">Contact us</h1>
          <p className="text-ink-muted mt-4 leading-relaxed">
            For news tips, story pitches, partnerships or advertising enquiries, write to the relevant desk below.
            We respond within one business day.
          </p>
          <ul className="mt-6 space-y-4 text-sm">
            <li className="flex gap-3"><Mail className="w-5 h-5 text-primary mt-0.5" /><span><strong className="block">Newsroom</strong> newsroom@bharatstandard.in</span></li>
            <li className="flex gap-3"><Mail className="w-5 h-5 text-primary mt-0.5" /><span><strong className="block">Advertising & PR</strong> partners@bharatstandard.in</span></li>
            <li className="flex gap-3"><Phone className="w-5 h-5 text-primary mt-0.5" /><span><strong className="block">Phone</strong> +91 11 4000 0000</span></li>
            <li className="flex gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5" /><span><strong className="block">Office</strong> 4th Floor, Connaught Place, New Delhi 110001</span></li>
          </ul>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="card-news p-6 space-y-4 bg-background">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">Full name</label>
            <input className="mt-1 w-full border border-rule px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">Email</label>
            <input type="email" className="mt-1 w-full border border-rule px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">Subject</label>
            <input className="mt-1 w-full border border-rule px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-ink-muted">Message</label>
            <textarea rows={5} className="mt-1 w-full border border-rule px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <button className="bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider px-5 py-3 hover:bg-primary/90 w-full">
            Send message
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo-bharat-standard.jpeg";

export function SiteFooter() {
  return (
    <footer className="bg-surface border-t border-rule mt-16">
      <div className="container-bs py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logo} alt="Bharat Standard" className="h-9 w-auto mb-4" width={280} height={70} />
          <p className="text-sm text-ink-muted max-w-md leading-relaxed">
            Bharat Standard is an independent business news platform covering the companies, markets and
            policy decisions that shape the Indian economy. Authoritative reporting, sharp analysis,
            trusted by India’s decision-makers.
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="w-9 h-9 inline-flex items-center justify-center border border-rule bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">Sections</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link to="/category/$cat" params={{ cat: "business" }} className="hover:text-primary">Business</Link></li>
            <li><Link to="/category/$cat" params={{ cat: "startups" }} className="hover:text-primary">Startups</Link></li>
            <li><Link to="/category/$cat" params={{ cat: "finance" }} className="hover:text-primary">Finance</Link></li>
            <li><Link to="/category/$cat" params={{ cat: "technology" }} className="hover:text-primary">Technology</Link></li>
            <li><Link to="/category/$cat" params={{ cat: "economy" }} className="hover:text-primary">Economy</Link></li>
            <li><Link to="/listicles" className="hover:text-primary">Listicles</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link to="/about" className="hover:text-primary">About us</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/publish" className="hover:text-primary">Publish with us</Link></li>
            <li><a href="#" className="hover:text-primary">Editorial code</a></li>
            <li><a href="#" className="hover:text-primary">Privacy policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="container-bs py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} Bharat Standard. All rights reserved.</p>
          <p>An independent business news platform · New Delhi</p>
        </div>
      </div>
    </footer>
  );
}

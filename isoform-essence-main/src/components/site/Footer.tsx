import { Link } from "@tanstack/react-router";

export const CONTACT_EMAIL = "hello@isoform.studio";

const socials = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "Behance", href: "https://behance.net/" },
];

export function Footer() {
  return (
    <footer className="on-ink bg-ink text-ivory">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-2xl font-semibold uppercase tracking-[0.3em]">Isoform</p>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Independent digital studio. Websites and experiences shaped with intention.
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <p className="eyebrow">Index</p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                { to: "/work", label: "Work" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact Us" },
                { to: "/start-project", label: "Start a Project" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-underline hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-4 space-y-2 text-sm">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow">Enquiries</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline mt-4 block text-sm hover:text-accent">
              {CONTACT_EMAIL}
            </a>
            <p className="mt-2 text-xs text-muted-foreground">Placeholder address — update once configured.</p>
          </div>
        </div>

        <div className="rule-t mt-14 flex flex-wrap items-center justify-between gap-4 pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ISOFORM. All rights reserved.</p>
          <p className="eyebrow">Precision · Form · Craft</p>
        </div>
      </div>
    </footer>
  );
}

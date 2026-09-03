import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const links = [
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[90] transition-all duration-500",
        scrolled ? "backdrop-blur-md" : "",
      )}
      style={scrolled ? { backgroundColor: "color-mix(in oklab, var(--background) 78%, transparent)" } : undefined}
    >
      <div
        className={cn(
          "shell flex items-center justify-between transition-all duration-500",
          scrolled ? "py-3.5 rule-b" : "py-6",
        )}
      >
        <Link
          to="/"
          className="font-display text-sm font-semibold uppercase tracking-[0.32em] leading-none"
          aria-label="ISOFORM — home"
        >
          Isoform
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="link-underline text-sm text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ "data-active": "true", className: "link-underline text-sm text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/start-project"
            className="group inline-flex items-center gap-2 border border-foreground/25 px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
          >
            Start a Project
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="eyebrow md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="rule-t bg-background px-5 pb-8 pt-4 md:hidden"
      >
        <nav className="flex flex-col" aria-label="Mobile">
          {[...links, { to: "/start-project", label: "Start a Project" } as const].map((link, i) => (
            <Link
              key={`${link.to}-${i}`}
              to={link.to}
              className="rule-b py-4 display-md"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

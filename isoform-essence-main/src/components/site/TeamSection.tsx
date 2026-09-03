import { Reveal } from "./Reveal";
import { CONTACT_EMAIL } from "./Footer";
import { TEAM_MEMBERS } from "@/lib/team";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.17-.47-.29" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function TeamSection() {
  return (
    <section className="on-ink bg-ink py-20 text-ivory md:py-28" aria-label="Studio Team">
      <div className="shell">
        <div className="rule-t grid gap-12 pt-12 md:grid-cols-3 md:gap-8">
          {TEAM_MEMBERS.map((person, idx) => (
            <Reveal key={person.id} delay={idx * 0.1} className="flex flex-col justify-between">
              <div>
                {/* Image Space */}
                <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-ivory/10 bg-card/10">
                  {person.image ? (
                    <img
                      src={person.image}
                      alt={person.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted/20 text-xs uppercase tracking-widest text-muted-foreground">
                      Photo Placeholder
                    </div>
                  )}

                  {/* Status Tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-sm bg-ink/80 px-2.5 py-1 text-[11px] uppercase tracking-wider backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    <span>In Studio</span>
                  </div>
                </div>

                {/* Person Info */}
                <div className="mt-6">
                  <div className="flex items-baseline justify-between">
                    <p className="eyebrow">{person.role}</p>
                    {person.location && <span className="text-xs text-muted-foreground">{person.location}</span>}
                  </div>
                  <h3 className="display-md mt-2 text-ivory transition-colors hover:text-accent">
                    {person.name}
                  </h3>
                </div>

                {/* What they are doing right now */}
                <div className="mt-4 rounded-sm border border-ivory/10 bg-ivory/5 p-4">
                  <p className="eyebrow text-accent">Currently Working On</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/80">
                    {person.currentActivity}
                  </p>
                </div>
              </div>

              {/* Social / Contact Action Buttons (Instagram, WhatsApp, LinkedIn) */}
              <div className="mt-6 flex items-center gap-2.5 border-t border-ivory/10 pt-4">
                <a
                  href={person.instagram || "https://instagram.com/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${person.name}'s Instagram`}
                  className="group/btn flex h-9 w-9 items-center justify-center rounded-sm border border-ivory/20 bg-ivory/5 text-ivory/80 transition-all hover:border-accent hover:bg-accent/15 hover:text-accent"
                  title="Instagram"
                >
                  <InstagramIcon className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                </a>
                <a
                  href={person.whatsapp || "https://wa.me/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${person.name}'s WhatsApp`}
                  className="group/btn flex h-9 w-9 items-center justify-center rounded-sm border border-ivory/20 bg-ivory/5 text-ivory/80 transition-all hover:border-accent hover:bg-accent/15 hover:text-accent"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                </a>
                <a
                  href={person.linkedin || "https://linkedin.com/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${person.name}'s LinkedIn`}
                  className="group/btn flex h-9 w-9 items-center justify-center rounded-sm border border-ivory/20 bg-ivory/5 text-ivory/80 transition-all hover:border-accent hover:bg-accent/15 hover:text-accent"
                  title="LinkedIn"
                >
                  <LinkedInIcon className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Studio General Reach */}
        <div className="rule-t mt-20 grid gap-8 pt-12 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <p className="eyebrow">General Enquiries</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="link-underline mt-3 block text-xl font-medium text-ivory hover:text-accent md:text-2xl"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-2 text-xs text-muted-foreground">
              For general studio questions, speaking engagements, and press.
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-7">
            <p className="eyebrow">Have a new project?</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              If you are looking to initiate a build, consultation, or retainer with ISOFORM, please use our project intake form.
            </p>
            <a
              href="/start-project"
              className="group mt-5 inline-flex items-center gap-3 border border-ivory/30 px-5 py-2.5 text-sm text-ivory transition-colors hover:border-accent hover:text-accent"
            >
              <span>Fill Project Form</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1.5">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

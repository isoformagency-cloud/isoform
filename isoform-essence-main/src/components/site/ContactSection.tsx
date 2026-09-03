import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT_EMAIL } from "./Footer";

const schema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  company: z.string().trim().max(160).optional().default(""),
  budget: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(10, "A little more detail, please").max(4000),
});

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  { name: "budget", label: "Budget range", type: "text", autoComplete: "off" },
] as const;

export function ContactSection({ heading = true }: { heading?: boolean }) {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setPending(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setPending(false);

    if (error) {
      toast.error("Something went wrong. Please email us directly.");
      return;
    }
    form.reset();
    toast.success("Enquiry received. We reply within two working days.");
  }

  return (
    <section
      className="on-ink bg-ink py-24 text-ivory md:py-36"
      {...(heading ? { "aria-labelledby": "contact-title" } : { "aria-label": "Contact form" })}
    >
      <div className="shell">
        {heading ? (
          <>
            <p className="eyebrow">05 — Contact</p>
            <h2 id="contact-title" className="display-xl mt-8">
              Have a project
              <br />
              in mind? <span className="text-accent">Let's shape it.</span>
            </h2>
          </>
        ) : null}

        <div className="rule-t mt-16 grid gap-14 pt-12 md:grid-cols-12">
          <div className="md:col-span-4 space-y-8">
            <div>
              <p className="eyebrow">Direct</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="link-underline mt-2 block text-lg hover:text-accent">
                {CONTACT_EMAIL}
              </a>
              <p className="mt-2 text-xs text-muted-foreground">
                Placeholder address — replace once the studio domain is configured.
              </p>
            </div>
            <div>
              <p className="eyebrow">Elsewhere</p>
              <ul className="mt-2 space-y-1 text-sm">
                {["Instagram", "LinkedIn", "Behance"].map((s) => (
                  <li key={s}>
                    <a
                      href="https://example.com"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-underline hover:text-accent"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tell us about the brand, the timeline and what success looks like. Short notes are welcome.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate className="md:col-span-7 md:col-start-6">
            <div className="grid gap-8 md:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.name} className={field.name === "name" || field.name === "email" ? "" : ""}>
                  <label htmlFor={field.name} className="eyebrow">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    aria-invalid={Boolean(errors[field.name])}
                    aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                    className="mt-2 w-full border-b border-input bg-transparent py-2 text-base outline-none transition-colors focus:border-accent"
                  />
                  {errors[field.name] ? (
                    <p id={`${field.name}-error`} className="mt-2 text-xs text-accent">
                      {errors[field.name]}
                    </p>
                  ) : null}
                </div>
              ))}

              <div className="md:col-span-2">
                <label htmlFor="message" className="eyebrow">
                  Project
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  maxLength={4000}
                  aria-invalid={Boolean(errors["message"])}
                  aria-describedby={errors["message"] ? "message-error" : undefined}
                  className="mt-2 w-full resize-none border-b border-input bg-transparent py-2 text-base outline-none transition-colors focus:border-accent"
                />
                {errors["message"] ? (
                  <p id="message-error" className="mt-2 text-xs text-accent">
                    {errors["message"]}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="group mt-10 inline-flex items-center gap-3 border border-ivory/30 px-6 py-3 text-sm transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {pending ? "Sending…" : "Send enquiry"}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1.5">
                →
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

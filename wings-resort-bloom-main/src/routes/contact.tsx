import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Car,
  Plane,
  Train,
  CheckCircle2,
  Send,
  MessageSquare,
} from "lucide-react";
import cottageWarm from "@/assets/gallery-dining.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Location — Wings Resort Ooty" },
      {
        name: "description",
        content:
          "Find contact information, location map, and travel directions for Wings Resort in Ooty, Nilgiris.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  useReveal();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please provide your name, email, and message.");
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar transparentOnTop={true} />
      <PageHeader
        eyebrow="Get in Touch"
        title="Come up the hill."
        subtitle="We are ten minutes from Ooty lake, nestled along quiet tea-terraced slopes. Reach out with questions or custom stay requests."
        backgroundImage={cottageWarm}
      />

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1.3fr] lg:items-start">
            {/* Contact Details Column */}
            <div className="reveal space-y-8">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-secondary">
                  Our Sanctuary
                </p>
                <h2 className="mt-2 font-display text-3xl md:text-4xl text-primary">
                  We look forward to welcoming you.
                </h2>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                  Whether you are planning a romantic hillside getaway, a creative writing retreat,
                  or a family celebration, our local team is here to assist.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="rounded-lg bg-primary/10 p-3 text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-primary">Resort Address</h4>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      Havelock Road, Off Ooty–Coonoor Highway,
                      <br />
                      The Nilgiris, Tamil Nadu 643001, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="rounded-lg bg-primary/10 p-3 text-primary shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-primary">Phone & WhatsApp</h4>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      Reservations: <strong className="text-foreground">+91 98 4000 0000</strong>
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Front Desk: <strong className="text-foreground">+91 98 4000 0001</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="rounded-lg bg-primary/10 p-3 text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-primary">Email Inquiries</h4>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      Bookings: <strong className="text-foreground">stay@wingsresort.in</strong>
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Support: <strong className="text-foreground">concierge@wingsresort.in</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="rounded-lg bg-primary/10 p-3 text-primary shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-primary">Front Desk & Security</h4>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      Open 24 Hours · 7 Days a week
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form Column */}
            <div className="reveal">
              {sent ? (
                <div className="rounded-2xl border border-primary/20 bg-card p-8 md:p-12 text-center shadow-lg">
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl text-primary">Message Sent Successfully!</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Thank you, <strong className="text-foreground">{name}</strong>. Our concierge
                    desk will get back to you at <strong className="text-foreground">{email}</strong>{" "}
                    shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setName("");
                      setEmail("");
                      setPhone("");
                      setMessage("");
                    }}
                    className="mt-6 rounded-full bg-primary px-6 py-2.5 text-xs font-medium text-primary-foreground hover:bg-secondary transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-secondary" />
                    <h3 className="font-display text-xl text-primary">Send Us a Message</h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Your Name">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Sundaram"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                      />
                    </Field>

                    <Field label="Email Address">
                      <input
                        type="email"
                        required
                        placeholder="e.g. priya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone Number (Optional)">
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                      />
                    </Field>

                    <Field label="Subject">
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Group / Event Booking">Group / Event Booking</option>
                        <option value="Honeymoon Package">Honeymoon Package</option>
                        <option value="Transportation Request">Transportation Request</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Your Message">
                    <textarea
                      rows={5}
                      required
                      placeholder="Tell us about your upcoming travel plans or questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                    />
                  </Field>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-secondary active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Travel Directions / How to Reach */}
          <div className="reveal mt-20 pt-16 border-t border-border">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs uppercase tracking-[0.35em] text-secondary">Travel Guide</p>
              <h3 className="mt-2 font-display text-3xl text-primary">How to Reach Wings Resort</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ooty is well-connected by road, rail, and nearby international airports.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="inline-flex p-3 rounded-xl bg-secondary/10 text-secondary mb-4">
                  <Plane className="h-6 w-6" />
                </div>
                <h4 className="font-display text-lg text-primary">By Air</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  <strong>Coimbatore Airport (CJB)</strong> is 88 km away (~3 hours drive via scenic
                  ghat roads). We can arrange private airport taxi pickups upon advance notice.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="inline-flex p-3 rounded-xl bg-secondary/10 text-secondary mb-4">
                  <Train className="h-6 w-6" />
                </div>
                <h4 className="font-display text-lg text-primary">By Heritage Train</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  <strong>Ooty Railway Station (UAM)</strong> is only 4.5 km away. Experience the UNESCO
                  Nilgiri Mountain Toy Train from Mettupalayam.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="inline-flex p-3 rounded-xl bg-secondary/10 text-secondary mb-4">
                  <Car className="h-6 w-6" />
                </div>
                <h4 className="font-display text-lg text-primary">By Road</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Direct highway drives: <strong>Bangalore</strong> (275 km, ~6 hrs via Bandipur),{" "}
                  <strong>Mysore</strong> (125 km, ~3.5 hrs), or <strong>Kochi</strong> (270 km, ~7 hrs).
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { ROOMS } from "@/lib/data";
import {
  Users,
  Maximize2,
  Bed,
  Wifi,
  Coffee,
  Flame,
  Sparkles,
  TreePine,
  Car,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import cottageAframe from "@/assets/room-cottage.jpg";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Rooms & Cottages — Wings Resort Ooty" },
      {
        name: "description",
        content:
          "Explore our handcrafted wooden cottages, A-frame chalets, and heritage suites wrapped in the Nilgiri pine mist.",
      },
    ],
  }),
  component: RoomsPage,
});

function RoomsPage() {
  useReveal();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar transparentOnTop={true} />
      <PageHeader
        eyebrow="Accommodations"
        title="Six ways to stay in the mist."
        subtitle="From honeymoon chalets to family suites — every room is finished in local pinewood and warmed by hand-woven throws."
        backgroundImage={cottageAframe}
      />

      <main className="flex-1">
        {/* Rooms Grid Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {ROOMS.map((r) => (
              <article
                key={r.id}
                className="reveal group flex flex-col justify-between overflow-hidden rounded-2xl bg-card border border-border/70 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={r.image}
                      alt={r.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-medium text-primary shadow-sm">
                      <Users className="h-3.5 w-3.5" />
                      <span>{r.guests} guests</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      {r.size && (
                        <span className="inline-flex items-center gap-1">
                          <Maximize2 className="h-3 w-3" />
                          {r.size}
                        </span>
                      )}
                      {r.bedType && (
                        <span className="inline-flex items-center gap-1">
                          <Bed className="h-3 w-3" />
                          {r.bedType}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-2xl text-primary">{r.name}</h3>
                    <p className="mt-2 text-sm font-medium text-secondary">{r.tagline}</p>
                    {r.description && (
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {r.description}
                      </p>
                    )}

                    <div className="mt-5 pt-4 border-t border-border/60">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Key Amenities
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {r.features.map((f) => (
                          <li
                            key={f}
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground"
                          >
                            <CheckCircle2 className="h-3 w-3 text-secondary" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex items-end justify-between border-t border-border/60 pt-4">
                    <div>
                      <div className="font-display text-2xl font-bold text-primary">
                        ₹{r.price.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                        per night + taxes
                      </div>
                    </div>
                    <Link
                      to="/book"
                      search={{ room: r.name }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-secondary active:scale-95 shadow-sm"
                    >
                      <span>Reserve</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Inclusions & Highlights */}
        <section className="bg-muted/40 border-y border-border py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="reveal text-center max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-[0.35em] text-secondary">
                Included with every stay
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-primary">
                The Wings Hospitality Standard
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We believe genuine mountain hospitality is found in the quiet, thoughtful details.
              </p>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Coffee,
                  title: "Verandah Filter Coffee & Tea",
                  desc: "Fresh estate Nilgiri tea and hand-pulled South Indian filter coffee brewed every sunrise.",
                },
                {
                  icon: Flame,
                  title: "Evening Campfire Gatherings",
                  desc: "Nightly wood fire under the eucalyptus groves with acoustic music and roasted treats.",
                },
                {
                  icon: Wifi,
                  title: "High-Speed Optical Wi-Fi",
                  desc: "Reliable fiber connectivity throughout the main house and private cottages for remote work.",
                },
                {
                  icon: TreePine,
                  title: "Private Tea Trail Access",
                  desc: "Direct private pedestrian paths through three acres of aromatic gardens and sloping tea shrubs.",
                },
                {
                  icon: Sparkles,
                  title: "Daily Housekeeping & Turndown",
                  desc: "Meticulous daily cleaning, fresh hill linen, botanical toiletries, and cozy evening turndown.",
                },
                {
                  icon: Car,
                  title: "Secured Valet & Self Parking",
                  desc: "Ample on-premises gated parking with 24/7 security and EV charging assistance.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="reveal flex items-start gap-4 rounded-xl bg-card p-6 border border-border/50 shadow-sm"
                  >
                    <div className="rounded-lg bg-secondary/10 p-3 text-secondary shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-semibold text-primary">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="reveal mt-14 text-center">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-3.5 text-sm font-semibold text-secondary-foreground shadow-md hover:bg-secondary/90 transition-all active:scale-95"
              >
                <span>Book Your Room Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

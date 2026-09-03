import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useReveal } from "@/hooks/use-reveal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { ROOMS } from "@/lib/data";
import {
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Info,
} from "lucide-react";
import heroImg from "@/assets/hero-resort.jpg";

const searchSchema = z.object({
  room: z.string().optional(),
});

export const Route = createFileRoute("/book")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Book Your Stay — Wings Resort Ooty" },
      {
        name: "description",
        content:
          "Reserve your cottage or heritage suite at Wings Resort in Ooty. Direct booking with best rate guarantee.",
      },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  useReveal();
  const search = Route.useSearch();

  // Booking details
  const [checkIn, setCheckIn] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const next = new Date();
    next.setDate(next.getDate() + 3);
    return next.toISOString().split("T")[0];
  });
  const [guests, setGuests] = useState(2);
  const [roomName, setRoomName] = useState(() => {
    if (search.room && ROOMS.some((r) => r.name === search.room)) {
      return search.room;
    }
    return ROOMS[0].name;
  });

  // Guest details
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  useEffect(() => {
    if (search.room && ROOMS.some((r) => r.name === search.room)) {
      setRoomName(search.room);
    }
  }, [search.room]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(ms / 86400000));
  }, [checkIn, checkOut]);

  const selectedRoom = ROOMS.find((r) => r.name === roomName) || ROOMS[0];
  const subtotal = selectedRoom.price * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      alert("Please fill in your name, email, and phone number.");
      return;
    }
    const ref = `WNG-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setSubmitted(true);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar transparentOnTop={true} />
      <PageHeader
        eyebrow="Reserve"
        title="Plan your stay in the mist."
        subtitle="Direct bookings come with complimentary breakfast, estate welcome tea, and priority room allocation."
        backgroundImage={heroImg}
      />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          {submitted ? (
            /* Confirmation Screen */
            <div className="reveal mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-card p-8 md:p-12 text-center shadow-xl">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-display text-3xl text-primary">
                Booking Request Received!
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base">
                Thank you, <strong className="text-foreground">{guestName}</strong>. Your reservation
                reference is{" "}
                <span className="rounded bg-secondary/15 px-2 py-1 font-mono font-bold text-secondary">
                  {bookingRef}
                </span>
                .
              </p>

              <div className="mt-8 rounded-xl bg-muted/50 p-6 text-left text-sm space-y-3">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Reserved Cottage:</span>
                  <span className="font-semibold text-primary">{selectedRoom.name}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Dates:</span>
                  <span className="font-semibold">
                    {checkIn} to {checkOut} ({nights} {nights === 1 ? "night" : "nights"})
                  </span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Guests:</span>
                  <span className="font-semibold">{guests} Guests</span>
                </div>
                <div className="flex justify-between text-base font-bold text-primary pt-1">
                  <span>Estimated Total (incl. taxes):</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
                Our front desk manager will contact you via WhatsApp/Email at{" "}
                <strong className="text-foreground">{guestPhone}</strong> within 60 minutes to
                confirm arrival arrangements and payment link.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-secondary transition-colors"
                >
                  Make Another Reservation
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form & Calculator */
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              {/* Form Column */}
              <form
                onSubmit={handleBookingSubmit}
                className="reveal space-y-8 rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-sm"
              >
                <div>
                  <h3 className="font-display text-2xl text-primary">1. Stay Details</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Select your preferred travel dates and room configuration.
                  </p>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field label="Check-in Date">
                      <input
                        type="date"
                        required
                        value={checkIn}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                      />
                    </Field>
                    <Field label="Check-out Date">
                      <input
                        type="date"
                        required
                        value={checkOut}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                      />
                    </Field>
                    <Field label="Number of Guests">
                      <input
                        type="number"
                        min={1}
                        max={8}
                        required
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                      />
                    </Field>
                    <Field label="Selected Room / Cottage">
                      <select
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                      >
                        {ROOMS.map((r) => (
                          <option key={r.name} value={r.name}>
                            {r.name} (₹{r.price.toLocaleString("en-IN")}/nt)
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <h3 className="font-display text-2xl text-primary">2. Guest Details</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We&apos;ll send confirmation and direction details to this contact.
                  </p>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Krishnan"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                      />
                    </Field>
                    <Field label="Email Address">
                      <input
                        type="email"
                        required
                        placeholder="e.g. ramesh@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Phone / WhatsApp Number">
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Special Requests or Arrival Notes (Optional)">
                        <textarea
                          rows={3}
                          placeholder="Late check-in, dietary preferences, anniversary decor..."
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none"
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!nights}
                  className="w-full rounded-full bg-secondary py-4 text-sm font-semibold text-secondary-foreground shadow-md transition-all hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                >
                  Submit Reservation Request (₹{total.toLocaleString("en-IN")})
                </button>
              </form>

              {/* Booking Summary Sidebar */}
              <aside className="reveal space-y-6">
                <div className="rounded-2xl bg-muted/60 border border-border p-6 shadow-sm">
                  <h4 className="font-display text-xl text-primary">Booking Summary</h4>
                  <div className="mt-4 overflow-hidden rounded-xl bg-card border border-border">
                    <img
                      src={selectedRoom.image}
                      alt={selectedRoom.name}
                      className="h-36 w-full object-cover"
                    />
                    <div className="p-4">
                      <div className="font-display text-base font-semibold text-primary">
                        {selectedRoom.name}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedRoom.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5 text-sm">
                    <Row k="Check-in" v={checkIn || "Select date"} />
                    <Row k="Check-out" v={checkOut || "Select date"} />
                    <Row k="Nights" v={nights ? `${nights} nights` : "0 nights"} />
                    <Row k="Guests" v={`${guests} guests`} />
                    <Row
                      k="Nightly Rate"
                      v={`₹${selectedRoom.price.toLocaleString("en-IN")}`}
                    />
                    <div className="my-3 h-px bg-border" />
                    <Row k="Subtotal" v={`₹${subtotal.toLocaleString("en-IN")}`} />
                    <Row k="GST (12%)" v={`₹${taxes.toLocaleString("en-IN")}`} />
                    <div className="mt-4 flex items-baseline justify-between rounded-lg bg-primary/10 p-3 text-primary">
                      <span className="font-medium text-sm">Estimated Total</span>
                      <span className="font-display text-2xl font-bold">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-secondary shrink-0" />
                    <span>No advance payment required upfront. Pay upon check-in.</span>
                  </div>
                </div>

                {/* Direct Help Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-secondary/10 p-2.5 text-secondary">
                      <PhoneCall className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="font-display text-sm font-semibold text-primary">
                        Need Custom Arrangements?
                      </h5>
                      <p className="text-xs text-muted-foreground">Speak directly with front desk</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm font-medium text-primary">
                    +91 98 4000 0000 / stay@wingsresort.in
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Booking Policies Section */}
          <div className="reveal mt-16 pt-12 border-t border-border">
            <h3 className="font-display text-2xl text-primary text-center">
              Important Stay Information
            </h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 font-medium text-sm text-primary mb-2">
                  <Clock className="h-4 w-4 text-secondary" />
                  <span>Check-in & Check-out</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Check-in from 2:00 PM. Check-out by 11:00 AM. Early check-in or late departure is
                  subject to cottage availability upon request.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 font-medium text-sm text-primary mb-2">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <span>Complimentary Perks</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All direct bookings include hot South Indian breakfast buffet, welcome tea, evening
                  bonfire access, and tea estate trail entry.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 font-medium text-sm text-primary mb-2">
                  <Info className="h-4 w-4 text-secondary" />
                  <span>Cancellation Policy</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Free cancellation up to 48 hours prior to check-in date. Cancellations within 48
                  hours incur a one-night charge.
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

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{k}</span>
      <span className="font-medium text-foreground">{v}</span>
    </div>
  );
}

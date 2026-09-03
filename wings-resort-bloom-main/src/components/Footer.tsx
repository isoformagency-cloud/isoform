import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="min-h-screen w-full flex flex-col justify-between border-t border-primary/20 bg-primary text-primary-foreground relative overflow-hidden px-6 py-12 md:py-16 snap-start">
      {/* Background Gradient & Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-black/90 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-secondary/15 blur-3xl pointer-events-none" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      {/* Top Section: Giant Brand Header & Booking CTA */}
      <div className="relative z-10 mx-auto w-full max-w-7xl pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-secondary font-semibold">
              The Nilgiri Sanctuary
            </span>
            <h2 className="mt-3 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white">
              WINGS RESORT
            </h2>
            <p className="mt-4 max-w-xl text-base md:text-lg text-white/80 leading-relaxed font-light">
              Tucked into Ooty&apos;s ancient pine slopes. Wooden chalets, heritage stone hearths, and warm hill hospitality for three generations.
            </p>
          </div>

          <div>
            <Link
              to="/book"
              className="inline-flex items-center gap-3 rounded-full bg-secondary px-8 py-4 text-base font-semibold text-secondary-foreground shadow-2xl transition-all hover:bg-secondary/90 hover:scale-105 active:scale-95"
            >
              <span>Reserve Your Stay</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Middle Columns: Quick Links, Contact, Room Collections */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 py-12">
          {/* Column 1: Accommodations */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] font-semibold text-secondary">
              Accommodations
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/rooms" className="text-white/75 hover:text-white transition-colors">
                  A-Frame Chalets
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-white/75 hover:text-white transition-colors">
                  Heritage Stone Suites
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-white/75 hover:text-white transition-colors">
                  Hillside Pinewood Cottages
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-white/75 hover:text-white transition-colors">
                  Family Garden Villas
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] font-semibold text-secondary">
              Navigation
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link to="/" className="text-white/75 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-white/75 hover:text-white transition-colors">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-white/75 hover:text-white transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-white/75 hover:text-white transition-colors">
                  Book Availability
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/75 hover:text-white transition-colors">
                  Location & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] font-semibold text-secondary">
              Get in Touch
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <span>Havelock Road, Off Ooty–Coonoor Hwy, Nilgiris, TN 643001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <span>+91 98 4000 0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-secondary shrink-0" />
                <span>stay@wingsresort.in</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Hill Hospitality Note */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] font-semibold text-secondary">
              Hill Sanctuary
            </h4>
            <p className="mt-5 text-xs sm:text-sm text-white/70 leading-relaxed">
              Mornings begin with filter coffee on the verandah and end with a bonfire under the eucalyptus. We look forward to welcoming you.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="relative z-10 mx-auto w-full max-w-7xl border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
        <p>© {new Date().getFullYear()} Wings Resort, Ooty — All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/rooms" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link to="/book" className="hover:text-white transition-colors">
            Booking Terms
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors">
            Guest Concierge
          </Link>
        </div>
      </div>
    </footer>
  );
}

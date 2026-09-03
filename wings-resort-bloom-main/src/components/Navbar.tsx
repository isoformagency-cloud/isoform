import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  transparentOnTop?: boolean;
}

export function Navbar({ transparentOnTop = true }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 24);

      if (currentScrollY <= 50) {
        setVisible(true);
      } else {
        if (currentScrollY > lastY && currentScrollY - lastY > 5) {
          // Scrolling down -> hide navbar (unless mobile menu is open)
          setVisible(false);
        } else if (lastY - currentScrollY > 5) {
          // Scrolling up -> show navbar
          setVisible(true);
        }
      }
      lastY = currentScrollY;
      setLastScrollY(currentScrollY);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Rooms", to: "/rooms" },
    { label: "Gallery", to: "/gallery" },
    { label: "Book", to: "/book" },
    { label: "Contact", to: "/contact" },
  ];

  const isTransparent = transparentOnTop && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${
        visible || mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
      } ${
        isTransparent
          ? "bg-transparent text-white"
          : "bg-background/90 backdrop-blur-md border-b border-border shadow-sm text-foreground"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span
            className={`font-display text-2xl font-semibold tracking-wide transition-colors ${
              isTransparent ? "text-white" : "text-primary"
            }`}
          >
            WINGS
          </span>
          <span
            className={`text-[10px] uppercase tracking-[0.3em] transition-colors ${
              isTransparent ? "text-white/75" : "text-muted-foreground"
            }`}
          >
            Resort · Ooty
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{
                className: isTransparent ? "text-white font-semibold" : "text-secondary font-semibold",
              }}
              inactiveProps={{
                className: isTransparent
                  ? "text-white/85 hover:text-white"
                  : "text-foreground/80 hover:text-secondary",
              }}
              className="text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/book"
            className="rounded-full bg-secondary px-5 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-all hover:bg-secondary/90 hover:shadow-md active:scale-95"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            isTransparent ? "text-white hover:bg-white/10" : "text-foreground hover:bg-muted"
          }`}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-foreground hover:text-secondary py-1"
            >
              Home
            </Link>
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                activeProps={{
                  className: "text-secondary font-semibold",
                }}
                inactiveProps={{
                  className: "text-foreground/80 hover:text-secondary",
                }}
                className="text-base font-medium py-1 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border">
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-full bg-secondary py-3 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/90"
              >
                Book Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

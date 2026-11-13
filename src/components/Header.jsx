import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { navLinks, site, whatsappUrl } from '../data/site.js';
import { services } from '../data/services.js';
import { heroTop, scrollToHero, useIntro } from '../lib/intro.jsx';
import { trackScroll } from '../lib/scroll.js';
import Button from './Button.jsx';
import { ArrowRight, ChevronDown, Close, Menu, WhatsApp } from './Icon.jsx';
import { Lockup } from './Logo.jsx';

const menuButton =
  'inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 pl-4 pr-3.5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-white/10';

// The bar itself. Rendered twice on the home page: once as the real fixed
// header, and once as a lifeless copy inside the intro's laptop screen
// (`decorative`), so the two line up exactly when the intro hands over.
export function HeaderBar({
  decorative = false,
  servicesOpen = false,
  menuOpen = false,
  onHomeClick,
  groupProps,
  onToggleServices,
  onChevronPointerDown,
  onToggleMenu,
  chevronRef,
  menuButtonRef,
}) {
  return (
    <div className="wrap relative flex h-[4.5rem] items-center justify-between lg:h-[5.5rem]">
      <div className="relative z-10 flex items-center gap-5">
        <Link to="/" onClick={onHomeClick} aria-label={`${site.name} home`} className="-m-2 rounded-lg p-2">
          <Lockup />
        </Link>
        <span className="hidden h-6 w-px bg-white/15 2xl:block" aria-hidden="true" />
        <span className="hidden whitespace-nowrap text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-muted 2xl:block">
          {site.tagline}
        </span>
      </div>

      <nav
        aria-label={decorative ? undefined : 'Main'}
        className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      >
        <ul className="nav-pill">
          <li className="nav-group relative flex items-center" data-open={servicesOpen} {...groupProps}>
            <NavLink to="/services" className="nav-link">
              Services
            </NavLink>
            <button
              type="button"
              ref={chevronRef}
              className="nav-chevron"
              aria-expanded={servicesOpen}
              aria-controls={decorative ? undefined : 'services-menu'}
              aria-label="Show all services"
              onPointerDown={onChevronPointerDown}
              onClick={onToggleServices}
            >
              <ChevronDown size={16} />
            </button>
            {decorative ? null : (
              <div id="services-menu" className="nav-dropdown">
                <ul>
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link to={`/services/${service.slug}`}>
                        <span className="text-xs tabular-nums text-faint">{service.number}</span>
                        <span className="text-[0.9375rem] font-medium text-white">{service.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-1 border-t border-line pt-1">
                  <Link to="/services">
                    <span className="text-brand-300">
                      <ArrowRight size={14} />
                    </span>
                    <span className="text-[0.9375rem] text-muted">All services</span>
                  </Link>
                </div>
              </div>
            )}
          </li>
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className="nav-link">
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative z-10 flex items-center gap-2.5">
        <Button to="/contact" size="sm" className="hidden sm:inline-flex">
          Start a project
        </Button>
        <button
          type="button"
          ref={menuButtonRef}
          className={`${menuButton} lg:hidden`}
          aria-expanded={menuOpen}
          aria-controls={decorative ? undefined : 'mobile-menu'}
          onClick={onToggleMenu}
        >
          Menu
          <Menu size={20} />
        </button>
      </div>
    </div>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const { introActive } = useIntro();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef(0);
  const restoreFocus = useRef(false);
  const chevronRef = useRef(null);
  const chevronPointer = useRef('');
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);

  // Navigating closes whatever was open. (Adjusted during render, React's
  // recommended way to reset state when a value changes, instead of an effect.)
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setServicesOpen(false);
    setMenuOpen(false);
  }

  // The dark scrim behind the header appears once the page has moved 24px past
  // the hero's top (on the home page with the intro, that's after the intro).
  // Uses the site's small shared scroll handler, not GSAP, so pages other than
  // home don't need GSAP at all.
  useEffect(
    () =>
      trackScroll(document.documentElement, (rect) => {
        setScrolled(-rect.top > heroTop() + 24);
      }),
    [pathname]
  );

  // Mobile menu: lock the page, keep focus inside, close on Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const root = document.documentElement;
    const menu = menuRef.current;
    const button = menuButtonRef.current;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    menu.querySelector('[data-close]')?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        restoreFocus.current = true;
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = menu.querySelectorAll('a[href], button:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia('(min-width: 64rem)');
    const onDesktop = () => desktop.matches && setMenuOpen(false);

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktop);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
      if (restoreFocus.current) button?.focus();
      restoreFocus.current = false;
    };
  }, [menuOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const onHomeClick = (event) => {
    if (pathname !== '/') return;
    event.preventDefault();
    setMenuOpen(false);
    scrollToHero();
  };

  // Hover opens the drop-down for a real mouse only. (Touch screens fire fake
  // hover events on tap, which would open the menu and then let the tap's click
  // close it straight away.)
  const groupProps = {
    onPointerEnter: (event) => {
      if (event.pointerType !== 'mouse') return;
      window.clearTimeout(closeTimer.current);
      setServicesOpen(true);
    },
    onPointerLeave: (event) => {
      if (event.pointerType !== 'mouse') return;
      window.clearTimeout(closeTimer.current);
      closeTimer.current = window.setTimeout(() => setServicesOpen(false), 160);
    },
    onBlur: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false);
    },
    onKeyDown: (event) => {
      if (event.key === 'Escape' && servicesOpen) {
        setServicesOpen(false);
        chevronRef.current?.focus();
      }
    },
  };

  return (
    <header className="site-header" data-intro={introActive ? 'hidden' : undefined} data-scrolled={scrolled}>
      <div className="header-scrim" aria-hidden="true" />
      <HeaderBar
        servicesOpen={servicesOpen}
        menuOpen={menuOpen}
        onHomeClick={onHomeClick}
        groupProps={groupProps}
        onChevronPointerDown={(event) => {
          chevronPointer.current = event.pointerType;
        }}
        onToggleServices={() => {
          // A mouse has already opened the menu by hovering, so its click must not
          // toggle it shut again. Keyboard (Enter/Space) and touch toggle as usual.
          const byMouse = chevronPointer.current === 'mouse';
          chevronPointer.current = '';
          setServicesOpen((open) => (byMouse ? true : !open));
        }}
        onToggleMenu={() => setMenuOpen(true)}
        chevronRef={chevronRef}
        menuButtonRef={menuButtonRef}
      />

      <div
        id="mobile-menu"
        ref={menuRef}
        className="mobile-menu lg:hidden"
        data-open={menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="wrap flex h-[4.5rem] flex-none items-center justify-between">
          <Link to="/" onClick={onHomeClick} aria-label={`${site.name} home`} className="-m-2 rounded-lg p-2">
            <Lockup />
          </Link>
          <button
            type="button"
            data-close
            className={menuButton}
            onClick={() => {
              restoreFocus.current = true;
              setMenuOpen(false);
            }}
          >
            Close
            <Close size={20} />
          </button>
        </div>

        <nav aria-label="Main" className="wrap flex-1 pb-6 pt-3">
          <ul>
            <li className="mobile-menu-item border-b border-line pb-3" style={{ '--i': 0 }}>
              <NavLink
                to="/services"
                end
                className="block py-3 text-[1.875rem] font-[450] leading-tight tracking-[-0.035em] text-white aria-[current=page]:text-brand-300"
              >
                Services
              </NavLink>
              <ul className="grid gap-x-6 sm:grid-cols-2">
                {services.map((service) => (
                  <li key={service.slug}>
                    <NavLink
                      to={`/services/${service.slug}`}
                      className="flex items-baseline gap-3 py-2 text-[1.0625rem] text-muted aria-[current=page]:text-brand-300"
                    >
                      <span className="text-xs tabular-nums text-faint">{service.number}</span>
                      {service.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            {navLinks.map((link, index) => (
              <li key={link.to} className="mobile-menu-item border-b border-line" style={{ '--i': index + 1 }}>
                <NavLink
                  to={link.to}
                  className="block py-3 text-[1.875rem] font-[450] leading-tight tracking-[-0.035em] text-white aria-[current=page]:text-brand-300"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="wrap mobile-menu-item flex-none pb-8" style={{ '--i': navLinks.length + 1 }}>
          <Button to="/contact" className="w-full">
            Start a project
          </Button>
          <Button
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            arrow={false}
            className="mt-3 w-full"
          >
            <WhatsApp size={20} />
            WhatsApp us
            <span className="sr-only"> (opens in a new tab)</span>
          </Button>
          <p className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-muted">
            <a href={`mailto:${site.email}`} className="text-link">
              {site.email}
            </a>
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-faint">{site.tagline}</span>
          </p>
        </div>
      </div>
    </header>
  );
}

import { Link } from 'react-router';
import { services } from '../data/services.js';
import { site, studioLinks } from '../data/site.js';
import ContactLinks from './ContactLinks.jsx';
import { Mark } from './Logo.jsx';

const footerLink = 'text-muted transition-colors hover:text-white';

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-line">
      {/* violet light rising from the bottom edge */}
      <div
        className="glow -bottom-[34rem] left-1/2 -z-10 h-[60rem] w-[150rem] max-w-[260vw] -translate-x-1/2 opacity-90"
        aria-hidden="true"
      />

      <div className="wrap pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-4">
              <Mark className="h-[3.6rem] w-auto flex-none text-brand-400" />
              <div className="w-[13.25rem] sm:w-[17rem]">
                <span role="img" aria-label={site.name} className="wordmark block w-full text-white" />
                <p className="mt-3 w-full whitespace-nowrap text-[0.625rem] font-medium uppercase tracking-[0.08em] text-muted [text-align-last:justify] sm:text-[0.6875rem] sm:tracking-[0.16em]">
                  {site.tagline}
                </p>
              </div>
            </div>
            <p className="type-lead mt-9 max-w-md text-muted">{site.description}</p>
            <a
              href={`mailto:${site.email}`}
              className="text-link mt-8 inline-block break-all text-[clamp(1.3rem,2.7vw,2.25rem)] font-[450] leading-tight tracking-[-0.03em] text-white"
            >
              {site.email}
            </a>
            <ContactLinks className="mt-7 space-y-3" linkClassName="text-muted" />
          </div>

          <nav aria-labelledby="footer-services" className="lg:col-span-3 lg:col-start-8">
            <h2 id="footer-services" className="label-caps text-faint">
              Services
            </h2>
            <ul className="mt-6 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services/${service.slug}`} className={footerLink}>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-studio" className="lg:col-span-2">
            <h2 id="footer-studio" className="label-caps text-faint">
              Studio
            </h2>
            <ul className="mt-6 space-y-3">
              {studioLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-20 md:mt-28" aria-hidden="true">
          <span className="footer-wordmark" />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line py-7 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.year} {site.name}. All rights reserved. <span className="text-faint">·</span> Based in{' '}
            {site.location.short}
          </p>
          <Link to="/privacy" className="text-link hover:text-white">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

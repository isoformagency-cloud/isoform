import { site, whatsappUrl } from '../data/site.js';
import { Instagram, WhatsApp } from './Icon.jsx';

const linkBase = 'group inline-flex items-center gap-3 transition-colors hover:text-white';

// Both WhatsApp numbers and the Instagram profile, as a list of links.
// Used in the footer and on the contact page.
export default function ContactLinks({ className = '', linkClassName = '' }) {
  return (
    <ul className={className}>
      {site.whatsapp.map((number) => (
        <li key={number.digits}>
          <a
            href={whatsappUrl(number)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkBase} ${linkClassName}`.trim()}
          >
            <WhatsApp size={20} className="flex-none text-brand-300" />
            <span>
              <span className="text-faint">WhatsApp</span> <span className="tabular-nums">{number.label}</span>
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
      <li>
        <a
          href={site.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkBase} ${linkClassName}`.trim()}
        >
          <Instagram size={20} className="flex-none text-brand-300" />
          <span>
            <span className="text-faint">Instagram</span> {site.instagram.handle}
          </span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </li>
    </ul>
  );
}

import { Link } from 'react-router';
import contours from '../assets/brand/contours.svg';
import { ArrowRight } from '../components/Icon.jsx';
import { TitleText } from '../components/TitleText.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <section
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden py-40"
      aria-labelledby="notfound-title"
    >
      <div className="glow -right-[24rem] -top-[30rem] -z-10 h-[70rem] w-[70rem] opacity-80" aria-hidden="true" />
      <img
        src={contours}
        alt=""
        aria-hidden="true"
        width="1200"
        height="1200"
        className="contours -right-[20rem] -top-[26rem] -z-10 w-[62rem] opacity-60"
      />
      <div className="wrap">
        <p className="label-caps fade-up flex items-center gap-3 text-brand-200">
          <span className="h-px w-8 bg-brand-300" aria-hidden="true" />
          Error 404
        </p>
        <h1 id="notfound-title" className="type-h1 mt-6 max-w-[12ch]">
          <TitleText text="This page *doesn’t exist.*" />
        </h1>
        <nav aria-label="Helpful links" className="fade-up mt-12" style={{ '--delay': '380ms' }}>
          <ul className="flex flex-wrap gap-3">
            {links.map((link, index) => (
              <li key={link.to}>
                <Link to={link.to} className={`btn ${index === 0 ? 'btn-primary' : 'btn-secondary'}`}>
                  {link.label}
                  {index === 0 ? <ArrowRight size={18} /> : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

import contours from '../assets/brand/contours.svg';
import { site, whatsappUrl } from '../data/site.js';
import Magnet from './bits/Magnet.jsx';
import Button from './Button.jsx';
import { WhatsApp } from './Icon.jsx';
import Reveal from './Reveal.jsx';
import { Title } from './TitleText.jsx';

// The violet closing band at the bottom of each page.
export default function CtaBand({ title, text, to = '/contact', cta = 'Start a project' }) {
  return (
    <section className="wrap pb-24 pt-8 md:pb-32" aria-label="Start a project">
      <Reveal className="band px-6 py-16 sm:px-12 md:py-24 lg:px-20">
        <img
          src={contours}
          alt=""
          aria-hidden="true"
          width="1200"
          height="1200"
          loading="lazy"
          className="contours -right-[16rem] -top-[20rem] -z-10 w-[56rem]"
        />
        <h2 className="type-h2 max-w-[13ch] [&_em]:text-white">
          <Title text={title} />
        </h2>
        {text ? <p className="type-lead mt-7 max-w-xl text-white/90">{text}</p> : null}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Magnet>
            <Button to={to} variant="light">
              {cta}
            </Button>
          </Magnet>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link inline-flex items-center gap-2 font-medium text-white"
          >
            <WhatsApp size={20} className="flex-none" />
            WhatsApp us
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={`mailto:${site.email}`} className="text-link break-all text-white">
            {site.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

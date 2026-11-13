import contours from '../assets/brand/contours.svg';
import { TitleText } from './TitleText.jsx';

// The opening block of every inner page: label, big title, short lead.
export default function PageHeader({ label, title, lead, children, titleClassName = 'max-w-[15ch]' }) {
  return (
    <header className="relative isolate overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48">
      <div
        className="glow -right-[28rem] -top-[34rem] -z-10 h-[70rem] w-[70rem] opacity-80 max-md:-right-[38rem]"
        aria-hidden="true"
      />
      <img
        src={contours}
        alt=""
        aria-hidden="true"
        width="1200"
        height="1200"
        className="contours -right-[22rem] -top-[30rem] -z-10 w-[62rem] opacity-60 max-md:-right-[34rem]"
      />
      <div className="wrap">
        <p className="label-caps fade-up flex items-center gap-3 text-brand-200">
          <span className="h-px w-8 bg-brand-300" aria-hidden="true" />
          {label}
        </p>
        <h1 className={`type-h1 mt-6 ${titleClassName}`}>
          <TitleText text={title} />
        </h1>
        {lead ? (
          <p className="type-lead fade-up mt-8 max-w-2xl text-muted" style={{ '--delay': '380ms' }}>
            {lead}
          </p>
        ) : null}
        {children}
      </div>
    </header>
  );
}

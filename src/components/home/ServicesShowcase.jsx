import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import contours from '../../assets/brand/contours.svg';
import { media } from '../../data/projects.js';
import { services } from '../../data/services.js';
import { useGsap } from '../../lib/gsap.js';
import { prefersReducedMotion } from '../../lib/scroll.js';
import { ArrowRight, Check } from '../Icon.jsx';
import { Mark } from '../Logo.jsx';
import { Title, plainTitle } from '../TitleText.jsx';

// The services section of the home page: a phone that turns as you scroll,
// while its screen and the text beside it step through the five services.
//
// Without JavaScript, on very short screens, or with reduced motion, it is a
// plain list with a still phone. The scroll-driven mode ("live") is switched
// on after load, and all of its layout lives in index.css (.showcase-*).

const LIVE_QUERY = '(min-width: 64rem) and (min-height: 32rem), (max-width: 63.99rem) and (min-height: 36rem)';

const CAPTION = ['Reels', 'people', 'watch', 'past', 'the', 'first', 'second.'];

/* ----------------------------- phone screens ----------------------------- */
// 01 Websites and 02 Social media show real client work.
// 03 to 05 are small illustrations of the service, not client material.

function VideoScreen() {
  return (
    <div className="flex h-full flex-col bg-[#09090d] text-white">
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_30%,rgb(90_37_226/0.75),rgb(11_11_15/0)_75%)]" />
        <img src={contours} alt="" className="absolute -left-1/4 top-0 w-[150%] max-w-none opacity-60" />
        <span className="absolute left-[8%] top-[11%] rounded-full bg-black/45 px-[0.7em] py-[0.35em] text-[0.62em] font-medium uppercase tracking-[0.18em]">
          Reel · 0:12
        </span>
        <p className="absolute inset-x-[8%] bottom-[9%] text-[1.5em] font-semibold leading-[1.12] tracking-[-0.03em]">
          {CAPTION.map((word, index) => (
            <span key={word} className="cap-word" style={{ '--i': index }}>
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
      {/* edit timeline */}
      <div className="relative flex-none bg-[#111117] px-[7%] pb-[9%] pt-[5%]">
        <div className="flex h-[1.9em] gap-[3px] overflow-hidden rounded-[0.4em]">
          <i className="w-[26%] bg-brand" />
          <i className="w-[16%] bg-brand-400" />
          <i className="w-[31%] bg-brand" />
          <i className="flex-1 bg-brand-300" />
        </div>
        <div className="mt-[4px] flex h-[0.7em] gap-[3px] overflow-hidden rounded-[0.25em]">
          <i className="w-[42%] bg-white/25" />
          <i className="flex-1 bg-white/15" />
        </div>
        <i className="playhead absolute bottom-[7%] left-[7%] top-[3%] w-[2px] rounded bg-white" />
      </div>
    </div>
  );
}

function ChatBubble({ i, mine = false, children }) {
  return (
    <p
      className={`chat-msg max-w-[84%] rounded-[1.1em] px-[0.95em] py-[0.65em] text-[0.74em] leading-[1.35] ${
        mine ? 'self-end rounded-br-[0.3em] bg-brand text-white' : 'self-start rounded-bl-[0.3em] bg-white/10 text-fg'
      }`}
      style={{ '--i': i }}
    >
      {children}
    </p>
  );
}

function ChatScreen() {
  return (
    <div className="flex h-full flex-col bg-[#0d0d12] text-white">
      <div className="flex flex-none items-center gap-[0.6em] border-b border-white/10 px-[7%] pb-[4%] pt-[15%]">
        <span className="flex h-[2em] w-[2em] items-center justify-center rounded-full bg-brand">
          <Mark className="h-[1em] w-auto text-white" />
        </span>
        <span className="text-[0.78em] font-medium leading-tight">
          Your business
          <span className="block text-[0.82em] font-normal text-success">Auto-reply on</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-[0.55em] px-[6%] pb-[9%]">
        <ChatBubble i={0}>Hi, is a cab free tomorrow morning?</ChatBubble>
        <ChatBubble i={1} mine>
          Hello! Reply with a number:
          <br />1 Book a ride
          <br />2 Price list
          <br />3 Talk to us
        </ChatBubble>
        <ChatBubble i={2}>1</ChatBubble>
        <ChatBubble i={3} mine>
          <span className="flex items-center gap-[0.4em]">
            <Check size={14} />
            Booking confirmed. Details sent.
          </span>
        </ChatBubble>
        <p
          className="chat-msg self-center pt-[0.4em] text-[0.58em] uppercase tracking-[0.18em] text-faint"
          style={{ '--i': 4 }}
        >
          Lead saved to your sheet
        </p>
      </div>
    </div>
  );
}

function BrandScreen() {
  return (
    <div className="flex h-full flex-col bg-paper px-[9%] pb-[9%] pt-[16%] text-ink">
      <p className="text-[0.6em] font-medium uppercase tracking-[0.2em] text-ink/60">Brand kit</p>
      <div className="flex flex-1 flex-col items-center justify-center gap-[1.1em]">
        <Mark className="h-[5.4em] w-auto text-brand" />
        <span className="wordmark w-[62%] text-ink" />
      </div>
      <div className="grid grid-cols-4 gap-[0.4em]">
        <i className="aspect-square rounded-[0.5em] bg-brand" />
        <i className="aspect-square rounded-[0.5em] bg-ink" />
        <i className="aspect-square rounded-[0.5em] bg-brand-200" />
        <i className="aspect-square rounded-[0.5em] border border-ink/15 bg-white" />
      </div>
      <p className="mt-[0.9em] flex items-baseline justify-between border-t border-ink/15 pt-[0.7em]">
        <span className="text-[1.7em] font-medium leading-none tracking-[-0.04em]">Aa</span>
        <span className="serif-accent text-[1.7em] leading-none">Aa</span>
        <span className="text-[0.6em] uppercase tracking-[0.18em] text-ink/60">Type</span>
      </p>
    </div>
  );
}

const SCREENS = [
  <img
    key="site"
    src={media.phoneSite}
    alt=""
    loading="lazy"
    decoding="async"
    className="h-full w-full object-cover object-top"
  />,
  <img
    key="feed"
    src={media.phoneFeed}
    alt=""
    loading="lazy"
    decoding="async"
    className="h-full w-full object-cover object-top"
  />,
  <VideoScreen key="video" />,
  <ChatScreen key="chat" />,
  <BrandScreen key="brand" />,
];

/* -------------------------------- section -------------------------------- */

export default function ServicesShowcase() {
  const sectionRef = useRef(null);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(0);

  // Switch the scroll-driven mode on where it fits.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const query = window.matchMedia(LIVE_QUERY);
    const update = () => setLive(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Map scroll through the tall section to the phone's turn (--p, eased so it
  // glides instead of stepping with the wheel) and to the active service.
  // When scrolling stops, it settles gently on the nearest service.
  useGsap(
    ({ gsap }) => {
      if (!live) return;
      const count = services.length;
      const middles = services.map((_, index) => (index + 0.5) / count);
      let last = -1;
      gsap.fromTo(
        sectionRef.current,
        { '--p': 0 },
        {
          '--p': 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            // Settle on the nearest service, ignoring scroll speed and direction,
            // so it never jumps further than the closest stop.
            snap: {
              snapTo: [0, ...middles, 1],
              inertia: false,
              directional: false,
              duration: { min: 0.25, max: 0.7 },
              delay: 0.15,
              ease: 'power2.inOut',
            },
            onUpdate: (self) => {
              const index = Math.min(count - 1, Math.floor(self.progress * count));
              if (index !== last) {
                last = index;
                setActive(index);
              }
            },
          },
        }
      );
    },
    sectionRef,
    live
  );

  // Outside the scroll-driven mode the first service is always the current one.
  const current = live ? active : 0;

  return (
    <section
      ref={sectionRef}
      className="showcase"
      data-live={live ? 'true' : undefined}
      aria-labelledby="services-title"
    >
      <div className="showcase-sticky">
        <div className="wrap showcase-grid">
          <div className="showcase-copy">
            <div className="showcase-head">
              <p className="label-caps text-brand-300">Services</p>
              <h2 id="services-title" className="type-h2 mt-5">
                <Title text="Five crafts, *one team.*" />
              </h2>
            </div>

            <ol className="showcase-list">
              {services.map((service, index) => (
                <li key={service.slug} className="showcase-item" data-current={index === current ? 'true' : undefined}>
                  <Link to={`/services/${service.slug}`} className="showcase-row">
                    <span className="w-7 flex-none text-sm tabular-nums text-brand-300">{service.number}</span>
                    <h3>{service.name}</h3>
                  </Link>
                  <div className="showcase-detail">
                    <div>
                      <p className="text-lg leading-snug text-fg">{plainTitle(service.headline)}</p>
                      <p className="showcase-desc mt-2 max-w-xl text-muted">{service.description}</p>
                      <Link to={`/services/${service.slug}`} className="link-arrow mb-6 mt-4 text-[0.9375rem]">
                        More about {service.option.toLowerCase()}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {/* small screens in live mode: one service shows at a time, these link to all five */}
            <nav className="showcase-dots" aria-label="All services">
              {services.map((service, index) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  aria-label={`${service.number} ${service.name}`}
                  data-current={index === current ? 'true' : undefined}
                >
                  {service.number}
                </Link>
              ))}
            </nav>

            <Link to="/services" className="showcase-all link-arrow mt-8">
              All services
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="showcase-stage" aria-hidden="true">
            <div className="glow left-1/2 top-1/2 h-[140%] w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2" />
            <img src={contours} alt="" loading="lazy" className="showcase-orb" />
            <div className="showcase-phone">
              <div className="showcase-screens">
                {SCREENS.map((screen, index) => (
                  <div
                    key={screen.key}
                    className="showcase-screen"
                    data-current={index === current ? 'true' : undefined}
                  >
                    {screen}
                  </div>
                ))}
              </div>
            </div>
            <p key={current} className="showcase-chip">
              <span className="tabular-nums text-brand-300">{services[current].number}</span>
              {services[current].name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

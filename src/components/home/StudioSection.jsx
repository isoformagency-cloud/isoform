import { useRef } from 'react';
import { Link } from 'react-router';
import { media } from '../../data/projects.js';
import { MOTION_OK, useGsap } from '../../lib/gsap.js';
import { ArrowRight } from '../Icon.jsx';
import { Mark } from '../Logo.jsx';
import Reveal from '../Reveal.jsx';

const PARAGRAPH =
  'ISOFORM handles the whole online side of a business: the website, the social media, the videos, the automations and the brand behind them. Because one team makes all of it, everything looks and sounds like one business.';

// A small picture that opens up inside the sentence as you scroll.
function Pill({ i, children }) {
  return (
    <span className="pill" style={{ '--i': i }} aria-hidden="true">
      {children}
    </span>
  );
}

export default function StudioSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);
  const words = PARAGRAPH.split(' ');

  // --p drives the CSS (pills opening, words lighting up). Its CSS default is 1,
  // the finished state, which is what reduced-motion visitors keep.
  useGsap(({ gsap }) => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const scrub = (target, start, end) =>
        gsap.fromTo(
          target,
          { '--p': 0 },
          { '--p': 1, ease: 'none', scrollTrigger: { trigger: target, start, end, scrub: 0.5 } }
        );
      // pills open as the heading rises from the bottom towards the middle
      scrub(titleRef.current, 'top 92%', 'top 37%');
      // words light up while the paragraph moves into view
      scrub(paragraphRef.current, 'top 88%', 'bottom 46%');
    });
  }, sectionRef);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-40" aria-labelledby="studio-title">
      <div className="wrap">
        <Reveal as="p" className="label-caps text-brand-300">
          The studio
        </Reveal>

        <h2 id="studio-title" ref={titleRef} className="statement mt-8 md:mt-12">
          <span className="line">
            Your{' '}
            <Pill i={0}>
              <img src={media.pillSite} alt="" loading="lazy" decoding="async" className="object-[30%_42%]" />
            </Pill>
            website,
          </span>{' '}
          <span className="line">
            your{' '}
            <Pill i={1}>
              <img src={media.pillFeed} alt="" loading="lazy" decoding="async" className="object-[50%_74%]" />
            </Pill>
            feed and
          </span>{' '}
          <span className="line">
            your{' '}
            <Pill i={2}>
              <span className="absolute inset-0 flex items-center justify-center bg-brand">
                <Mark className="h-[58%] w-auto text-white" />
              </span>
            </Pill>
            brand,
          </span>{' '}
          <span className="line">
            <em className="serif-accent text-brand-200">designed as one.</em>
          </span>
        </h2>

        <div className="mt-14 grid gap-10 md:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:col-start-6">
            <p
              ref={paragraphRef}
              className="word-reveal text-[clamp(1.375rem,2.5vw,2.25rem)] font-light leading-[1.32] tracking-[-0.02em]"
              style={{ '--n': words.length }}
            >
              {words.map((word, index) => (
                <span key={index} style={{ '--i': index }}>
                  {word}{' '}
                </span>
              ))}
            </p>
            <Reveal className="mt-10">
              <Link to="/about" className="link-arrow">
                About the studio
                <ArrowRight size={18} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

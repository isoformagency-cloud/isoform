import { useEffect, useRef } from 'react';
import contours from '../../assets/brand/contours.svg';
import { recentlyLaunched } from '../../data/projects.js';
import { useIntro } from '../../lib/intro.jsx';
import Magnet from '../bits/Magnet.jsx';
import Button from '../Button.jsx';
import { ArrowUpRight } from '../Icon.jsx';
import { Rise } from '../TitleText.jsx';

export default function Hero() {
  const { introActive } = useIntro();
  const contoursRef = useRef(null);

  // The background contours turn slowly forever; pause them while the hero is
  // off screen so the browser isn't animating something nobody can see.
  useEffect(() => {
    const el = contoursRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      el.style.animationPlayState = entry.isIntersecting ? '' : 'paused';
    });
    observer.observe(el.parentElement);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <img
        ref={contoursRef}
        src={contours}
        alt=""
        aria-hidden="true"
        width="1200"
        height="1200"
        className="hero-contours"
      />

      <div className="hero-body wrap flex flex-1 flex-col justify-end pb-7 pt-24 md:pb-9 lg:pt-28">
        <p className="hero-label label-caps fade-up flex items-center gap-3 text-brand-200">
          <span className="h-px w-8 bg-brand-300" aria-hidden="true" />
          Digital design studio
        </p>

        <h1 id="hero-title" className="hero-title mt-5 md:mt-6">
          <Rise i={0}>Designed</Rise> <br className="hero-br" />
          <Rise i={1}>to</Rise> <Rise i={2}>be</Rise> <br />
          <em className="serif-accent text-brand-200">
            <Rise i={3}>chosen.</Rise>
          </em>
        </h1>

        <div className="hero-actions mt-7 flex flex-col gap-6 md:mt-9 md:flex-row md:items-end md:justify-between md:gap-10">
          <p className="hero-lead type-lead fade-up max-w-[35rem] text-muted" style={{ '--delay': '420ms' }}>
            ISOFORM designs and builds websites, social media, video, automation and brands for businesses that want to
            be the first choice online.
          </p>
          <div className="fade-up flex flex-none flex-wrap gap-3" style={{ '--delay': '520ms' }}>
            {/* off while the hero is still the small screen inside the intro */}
            <Magnet disabled={introActive}>
              <Button to="/contact">Start a project</Button>
            </Magnet>
            <Button to="/work" variant="secondary" arrow={false}>
              View our work
            </Button>
          </div>
        </div>
      </div>

      <div className="hero-recent fade-up border-t border-line" style={{ '--delay': '640ms' }}>
        <div className="wrap flex flex-col gap-x-10 gap-y-2.5 py-4 md:flex-row md:items-center md:py-5">
          <p className="label-caps flex-none text-faint">Recently launched</p>
          <ul className="flex flex-wrap gap-x-7 gap-y-0.5">
            {recentlyLaunched.map((project) => (
              <li key={project.id}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-8 items-center gap-1.5 py-1 text-[0.9375rem] text-fg transition-colors hover:text-brand-200"
                >
                  {project.name}
                  <ArrowUpRight
                    size={15}
                    className="text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-200"
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

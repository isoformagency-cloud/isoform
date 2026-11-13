import { useRef } from 'react';
import { Link } from 'react-router';
import { selectedWork } from '../../data/projects.js';
import { DESKTOP_TALL, MOTION_OK, useGsap } from '../../lib/gsap.js';
import { ProjectLink, ProjectVisual } from '../Frames.jsx';
import { ArrowRight } from '../Icon.jsx';
import SectionHeading from '../SectionHeading.jsx';

// Selected work as a deck: on large screens each card sticks near the top and
// the next one slides over it. On small screens it is a simple list.
export default function WorkSection() {
  const listRef = useRef(null);

  // --cover: how much of a card is hidden by the next one (drives the scale-back
  // and dimming in CSS). Only on large screens, the only place the cards stack;
  // eased with quickTo so the cards settle smoothly.
  useGsap(({ gsap, ScrollTrigger }) => {
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and ${DESKTOP_TALL}`, () => {
      const items = Array.from(listRef.current.children);
      const setCover = items.map((item) => gsap.quickTo(item, '--cover', { duration: 0.35, ease: 'power3' }));
      const clamp = gsap.utils.clamp(0, 1);
      ScrollTrigger.create({
        trigger: listRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: () => {
          // The cards are position: sticky, so measure where they really are now.
          const rects = items.map((item) => item.getBoundingClientRect());
          rects.forEach((rect, i) => {
            const next = rects[i + 1];
            setCover[i](next ? clamp(1 - (next.top - rect.top) / rect.height) : 0);
          });
        },
      });
      return () => items.forEach((item) => item.style.removeProperty('--cover'));
    });
  }, listRef);

  return (
    <section className="py-24 md:py-36" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHeading
          id="work-title"
          label="Selected work"
          title="Real businesses, *live today.*"
          action={
            <Link to="/work" className="link-arrow">
              See all work
              <ArrowRight size={18} />
            </Link>
          }
        />

        <ol ref={listRef} className="mt-14 space-y-6 md:mt-20 lg:space-y-10">
          {selectedWork.map((project, index) => (
            <li key={project.id} className="stack-item" style={{ '--i': index }}>
              <article className="stack-card grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-14">
                <div className="lg:col-span-5">
                  <p className="flex items-center gap-4 text-sm text-faint">
                    <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                    <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
                    <span className="label-caps text-brand-300">{project.type}</span>
                  </p>
                  <h3 className="mt-6 text-[clamp(2rem,3.8vw,3.5rem)] leading-none tracking-[-0.04em]">
                    {project.name}
                  </h3>
                  <p className="type-lead mt-5 max-w-md text-muted">{project.description}</p>
                  <ProjectLink project={project} className="mt-8" />
                </div>
                <ProjectVisual project={project} className="lg:col-span-7" />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router';
import CtaBand from '../components/CtaBand.jsx';
import { ArrowRight } from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Hero from '../components/home/Hero.jsx';
import IntroStage from '../components/home/IntroStage.jsx';
import ServicesShowcase from '../components/home/ServicesShowcase.jsx';
import StudioSection from '../components/home/StudioSection.jsx';
import WorkSection from '../components/home/WorkSection.jsx';
import { steps } from '../data/process.js';
import { useScrollTriggerRefresh } from '../lib/gsap.js';
import { shouldShowIntro } from '../lib/intro.jsx';

export default function Home() {
  // The intro plays once, and only when the visit starts on the home page.
  const [withIntro] = useState(shouldShowIntro);

  // GSAP scroll effects live only on this page; keep their positions accurate.
  useScrollTriggerRefresh();

  return (
    <>
      {withIntro ? (
        <IntroStage>
          <Hero />
        </IntroStage>
      ) : (
        <Hero />
      )}

      <ServicesShowcase />

      <StudioSection />

      <WorkSection />

      <section className="border-t border-line py-24 md:py-36" aria-labelledby="process-title">
        <div className="wrap">
          <SectionHeading
            id="process-title"
            label="How we work"
            title="Four steps. *No surprises.*"
            text="You always know what’s happening, what it costs and when it’s done."
            action={
              <Link to="/process" className="link-arrow">
                See the process
                <ArrowRight size={18} />
              </Link>
            }
          />
          <ol className="mt-14 grid border-t border-line sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal
                as="li"
                key={step.number}
                delay={index * 80}
                className={`border-b border-line py-9 lg:border-b-0 lg:py-12 ${
                  index % 2 === 1 ? 'sm:border-l sm:pl-8' : 'sm:pr-8'
                } ${index === 2 ? 'lg:border-l lg:pl-8' : ''} ${index === 0 ? 'lg:pr-8' : 'lg:px-8'}`}
              >
                <p className="text-sm tabular-nums text-brand-300">{step.number}</p>
                <h3 className="type-h3 mt-8 lg:mt-16">{step.title}</h3>
                <p className="mt-4 text-muted">{step.happens}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        title="Have a project *in mind?*"
        text="Tell us about your business and what you want to change. We’ll reply with honest next steps and a clear price, even if the answer is that you don’t need us yet."
      />
    </>
  );
}

import SpotlightCard from '../components/bits/SpotlightCard.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { ArrowUpRight } from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { projects } from '../data/projects.js';
import { capabilities } from '../data/services.js';

const principles = [
  {
    title: 'One team, everything connected',
    text: 'Your website, posts, videos and automations come from the same people.',
  },
  {
    title: 'Made for you, not from a template',
    text: 'We start from your customers and your goals.',
  },
  {
    title: 'You stay in control',
    text: 'You own your domain, accounts and content.',
  },
  {
    title: 'Clear from day one',
    text: 'A fixed scope, a clear price and a delivery date, agreed before work starts.',
  },
];

export default function About() {
  return (
    <>
      <PageHeader
        label="About"
        title="One studio for the *online side* of your business."
        titleClassName="max-w-[18ch]"
      />

      {/* Who we are */}
      <section className="border-t border-line py-20 md:py-32" aria-labelledby="who-title">
        <div className="wrap grid gap-8 lg:grid-cols-12">
          <Reveal as="h2" id="who-title" className="label-caps text-brand-300 lg:col-span-3 lg:pt-3">
            Who we are
          </Reveal>
          <div className="lg:col-span-9">
            <Reveal as="p" className="text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.14] tracking-[-0.035em]">
              ISOFORM is a small digital design studio based in Ooty, the Nilgiris. We design and build websites, run
              social media, edit video, automate repetitive work and create brand identities, all under one roof.
            </Reveal>
            <Reveal as="p" delay={100} className="type-lead mt-10 max-w-3xl text-muted">
              Many of our clients are in and around Ooty and the Nilgiris: chocolate makers, travel companies,
              architects, boutiques and artists. We also work with businesses across India, online. Clients usually come
              to us for one thing and stay for the rest.
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-line py-20 md:py-32" aria-labelledby="principles-title">
        <div className="wrap">
          <SectionHeading id="principles-title" label="Principles" title="Four things we *hold ourselves to*" />
          <ol className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-20">
            {principles.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 70} className="flex">
                <SpotlightCard className="w-full rounded-3xl bg-surface p-7 md:p-10">
                  <p className="text-sm tabular-nums text-brand-300">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="type-h3 mt-10 md:mt-16">{item.title}</h3>
                  <p className="mt-4 max-w-md text-muted md:text-lg">{item.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Clients and capabilities */}
      <section className="border-t border-line py-20 md:py-32">
        <div className="wrap grid gap-x-10 gap-y-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="label-caps text-brand-300">Clients</h2>
            <ul className="mt-8 border-b border-line">
              {projects.map((project) => (
                <li key={project.id} className="border-t border-line">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-4 py-5"
                  >
                    <span className="text-xl tracking-[-0.02em] transition-colors group-hover:text-brand-200 md:text-2xl">
                      {project.name}
                    </span>
                    <span className="flex flex-none items-center gap-2 text-sm text-faint">
                      {project.type}
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-6 lg:col-start-7">
            <h2 className="label-caps text-brand-300">Capabilities</h2>
            <dl className="mt-8 border-b border-line">
              {capabilities.map((group) => (
                <div
                  key={group.group}
                  className="grid gap-x-6 gap-y-2 border-t border-line py-5 sm:grid-cols-[9.5rem_1fr]"
                >
                  <dt className="text-xl tracking-[-0.02em] md:text-2xl">{group.group}</dt>
                  <dd className="text-muted sm:pt-1">{group.items.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Let’s build something *together.*" />
    </>
  );
}

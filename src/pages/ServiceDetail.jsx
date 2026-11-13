import { useParams } from 'react-router';
import SpotlightCard from '../components/bits/SpotlightCard.jsx';
import Button from '../components/Button.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { Check } from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Reveal from '../components/Reveal.jsx';
import ServiceList from '../components/ServiceList.jsx';
import { getService } from '../data/services.js';
import NotFound from './NotFound.jsx';

const sectionLabel = 'label-caps text-brand-300';

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getService(slug);
  if (!service) return <NotFound />;

  return (
    <>
      <PageHeader
        label={`${service.number} · ${service.name}`}
        title={service.headline}
        lead={service.description}
        titleClassName="max-w-[17ch]"
      >
        <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ '--delay': '480ms' }}>
          <Button to={`/contact?service=${service.slug}`}>Start a project</Button>
          <Button to="/work" variant="secondary" arrow={false}>
            View our work
          </Button>
        </div>
      </PageHeader>

      {/* The problem */}
      <section className="border-t border-line py-20 md:py-32" aria-labelledby="problem-title">
        <div className="wrap grid gap-8 lg:grid-cols-12">
          <Reveal as="h2" id="problem-title" className={`${sectionLabel} lg:col-span-3 lg:pt-3`}>
            The problem
          </Reveal>
          <Reveal
            as="p"
            delay={80}
            className="text-[clamp(1.6rem,3.5vw,3.1rem)] font-[400] leading-[1.14] tracking-[-0.035em] lg:col-span-9"
          >
            {service.problem}
          </Reveal>
        </div>
      </section>

      {/* What it covers + a good fit for */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="wrap grid gap-x-10 gap-y-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <h2 className={sectionLabel}>What it covers</h2>
            <ul className="mt-8 border-b border-line">
              {service.covers.map((item) => (
                <li key={item} className="flex gap-4 border-t border-line py-5 text-lg leading-snug md:text-xl">
                  <Check size={22} className="mt-0.5 flex-none text-brand-300" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-5 lg:col-start-8">
            <h2 className={sectionLabel}>A good fit for</h2>
            <ul className="mt-8 border-b border-line">
              {service.fitFor.map((item) => (
                <li key={item} className="border-t border-line py-5 text-lg leading-snug text-muted md:text-xl">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-line py-20 md:py-32" aria-labelledby="get-title">
        <div className="wrap">
          <Reveal as="h2" id="get-title" className={sectionLabel}>
            What you get
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2">
            {service.deliverables.map((item, index) => (
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

      {/* The other four */}
      <section className="border-t border-line py-20 md:py-28" aria-labelledby="more-title">
        <div className="wrap">
          <Reveal as="h2" id="more-title" className={sectionLabel}>
            More services
          </Reveal>
          <div className="mt-10">
            <ServiceList exclude={service.slug} />
          </div>
        </div>
      </section>

      <CtaBand
        title="Have a project *in mind?*"
        text="Tell us about your business and what you want to change. We’ll reply with honest next steps and a clear price, even if the answer is that you don’t need us yet."
        to={`/contact?service=${service.slug}`}
      />
    </>
  );
}

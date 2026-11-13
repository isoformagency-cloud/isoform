import { Link } from 'react-router';
import CtaBand from '../components/CtaBand.jsx';
import { ArrowRight, Check } from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Reveal from '../components/Reveal.jsx';
import { Title } from '../components/TitleText.jsx';
import { services } from '../data/services.js';

export default function Services() {
  return (
    <>
      <PageHeader
        label="Services"
        title="Five crafts, *one team.*"
        lead="Pick one, or let us run the whole online side of your business. Every service is done in-house, by the same people."
      />

      <div className="wrap pb-16 md:pb-24">
        {services.map((service) => (
          <Reveal
            as="section"
            key={service.slug}
            aria-labelledby={`service-${service.slug}`}
            className="grid gap-x-10 gap-y-8 border-t border-line py-14 md:py-20 lg:grid-cols-12"
          >
            <div className="lg:col-span-5">
              <p className="flex items-center gap-4 text-sm text-faint">
                <span className="tabular-nums text-brand-300">{service.number}</span>
                <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
                <span className="label-caps">{service.name}</span>
              </p>
              <h2
                id={`service-${service.slug}`}
                className="mt-7 text-[clamp(1.9rem,3.7vw,3.25rem)] leading-[1.02] tracking-[-0.04em]"
              >
                <Title text={service.headline} />
              </h2>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="type-lead text-muted">{service.description}</p>
              <h3 className="label-caps mt-10 text-faint">What it covers</h3>
              <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
                {service.covers.map((item) => (
                  <li key={item} className="flex gap-3 border-t border-line py-3.5 text-[0.9875rem] leading-snug">
                    <Check size={18} className="mt-0.5 flex-none text-brand-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to={`/services/${service.slug}`} className="link-arrow mt-9">
                More about {service.option.toLowerCase()}
                <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>

      <CtaBand title="Not sure which one *you need?*" />
    </>
  );
}

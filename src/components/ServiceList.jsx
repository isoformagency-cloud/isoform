import { Link } from 'react-router';
import { services } from '../data/services.js';
import { ArrowUpRight } from './Icon.jsx';
import Reveal from './Reveal.jsx';
import { plainTitle } from './TitleText.jsx';

// The five services as an index: number, name, one-line promise.
// Each row is one link to that service's page.
export default function ServiceList({ exclude, headingLevel: Heading = 'h3' }) {
  const items = exclude ? services.filter((service) => service.slug !== exclude) : services;

  return (
    <ol className="border-t border-line">
      {items.map((service, index) => (
        <Reveal as="li" key={service.slug} delay={index * 60}>
          <Link to={`/services/${service.slug}`} className="service-row group">
            <span className="text-sm tabular-nums text-faint lg:text-base">{service.number}</span>
            <Heading className="row-title type-h3">{service.name}</Heading>
            <ArrowUpRight size={24} className="row-arrow self-center text-faint group-hover:text-white lg:order-last" />
            <p className="col-start-2 max-w-xl text-muted lg:col-start-auto lg:text-lg">
              {plainTitle(service.headline)}
            </p>
          </Link>
        </Reveal>
      ))}
    </ol>
  );
}

// Page titles, descriptions and structured data, in one place.
// Used by the prerender script (to write real <head> tags into each HTML
// file) and by the client (to update the title when you navigate).

import { faqs } from './data/process.js';
import { services } from './data/services.js';
import { site } from './data/site.js';

const pages = {
  '/': {
    title: 'ISOFORM | Digital design studio in Ooty, the Nilgiris',
    description:
      'ISOFORM is a digital design studio in Ooty, the Nilgiris. We design and build websites, social media, video, automation and brands for businesses across India.',
  },
  '/services': {
    title: 'Services | ISOFORM',
    description:
      'Five crafts, one team: websites, social media management, video editing, automation and branding, all done in-house by the same people.',
  },
  '/work': {
    title: 'Work | ISOFORM',
    description:
      'Every project is a real client you can visit today: online stores, portfolio sites, a booking dashboard and Instagram accounts we run.',
  },
  '/about': {
    title: 'About | ISOFORM',
    description:
      'ISOFORM is a small digital design studio in Ooty, the Nilgiris: websites, social media, video, automation and brand identities, all under one roof.',
  },
  '/process': {
    title: 'Process | ISOFORM',
    description:
      'Four steps, no surprises: talk, plan, build, launch and grow. You always know what’s happening, what it costs and when it’s done.',
  },
  '/contact': {
    title: 'Contact | ISOFORM',
    description:
      'Tell us about your business by form, WhatsApp or email. We’ll reply with clear next steps, even if the answer is that you don’t need us yet.',
  },
  '/privacy': {
    title: 'Privacy policy | ISOFORM',
    description: 'What this website collects, how it is used, and how to see, correct or delete your data.',
  },
  // private: not in the sitemap, never indexed
  '/admin': {
    title: 'Admin | ISOFORM',
    description: 'ISOFORM team only.',
    noindex: true,
  },
};

// Every real page, in sitemap order.
export const routes = [
  '/',
  '/services',
  ...services.map((service) => `/services/${service.slug}`),
  '/work',
  '/about',
  '/process',
  '/contact',
  '/privacy',
];

export function getMeta(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (pages[path]) return { path, ...pages[path] };

  const service = services.find((item) => path === `/services/${item.slug}`);
  if (service) {
    return { path, title: `${service.name} | ISOFORM`, description: service.description, service };
  }

  return {
    path,
    title: 'Page not found | ISOFORM',
    description: 'This page doesn’t exist.',
    notFound: true,
  };
}

// schema.org data for a page. `siteUrl` may be empty when the domain isn't set yet.
export function structuredData(meta, siteUrl) {
  const organization = {
    '@type': 'Organization',
    name: site.name,
    description: site.description,
    email: site.email,
    // City level only: the studio has no public office address.
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location.locality,
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    },
    areaServed: { '@type': 'Country', name: 'India' },
    sameAs: [site.instagram.url],
    contactPoint: site.whatsapp.map((number) => ({
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: `+${number.digits}`,
      email: site.email,
    })),
    ...(siteUrl ? { '@id': `${siteUrl}/#organization`, url: `${siteUrl}/`, logo: `${siteUrl}/logo.png` } : {}),
  };
  const graph = [organization];

  if (meta.path === '/' && siteUrl) {
    graph.push({
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: site.name,
      publisher: { '@id': `${siteUrl}/#organization` },
    });
  }

  if (meta.service) {
    graph.push({
      '@type': 'Service',
      name: meta.service.name,
      serviceType: meta.service.name,
      description: meta.service.description,
      provider: siteUrl ? { '@id': `${siteUrl}/#organization` } : { '@type': 'Organization', name: site.name },
      ...(siteUrl ? { url: `${siteUrl}${meta.path}` } : {}),
    });
  }

  if (meta.path === '/process') {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

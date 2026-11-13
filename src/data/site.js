/* global __BUILD_YEAR__ */

export const site = {
  name: 'ISOFORM',
  tagline: 'Digital • Design • Experience',
  description: 'A digital design studio for websites, social media, video, automation and branding.',
  email: 'isoformagency@gmail.com',
  // set at build time, so the server-rendered and client-rendered year always match
  year: typeof __BUILD_YEAR__ === 'undefined' ? 2026 : __BUILD_YEAR__,

  // WhatsApp: `digits` is the full international number without "+" or spaces.
  // The first number is the main one (used where only one fits).
  whatsapp: [
    { label: '+91 90878 07659', digits: '919087807659' },
    { label: '+91 63829 60070', digits: '916382960070' },
  ],
  instagram: { handle: '@isoform_agency', url: 'https://www.instagram.com/isoform_agency/' },

  // No office: city-level location only (never a street address).
  location: {
    short: 'Ooty, the Nilgiris',
    line: 'Based in Ooty, the Nilgiris. Working with businesses across India, online.',
    locality: 'Ooty',
    region: 'Tamil Nadu',
    country: 'IN',
  },
};

// Opens a WhatsApp chat with a friendly first message already typed.
const WHATSAPP_GREETING = 'Hi ISOFORM, I’d like to talk about a project.';
export const whatsappUrl = (number = site.whatsapp[0]) =>
  `https://wa.me/${number.digits}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;

export const studioLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/process', label: 'Process' },
  { to: '/contact', label: 'Contact' },
];

// header links after the Services drop-down
export const navLinks = studioLinks.filter((link) => !['/', '/services'].includes(link.to));

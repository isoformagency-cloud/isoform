// The five services. `headline` uses *asterisks* around the words set in the serif accent.
// `option` is the matching choice in the contact form.

export const services = [
  {
    slug: 'websites',
    number: '01',
    name: 'Websites & Portfolios',
    option: 'Websites',
    headline: 'A website that keeps selling *while you’re busy.*',
    description:
      'Fast, mobile-first sites for shops, studios and service businesses. Need to change prices or photos often? We add a simple admin panel, so you never have to wait on us.',
    covers: [
      'Business sites, portfolios and online stores',
      'Designed for phones first, then desktop',
      'Optional admin panel to edit text, photos and prices',
      'Set up for Google search from day one',
    ],
    problem:
      'Most customers check you online before they call. If your site is slow, outdated or missing, they quietly pick someone else.',
    fitFor: [
      'Shops and online stores',
      'Architects, studios and freelancers',
      'Travel, food and hospitality businesses',
    ],
    deliverables: [
      {
        title: 'Design around your customers',
        text: 'We plan the pages around what they need to see before they buy or book.',
      },
      { title: 'Built for speed', text: 'Pages load fast on mobile data.' },
      {
        title: 'An admin panel, if you need one',
        text: 'Update products, prices, photos and text yourself, without code.',
      },
      {
        title: 'Enquiries that reach you',
        text: 'Booking forms, WhatsApp buttons and order flows straight to your inbox or phone.',
      },
    ],
  },
  {
    slug: 'social-media',
    number: '02',
    name: 'Social Media Management',
    option: 'Social Media',
    headline: 'Show up every week *without thinking about it.*',
    description:
      'We plan the month, design the posts, write the captions and publish them. You approve once, then get back to running your business.',
    covers: [
      'Monthly content calendar',
      'Posts, carousels and story designs',
      'Captions written for your customers',
      'Profile setup and a monthly report',
    ],
    problem: 'Posting “when there’s time” means weeks of silence, and an inactive page looks like a closed business.',
    fitFor: ['Local service businesses', 'Artists and creators', 'Travel and hospitality brands'],
    deliverables: [
      {
        title: 'A plan, not random posts',
        text: 'The month is planned in a content calendar before anything goes out.',
      },
      { title: 'Designed to match your brand', text: 'Posts, carousels and stories in one consistent look.' },
      { title: 'Captions that sound like you', text: 'Captions written for your customers, in your voice.' },
      { title: 'Know what’s working', text: 'A short monthly report on reach, followers and enquiries.' },
    ],
  },
  {
    slug: 'video-editing',
    number: '03',
    name: 'Video Editing',
    option: 'Video Editing',
    headline: 'Reels people watch *past the first second.*',
    description:
      'Short-form edits for Instagram, YouTube Shorts and ads, cut for pace, with captions and sound that hold attention to the end.',
    covers: [
      'Reels, Shorts and talking-head edits',
      'Motion graphics and word-by-word captions',
      'Product and ad videos',
      'Edited from the footage you already have',
    ],
    problem:
      'You’ve got hours of footage on your phone and no time to edit it. Raw clips get skipped in the first second.',
    fitFor: ['Founders who talk to camera', 'Product and service brands', 'Creators who want a consistent style'],
    deliverables: [
      { title: 'Hooks that stop the scroll', text: 'Openings cut for pace, so viewers stay past the first second.' },
      { title: 'Captions on every word', text: 'Word-by-word captions that hold attention to the end.' },
      { title: 'Motion and mockups', text: 'Motion graphics that show your product or service clearly.' },
      { title: 'Ready for every platform', text: 'Edits for Instagram Reels, YouTube Shorts and ads.' },
    ],
  },
  {
    slug: 'automation',
    number: '04',
    name: 'Automation',
    option: 'Automation',
    headline: 'Stop answering the same message *fifty times.*',
    description:
      'WhatsApp replies, booking confirmations and follow-ups that run on their own, connected to the tools you already use.',
    covers: [
      'WhatsApp auto-replies and quick menus',
      'Booking and payment confirmations',
      'Leads saved to Google Sheets or your CRM',
      'Follow-ups that go out on time',
    ],
    problem: 'The same five questions eat your day, and a slow reply loses the booking.',
    fitFor: ['Travel and booking businesses', 'Clinics, salons and studios', 'Anyone drowning in WhatsApp'],
    deliverables: [
      { title: 'Instant answers', text: 'WhatsApp auto-replies and quick menus handle the common questions.' },
      { title: 'Bookings without back-and-forth', text: 'Booking and payment confirmations go out on their own.' },
      { title: 'Every lead in one place', text: 'Leads are saved to Google Sheets or your CRM.' },
      { title: 'Follow-ups on autopilot', text: 'Follow-ups go out on time, through the tools you already use.' },
    ],
  },
  {
    slug: 'branding',
    number: '05',
    name: 'Branding & Graphic Design',
    option: 'Branding',
    headline: 'Look like the business *you’re becoming.*',
    description: 'Logos, brand kits, posts and print that make you look as good as the work you actually do.',
    covers: [
      'Logo and visual identity',
      'Brand colours, fonts and simple usage rules',
      'Social media templates',
      'Menus, flyers, banners and business cards',
    ],
    problem: 'A logo made in a hurry and posts in five different styles make a good business look small.',
    fitFor: ['New businesses', 'Businesses ready for a refresh', 'Anyone printing menus, flyers or banners'],
    deliverables: [
      { title: 'A logo with a reason', text: 'A logo and visual identity built around the work you actually do.' },
      { title: 'A brand kit you can reuse', text: 'Brand colours, fonts and simple usage rules in one place.' },
      { title: 'Templates for social', text: 'Social media templates, so every post looks like the same business.' },
      {
        title: 'Print that’s ready to print',
        text: 'Menus, flyers, banners and business cards, ready for the printer.',
      },
    ],
  },
];

export const getService = (slug) => services.find((service) => service.slug === slug);

// The About page's capabilities list, grouped by service.
export const capabilities = [
  {
    group: 'Websites',
    items: [
      'Business sites and portfolios',
      'Online stores',
      'Admin panels and dashboards',
      'Booking and enquiry flows',
      'Google search setup',
    ],
  },
  {
    group: 'Social media',
    items: [
      'Monthly content calendars',
      'Posts, carousels and stories',
      'Caption writing',
      'Profile setup',
      'Monthly reports',
    ],
  },
  {
    group: 'Video',
    items: [
      'Reels and Shorts',
      'Talking-head edits',
      'Word-by-word captions',
      'Motion graphics',
      'Product and ad videos',
    ],
  },
  {
    group: 'Automation',
    items: [
      'WhatsApp auto-replies and menus',
      'Booking and payment confirmations',
      'Leads to Google Sheets or a CRM',
      'Timed follow-ups',
    ],
  },
  {
    group: 'Branding',
    items: [
      'Logo and visual identity',
      'Brand kits',
      'Social media templates',
      'Menus, flyers and banners',
      'Business cards',
    ],
  },
];

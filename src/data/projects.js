import eternityDesktop from '../assets/work/eternity-desktop.webp';
import eternityMobile from '../assets/work/eternity-mobile.webp';
import ssarchDesktop from '../assets/work/ssarch-desktop.webp';
import ssarchMobile from '../assets/work/ssarch-mobile.webp';
import rasheDesktop from '../assets/work/rashe-desktop.webp';
import rasheMobile from '../assets/work/rashe-mobile.webp';
import queensDesktop from '../assets/work/queens-desktop.webp';
import queensMobile from '../assets/work/queens-mobile.webp';
import ootyTripPlanner from '../assets/work/ooty-trip-planner.webp';
import dilshath from '../assets/work/dilshath-mehendhi-art.webp';

// Screenshot sizes are the real pixel sizes of the files, so the browser can
// reserve space before they load.
const DESKTOP = { width: 1200, height: 750 };

export const filters = [
  { id: 'all', label: 'All' },
  { id: 'websites', label: 'Websites' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'dashboards', label: 'Dashboards' },
  { id: 'social', label: 'Social media' },
];

/*
  ADDING A NEW CLIENT
  1. Take two screenshots of their live site and save them as .webp in
     src/assets/work/: a desktop one (1200 x 750) and a phone one (390 x 844).
  2. Import them at the top of this file, next to the others.
  3. Add an entry to the list below. It then appears on the Work page (with
     its filter), in the About page client list, and, if you add its id to
     `selectedWork` or `recentlyLaunched` further down, on the Home page.

  Example: a website client. "Example Bakery" is a placeholder, not a real client.

    import exampleDesktop from '../assets/work/example-desktop.webp';
    import exampleMobile from '../assets/work/example-mobile.webp';

    {
      id: 'example-bakery',               // unique, lowercase, no spaces
      name: 'Example Bakery',
      kind: 'site',                       // 'site' or 'social'
      filter: 'ecommerce',                // websites | ecommerce | dashboards | social
      type: 'E-commerce',                 // label shown on the card
      description: 'An online store for fresh bread and cakes, with order-ahead pickup.',
      url: 'https://example.com',
      display: 'example.com',             // the address as shown on the card
      desktop: { src: exampleDesktop, ...DESKTOP },
      mobile: { src: exampleMobile, width: 390, height: 844 },
    },

  For an Instagram client use kind: 'social', filter: 'social', add
  followers: '1,234', and a profile screenshot as feed: { src, width, height }
  instead of desktop/mobile (see Ooty Trip Planner below).
*/
export const projects = [
  {
    id: 'eternity',
    name: 'Eternity',
    kind: 'site',
    filter: 'ecommerce',
    type: 'E-commerce',
    description: 'An online store for handmade chocolates and spices from Ooty.',
    url: 'https://eternitychocolateooty.in',
    display: 'eternitychocolateooty.in',
    desktop: { src: eternityDesktop, ...DESKTOP },
    mobile: { src: eternityMobile, width: 390, height: 844 },
  },
  {
    id: 'ss-architects',
    name: 'SS Architects & Interiors',
    shortName: 'SS Architects',
    kind: 'site',
    filter: 'websites',
    type: 'Websites',
    description: 'A portfolio site for an architecture studio, with online consultation booking.',
    url: 'https://ssachitectandinterior.com',
    display: 'ssachitectandinterior.com',
    desktop: { src: ssarchDesktop, ...DESKTOP },
    mobile: { src: ssarchMobile, width: 390, height: 844 },
  },
  {
    id: 'rashe-holidays',
    name: 'Rashe Holidays',
    kind: 'site',
    filter: 'dashboards',
    type: 'Dashboards',
    description: 'A cab and trip booking site for the Nilgiris, with a dashboard for every reservation and enquiry.',
    url: 'https://rasheholidays.com',
    display: 'rasheholidays.com',
    desktop: { src: rasheDesktop, ...DESKTOP },
    mobile: { src: rasheMobile, width: 390, height: 844 },
  },
  {
    id: 'queens-clozet',
    name: 'Queens Clozet',
    kind: 'site',
    filter: 'websites',
    type: 'Websites',
    description: 'An elegant website for a boutique and craft studio.',
    url: 'https://queensclozet.in',
    display: 'queensclozet.in',
    desktop: { src: queensDesktop, ...DESKTOP },
    mobile: { src: queensMobile, width: 390, height: 844 },
  },
  {
    id: 'ooty-trip-planner',
    name: 'Ooty Trip Planner',
    kind: 'social',
    filter: 'social',
    type: 'Social media',
    description: 'Instagram content for a travel company in Ooty: packages, cab price lists and reels.',
    url: 'https://www.instagram.com/ooty_trip_planner/',
    display: '@ooty_trip_planner',
    followers: '4,459',
    feed: { src: ootyTripPlanner, width: 600, height: 1184 },
  },
  {
    id: 'dilshath-mehendhi-art',
    name: 'Dilshath Mehendhi Art',
    kind: 'social',
    filter: 'social',
    type: 'Social media',
    description: 'Instagram content for an Ooty mehendi, makeup and nail artist.',
    url: 'https://www.instagram.com/dilshath_mehendhi_art/',
    display: '@dilshath_mehendhi_art',
    followers: '2,864',
    feed: { src: dilshath, width: 600, height: 1240 },
  },
];

const byId = (id) => projects.find((project) => project.id === id);

// Home page: "Selected work" and the hero's "Recently launched" strip.
export const selectedWork = ['eternity', 'rashe-holidays', 'ooty-trip-planner', 'ss-architects'].map(byId);
export const recentlyLaunched = ['eternity', 'ss-architects', 'rashe-holidays', 'queens-clozet'].map(byId);

// Used by the intro devices and the statement pills.
export const media = {
  introTablet: rasheDesktop,
  introPhone: eternityMobile,
  pillSite: eternityDesktop,
  pillFeed: ootyTripPlanner,
  // phone screens in the home page services showcase (one real client each)
  phoneSite: eternityMobile,
  phoneFeed: ootyTripPlanner,
};

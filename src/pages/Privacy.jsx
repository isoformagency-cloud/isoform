import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.jsx';
import { site } from '../data/site.js';

// Change this date whenever the policy text changes.
const LAST_UPDATED = '13 November 2026';
// Where the Supabase project's servers are. Must match the region chosen when
// the project was created (Supabase dashboard, Project Settings, General).
const DATA_REGION = 'Mumbai, India';

const mailto = (
  <a href={`mailto:${site.email}`} className="text-link text-white">
    {site.email}
  </a>
);

const sections = [
  {
    title: 'Who we are',
    body: [
      <>
        This website is run by {site.name}, a digital design studio based in {site.location.short}, Tamil Nadu, India.
        We work remotely and don’t have a public office address.
      </>,
      <>
        For anything about your data, email {mailto} or message us on WhatsApp (numbers on the{' '}
        <Link to="/contact" className="text-link text-white">
          contact page
        </Link>
        ).
      </>,
    ],
  },
  {
    title: 'What we collect',
    body: [
      <>
        Only what you type into the contact form: your name, your email address or phone number, your business name (if
        you give it), the services you’re interested in and your message.
      </>,
      <>If you email us, message us on WhatsApp or contact us on Instagram, we receive what you send there.</>,
      <>
        This website has no analytics, no trackers, no cookies and no third-party scripts, and it doesn’t store anything
        in visitors’ browsers. (Our private admin page, used only by our own team, keeps its sign-in in the browser.)
      </>,
    ],
  },
  {
    title: 'How we use it',
    body: [
      <>
        Only to reply to your enquiry and, if we work together, to run your project. We don’t sell your details, share
        them for marketing or add you to a mailing list.
      </>,
    ],
  },
  {
    title: 'Where it goes',
    body: [
      <>
        Contact form enquiries are saved in our database, run by Supabase on servers in {DATA_REGION}, so our team can
        read and answer them. Only our team can see them. A copy is also sent to our inbox by email, through Google’s
        Gmail service.
      </>,
      <>
        The site is hosted on Vercel, which may keep standard technical logs (such as IP addresses) for a short time to
        run and protect the service. Fonts load from this site, not from a third party.
      </>,
      <>
        To stop spam, the server counts how many enquiries come from each connection, using a scrambled (hashed) form of
        the IP address, never the address itself. Each count is deleted from our database after about ten minutes.
      </>,
      <>Messages on WhatsApp and Instagram are handled by those services (Meta) under their own privacy policies.</>,
    ],
  },
  {
    title: 'How long we keep it',
    body: [
      <>
        Enquiries that don’t become projects are deleted within 12 months: automatically from our database, and from our
        email inbox.
      </>,
      <>
        If you become a client, we keep your details while we work together, and afterwards for as long as the law
        requires for invoices and accounts.
      </>,
    ],
  },
  {
    title: 'Your rights',
    body: [
      <>
        You can ask us at any time to see the details we hold about you, correct them, delete them, or stop using them.
        Email {mailto} and we’ll confirm once it’s done.
      </>,
      <>If you’re not happy with our answer, you can complain to the Data Protection Board of India.</>,
    ],
  },
  {
    title: 'Changes',
    body: [<>If this policy changes, we’ll update this page and the date at the top.</>],
  },
];

export default function Privacy() {
  return (
    <>
      <PageHeader label="Legal" title="Privacy policy" lead={`Last updated: ${LAST_UPDATED}`} />

      <div className="wrap pb-24 md:pb-36">
        <div className="max-w-5xl border-b border-line">
          {sections.map((section) => (
            <section
              key={section.title}
              className="grid gap-x-10 gap-y-3 border-t border-line py-9 md:grid-cols-[16rem_1fr] md:py-12"
            >
              <h2 className="type-h3">{section.title}</h2>
              <div className="type-lead max-w-2xl space-y-4 text-muted">
                {section.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

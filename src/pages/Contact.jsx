import { Link } from 'react-router';
import ContactForm from '../components/ContactForm.jsx';
import ContactLinks from '../components/ContactLinks.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { nextSteps } from '../data/process.js';
import { site } from '../data/site.js';

export default function Contact() {
  return (
    <>
      <PageHeader
        label="Contact"
        title="Tell us *what you need.*"
        lead="Share a little about your business. We’ll reply with clear next steps, even if the answer is that you don’t need us yet."
        titleClassName="max-w-[13ch]"
      />

      <div className="wrap grid gap-x-12 gap-y-16 border-t border-line pb-24 pt-12 md:pb-36 md:pt-16 lg:grid-cols-12">
        <section className="lg:col-span-7" aria-labelledby="form-title">
          <h2 id="form-title" className="sr-only">
            Send an enquiry
          </h2>
          <ContactForm />
        </section>

        <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="next-title">
          <h2 id="next-title" className="label-caps text-brand-300">
            What happens next
          </h2>
          <ol className="mt-7 border-b border-line">
            {nextSteps.map((step, index) => (
              <li key={step.title} className="flex gap-5 border-t border-line py-6">
                <span className="pt-1 text-sm tabular-nums text-brand-300">{String(index + 1).padStart(2, '0')}</span>
                <p className="text-lg leading-snug md:text-xl">{step.title}</p>
              </li>
            ))}
          </ol>

          <h2 className="label-caps mt-12 text-brand-300">Prefer to message us?</h2>
          <a
            href={`mailto:${site.email}`}
            className="text-link mt-5 inline-block break-all text-xl tracking-[-0.02em] text-white md:text-2xl"
          >
            {site.email}
          </a>
          <ContactLinks className="mt-6 space-y-3.5" linkClassName="text-lg text-fg" />

          <p className="mt-10 text-muted">{site.location.line}</p>
          <p className="mt-6 text-sm text-faint">
            How we handle your details is set out in our{' '}
            <Link to="/privacy" className="text-link text-muted hover:text-white">
              privacy policy
            </Link>
            .
          </p>
        </aside>
      </div>
    </>
  );
}

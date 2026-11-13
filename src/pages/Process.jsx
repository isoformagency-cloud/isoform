import CtaBand from '../components/CtaBand.jsx';
import { Plus } from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { faqs, steps } from '../data/process.js';

export default function Process() {
  return (
    <>
      <PageHeader
        label="Process"
        title="Four steps. *No surprises.*"
        lead="You always know what’s happening, what it costs and when it’s done."
      />

      <section className="wrap pb-20 md:pb-32" aria-labelledby="steps-title">
        <h2 id="steps-title" className="sr-only">
          The four steps
        </h2>
        <ol>
          {steps.map((step) => (
            <Reveal
              as="li"
              key={step.number}
              className="grid gap-x-10 gap-y-8 border-t border-line py-12 md:py-16 lg:grid-cols-12"
            >
              <div className="flex items-baseline gap-6 lg:col-span-5">
                <span className="text-sm tabular-nums text-brand-300 lg:text-base">{step.number}</span>
                <h3 className="text-[clamp(2.4rem,5.2vw,4.5rem)] leading-none tracking-[-0.045em]">{step.title}</h3>
              </div>
              <div className="lg:col-span-7">
                <p className="text-[clamp(1.3rem,2.1vw,1.75rem)] font-light leading-[1.3] tracking-[-0.02em]">
                  {step.happens}
                </p>
                <dl className="mt-9 grid gap-6 sm:grid-cols-2">
                  <div className="border-t border-line pt-5">
                    <dt className="label-caps text-faint">You get</dt>
                    <dd className="mt-3 text-lg text-fg">{step.youGet}</dd>
                  </div>
                  <div className="border-t border-line pt-5">
                    <dt className="label-caps text-faint">You do</dt>
                    <dd className="mt-3 text-lg text-fg">{step.youDo}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-t border-line py-20 md:py-32" aria-labelledby="faq-title">
        <div className="wrap grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <SectionHeading id="faq-title" label="FAQ" title="Questions people *usually ask*" className="lg:col-span-5" />
          <Reveal delay={100} className="border-b border-line lg:col-span-7">
            {faqs.map((faq) => (
              <details key={faq.question} className="faq border-t border-line">
                <summary>
                  {/* Plain text, not a heading: a summary acts as a button, and some
                      screen readers drop heading semantics inside buttons. */}
                  <span className="text-xl font-[450] leading-snug tracking-[-0.02em] md:text-2xl">{faq.question}</span>
                  <Plus size={24} className="text-brand-300" />
                </summary>
                <p className="faq-body max-w-2xl pb-8 text-lg text-muted">{faq.answer}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand title="Ready for *step one?*" />
    </>
  );
}

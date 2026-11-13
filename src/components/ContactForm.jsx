import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { services } from '../data/services.js';
import { site } from '../data/site.js';
import { LIMITS, SERVICE_OPTIONS, normalizeEnquiry, validateEnquiry } from '../lib/contactSchema.js';
import { Alert, ArrowRight, Check } from './Icon.jsx';

const EMPTY = { name: '', contact: '', business: '', services: [], message: '' };
const FIELD_ORDER = ['name', 'contact', 'services', 'message'];

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      <Alert size={18} className="mt-0.5 flex-none" />
      {message}
    </p>
  );
}

// The enquiry form. It posts JSON to /api/contact (Node), which validates the
// same way and emails the studio. States: idle, sending, sent, failed.
export default function ContactForm() {
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const [failure, setFailure] = useState('');
  const [trap, setTrap] = useState(''); // honeypot, stays empty for people
  const formRef = useRef(null);
  const sentRef = useRef(null);
  const failRef = useRef(null);
  // When the form appeared. The server rejects enquiries sent within 2 seconds
  // of that (people can't fill it in that fast; bots can).
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  // Arriving from a service page (/contact?service=websites) ticks that service.
  // This has to wait for an effect: the page is prerendered without the query
  // string, so ticking it during the first render would not match the HTML.
  useEffect(() => {
    const service = services.find((item) => item.slug === searchParams.get('service'));
    if (service)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs from the URL after hydration (see above)
      setValues((current) => (current.services.length ? current : { ...current, services: [service.option] }));
  }, [searchParams]);

  useEffect(() => {
    if (status === 'sent') sentRef.current?.focus();
    if (status === 'failed') failRef.current?.focus();
  }, [status]);

  const update = (field) => (event) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const toggleService = (option) => {
    setValues((current) => ({
      ...current,
      services: current.services.includes(option)
        ? current.services.filter((item) => item !== option)
        : [...current.services, option],
    }));
    if (errors.services) setErrors((current) => ({ ...current, services: undefined }));
  };

  // Check one field when you leave it, so mistakes show up early but not while typing.
  const validateField = (field) => () => {
    const message = validateEnquiry(normalizeEnquiry(values))[field];
    setErrors((current) => ({ ...current, [field]: values[field]?.length ? message : current[field] }));
  };

  const focusFirstError = (found) => {
    const first = FIELD_ORDER.find((field) => found[field]);
    if (!first) return;
    const target =
      first === 'services'
        ? formRef.current.querySelector('input[name="services"]')
        : formRef.current.querySelector(`#field-${first}`);
    target?.focus();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;

    const enquiry = normalizeEnquiry(values);
    const found = validateEnquiry(enquiry);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }

    setStatus('sending');
    setFailure('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...enquiry, company_url: trap, elapsed: Date.now() - shownAt.current }),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && result.ok) {
        setStatus('sent');
        return;
      }
      if (response.status === 422 && result.fields) {
        setErrors(result.fields);
        setStatus('idle');
        focusFirstError(result.fields);
        return;
      }
      setFailure(
        response.status === 429
          ? 'You’ve sent a few enquiries in a short time. Please wait a few minutes and try again, or email us directly.'
          : 'We couldn’t send your enquiry just now. Please try again, or email us directly.'
      );
      setStatus('failed');
    } catch {
      setFailure('We couldn’t reach the server. Check your connection and try again, or email us directly.');
      setStatus('failed');
    } finally {
      window.clearTimeout(timeout);
    }
  };

  if (status === 'sent') {
    return (
      <div
        ref={sentRef}
        tabIndex={-1}
        role="status"
        className="rounded-3xl border border-success/40 bg-success/[0.07] p-8 outline-none md:p-12"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-ink">
          <Check size={24} />
        </span>
        <h2 className="type-h3 mt-8">Thank you. Your enquiry is in our inbox.</h2>
        <p className="type-lead mt-4 max-w-lg text-muted">We’ll read it properly and reply with next steps.</p>
        <button
          type="button"
          className="link-arrow mt-9"
          onClick={() => {
            setValues(EMPTY);
            setErrors({});
            setStatus('idle');
            shownAt.current = Date.now();
          }}
        >
          Send another enquiry
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const sending = status === 'sending';

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Project enquiry">
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="field-name" className="field-label">
            Your name
          </label>
          <input
            id="field-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={LIMITS.name.max}
            value={values.name}
            onChange={update('name')}
            onBlur={validateField('name')}
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'error-name' : undefined}
            className="field-input"
          />
          <FieldError id="error-name" message={errors.name} />
        </div>

        <div>
          <label htmlFor="field-contact" className="field-label">
            Email or phone
          </label>
          <input
            id="field-contact"
            name="contact"
            type="text"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            maxLength={LIMITS.contact.max}
            value={values.contact}
            onChange={update('contact')}
            onBlur={validateField('contact')}
            aria-invalid={errors.contact ? 'true' : undefined}
            aria-describedby={errors.contact ? 'error-contact' : undefined}
            className="field-input"
          />
          <FieldError id="error-contact" message={errors.contact} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="field-business" className="field-label">
            Business name <span className="font-normal text-faint">(optional)</span>
          </label>
          <input
            id="field-business"
            name="business"
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.business.max}
            value={values.business}
            onChange={update('business')}
            className="field-input"
          />
        </div>

        <fieldset className="sm:col-span-2" aria-describedby={errors.services ? 'error-services' : 'hint-services'}>
          <legend className="field-label">What can we help with?</legend>
          <p id="hint-services" className="-mt-1 mb-4 text-sm text-faint">
            Choose as many as you like.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {SERVICE_OPTIONS.map((option) => (
              <label key={option} className="chip">
                <input
                  type="checkbox"
                  name="services"
                  value={option}
                  checked={values.services.includes(option)}
                  onChange={() => toggleService(option)}
                />
                <span>
                  <Check size={16} />
                  {option}
                </span>
              </label>
            ))}
          </div>
          <FieldError id="error-services" message={errors.services} />
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor="field-message" className="field-label">
            Tell us about the project
          </label>
          <textarea
            id="field-message"
            name="message"
            rows={6}
            required
            maxLength={LIMITS.message.max}
            value={values.message}
            onChange={update('message')}
            onBlur={validateField('message')}
            aria-invalid={errors.message ? 'true' : undefined}
            aria-describedby={errors.message ? 'error-message' : undefined}
            className="field-input min-h-[10rem] resize-y"
          />
          <FieldError id="error-message" message={errors.message} />
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company_url">Leave this field empty</label>
        <input
          id="company_url"
          name="company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(event) => setTrap(event.target.value)}
        />
      </div>

      {status === 'failed' ? (
        <div
          ref={failRef}
          tabIndex={-1}
          role="alert"
          className="mt-8 flex gap-3 rounded-2xl border border-danger/50 bg-danger/[0.08] p-5 text-fg outline-none"
        >
          <Alert size={22} className="mt-0.5 flex-none text-danger" />
          <p>
            {failure}{' '}
            <a href={`mailto:${site.email}`} className="text-link font-medium text-white">
              {site.email}
            </a>
          </p>
        </div>
      ) : null}

      <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
        <button type="submit" className="btn btn-primary min-w-[12.5rem]" aria-disabled={sending ? 'true' : undefined}>
          {sending ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send enquiry
              <ArrowRight size={18} />
            </>
          )}
        </button>
        <p className="max-w-xs text-sm text-faint">We only use these details to reply to you.</p>
      </div>
    </form>
  );
}

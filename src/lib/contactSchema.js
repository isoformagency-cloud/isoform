// Shared by the contact form (browser) and the contact API (Node), so both
// sides agree on what a valid enquiry looks like.

export const SERVICE_OPTIONS = ['Websites', 'Social Media', 'Video Editing', 'Automation', 'Branding', 'Not sure yet'];

export const LIMITS = {
  name: { min: 2, max: 80 },
  contact: { min: 5, max: 120 },
  business: { min: 0, max: 120 },
  message: { min: 10, max: 4000 },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

export const isEmail = (value) => EMAIL_RE.test(value);
export const isPhone = (value) =>
  PHONE_RE.test(value) && value.replace(/\D/g, '').length >= 7 && value.replace(/\D/g, '').length <= 15;

// Strip control characters. Single-line fields also lose line breaks.
// (Matching control characters is the point here, so no-control-regex is off.)
/* eslint-disable no-control-regex */
const cleanLine = (value, max) =>
  String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

const cleanText = (value, max) =>
  String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
/* eslint-enable no-control-regex */

export function normalizeEnquiry(input = {}) {
  const services = Array.isArray(input.services) ? input.services : [];
  return {
    name: cleanLine(input.name, LIMITS.name.max),
    contact: cleanLine(input.contact, LIMITS.contact.max),
    business: cleanLine(input.business, LIMITS.business.max),
    services: SERVICE_OPTIONS.filter((option) => services.includes(option)),
    message: cleanText(input.message, LIMITS.message.max),
  };
}

// Returns { field: message } for every problem; an empty object means valid.
export function validateEnquiry(data) {
  const errors = {};
  if (data.name.length < LIMITS.name.min) {
    errors.name = 'Please tell us your name.';
  }
  if (!data.contact) {
    errors.contact = 'Add an email address or phone number so we can reply.';
  } else if (!isEmail(data.contact) && !isPhone(data.contact)) {
    errors.contact = 'That doesn’t look like an email address or phone number.';
  }
  if (data.services.length === 0) {
    errors.services = 'Pick at least one option. “Not sure yet” is fine.';
  }
  if (data.message.length < LIMITS.message.min) {
    errors.message = 'Tell us a little about the project, even one or two sentences.';
  }
  return errors;
}

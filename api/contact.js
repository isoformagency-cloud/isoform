// Vercel serverless function: POST /api/contact
import { contactRequest } from '../server/contact.js';

export default function handler(req, res) {
  const forwarded = String(req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim();
  return contactRequest(req, res, { ip: req.headers['x-real-ip'] || forwarded });
}

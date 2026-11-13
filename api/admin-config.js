// Vercel serverless function: GET /api/admin-config
import { adminConfigRequest } from '../server/adminConfig.js';

export default function handler(req, res) {
  return adminConfigRequest(req, res);
}

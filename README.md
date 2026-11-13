# ISOFORM website

React + Tailwind CSS front end, Node.js API, Supabase for enquiries. Every page is prerendered to static HTML at build time, so it loads fast and search engines get real content.

- **Contact form:** each enquiry is saved in Supabase and emailed to the studio inbox (Gmail).
- **`/admin`:** private inbox for the team: read enquiries, mark them replied / client / closed, delete them. Sign in with a Supabase user that is on the admin list.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. The dev server also serves the API (`/api/contact`, `/api/admin-config`).

```bash
npm run build
npm start
```

`build` creates `dist/` (one HTML file per page). `start` serves it with the API at http://localhost:3000.

## Checks

```bash
npm run check
```

Runs lint, the formatting check, the build, the server unit tests (`tests/unit/`) and the Playwright tests (`tests/`) against the built site. First time only: `npx playwright install chromium`. On Windows the tests use your installed Google Chrome, with a temporary profile. The tests never send real email and never touch the real Supabase project.

| Command | What it does |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run format` | Formats every file with Prettier |
| `npm run test:unit` | Server unit tests (Node's built-in test runner) |
| `npm test` | Playwright tests (needs `npm run build` first) |

## Settings

Copy `.env.example` to `.env` and fill it in. On Vercel, add the same settings under Project Settings, Environment Variables.

| Setting | What it does |
| --- | --- |
| `SITE_URL` | Your live address, for canonical links, the social preview image and `sitemap.xml`. On Vercel the production domain is used automatically. |
| `SUPABASE_URL` | Your Supabase project's URL (`https://<ref>.supabase.co`). |
| `SUPABASE_PUBLISHABLE_KEY` | Public key, used by `/admin` to sign in. Safe to expose: the database's row-level security decides what it can do. |
| `SUPABASE_SECRET_KEY` | Secret key, used **only by the server** to save enquiries and run the spam limit. Never put it in front-end code. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | The email service that sends enquiry alerts. |
| `CONTACT_TO` | Inbox for enquiry alerts. Defaults to isoformagency@gmail.com. |
| `MAIL_TRANSPORT=log` | Local testing only: prints enquiries in the terminal instead of sending them. |

An enquiry counts as delivered if it was saved **or** emailed, so a failed email never loses one. With neither Supabase nor email set up, the form tells visitors it could not send and shows the email address instead.

With Gmail: turn on 2-Step Verification, create an App password, and use `smtp.gmail.com`, port `465`, your Gmail address as `SMTP_USER` and the App password as `SMTP_PASS`.

## Supabase setup (once)

1. Create a project (region: South Asia, Mumbai; it must match `DATA_REGION` in `src/pages/Privacy.jsx`).
2. In the SQL Editor, run `supabase/migrations/0001_enquiries.sql`. It creates the `enquiries` table, the admin list, row-level security, the shared spam limit and the nightly job that deletes non-client enquiries after 12 months.
3. Authentication, Sign In / Providers: turn **off** "Allow new users to sign up".
4. Authentication, Users, Add user: create each team member (email + password, auto-confirm).
5. Make them admins, in the SQL Editor: `insert into public.admins (user_id) select id from auth.users where email = 'name@example.com';`
6. Copy the URL, publishable key and secret key into the settings above.

## Deploy on Vercel

Import the GitHub repo as a project. `vercel.json` already sets the build command, clean URLs and security headers, and the files in `api/` become serverless functions. Add the settings above under Project Settings, Environment Variables, then redeploy.

On any other Node host, run `npm run build` then `npm start`.

## Where things are

| Path | Contents |
| --- | --- |
| `src/data/` | All site copy that repeats: services, projects, process steps, FAQs, contact details |
| `src/pages/` | One file per page (`Admin.jsx` is the private inbox) |
| `src/components/` | Header, footer, hero, intro, form and other shared pieces; `bits/` holds adapted React Bits components |
| `src/index.css` | Design tokens (colours, type, easing) and component styles |
| `src/seo.js` | Page titles, descriptions and structured data |
| `src/lib/gsap.js` | GSAP, loaded on demand (home page only) |
| `src/lib/supabaseClient.js` | Supabase in the browser, loaded on demand (`/admin` only) |
| `server/contact.js` | Enquiry validation, spam checks, saving and email |
| `server/supabase.js` | Server-side Supabase calls (secret key) |
| `supabase/migrations/` | Database setup (SQL) |
| `scripts/prerender.mjs` | Writes the static HTML, `robots.txt` and `sitemap.xml` |
| `FIX-PLAN.md` | The review, the staged fixes and what's left |

To add a project, put its screenshots in `src/assets/work/` and add an entry in `src/data/projects.js`.

## Privacy

Visitors get no cookies, no browser storage, no third-party scripts or fonts. Enquiries are stored in Supabase and deleted after 12 months unless the person became a client. Keep it that way, or update the privacy policy page.

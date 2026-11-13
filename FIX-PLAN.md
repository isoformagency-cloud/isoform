# ISOFORM website: staged fix plan

Written 13 Nov 2026, from the full review of the frontend.
Work through the stages in order. Each stage leaves the site working, so we can stop between stages.

**Who does what**
- **You**: decisions, content, settings in Vercel, and all interface testing (how it looks and feels on real screens).
- **Me**: code changes and the technical tests listed in "Testing" below. I'll tell you before I run any of them.

Tick items off as they're done: `- [x]`.

---

## Stage 0: Decisions (answered 13 Nov 2026)

Nothing here is code. Later stages use these answers.

- [x] **WhatsApp: two numbers.**
  - `+91 90878 07659`
  - `+91 63829 60070`
- [x] **Instagram:** `@isoform_agency`, linked as `https://www.instagram.com/isoform_agency/` (the share-tracking part of the pasted link removed).
- [x] **Team:** stay anonymous for now. Team members may be added later.
- [x] **Testimonials:** none yet. Add when they come in (parked, not dropped).
- [x] **Price guide:** no prices on the site. Visitors contact us first, then get a price. (The site already says this; no change.)
- [x] **Location:** no office and no street address. Approved: the suggestion in the "Location" note below.
- [x] **Admin panel:** every website so far has one, but it's **optional**: added if the client wants it; a simple portfolio can go without. The copy will say "available when you need it" instead of "every site comes with one".
- [x] **SS Architects domain:** `ssachitectandinterior.com` is the real domain (the spelling is the client's). No change.
- [x] **Privacy policy:** run by the business, ISOFORM, not a person. No postal address.
- [x] **How long enquiries are kept:** approved the suggested wording in the "Keeping enquiries" note below (12 months; clients kept while working together, then as long as the law requires for accounts).
- [x] **GSAP and React Bits:** yes, as long as the site ends up smoother and better than now. Rules at the end of this file.
- [x] **Home page intro:** keep the current one for now. You may bring a new idea later (see Stage 5).

### Location note (suggestion)
- On the site: "Based in Ooty, the Nilgiris · working with businesses across India, online." Honest, helps local search, and doesn't suggest an office.
- In Google's structured data: the city, state and country only (Ooty, Tamil Nadu, India), with no street.
- Outside the site (your call): create a **Google Business Profile as a "service-area business"**. Google lets businesses without an office hide their address and list the areas they serve, which is how you'd appear in "web design Ooty" searches and on Maps.

### Keeping enquiries: what it means
When someone sends the contact form, their name, contact details and message arrive as an email in your Gmail inbox. "How long we keep it" means **how long you keep those emails before deleting them**. Privacy rules (India's DPDP Act) expect a clear answer, not "as long as needed".

Suggested wording (change the numbers if you like):
- Enquiries that don't become projects: **deleted within 12 months**.
- Enquiries from people who become clients: kept while we work together, plus as long as the law requires for invoices and accounts.

---

## Stage 1: Launch blockers (settings, not code)

Without these, the live site can't take enquiries and is missing SEO tags.

| # | Problem | Fix | Who |
|---|---|---|---|
| 1.1 | The contact form returns an error ("not configured") because no email service is set. Every enquiry fails. | In Vercel, add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (Gmail App password, see `.env.example`). | You |
| 1.2 | `SITE_URL` isn't set, so the build skips canonical links, the social-preview image and `sitemap.xml`. | Add `SITE_URL=https://your-domain` in Vercel (or confirm the Vercel production domain is right). | You |
| 1.3 | We haven't seen an enquiry actually arrive. | After 1.1, send one test enquiry and confirm it lands in the inbox. | Me (with your OK, since it sends a real email) |

**Done when:** a test enquiry reaches the inbox, and the built pages include canonical links and `sitemap.xml`.

---

## Stage 2: Safety net before changing code

Set this up first, so every later change is checked automatically and nothing breaks silently.

| # | Task | Status |
|---|---|---|
| 2.1 | **ESLint** with the React Hooks rules (`eslint.config.js`, `npm run lint`). | ✅ 0 errors. 6 warnings logged as Stage 3.11. |
| 2.2 | **Prettier** (`.prettierrc.json`, `npm run format`, `npm run format:check`). | ✅ Whole codebase formatted once: about 260 lines re-wrapped, no behaviour change. |
| 2.3 | **Playwright smoke tests** in `tests/`: every page loads with the right title and no console or hydration errors, 404s, no overflow at 320 / 360 / 768 / 1280 px, skip link, mobile menu, services drop-down, page-change focus, home intro (normal and reduced motion), Work filters, contact form (errors, pre-ticked service, success, failure), contact API (7 cases). | ✅ All pass. |
| 2.4 | **Accessibility scan** (axe, WCAG 2.1 AA) on all 13 pages plus the 404 page. | ✅ No serious or critical problems. |
| 2.5 | **`npm run check`**: lint → format check → build → tests. | ✅ Passes: 49 tests, about 1 minute. |

**Done (13 Nov 2026).**

How the tests are kept safe:
- The contact form tests use a fake server reply, and the API tests never send a valid enquiry. The test server also runs with blank email settings, so **no test can send a real email**.
- On Windows the tests run in the installed **Google Chrome**, using a fresh temporary profile (never your normal one). Windows Smart App Control blocks Playwright's own unsigned test browser.

New problems the tests found (added to Stage 3 as 3.10 and 3.11):
- **Services drop-down bug:** moving the mouse onto the arrow opens the menu on hover, then clicking the arrow closes it again. A test marks this as a known bug, so it will flag the fix when it lands.
- **6 React rule warnings** from ESLint.

---

## Stage 3: Quick, low-risk code fixes

Small fixes with no visual redesign.

| # | Problem | What was done | Status |
|---|---|---|---|
| 3.1 | "Email or phone" opened the email keyboard on phones. | Normal text keyboard (email suggestions still offered). | ✅ |
| 3.2 | Fonts weren't preloaded, so headings could flash in a fallback font. | The build now preloads the main font on every page, and the serif accent font only on pages that use it. | ✅ test added |
| 3.3 | A side effect ran during render in App.jsx. | Rewritten the React-approved way (state adjusted during render). It must still run before the new page renders, so it can't be an effect. | ✅ test added |
| 3.4 | The menu and the nav inside it were both labelled "Menu". | Inner nav is now "Main". | ✅ |
| 3.5 | FAQ questions were headings inside `<summary>`. | Now plain styled text (same look). | ✅ |
| 3.6 | Email and security headers were each written in two places. | The server reads the email from `src/data/site.js` and the security headers from `vercel.json`. **Edit headers only in `vercel.json`.** | ✅ test added |
| 3.7 | The header has its own scroll listener. | Done in Stage 5: now uses the shared scroll handler. | ✅ |
| 3.8 | The Work section's card maths runs on phones. | Done in Stage 5: GSAP runs it on large screens only. | ✅ |
| 3.9 | `isoform_logo.jpeg` in the project root isn't used. | **Kept** at your request (13 Nov 2026). It's already left out of deploys by `.vercelignore`. | ✅ |
| 3.10 | **Bug:** hovering opened the Services drop-down, then clicking the arrow closed it. | Hover-to-open now applies to a real mouse only, and a mouse click on the arrow keeps the menu open. Keyboard and touch still toggle it. | ✅ tests added |
| 3.11 | 6 React rule warnings. | Fixed in Header, ServicesShowcase, App and useScrollTrack (now uses React's `useEffectEvent`). ContactForm keeps its effect on purpose: the page is pre-built without the `?service=` address, so the tick has to wait until after the page loads (explained in the code). Both rules are back to errors. | ✅ |

**Done (13 Nov 2026):** `npm run check` passes: 0 lint warnings, 53 tests. **Waiting on:** your interface test.

**What to look at in your interface test:**
- Desktop: hover over Services, then click the small arrow. The menu should stay open. Move the mouse away and it should close.
- Phone: the "Email or phone" field on the contact page should open a normal keyboard.
- The FAQ on the Process page should look exactly as before.
- Everything else should look and behave exactly as before.

---

## Stage 4: Conversion and trust (needs Stage 0 answers)

The biggest business gains. Mostly content, plus small components.

| # | Problem | What was done | Status |
|---|---|---|---|
| 4.1 | No WhatsApp link anywhere. | **Both numbers** are in the footer and on the contact page. A **"WhatsApp us"** button (main number, +91 90878 07659) is in the mobile menu and in the violet closing band on every page. Each link opens a chat with "Hi ISOFORM, I’d like to talk about a project." already typed. | ✅ |
| 4.2 | No Instagram link. | `@isoform_agency` in the footer and on the contact page. | ✅ |
| 4.3 | No location. | "Based in Ooty, the Nilgiris" on the About page, the contact page and the footer's bottom line. Team section **parked**. | ✅ |
| 4.4 | No testimonials. | **Parked** until real testimonials come in. | ⏸ |
| 4.5 | Local search. | Home, About and Contact titles and descriptions mention Ooty / the Nilgiris. Google's structured data now has the city, state and country (no street), India as the service area, the Instagram profile, and both WhatsApp numbers as contact points. | ✅ |
| 4.6 | Thin privacy policy. | Rewritten: who runs the site (ISOFORM, no postal address), exactly what's collected, Gmail and Vercel named, the in-memory spam counter explained, the 12-month keep-time, your rights, and the Data Protection Board of India. Date set to 13 November 2026 (`LAST_UPDATED` at the top of `src/pages/Privacy.jsx`). **Still get it checked by someone qualified.** | ✅ |
| 4.7 | Follower counts typed in by hand. | **Waiting for you:** current follower counts for @ooty_trip_planner and @dilshath_mehendhi_art. | ⏸ |
| 4.8 | Copy said every site has an admin panel. | FAQ, the Websites service description, its "what it covers" list and its deliverables now describe the admin panel as optional. | ✅ |

Contact details live in one place: `src/data/site.js` (`whatsapp`, `instagram`, `location`). Change a number there and it updates everywhere, including Google's data.

**Done (13 Nov 2026):** `npm run check` passes: 0 lint warnings, 59 tests (6 new content tests). **Waiting on:** your interface test and approval of the new wording, plus the follower counts (4.7).

**What to look at in your interface test:**
- Footer (any page): both WhatsApp numbers, Instagram, and "Based in Ooty, the Nilgiris" on the bottom line.
- Contact page, right-hand side: "Prefer to message us?" with email, both WhatsApp numbers and Instagram.
- Violet closing band on any page: the new "WhatsApp us" link.
- Phone: open the menu. There's a "WhatsApp us" button under "Start a project". Tap it: WhatsApp should open with the message ready.
- Read the new **Privacy policy** page, the **About** page's first two paragraphs, and the "Can I update my website myself?" FAQ on the **Process** page.

---

## Stage 5: Home page experience and animation (GSAP + React Bits)

| # | Problem | What was done | Status |
|---|---|---|---|
| 5.1 | The intro adds about one extra screen of scrolling. | **Kept as is** (your call). Still waiting on your rotating phone/laptop idea. | ⏸ |
| 5.2 | The services showcase held the page for 3 extra screens (about 15 screens on a phone home page). | Now **2 extra screens on desktop, 1.5 on phones and tablets**. Rebuilt with GSAP: the phone's turn eases instead of stepping with the wheel, and when you stop scrolling it **settles on the nearest service**. | ✅ |
| 5.3 | Hand-written scroll code. | **GSAP** now drives the services showcase, the studio statement (pills and word reveal, slightly eased) and the selected-work card stack (eased, large screens only: 3.8). Shared setup in `src/lib/gsap.js`, which re-measures if the page height changes. `useScrollTrack.js` deleted. The **intro** stays on the old small handler (`src/lib/scroll.js`) until its redesign. The header uses that small handler too (3.7), so pages other than home don't need GSAP. | ✅ |
| 5.4 | React Bits. | Two components, adapted into `src/components/bits/` with React Bits' licence kept (`LICENSE-react-bits.md`): **SpotlightCard**, a soft violet light following the mouse (and keyboard focus) on the About principles, each service page's "What you get" cards and the Work page cards; and **Magnet**, a subtle pull towards the mouse on the main "Start a project" buttons (hero and closing band; mouse only, off during the intro). | ✅ |
| 5.5 | Always-on effects. | The hero's rotating background pauses when off screen. No header blur on phones and tablets. | ✅ |

**Rules followed** (see "GSAP and React Bits" at the end): animation code never runs during render, so pre-building still works; every effect is off for reduced motion; GSAP and the old code never control the same element; React Bits CSS sits in a CSS layer so it can't override Tailwind.

**JavaScript size:** 103.6 KB → **154.7 KB** compressed (GSAP + its scroll plugin about 47 KB, React Bits about 4 KB). Today every page loads it. **Stage 6.2** (load each page's code separately) brings the other pages back down, because only the home page uses GSAP.

**Done (13 Nov 2026):** `npm run check` passes: 0 lint warnings, 69 tests (10 new, covering the scroll effects, snapping, spotlight, magnet and reduced motion; repeated runs were stable).

**Not done, for you to decide:**
- **Smooth scrolling (Lenis):** gives the whole site a glide when scrolling with a mouse wheel, and is the biggest single "smoothness" change. It needs the intro's own "come in" scrolling reworked, so it fits best alongside your intro redesign.

**What to look at in your interface test** (on a real laptop with a mouse, and on a phone):
- Home: scroll through the services section. It should be shorter, the phone should glide, and stopping mid-way should settle on a service.
- Home: the "Your website, your feed and your brand" pills and the paragraph below should open and light up smoothly.
- Home (laptop): the selected-work cards should stack and ease back.
- About, any service page, Work: move the mouse over the cards for the violet light, and press Tab through a card's link to see it follow focus.
- Hover near "Start a project" in the hero and in the violet band at the bottom: it should lean gently towards the mouse.

## Stage 6: Performance and hardening

| # | Problem | What was done | Status |
|---|---|---|---|
| 6.1 | Speed not measured. | Lighthouse (Google's page-speed tool) on the built site, simulating a mid-range phone on slow 4G. Results below. **You:** still try a cheap Android phone. | ✅ (yours pending) |
| 6.2 | Everything in one JavaScript file; GSAP made it 154.7 KB. | **GSAP is now a separate file (44.5 KB) that only the home page downloads**, fetched early on that page. The main file is back to **109.6 KB** (it was 103.6 KB before this project; the 6 KB difference is the WhatsApp/Instagram links, the new privacy text and React Bits). Splitting each page's own code was measured and skipped: almost all of the size is React itself, so it would save little and mean reworking the pre-built pages. | ✅ |
| 6.3 | `overflow-x: clip` on the page hid layout bugs. | Removed. Nothing scrolls sideways at 320 / 360 / 768 / 1280 px, and the test now fails if any page ever does. | ✅ |
| 6.4 | Weak spam protection. | Requests with **no `Origin` header are blocked** (browsers always send it; scripts and bots often don't). New **time check**: enquiries sent less than 2 seconds after the form appeared are rejected. A test proves a real browser submission still gets through. A shared rate limit (Upstash or Vercel KV) is still only worth adding **if spam shows up**: it needs an account. | ✅ |
| 6.5 | **New:** the Node server (`npm start`, any host except Vercel) sent files uncompressed (the 110 KB script went out as 353 KB). | Added standard compression. Vercel already compresses, so the live Vercel site wasn't affected. | ✅ |
| 6.6 | **New:** voice-control mismatch on the home page's numbered service dots (phones); "Recently launched" links were small to tap. | Dots are now labelled "01 Websites & Portfolios" etc.; the links are 32 px tall (minimum is 24 px). | ✅ |

### Lighthouse scores (13 Nov 2026, local build)

| Page | Speed | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Home (phone) | 91 | 92 | 100 | 100 |
| Home (desktop) | 100 | 96 | 100 | 100 |
| About (phone) | 98 | 100 | 100 | 100 |
| Work (phone) | 93 | 100 | 100 | 100 |
| Contact (phone) | 94 | 100 | 100 | 100 |

Home page accessibility notes (not real problems):
- The studio paragraph's words are dim **until you scroll to them** (the "light up" effect); Lighthouse measures them before that.
- Lighthouse measures the "Recently launched" links **inside the shrunken intro**, where they can't be tapped anyway; at real size they're 32 px.

**Biggest remaining speed win (not done, your call):** phones download the full-size screenshots (1200 px wide) even where they show at about 330 px. Lighthouse estimates about **370 KB less on the Work page** (and 64 KB on home) with phone-sized copies, which would bring the Work page's main image in sooner (it's currently 3.2 s on slow 4G).

**Done (13 Nov 2026):** `npm run check` passes: 0 lint warnings, 74 tests (5 new: GSAP only on home, no sideways scrolling, compression, too-fast and no-Origin enquiries, a real browser submission).

**What to look at in your interface test:**
- Contact page: wait a few seconds, fill the form and send. You should get the "couldn't send" message with the email address (email isn't set up locally, Stage 1). That means it passed the new spam checks.
- Home page on a phone: the "Recently launched" links under the hero have a little more space.
- Everything else should look and behave the same.

## Stage 7: New repo, new Vercel project, Supabase backend (13 Nov 2026)

Decided: Supabase **stores enquiries and runs a private `/admin` page**; Gmail alerts stay; you create the GitHub repo.

### Done (code)

| # | What | Where |
|---|---|---|
| 7.1 | Database setup: `enquiries` table, admin list, row-level security (only admins can read/change; nobody can add except the site's server), shared spam limit, nightly 12-month clean-up. **Tested**: 26 checks in a real Postgres engine (PGlite) with stand-ins for Supabase's auth and scheduler. | `supabase/migrations/0001_enquiries.sql` |
| 7.2 | The contact form's server function **saves each enquiry in Supabase and emails it at the same time**. Success if either works, so a failed email never loses an enquiry. The spam limit (5 per 10 minutes per connection) is now shared across Vercel's servers. The secret key stays on the server. | `server/contact.js`, `server/supabase.js` |
| 7.3 | **`/admin`**: sign in, read enquiries (filter New / Replied / Client / Closed / All), reply shortcuts (email, or WhatsApp and call for phone numbers), change status, delete (with confirmation), sign out. Non-admin accounts see nothing. Noindex, blocked in robots.txt, not in the sitemap, no footer. Supabase's code (55.7 KB) loads **only** on this page. | `src/pages/Admin.jsx`, `src/lib/supabaseClient.js`, `server/adminConfig.js`, `api/admin-config.js` |
| 7.4 | Privacy policy updated: enquiries stored in Supabase (Mumbai), only the team can see them, spam counts deleted after 10 minutes, the admin page's sign-in is the only thing stored in a browser. | `src/pages/Privacy.jsx` |
| 7.5 | Security headers allow the browser to talk to Supabase (`connect-src https://*.supabase.co`). | `vercel.json` |
| 7.6 | Tests: 11 server unit tests (saving, email, fallbacks, shared limit, key handling) and 6 admin page tests against a **fake** Supabase. The test server ignores `.env`, so tests can never touch the real project or send email. `npm run check` passes: 0 lint warnings, 11 unit + 81 browser tests. | `tests/unit/`, `tests/admin.spec.js` |
| 7.7 | New git repo here (branch `main`), first commit made **locally only**. Line endings pinned (`.gitattributes`); no secrets, `node_modules` or build output committed. | `.git`, `.gitignore`, `.gitattributes` |

### Your steps, in order

**A. GitHub**
1. Create an **empty, private** repo (no README, no licence, no .gitignore), and send me its URL.
2. I add it as the remote and push `main`.

**B. Supabase**
1. Create a project. Region: **South Asia (Mumbai)** (the privacy policy says Mumbai; if you pick another, tell me and I'll change `DATA_REGION` in `src/pages/Privacy.jsx`).
2. SQL Editor: paste and run all of `supabase/migrations/0001_enquiries.sql`. If the `pg_cron` line fails: Database, Extensions, turn on **pg_cron**, run the file again.
3. Authentication, Sign In / Providers: turn **off** "Allow new users to sign up".
4. Authentication, Users, Add user: each team member (email + password, auto-confirm).
5. SQL Editor, for each team member: `insert into public.admins (user_id) select id from auth.users where email = 'their@email';`
6. Project Settings, API Keys: keep the **URL**, the **publishable** key and the **secret** key ready for Vercel. Never paste the secret key in chat, code or anywhere public.

**C. Vercel (new project)**
1. Add New, Project, import the GitHub repo (framework: Vite is detected; `vercel.json` sets the rest).
2. Settings, Environment Variables (Production and Preview):
   - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`
   - `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER` (Gmail address), `SMTP_PASS` (Gmail **App password**)
   - `SITE_URL` = the final address (e.g. `https://isoform.in`), no trailing slash
3. Domains: add your domain if you have one, then **Redeploy** so `SITE_URL` is used.
4. Tell me the live URL.

**D. Gmail**
- Enquiry alerts land in the inbox. The privacy policy promises deletion within 12 months, and only the database deletes automatically, so clear old alerts from Gmail yourself (search `older_than:1y`).

### Then I check (with your OK, as agreed)
- The live contact form: one real test enquiry, which should appear in `/admin` and arrive by email. (Sends a real email: I'll ask first.)
- `/admin` sign-in with your account, status change and delete on the test enquiry.
- `sitemap.xml`, canonical links and the social preview image on the live domain.

---

## Stage 8: Final check and launch

- [ ] Me: full `npm run check`, Lighthouse on the live site, and a check that every client link still works.
- [ ] You: interface test on phone, tablet and laptop, including `/admin`.
- [ ] You: point the domain at the new Vercel project (if not done in Stage 7) and retire the old one.

---

## Testing: who does what

### Your interface testing (each stage)
- Every page on phone, tablet and laptop: layout, spacing, text readable, nothing cut off.
- Home page: intro, services showcase, work cards. Does it feel smooth or tiring?
- Mobile menu, the services dropdown, Work filters, FAQ open and close.
- Contact form: fill it wrong, then right. Check the messages make sense.
- Try a cheap Android phone at least once (Stage 5 and 6).

### Technical testing I'll do (I'll ask before each run)

| Test | What it checks | Notes |
|---|---|---|
| Build + prerender | The site builds and every page gets real HTML. | Local only. |
| Playwright smoke tests | Pages load, no console or hydration errors, 404s, overflow, menu, form errors. | Installs Playwright and a test browser (about 150 MB download). |
| Accessibility scan (axe) | Automatic accessibility problems on every page. | Runs inside the smoke tests. |
| Contact API tests | Correct responses for valid, invalid, spam and wrong-format requests. | Local only, nothing sent. |
| Real email test | An enquiry actually reaches the inbox. | **Sends a real email**: always ask first. |
| Lighthouse | Speed, SEO and best-practice scores. | Runs against the local built site. |
| Bundle size check | JavaScript size before and after each stage. | Local only. |
| External link check | The client sites and Instagram links still open. | Makes requests to those sites. |
| GSAP / React Bits trial | Installs them in a throwaway copy, then builds and prerenders to catch conflicts early. | Doesn't touch the real project. |

---

## GSAP and React Bits: will they cause problems?

**Short answer:** they can be added safely, but not by just dropping them in. Three parts of this site need care: the pages are pre-built as HTML, there's a hand-written scroll system, and the site depends on `position: sticky`.

### Fine as they are
- **The security rules (CSP).** GSAP and React Bits are installed from npm and bundled into the site, so they count as the site's own scripts. Inline styles are already allowed.
- **React 19 and Tailwind 4.** GSAP's official React hook (`@gsap/react`, `useGSAP`) supports React. React Bits offers plain-JS versions, which suit this project (it doesn't use TypeScript).
- **Licences.** GSAP and all its plugins are free, including for commercial use. React Bits is MIT + Commons Clause: fine for client sites; it only stops reselling the components themselves.
- **Privacy promise.** Bundled code doesn't break "no third-party scripts". Just don't let any component load fonts or scripts from a CDN.

### Real risks, and how to avoid them

1. **The pages are pre-built in Node, where there's no browser** (`scripts/prerender.mjs`).
   - Any component that touches `window` or `document` during render or at import time will **break the build**. That at least fails loudly.
   - Any component that uses random values or screen size during render will cause **hydration mismatches** (the server HTML and the browser render disagree). That fails quietly, as warnings and flicker.
   - Rule: animation code only runs inside `useGSAP` / `useEffect`. Check every React Bits component for `Math.random()` or `window.innerWidth` in render.

2. **Two scroll systems fighting.** The site already moves things on scroll by hand:
   - Intro: `IntroStage.jsx:59-70` sets `transform`, `borderRadius` and `opacity` on every frame.
   - Showcase, Studio and Work sections set CSS variables (`--p`, `--cover`).
   - If GSAP animates the same elements, they'll fight and jitter.
   - Rule: move one section at a time to GSAP, then delete the old code for that section. Never let both control one element.

3. **Smooth-scroll libraries can break the layout.**
   - **GSAP ScrollSmoother: don't use it here.** It wraps the page in a moving container, which breaks `position: sticky` (the intro, services showcase and work cards) and the fixed header.
   - **Lenis** (often paired with React Bits) keeps sticky working. But it takes over mouse-wheel scrolling, which clashes with the intro's own "come in" scroll (`IntroStage.jsx:92-116`) and `scrollToHero()`. Those would need rewriting.
   - Recommendation: no smooth-scroll library, or Lenis only after the intro is reworked.

4. **ScrollTrigger positions can be wrong.**
   - The page changes height after it loads: the services showcase grows to 400% of the screen height when it switches on, and the intro shrinks or grows by screen shape.
   - ScrollTrigger measures positions once, so its trigger points would be off.
   - Rule: call `ScrollTrigger.refresh()` after those layout changes, or rebuild the showcase with GSAP pinning instead of CSS sticky.

5. **Reduced motion isn't automatic.**
   - The site's CSS turns off CSS animations for people who prefer less motion, but that rule doesn't affect GSAP (GSAP animates with JavaScript).
   - Rule: wrap every GSAP animation in `gsap.matchMedia()` with a `prefers-reduced-motion` check.

6. **Double animations.**
   - Headings already rise in (the `Rise` / `fade-up` CSS) and sections fade up (`Reveal.jsx`).
   - If GSAP or React Bits animate the same elements, they'll animate twice.
   - Rule: when an element gets a GSAP effect, remove its old class or wrapper.

7. **Accessibility.**
   - React Bits text effects (split text, scramble, typewriter) wrap each letter or word in its own tag. Screen readers can then read the text letter by letter.
   - Rule: give the full text to screen readers (an `aria-label`, or GSAP SplitText's `aria` option) and hide the split pieces.

8. **Size.**
   - GSAP + ScrollTrigger adds roughly 35 to 40 KB (compressed).
   - Some React Bits components pull in large libraries (three.js, ogl, motion, matter-js). three.js alone can more than double the site's JavaScript.
   - Rule: set a size limit, load heavy components only when needed, and prefer GSAP- or CSS-based React Bits pieces.

9. **Class name clashes.**
   - React Bits "CSS" versions come with plain stylesheets.
   - This site already uses short global class names (`.line`, `.pill`, `.chip`, `.glow`, `.band`, `.reveal`, `.phone`, `.browser`). A React Bits stylesheet with the same name would restyle parts of the site.
   - Rule: prefer the Tailwind versions, or check class names before adding a component.

### Recommended approach
1. Do Stages 1 to 4 first (the smoke tests catch regressions).
2. Trial GSAP + one React Bits component in a throwaway copy (the trial test above).
3. Move sections to GSAP one at a time (Studio section first, as it's the simplest; the intro last, as it's the riskiest).
4. Delete the hand-written scroll code once nothing uses it (`src/lib/scroll.js`, `useScrollTrack.js`).

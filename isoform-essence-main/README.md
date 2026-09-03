# ISOFORM Studio

# ISOFORM — Premium Web Agency Portfolio

## ROLE

Act as a **senior creative director, award-winning web designer, UX/UI designer, and frontend engineer** specializing in premium agency websites.

You are building the official portfolio website for **ISOFORM**, a modern web design and development agency.

The website should feel like a combination of:

* Awwwards-level creative agency
* Premium architecture/design studio
* Modern technology brand
* Minimal editorial website
* High-end digital experience

Do **not** make this look like a typical SaaS website, template, startup landing page, or generic agency portfolio.

The goal is to make visitors immediately think:

> **“These people build serious websites.”**

---

# 1. CORE DESIGN DIRECTION

Create a website that is:

* Modern
* Classy
* Minimal
* Premium
* Experimental but not confusing
* Editorial
* Highly visual
* Typography-focused
* Smooth and cinematic
* Professional enough for high-paying clients

Avoid:

* Generic cards
* Generic gradients
* Standard SaaS layouts
* Excessive rounded corners
* Generic navbar designs
* Stock illustrations
* Unnecessary UI components
* Overused glassmorphism
* Template-looking sections
* Excessive animations everywhere

Every visual element should have a reason to exist.

Use **large typography, whitespace, strong composition, asymmetrical layouts, subtle borders, grids, editorial spacing, and sophisticated motion.**

---

# 2. COLOR SYSTEM

Create a sophisticated modern color palette.

Primary direction:

* Deep black / near-black
* Warm off-white / ivory
* Soft gray
* One sophisticated accent color

The accent should feel contemporary and premium rather than neon or overly futuristic.

Use the accent color sparingly for:

* Hover states
* Links
* Small details
* Active navigation
* Interactive elements

The website should primarily feel **monochromatic and luxurious**.

Create CSS variables/design tokens for the entire color system so the palette can easily be changed later.

---

# 3. TYPOGRAPHY

Typography is one of the most important parts of the design.

Use a modern premium type system with:

### Display Font

A sophisticated modern grotesk or neo-grotesk typeface for:

* Hero headlines
* ISOFORM wordmark
* Large section headings

### Body Font

A highly readable modern sans-serif for:

* Paragraphs
* Navigation
* Project information
* Buttons
* Metadata

Use strong typographic hierarchy.

Hero typography should be **large, confident, and editorial**.

Do not use too many font families.

Use typography itself as a major visual element.

---

# 4. INITIAL PAGE LOADING EXPERIENCE

When the user first opens the website, create a **premium ISOFORM intro animation**.

The screen should initially be minimal.

Display:

**ISOFORM**

The word should appear through a sophisticated animation.

Possible direction:

* Letters reveal sequentially
* Subtle tracking animation
* Text moves from compressed to expanded
* Mask reveal
* Slight vertical movement
* Smooth opacity transition

After the logo animation completes, transition naturally into the hero section.

The animation must feel:

**cinematic + restrained + premium**

Do NOT make it feel like a flashy loading screen.

Keep the intro short so users are not forced to wait.

Use a smooth transition from the intro into the main website.

---

# 5. NAVIGATION

Create a minimal floating/sticky navigation.

Navigation should contain:

**ISOFORM**

Links:

* Work
* About
* Contact

Potential CTA:

**Start a Project**

The navbar should be extremely minimal.

On scroll:

* Navigation should subtly change
* Background/blur can appear if appropriate
* Typography and spacing should remain elegant

Do not use a huge conventional navbar.

---

# 6. HERO SECTION

The hero should be the strongest part of the website.

Create a visually impressive hero section with a large viewport presence.

Use strong copy around the idea of:

**Digital experiences shaped with intention.**

The messaging should communicate that ISOFORM creates:

* Websites
* Digital experiences
* Brand experiences
* Interactive interfaces

Do not use generic agency phrases such as:

“Take your business to the next level.”

Instead, create concise, confident editorial copy.

Example direction:

**WE SHAPE DIGITAL EXPERIENCES.**

Supporting copy:

**ISOFORM is an independent digital studio creating distinctive websites and experiences for ambitious brands.**

Include a subtle CTA:

**Explore our work →**

and optionally:

**Start a project →**

---

# 7. HERO VISUAL / MOTION

The hero should have an interactive visual element.

Use something abstract and connected to the concept of **form / geometry / transformation**.

Possible visual direction:

* Abstract geometric forms
* Shape morphing
* Fluid geometry
* Layered typography
* Distorted grid
* Interactive lines
* Subtle 3D object
* Generative form

The visual should represent the name **ISOFORM** without literally displaying a logo repeatedly.

Keep the interaction sophisticated.

Mouse movement can subtly influence the visual.

Do NOT create a distracting WebGL demo.

Performance is extremely important.

---

# 8. HERO SECONDARY SECTIONS

After the main hero, create 2–3 visually distinct sections before the portfolio.

### Section — Philosophy

Large editorial statement.

Example:

**WE DON'T BUILD MORE WEBSITES.
WE BUILD BETTER EXPERIENCES.**

Follow with a concise paragraph explaining ISOFORM's approach.

---

### Section — Capabilities

Instead of generic service cards, create an editorial list.

Example:

01 — Digital Design
02 — Web Development
03 — Interactive Experiences
04 — Creative Direction
05 — Brand Systems

Use large typography and hover interactions.

When hovering over a capability:

* Typography reacts
* Background subtly changes
* An image/visual can appear
* Cursor interaction can occur

Keep it elegant.

---

# 9. PROJECTS / WORK SECTION

Create a dedicated **WORK** section.

This is one of the most important sections.

Projects should not look like ordinary cards.

Use a large editorial project layout.

Each project should include:

* Project name
* Client
* Category
* Year
* Short description
* Large hero image
* Technologies used
* Project link
* Optional live website link

Create visually interesting project layouts such as:

* Full-width images
* Alternating layouts
* Large typography
* Asymmetrical grids
* Image reveal animations
* Horizontal scrolling sections where appropriate

Each project should feel like its own case study.

---

# 10. PROJECT DETAIL / CASE STUDY SYSTEM

Create a reusable project detail structure.

Every project should be able to contain:

### Project Information

* Project title
* Client
* Industry
* Year
* Services
* Technologies

### Hero

Large project hero image/video.

### Overview

Short explanation of the project.

### Challenge

What problem the project was solving.

### Approach

How ISOFORM approached the project.

### Solution

What was created.

### Visual Showcase

Allow multiple:

* Images
* Videos
* Screenshots
* UI sections

### Technology

Display technologies used.

Example:

React
Next.js
GSAP
Supabase
Three.js

### Live Project

Include a prominent button:

**Visit Live Website →**

This should open the client's website in a new tab.

---

# 11. PROJECT ADMIN PANEL / CMS

This is REQUIRED.

Create an admin system where ISOFORM can manage portfolio projects without editing the frontend manually.

The admin panel should allow us to:

### Create Project

Fields:

* Project title
* Slug
* Client
* Category
* Year
* Description
* Challenge
* Approach
* Solution
* Services
* Technologies
* Hero image
* Project images
* Project videos
* Live project URL
* Featured project toggle
* Display order

### Edit Project

Allow all project information to be updated.

### Delete Project

Allow projects to be removed.

### Publish / Draft

Projects should have:

* Draft
* Published

status.

### Featured Project

Allow us to choose which projects appear prominently on the homepage.

### Reordering

Allow us to control project order.

---

# 12. DATABASE

Use **Supabase** for the backend/database.

Create a clean database architecture.

Suggested structure:

### projects

* id
* title
* slug
* client
* category
* year
* description
* challenge
* approach
* solution
* services
* technologies
* hero_image
* live_url
* featured
* published
* display_order
* created_at
* updated_at

Create appropriate relationships/storage structures for project media.

Use Supabase Storage for project images/videos where appropriate.

Do NOT expose private admin credentials or service-role keys on the client.

---

# 13. ADMIN AUTHENTICATION

Create a secure admin login.

Only authorized ISOFORM administrators should be able to access:

`/admin`

Use Supabase authentication.

Protect admin routes properly.

Normal website visitors should never be able to access project management functionality.

---

# 14. PROJECT MEDIA SYSTEM

The admin should make it easy to upload project media.

Support:

* Hero images
* Gallery images
* Project screenshots
* Optional video

Images should be optimized appropriately.

Use responsive image loading.

Lazy-load images that are below the fold.

Do not allow huge unoptimized assets to destroy performance.

---

# 15. GSAP ANIMATIONS

Use **GSAP** extensively but intelligently.

Use GSAP for:

* Page entrance animations
* Typography reveals
* Image reveals
* Scroll-triggered animations
* Project transitions
* Hover interactions
* Section transitions
* Parallax
* Horizontal scrolling where appropriate

Use **ScrollTrigger** where appropriate.

Animations should feel:

* Smooth
* Controlled
* Cinematic
* Intentional

Do not animate every element.

The design should still work beautifully with animations disabled.

---

# 16. SMOOTH SCROLL

Implement premium smooth scrolling.

Use an appropriate modern smooth-scroll solution integrated with GSAP.

The scrolling experience should feel:

**fluid + responsive + premium**

Avoid excessive scroll-jacking.

Make sure native accessibility and usability are preserved.

---

# 17. CUSTOM CURSOR

On desktop, consider implementing a custom cursor.

The cursor can react to:

* Links
* Project images
* Buttons
* Interactive elements

For example:

When hovering over a project:

**VIEW PROJECT →**

appears near the cursor.

Keep the cursor subtle.

Disable or simplify it on touch devices/mobile.

---

# 18. RESPONSIVE DESIGN

The website must be fully responsive.

Design specifically for:

* Desktop
* Laptop
* Tablet
* Mobile

Do NOT simply shrink the desktop layout.

Create mobile-specific layouts where necessary.

Animations should also be optimized for mobile.

Avoid heavy effects that negatively affect mobile performance.

---

# 19. PAGE STRUCTURE

Create the following structure:

### `/`

Homepage:

1. Intro animation
2. Navigation
3. Hero
4. Philosophy
5. Capabilities
6. Featured Work
7. About/Studio statement
8. Contact CTA
9. Footer

### `/work`

Complete project portfolio.

### `/work/[project-slug]`

Individual project/case study page.

### `/about`

ISOFORM studio information, philosophy, capabilities, and approach.

### `/contact`

Premium contact experience.

### `/admin`

Protected project management dashboard.

---

# 20. CONTACT SECTION

Create a strong final CTA.

Large typography.

Example direction:

**HAVE A PROJECT IN MIND?**

**LET'S SHAPE IT.**

Include:

* Email
* Social links
* Contact form

The contact section should feel like a continuation of the brand rather than a generic form.

---

# 21. FOOTER

Keep the footer minimal.

Include:

**ISOFORM**

Navigation:

* Work
* About
* Contact

Social:

* Instagram
* LinkedIn
* Behance / relevant portfolio platform

Email:

**hello@isoform...**

Do not invent a final domain/email if it has not been configured yet. Use a clearly replaceable placeholder.

Include copyright.

---

# 22. TECHNOLOGY

Preferred stack:

* React / Next.js
* TypeScript
* Tailwind CSS where useful
* GSAP
* GSAP ScrollTrigger
* Supabase
* Supabase Storage

Use reusable components and clean architecture.

Keep the code maintainable.

Do not create one giant component.

Separate:

* Layout
* Navigation
* Hero
* Projects
* Project cards
* Project detail
* Animations
* Admin
* Database utilities
* UI primitives

---

# 23. PERFORMANCE

The website should look premium without becoming slow.

Prioritize:

* Image optimization
* Lazy loading
* Code splitting
* Efficient GSAP animations
* GPU-friendly transforms
* Minimal unnecessary JavaScript
* Responsive images
* Proper caching
* Reduced motion support

Avoid expensive effects when they don't add meaningful value.

---

# 24. ACCESSIBILITY

Implement:

* Semantic HTML
* Keyboard navigation
* Proper contrast
* Alt text
* Focus states
* Accessible forms
* Reduced-motion support

Animations must not make the website unusable.

---

# 25. IMPORTANT CREATIVE RULE

Do NOT use generic Lovable-generated UI.

Do not create:

* Standard dashboard cards
* Generic hero cards
* Generic pricing-style layouts
* Generic rounded buttons everywhere
* Generic gradient backgrounds
* Generic testimonial carousels
* Generic SaaS navigation
* Generic component-library aesthetics

Instead, create a **custom visual language specifically for ISOFORM.**

Think:

**Editorial × Architecture × Digital Art × Technology**

rather than:

**SaaS × Startup × Template.**

---

# 26. BRAND FEEL

The website should communicate:

**Precision.
Form.
Intelligence.
Craft.
Confidence.
Simplicity.**

ISOFORM should feel like a studio that cares about details.

Every spacing value, animation, typography decision, image treatment, and interaction should feel intentional.

---

# 27. FINAL IMPLEMENTATION REQUIREMENT

Before considering the website complete:

1. Build the homepage.
2. Build the portfolio/work page.
3. Build reusable project detail pages.
4. Build the Supabase database.
5. Build Supabase Storage integration.
6. Build secure admin authentication.
7. Build the admin project management dashboard.
8. Implement project creation/edit/delete.
9. Implement project publishing/drafting.
10. Implement featured project selection.
11. Implement project ordering.
12. Implement live project links.
13. Implement GSAP animations.
14. Implement smooth scrolling.
15. Implement responsive layouts.
16. Optimize performance.
17. Test desktop and mobile.
18. Test admin functionality.
19. Test project creation → database → frontend display flow.
20. Make sure no placeholder/demo functionality remains where real functionality is required.

Most importantly:

**Do not stop at designing the frontend. Build the actual portfolio system so ISOFORM can continue adding projects in the future through the admin panel.**

The final result should feel like a **premium digital studio website**, not a generated template.

The first impression should be unforgettable, but the design should remain timeless enough that ISOFORM can use it for years.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9a2ac709-21cf-4342-89dc-b5d061b2834a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

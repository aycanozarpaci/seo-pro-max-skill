---
name: seo-pro-max
description: Production-grade SEO implementation skill. Analyzes the existing project first, asks the user the right questions, and then implements every chosen SEO surface (meta tags, Open Graph, Twitter Cards, canonical, robots, sitemap, schema.org/JSON-LD, favicons, llms.txt, admin-panel wiring, database schema) exactly as the user decided. The skill is an EXECUTOR, not a decision-maker.
license: MIT
---

# seo-pro-max

> A cross-IDE SEO skill. Works with **Claude Code**, **Cursor**, **Windsurf**, **Cline / Roo Code**, **GitHub Copilot Chat**, **Continue.dev**, **Aider**, **Zed AI**, and any agent that can read a Markdown rules file.

## Core Principle

**This skill does not decide. The user decides; this skill executes.**

- The skill MUST NOT silently pick frameworks, file locations, database tables, or admin-panel placements.
- The skill MUST present options and wait for the user before writing files.
- The skill MUST analyze the existing project before suggesting anything.

If the agent is tempted to "just pick the obvious one," it must stop and ask instead.

---

## Operating Protocol (Mandatory Order)

### Phase 0 — Read the project

Before any question, the agent must inventory:

1. Framework / runtime — look for `package.json`, `composer.json`, `requirements.txt`, `pyproject.toml`, `Gemfile`, `go.mod`, `pubspec.yaml`, `next.config.*`, `nuxt.config.*`, `astro.config.*`, `vite.config.*`, `remix.config.*`, `svelte.config.*`, `artisan`, `manage.py`.
2. Rendering model — SSR / SSG / SPA / hybrid / RSC / ISR.
3. Routing convention — file-based (`app/`, `pages/`, `src/routes/`, `src/pages/`) vs. controller-based (Laravel `routes/web.php`, Django `urls.py`, Express routers).
4. Existing SEO surface — any current `<head>` management, `metadata` exports, `Helmet`, `next/head`, `useSeoMeta`, blade `@section('meta')`, etc.
5. Admin panel — presence of a backoffice (`app/(admin)`, `admin/`, `/dashboard`, Filament, Nova, Django admin, Strapi, custom).
6. Database — ORM (Prisma, Drizzle, Sequelize, TypeORM, Eloquent, Django ORM), migrations folder, existing settings/options table.
7. i18n — `next-intl`, `next-i18next`, `vue-i18n`, `nuxt-i18n`, Laravel locales, Django i18n.
8. Hosting hints — `vercel.json`, `netlify.toml`, `wrangler.toml`, `Dockerfile`, nginx configs.

The agent reports findings as a short summary, then proceeds to Phase 1.

### Phase 1 — Scope intake (ask, don't assume)

The agent asks the user, one block at a time, which SEO surfaces are in scope. **Default to none.** Each surface is opt-in.

```
Which SEO surfaces should I set up?
[ ] Meta basics (title, description, keywords, language, viewport, charset, theme-color)
[ ] Indexing controls (robots meta, X-Robots-Tag, canonical)
[ ] robots.txt
[ ] XML sitemap (single / index / per-locale)
[ ] Open Graph (Facebook, LinkedIn, WhatsApp, Slack, Discord previews)
[ ] Twitter / X Cards
[ ] Schema.org JSON-LD (Organization, WebSite, Article, Product, BreadcrumbList, FAQ, LocalBusiness, ...)
[ ] Favicons & PWA manifest (favicon.ico, apple-touch-icon, manifest.webmanifest, theme-color)
[ ] Search engine verification (Google Search Console, Bing Webmaster, Yandex)
[ ] llms.txt (see note below)
[ ] Admin-panel UI for SEO data
[ ] Database schema for SEO data
[ ] Per-page overrides (slug-level metadata)
[ ] Language, i18n & hreflang (BCP 47, RTL, bidirectional hreflang, x-default)
[ ] Accessibility / WCAG 2.2 AA (image alt-text enforcement, contrast, keyboard, landmarks, heading hierarchy)
[ ] OG image generation (static / dynamic)
[ ] Core Web Vitals & page performance (LCP, CLS, INP, font, third-party scripts)
[ ] Image optimization (srcset, sizes, AVIF/WebP, lazy, CLS prevention)
[ ] URL structure & slug rules (case, separator, Unicode/Turkish policy, length)
[ ] Internal linking & orphan detection (anchor text, link depth, faceted nav)
[ ] Security & Lighthouse headers (HSTS, CSP, Referrer-Policy, Permissions-Policy)
[ ] Search engine submission & IndexNow (GSC, Bing, Yandex, Naver, Baidu)
[ ] SPA hydration & client-side meta updates
```

### Phase 2 — Per-surface drill-down

For every selected surface, the agent asks the specific questions in the matching section below. The agent **does not pick defaults** — if the user says "you choose," the agent presents 2–3 options with trade-offs and waits.

### Phase 3 — Plan & confirm

The agent prints a written plan: files to create, files to modify, migrations to add, routes to register, admin pages to add. **No writes** until the user types "go" / "ok" / explicit confirmation.

### Phase 4 — Implement

Execute the confirmed plan. One commit-sized chunk at a time. After each chunk, report path + 1-line description.

### Phase 5 — Verify

- Lint / typecheck pass.
- Build pass.
- `curl -I` the homepage and one inner route; show response headers.
- Fetch HTML, grep for required tags, report counts.
- **HTTP status verification** (Surface 2 policy):
  - `curl -sI <homepage>` → expect `200`.
  - `curl -sI <known-good-inner-route>` → expect `200`.
  - `curl -sI '<base>/__definitely-does-not-exist-<random>'` → expect `404`, NOT `200`. Print `HTTP/1.1 200` here as a **FAIL** with the soft-404 explanation.
  - `curl -sI '<base>/sitemap.xml'` → expect `200` and `Content-Type: application/xml`.
  - `curl -sI '<base>/robots.txt'` → expect `200` and `Content-Type: text/plain`.
  - `curl -sIL '<http-base>'` → expect first hop `301` to HTTPS, second hop `200`.
  - `curl -sIL '<base>/About'` (mixed case) → expect `301` to `/about`, then `200`.
  - `curl -sIL '<base>/about/'` (trailing slash variant) → expect `301` to the canonical form, then `200`.
  - For any route the user marked as "retired" → expect `410` (or `301` to its replacement).
  - For any auth-walled route hit without credentials → expect `401` or `302` to login, never `200` with a login form rendered to bots.
- For sitemaps and `robots.txt`: hit the public URL and show the body.
- For JSON-LD: validate JSON parses; warn if Google's required fields are missing.
- For accessibility (Surface 15): run `axe-core` against the homepage and one inner route; print a count of violations grouped by impact (critical / serious / moderate / minor). Run the alt-text auditor: grep all `<img>` tags in the built HTML and report any without `alt=` or with auto-generated placeholder alt. Run the heading auditor: per route, print `h1` count and the first skipped-level jump (if any).

---

## Surface 1 — Meta Basics

### What it covers
`<title>`, `<meta name="description">`, `<meta name="keywords">` (see policy below), `<meta charset>`, `<meta name="viewport">`, `<html lang>`, `<meta name="theme-color">`, `<meta name="author">`, `<meta name="generator">`.

### `<meta name="keywords">` policy (must tell the user verbatim before emitting)

> The behaviour of search engines toward the `keywords` meta tag is **not uniform** — and that matters when the site targets non-Western markets.
>
> - **Google** — does not use it for ranking. Stated publicly since 2009. Source: https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag
> - **Bing** — does not use it for ranking. Has stated it can be a quality signal *against* the page when stuffed.
> - **DuckDuckGo / Brave Search** — inherit Bing's signal in practice; do not use it.
> - **Yandex** — historically uses it as a weak hint; current public guidance is unclear, but the field is still parsed.
> - **Baidu** — still reads it as a signal in China.
> - **Naver (KR)** — does not use it.
>
> Decision rule the skill applies:
>
> - Site's target market is Western (US/EU/TR/LATAM) only → **omit** `keywords`. Adding it is dead weight and clutters the head.
> - Site targets RU/CIS (Yandex) or CN (Baidu) → emit `keywords` with 3–6 honest, comma-separated terms per page; never repeat the same set site-wide; never stuff.
> - The skill never fabricates keywords from the slug or body. If the editor cannot provide them, omit the tag.

### Questions to ask
1. Site name? Tagline?
2. Title strategy — `Page | Site` / `Site — Page` / page only / custom template?
3. Title max length policy? (Recommend 50–60 chars but ask.)
4. Description length policy? (Recommend 140–160 but ask.)
5. Default language code (`lang="?"`)?
6. Theme color (light / dark variants)?
7. Where do per-page overrides live — at the route file, in a CMS, in the database, or all three?
8. **`<title>` ↔ `<h1>` relationship.** The page `<h1>` should mirror or paraphrase the `<title>` (same topic, different phrasing allowed) — they are read together as the page's identity signal by Google. Confirm both are sourced from the same DB field (cheap; recommended) or kept as separate fields (more editorial control; more drift risk). The heading hierarchy rules live in Surface 15 — do not bypass them just because Surface 1 owns the `<title>`.
9. **`keywords` meta decision** — per the policy above, confirm: target markets, emit or omit, and if emit, source of the per-page keyword list.

### Output locations (framework-dependent)
- **Next.js App Router** → `export const metadata` / `generateMetadata` in `layout.tsx` and per `page.tsx`.
- **Next.js Pages Router** → `next/head` or `next-seo`.
- **Nuxt 3** → `useSeoMeta()` / `definePageMeta()` / `app.head` in `nuxt.config`.
- **Astro** → `<head>` slot in layout + per-page frontmatter.
- **SvelteKit** → `<svelte:head>` in `+layout.svelte` and `+page.svelte`.
- **Remix** → `meta` export per route.
- **Laravel + Blade** → `@stack('meta')` and a `<x-seo />` component.
- **Django** → `{% block meta %}` in `base.html`.
- **WordPress** → `wp_head` action hook in theme.
- **Plain HTML** → `<head>` of each template.

---

## Surface 2 — Indexing Controls

### What it covers
`<meta name="robots">`, `X-Robots-Tag` HTTP header, `<link rel="canonical">`, alternate hreflang, pagination (`rel="prev/next"` is deprecated by Google but ask).

### Questions
1. Which routes are `index, follow` vs. `noindex` / `nofollow`?
2. Should auth-walled pages, drafts, search-result pages, and faceted URLs be `noindex`?
3. Canonical strategy — self-canonical on every page, or canonical to a parent for paginated/faceted?
4. Are there cross-domain canonicals (mirror sites, syndicated content)?
5. Strip query strings from canonical? Which ones (`utm_*`, `ref`, `fbclid`)?
6. hreflang pairs — confirm the locale list and the URL pattern (`/en/`, `?lang=en`, `en.example.com`).
7. **HTTP status policy** — confirm the response codes the framework will emit. See "HTTP status code policy" below; non-negotiable rules apply.

### HTTP status code policy (mandatory; verified in Phase 5)

Wrong status codes are an SEO-critical defect. Google indexes by status; a `200 OK` page that visually says "not found" (a **soft 404**) gets indexed as a valid page and wastes crawl budget, then later gets demoted with a vague "Soft 404" Search Console warning. The skill enforces real status codes at the framework layer.

Required behavior per route class:

| Route class                                                        | Status   | Headers / extras                                                              |
|--------------------------------------------------------------------|----------|-------------------------------------------------------------------------------|
| Existing content                                                   | `200`    | `Cache-Control` set; `Content-Type` correct.                                  |
| Unknown URL / missing resource                                     | `404`    | Real 404, never a 200 with a "not found" UI. Page should still render the branded 404 UI. |
| Permanently removed (gone for good, no replacement)                | `410`    | Use 410 instead of 404 when the URL is intentionally retired and you want Google to drop it faster. |
| Permanent move to new URL                                          | `301`    | `Location:` header; one hop only; never chain.                                |
| Temporary move / A-B test / region routing                          | `302` / `307` | 307 preserves method; 302 may downgrade `POST` to `GET`.                      |
| Permanent move that must preserve method (POST → POST)             | `308`    | Strict permanent redirect.                                                    |
| Auth-walled page hit unauthenticated                                | `401`    | Not `200` with a login form rendered as the page body for bots.               |
| Forbidden (logged in but not allowed)                              | `403`    | Same rule: real status.                                                       |
| Rate-limited                                                       | `429`    | `Retry-After:` header.                                                        |
| Scheduled maintenance / planned downtime                           | `503`    | `Retry-After:` header. Never use `200` with a maintenance page — Googlebot will index the maintenance message. |
| Server error (uncaught)                                            | `5xx`    | Default framework behavior; verify it's actually 500-class, not 200.          |
| Empty-state inside an existing valid route (e.g. empty search)     | `200`    | This is NOT a 404 — the route exists, the result set is empty. Render a clear empty-state UI; `noindex` is acceptable.|

Anti-patterns the skill refuses:

- Returning `200 OK` from a custom `not-found.tsx` / `404.vue` / `404.blade.php` / custom 404 view when the framework would have emitted 404. Confirm the status is preserved by the framework wrapper (Next App Router `notFound()`, Nuxt `throw createError({ statusCode: 404 })`, SvelteKit `error(404, ...)`, Laravel `abort(404)`, Django `Http404`, Astro `Astro.response.status = 404`).
- "Catch-all" routes that swallow unknown slugs and render a default page with 200.
- Redirect chains (`/a` → `/b` → `/c`). Collapse to one hop.
- Mixed-case duplication (`/About` and `/about` both `200`). Pick one canonical case and 301 the other.
- Trailing-slash duplication (`/about` and `/about/` both `200`). Pick one and 301 the other.
- HTTPS upgrade serving `200` on HTTP — must be `301` from `http://` to `https://`.
- `www` vs apex both `200`. One canonical, the other `301`.

Per-framework wiring the skill must verify:

- **Next.js App Router** — `notFound()` from a server component triggers `not-found.tsx`; confirm the response status is 404 in Vercel/CDN headers, not 200.
- **Next.js Pages Router** — `getStaticProps` / `getServerSideProps` returning `{ notFound: true }` produces a real 404.
- **Nuxt 3** — `throw createError({ statusCode: 404, fatal: true })`.
- **Astro** — `Astro.response.status = 404;` inside a `[...slug].astro` catch-all when the slug is unknown.
- **SvelteKit** — `import { error } from '@sveltejs/kit'; error(404, 'Not Found');`.
- **Remix** — `throw new Response(null, { status: 404 })`.
- **Laravel** — `abort(404)`; views in `resources/views/errors/404.blade.php` keep the status.
- **Django** — `raise Http404` or return `HttpResponseNotFound`.
- **Express / Fastify** — `res.status(404).render(...)`, not `res.render(...)` alone.
- **Static hosts** — Netlify `_redirects` (`/* /404.html 404`), Vercel `not-found.html` with explicit status, Cloudflare Pages `_redirects` syntax, S3+CloudFront error mapping.

Sitemap / canonical interplay:

- A URL emitting `404` / `410` / `5xx` MUST NOT appear in `sitemap.xml`. Sitemap generators (Surface 4) query live content; the skill verifies that 404'd URLs are absent.
- A URL with a `canonical` pointing elsewhere should still return `200`. If the page is retired, use `301` / `410`, not canonical-as-redirect.
- A `noindex` page should still return `200` (or the appropriate real status); `noindex` is not a substitute for `404` / `410`.

### Pagination canonical policy (Google deprecated `rel="prev/next"` in 2019)

Google announced in March 2019 that it no longer uses `<link rel="prev">` / `<link rel="next">` as an indexing signal. Most sites still emit them incorrectly. The skill's policy:

- **Do not emit** `<link rel="prev">` / `<link rel="next">` for the purpose of helping Google. They are harmless but dead weight. Bing still reads them weakly; emit only if the user explicitly wants Bing-paginated handling.
- Each paginated page **self-canonicals** to itself (`/blog?page=2` → canonical `/blog?page=2`). Do not canonical page 2+ back to page 1 — that hides the deeper pages from Google and they will not be crawled.
- Paginated pages should be `index, follow`, not `noindex`, unless the content is fully duplicated elsewhere.
- The "view all" pattern is acceptable if the all-results page loads in reasonable time; in that case, paginated pages canonical to the view-all URL.
- For infinite-scroll, ensure the same content is reachable via real paginated URLs (`?page=N`) — Google will not execute scroll-triggered loading.

### 404 page UX policy (the friendly-404 pattern)

Google's documentation calls helpful 404s a positive UX signal and an "important part of a healthy site." The page still returns the real `404` status (per status policy above), but its body is designed for the user:

- Branded header / footer (same as the rest of the site so the user knows they're not on a different domain).
- Clear, human heading — `<h1>`Page not found`</h1>` (per Surface 15 heading rules — yes, the 404 page MUST have an `<h1>`).
- A site search box (if site has search).
- 3–6 popular / recommended links: home, top-level sections, last-published posts/products.
- Optional: report-broken-link form (`mailto:` or a real endpoint).
- Anti-pattern: meta refresh redirect to homepage. Banned by the skill.
- Anti-pattern: showing the 404 UI but returning `200` (covered above as soft-404).
- The 404 page itself is `noindex, follow`.

---

## Surface 3 — robots.txt

### Questions
1. Allow all by default, then disallow listed paths — or disallow all and allow listed?
2. Disallow patterns — `/admin`, `/api`, `/_next`, `/cdn-cgi`, `/cart`, `/checkout`, search pages?
3. Different rules per user-agent? (e.g. block `GPTBot`, `CCBot`, `ClaudeBot`, `Google-Extended`, `anthropic-ai`, `PerplexityBot`, `Bytespider` — ask explicitly, this is a content-licensing decision.)
4. Sitemap URL(s) to advertise — single, multiple, sitemap index?
5. Crawl-delay? (Google ignores it; Yandex and Bing honor it.)

### Output locations
- Static: `public/robots.txt` (Next, Vite, Nuxt, Astro), `static/robots.txt` (SvelteKit), `public/robots.txt` (Laravel).
- Dynamic: Next App Router `app/robots.ts`, Nuxt module, Express route, Django view, Laravel route returning `text/plain`.

---

## Surface 4 — XML Sitemap

### Questions
1. One sitemap or sitemap index?
2. Per-locale split? Per content type (pages / posts / products)?
3. Source of URLs — file system routes, database query, headless CMS, or hybrid?
4. Include `lastmod`, `changefreq`, `priority`? (`changefreq`/`priority` are mostly ignored by Google — ask anyway.)
5. Cache strategy — regenerate on each request, on cron, on content update (webhook / hook)?
6. Image sitemap entries? Video sitemap entries? News sitemap?
7. Max URLs per file (cap is 50,000 / 50 MB — split before that).

### Output locations
- Next App Router → `app/sitemap.ts` (returns `MetadataRoute.Sitemap`).
- Nuxt → `@nuxtjs/sitemap` or custom server route.
- Laravel → `spatie/laravel-sitemap` or a controller returning XML.
- Django → `django.contrib.sitemaps`.
- Static → generated at build time and written to `public/sitemap.xml`.

---

## Surface 5 — Open Graph

### What it covers
`og:title`, `og:description`, `og:type`, `og:url`, `og:site_name`, `og:locale`, `og:locale:alternate`, `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `og:image:type`, plus type-specific (`article:published_time`, `article:author`, `product:price:amount`, etc.).

### Questions
1. Default OG image — single static asset or dynamic per page?
2. If dynamic: rendered at build, rendered on request (edge function / `@vercel/og` / `satori`), or pre-uploaded per record?
3. Image dimensions — `1200×630` (standard), or also `1080×1080` for Instagram/LinkedIn square previews?
4. Fall-back chain when a page lacks its own OG image?
5. `og:type` per route group (website / article / product / profile / book / video).
6. Per-locale alternates required?
7. `og:image:alt` policy — every OG image MUST emit `og:image:alt` (see Surface 15 alt-text policy). Where does the alt string come from — same DB column as the image's primary `alt`, or a separate `og_alt`?

---

## Surface 6 — Twitter / X Cards

### What it covers
`twitter:card` (`summary` / `summary_large_image` / `app` / `player`), `twitter:site`, `twitter:creator`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`.

### Questions
1. Card type per route group?
2. `@handle` for site and for author?
3. Reuse OG image or have a separate Twitter image (the platforms now share image fields, but ask)?
4. `twitter:image:alt` — same alt-text policy as Surface 15 applies. Never omit; never auto-fill from filename.

---

## Surface 7 — Schema.org / JSON-LD

### What it covers (only enable types the user confirms)
`Organization`, `WebSite` (+ `SearchAction`), `WebPage`, `BreadcrumbList`, `Article` / `NewsArticle` / `BlogPosting`, `Product` + `Offer` + `AggregateRating` + `Review`, `QAPage`, `HowTo`, `Recipe`, `Event`, `LocalBusiness` (and subtypes), `Person`, `VideoObject`, `ImageObject`, `Course`, `JobPosting`, `SoftwareApplication`, `Dataset`, `SoftwareSourceCode`, `Book`, `MusicRecording`, `MovieSeries`, `TVSeries`, `RealEstateListing`, `MedicalEntity`, `Service`.

### Schema recommendation engine (Phase 0 output drives this)

The skill **proposes** types based on what Phase 0 detected in the project. The user always confirms. Use this matrix as the suggestion source — never silently apply.

| Detected in project                                                       | Suggest these types                                                                         | Notes                                                                                                          |
|---------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| Any production site (root layout)                                         | `Organization` + `WebSite` (+ `SearchAction` if search route exists)                        | One per site, emitted on homepage / root layout only.                                                          |
| Breadcrumb component, nested routes, or sitemap with depth > 1            | `BreadcrumbList`                                                                            | Required when nav has visible breadcrumbs; Google won't show them otherwise.                                   |
| Blog routes (`/blog`, `/posts`, `app/blog/[slug]`, CMS post collection)    | `BlogPosting` (or `Article` if generic)                                                     | `headline` ≤ 110 chars; `image` ≥ 1200px wide; require `datePublished` + `dateModified` + `author`.            |
| News routes / press section                                               | `NewsArticle`                                                                               | Stricter than `Article`; also register with Google News if applicable.                                         |
| E-commerce (cart, checkout, product detail routes, product table)         | `Product` + `Offer` (+ `AggregateRating` + `Review` only with real data)                    | Never fabricate ratings. Must include `price`, `priceCurrency`, `availability`.                                |
| Job listing routes / `jobs` table                                         | `JobPosting`                                                                                | `datePosted`, `validThrough`, `hiringOrganization`, `jobLocation` required.                                    |
| Recipe site / `recipes` table                                             | `Recipe`                                                                                    | Needs `recipeIngredient`, `recipeInstructions`, `cookTime`, `nutrition` for full eligibility.                  |
| Event listings / calendar / ticketing                                     | `Event` (+ subtypes: `MusicEvent`, `BusinessEvent`, …)                                      | `startDate`, `location`, `offers` recommended.                                                                 |
| Physical address in footer / `contact` page / multi-branch                | `LocalBusiness` (use the most specific subtype: `Restaurant`, `Dentist`, `Store`, …)        | Include `geo`, `openingHoursSpecification`, `priceRange`. One per branch.                                      |
| Course/lesson content                                                     | `Course` (+ `CourseInstance`)                                                               | Required for Google's Course rich result.                                                                      |
| Video player on routes / `<video>` tags / Mux/Cloudinary video URLs       | `VideoObject`                                                                               | Needs `thumbnailUrl`, `uploadDate`, `duration` (ISO 8601).                                                     |
| Hosted SaaS / web app / mobile app store links                            | `SoftwareApplication` (and/or `WebApplication`, `MobileApplication`)                        | Useful for app-store-style rich cards.                                                                         |
| Open source / docs site / GitHub link in footer                           | `SoftwareSourceCode`                                                                        | Surfaces code-related rich results in Google's developer-doc surfaces.                                         |
| Real estate listings                                                      | `Residence` / `Accommodation` / `RealEstateListing` (per current Schema.org draft)          | Confirm with the user which subtype matches their inventory.                                                   |
| Dataset / research / open data portal                                     | `Dataset`                                                                                   | Google Dataset Search uses this; needs `creator`, `license`, `distribution`.                                   |
| Author bios, team page, contributor pages                                 | `Person` (and link from `Article.author` / `Organization.member`)                           | Use `sameAs` to disambiguate.                                                                                  |
| Customer support / Q&A page where one user asks, many users answer        | **`QAPage`** (single accepted+suggested answers, see deprecation note below)                | `mainEntity` is a `Question` with `acceptedAnswer` (one) and `suggestedAnswer` (many).                         |
| Site's own FAQ list authored by the brand                                 | **Do not use `FAQPage` for new builds** — see deprecation note. Render as plain HTML.       | Keep the questions visible to users in HTML; just omit the JSON-LD wrapper.                                    |
| Books / publications catalogue                                            | `Book` (+ `BookSeries`)                                                                     |                                                                                                                |
| Medical site (regulated)                                                  | `MedicalEntity` family (`MedicalCondition`, `Drug`, …)                                      | Confirm regulatory disclaimers; do not auto-populate.                                                          |
| Generic service business (not local)                                      | `Service` linked to `Organization.providerOf`                                               |                                                                                                                |

### FAQPage deprecation notice (must be told to the user verbatim before any FAQ-related suggestion)

> **Google is removing FAQ rich results.** As of **May 7, 2026**, FAQ rich results are no longer appearing in Google Search.
> Google will drop the FAQ search appearance, the FAQ Rich Result report, and FAQ support in the Rich Results Test in **June 2026**.
> Search Console API support for the FAQ rich result will be removed in **August 2026**.
>
> Source: https://developers.google.com/search/docs/appearance/structured-data/faqpage
>
> **Implication for this skill:**
> - For new builds, do **not** emit `FAQPage` JSON-LD — it gains nothing in Google and adds maintenance cost. Render the FAQ content as plain accessible HTML (`<details>` / headings + paragraphs).
> - If the page is genuinely a Q&A (one question asked by a user, multiple community answers — like Stack Overflow), use **`QAPage`** instead. `QAPage` is not affected by this deprecation.
> - If the user explicitly insists on shipping `FAQPage` anyway (e.g. for non-Google search engines or third-party consumers that still parse it), the skill MAY emit it — but must record this decision in `seo.config.md` with the user's reason.

### QAPage shape (use when a page is real community Q&A)

```json
{
  "@context": "https://schema.org",
  "@type": "QAPage",
  "mainEntity": {
    "@type": "Question",
    "name": "TODO: the actual question text",
    "text": "TODO: longer question body",
    "answerCount": 0,
    "upvoteCount": 0,
    "dateCreated": "TODO: ISO-8601",
    "author": { "@type": "Person", "name": "TODO" },
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "TODO: the accepted answer body",
      "dateCreated": "TODO: ISO-8601",
      "upvoteCount": 0,
      "url": "TODO: deep link to the answer",
      "author": { "@type": "Person", "name": "TODO" }
    },
    "suggestedAnswer": [
      {
        "@type": "Answer",
        "text": "TODO",
        "dateCreated": "TODO",
        "upvoteCount": 0,
        "url": "TODO",
        "author": { "@type": "Person", "name": "TODO" }
      }
    ]
  }
}
```

Rules:
- `QAPage` is only valid when the page is **one question** with discrete answers. Do not wrap a generic FAQ list in `QAPage`.
- `acceptedAnswer` is at most one. `suggestedAnswer` is an array of zero or more.
- Each answer needs a stable `url` (anchor or permalink) so Google can deep-link.

### Questions to the user
1. Based on the table above, here is my **proposed** type list for your project: `<list>`. Confirm, add, or remove items?
2. Single combined `@graph` object per page or multiple discrete `<script>` blocks? (Recommendation: `@graph` keeps things deduplicated; ask anyway.)
3. Source of fields — route file frontmatter, database column, headless CMS field, or hardcoded constants? (May differ per type.)
4. For `Product`: are `price`, `availability`, `sku`, `gtin*`, `brand`, `review` available as real data? If `AggregateRating` / `Review` data is fake or synthetic, the skill MUST refuse to emit it (Google policy).
5. For `Article` / `BlogPosting`: confirm `headline` ≤ 110 chars enforcement, `image` ≥ 1200px wide enforcement, `datePublished` + `dateModified` + `author` sources.
6. For `BreadcrumbList`: which existing breadcrumb component should it mirror? (Must match the visible breadcrumb exactly.)
7. For `LocalBusiness`: single location or multi-branch? If multi, one schema per branch page?
8. For `QAPage`: where do `acceptedAnswer` / `suggestedAnswer` come from in the DB?
9. Validation gate — block the build if Google's required fields for the chosen types are missing? (Recommend yes; ask.)
10. Generate types with `schema-dts` / Zod schemas for compile-time safety?

### Output rules
- Always emit as `<script type="application/ld+json">` with a stable serializer (no trailing commas, sorted keys, no `undefined`).
- Never inject unvalidated user HTML into JSON-LD strings — escape `<`, `>`, `&` properly; strip control characters.
- Never fabricate ratings, reviews, prices, dates, or counts. If the data isn't real, do not emit the property.
- Always run the generated JSON-LD through `JSON.parse` at build time as a sanity check.
- Echo the final type list and routes into `seo.config.md` so the user has a written record.
- For image fields (`image`, `logo`, `thumbnailUrl`, `Product.image`, `Article.image`, `Organization.logo`, `Person.image`), emit them as `ImageObject` with `url`, `width`, `height`, and **`caption`** populated from the same `alt_text` source the markup uses (Surface 15). Plain string URLs are allowed only when the alt text is genuinely unknown — log a TODO.

---

## Surface 8 — Favicons & PWA Manifest

### What it covers
`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180×180), `android-chrome-192x192.png`, `android-chrome-512x512.png`, `mask-icon.svg` (Safari pinned), `manifest.webmanifest`, `browserconfig.xml` (legacy IE/Edge), `theme-color`, `msapplication-TileColor`.

### Questions
1. Source image — single SVG, single high-res PNG, or pre-rendered set?
2. Generate at build time (`sharp`, `pwa-asset-generator`, `realfavicongenerator`) or commit static assets?
3. Maskable icon variant for Android?
4. PWA install prompt — does the site need a real manifest with `start_url`, `display`, `scope`, or just icons?
5. Dark-mode favicon (`<link rel="icon" media="(prefers-color-scheme: dark)">`)?

---

## Surface 9 — Search Engine Verification

### Questions
1. Which engines — Google Search Console, Bing Webmaster, Yandex Webmaster, Naver, Baidu?
2. Verification method — HTML meta tag, DNS TXT, file upload, Google Tag Manager?
3. Where do the tokens live — env vars, settings table, hardcoded? (Recommend env vars; ask.)

---

## Surface 10 — llms.txt

### Status note (must be told to the user verbatim)

> Google has publicly stated that `llms.txt` does **not** affect how its AI surfaces or AI Overviews understand or rank your site.
> Source: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
>
> `llms.txt` remains a community proposal (https://llmstxt.org) that *some* tools and crawlers may read. Adding it is harmless and cheap, but it is **not** an SEO ranking factor for Google.

### Questions (only after the user has read the note)
1. Add `llms.txt` anyway? If no — stop here.
2. Add `llms-full.txt` (expanded variant)?
3. Source — hand-written, generated from the sitemap, or generated from the CMS?
4. Should it list — site purpose, key URLs, API docs, content licensing terms, contact?
5. Update cadence — on each deploy, on content change, manual?

### Output location
- `public/llms.txt` (or framework equivalent — same rules as `robots.txt`).

---

## Surface 11 — Admin Panel Placement

**Critical: the skill must not decide where SEO admin UI lives.** It must ask.

### Questions
1. Does the project have an admin area? (If yes, list the routes found in Phase 0.)
2. For each SEO data type below, where does the editing UI live?
   - Site-wide defaults (site name, default description, default OG image, GSC token) → **Settings page** / **dedicated `/admin/seo` page** / **per-resource only**?
   - Per-page overrides (title, description, OG image, canonical, noindex flag) → **inline on the page editor** / **separate "SEO" tab on each resource** / **separate /admin/seo/pages list**?
   - Redirects (301 / 302) → **own page** / **inside settings** / **not in admin at all**?
   - robots.txt and sitemap → **read-only auto-generated** / **editable in admin** / **file-based only**?
   - JSON-LD templates per content type → **admin-editable** / **code-only**?
3. Permissions — who can edit SEO fields (owner / admin / editor)?
4. Preview — does the admin need a live SERP preview, Facebook preview, Twitter preview?
5. **Image upload widgets** — confirm the policy from Surface 15: every image upload form requires an `alt_text` field, validation rejects empty values for non-decorative images, and the UI explains the difference between decorative (`alt=""`) and content images. Where is the widget used (post editor, product editor, page builder, gallery, OG image override)?

The agent waits for explicit answers before scaffolding any admin route, form, or controller.

---

## Surface 12 — Database Schema

**Also user-decided.** The agent proposes; the user picks.

### Questions
1. Storage style — pick one (or mix):
   - **A. Polymorphic `seo_metas` table** — one row per `(model_type, model_id)` with columns: `title`, `description`, `keywords`, `canonical`, `noindex`, `og_image`, `og_type`, `twitter_card`, `json_ld`, `updated_at`. Pros: clean, queryable. Cons: extra join.
   - **B. Columns on each content table** — add `seo_title`, `seo_description`, ... directly to `posts`, `products`, `pages`. Pros: one query. Cons: schema churn, repeated columns.
   - **C. Single JSON column** (`seo jsonb`) per content table. Pros: flexible. Cons: harder to query, no FK integrity.
   - **D. Key-value `settings` table** for site-wide defaults + one of A/B/C for per-page.
2. i18n strategy — translation table (`seo_meta_translations` keyed by `locale`) or per-locale rows?
3. Indexes — on `slug`, `canonical`, `(model_type, model_id)`?
4. Migration strategy — new tables only, or backfill from existing columns?
5. ORM — confirm the ORM detected in Phase 0 is the one to use.
6. Validation rules — title length, description length, image URL reachability check at save time?
7. **Media / image table** — does the project already have one? If yes, confirm it has an `alt_text` column (and `alt_text_translations` table if i18n). If no, scaffold it per Surface 15: `id`, `url`, `mime`, `width`, `height`, `alt_text` (varchar 255, not null, default `''`), `is_decorative` (boolean), `created_at`. Reject `INSERT`s on the API layer where `alt_text = ''` AND `is_decorative = false`.

After the user picks, the agent generates:
- Migration file(s) in the right place (`prisma/schema.prisma`, `database/migrations/*`, Django `models.py` + `makemigrations`, Drizzle schema, etc.).
- Model / entity classes.
- Repository / service layer.
- Form request validators.
- Seeders for site-wide defaults (with placeholder values, not real data).

---

## Surface 13 — Per-page Overrides

### Questions
1. Override precedence — page-level > section-level > site-level? Confirm the chain.
2. What is the merge behavior when a field is empty — fall back to the next level, or render empty?
3. Slug-keyed or ID-keyed?
4. Are overrides editable by non-developers? (Routes back to Surface 11.)

---

## Surface 14 — Language, i18n & hreflang

This is the biggest source of silent SEO defects on multilingual sites. The skill enforces the rules below at the markup, sitemap, and routing layers.

### Language tag (`<html lang>`, inline `lang`, `dir`)

1. **`<html lang>` is mandatory** on every route. Single-language sites: still set it. Empty `lang` or missing `lang` is an accessibility AND a SEO failure (Google uses it to assign locale).
2. **BCP 47 format.** Use the language subtag — `tr`, `en`, `de` — and add the region subtag only when it changes meaning: `en-US` vs `en-GB`, `pt-BR` vs `pt-PT`, `zh-CN` vs `zh-TW` vs `zh-HK`. Wrong: `en_US` (underscore), `TR`, `tr_TR`. Right: `tr`, `en-US`, `pt-BR`.
3. **`<html lang>` switches per locale**, never stays at the site default. A page rendered in Turkish under `/en/` route is still a bug; `<html lang>` follows the rendered content, not the URL.
4. **Inline `lang` for foreign-language spans.** Quotes, names, book titles, song lyrics in a different language need `<span lang="en">…</span>`. Screen readers switch voice/pronunciation; Google uses it as a content-language hint.
5. **`dir` attribute** is mandatory for RTL languages: `<html lang="ar" dir="rtl">`, `ar`, `he`, `fa`, `ur`, `yi`, `dv`, `ps`. The skill MUST also set logical CSS properties (`margin-inline-start`) rather than `margin-left` where layout flips.
6. **Mixed-direction content** uses `<bdi>` or inline `dir="rtl"`/`"ltr"` for user-generated strings (usernames, search queries) that might break layout.

### URL pattern (one of these — user picks; never silently change)

- **Path prefix** — `/tr/`, `/en/`. Recommended for most sites; clean canonical signals.
- **Subdomain** — `tr.example.com`, `en.example.com`. Allows separate hosting per locale; needs more DNS / cert work.
- **Country-code TLD** — `example.tr`, `example.de`. Strongest geo signal; highest operational cost.
- **Query parameter** — `?lang=tr`. Discouraged — Google treats it as one URL; weak signal.
- **Accept-Language content negotiation alone** — banned. Google crawls without `Accept-Language` and sees only the default locale; other locales become invisible. Must combine with one of the above.

### Default-locale URL form

Decide once and apply globally. Two options:

- **Default unprefixed** — `/about` is English (default), `/tr/about` is Turkish. Pros: cleaner default URLs. Cons: must update if default changes.
- **Default also prefixed** — `/en/about`, `/tr/about`, root `/` redirects via geo/Accept-Language. Pros: symmetric, future-proof. Cons: extra redirect on every bare-root visit.

The skill asks the user; never picks silently.

### hreflang implementation (the part most sites get wrong)

1. **Self-reference is mandatory.** Every page must include a hreflang link pointing to itself. Missing self-reference invalidates the entire cluster for Google.
2. **Bidirectional symmetry is mandatory.** If page A says `<link rel="alternate" hreflang="tr" href="B">`, then page B MUST say `<link rel="alternate" hreflang="en" href="A">`. Google rejects one-way hreflang. The skill produces a `hreflang-audit.csv` listing any missing reverse pair.
3. **`x-default`** points to the page that handles unmatched / geo-unresolvable users — usually the language selector or the global English version. Not the same as "default locale." Include exactly one `x-default` per cluster.
4. **Region vs language hreflang.** `hreflang="en"` covers all English speakers. `hreflang="en-US"` targets US English only. Don't mix: if you have `en-US` and `en-GB`, you cannot also have a generic `en` — Google ignores conflicting ones. Add a `hreflang="en"` only as a catch-all when you don't ship region variants.
5. **Match the URL pattern.** If URLs are subdomain-per-locale, hreflang targets the right subdomain. Mismatches (e.g. hreflang pointing to a path-prefix URL when the site uses subdomains) are a common bug — the skill verifies.
6. **Emit in HTML head OR in sitemap, not both.** Google reads either; emitting in both is redundant and increases payload. Recommendation for large sites: sitemap (cheaper per request). For small sites: HTML head (easier to debug).
7. **301 between locale variants is wrong.** Locale variants are equivalents, not redirects. If user lands on the wrong locale, offer a banner; never auto-redirect on first visit — Google penalizes that.
8. **404 on a locale that doesn't exist.** If `/de/about` doesn't have a German version, emit `404`, never serve the English page with `<html lang="de">`. (Soft-404 + content-language mismatch double penalty.)
9. **Hreflang value validation.** The skill validates each tag against the BCP 47 registry. Common errors: `hreflang="english"`, `hreflang="UK"` (should be `en-GB`), `hreflang="cn"` (should be `zh-CN`).

### Translated metadata

For every locale: translated `<title>`, `<meta description>`, `og:title`, `og:description`, JSON-LD string fields (`name`, `headline`, `description`). The skill scaffolds a translation key namespace `seo.<route>.<field>` and an admin UI per Surface 11.

Untranslated copy is a bug: if a Turkish page renders English `og:description`, social shares look broken AND Google penalizes language mismatch.

### Questions to ask

1. Locale list and the canonical (default) locale.
2. URL pattern — path prefix, subdomain, ccTLD, or query? (Query discouraged.)
3. Default-locale URL form — prefixed or unprefixed?
4. RTL locales in the list? If yes, confirm CSS layout uses logical properties.
5. `x-default` target?
6. Hreflang emission — HTML head or sitemap?
7. Source of locale on cold visit — Accept-Language, geo-IP, cookie, manual switcher only? (Never silent auto-redirect — banner only.)
8. Per-locale translated metadata: confirm `title`, `description`, OG, Twitter, JSON-LD string fields are all translation-keyed.
9. Region variants (`en-US` vs `en-GB`) needed, or single-language hreflang sufficient?
10. Missing-translation fallback — show source locale with a banner, or `404`? (Recommend `404` for SEO clarity.)

---

## Surface 15 — Accessibility (WCAG 2.2 AA)

Accessibility is in scope because (a) it is a user obligation in many jurisdictions (EU EAA from June 2025, ADA in the US, KVKK-adjacent disability laws in TR), (b) Google's Lighthouse SEO score depends on accessibility checks, and (c) image `alt` text is read by both screen readers **and** Google Image Search. Improving a11y improves crawlability — they are not separable concerns.

### Reference

- WCAG 2.2 — https://www.w3.org/TR/WCAG22/
- WAI-ARIA Authoring Practices — https://www.w3.org/WAI/ARIA/apg/
- WebAIM contrast checker — https://webaim.org/resources/contrastchecker/

### What it covers

- **Images** — every `<img>` has an `alt` attribute (descriptive for content images, `alt=""` for purely decorative); `<svg>` has `<title>` and `aria-labelledby`; CSS background images that convey meaning are replaced with `<img>`.
- **Headings** — see the Heading hierarchy policy below.
- **Landmarks** — `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>` used semantically; one `<main>` per page; "skip to content" link.
- **Forms** — every `<input>` has a programmatically associated `<label>`; error messages linked with `aria-describedby`; required fields marked with `aria-required` and a visible cue.
- **Buttons vs links** — `<button>` for actions, `<a>` for navigation; never `<div onclick>`.
- **Keyboard** — every interactive element is reachable and operable by keyboard; focus order matches DOM order; visible focus ring not removed.
- **Color contrast** — body text ≥ 4.5:1; large text ≥ 3:1; UI controls / graphics ≥ 3:1.
- **Motion** — `prefers-reduced-motion` honored; no auto-playing video with sound; no flashing > 3 Hz.
- **Language** — `<html lang>` set; `lang` attribute on inline foreign-language spans.
- **Document title** — unique and descriptive per route (shares Surface 1).
- **Media** — video has captions (`<track kind="captions">`); audio has transcript.
- **Tables** — data tables use `<th>` with `scope`; complex tables use `<caption>` and `headers`/`id`.
- **Dynamic content** — live regions (`aria-live`) for async status; modal dialogs trap focus and restore it on close (`role="dialog"`, `aria-modal`).
- **Touch targets** — ≥ 24×24 CSS px (WCAG 2.2 SC 2.5.8); ≥ 44×44 recommended.

### Questions to ask

1. Target conformance level — A, **AA** (recommended), or AAA?
2. Which checks should the skill scaffold automatically vs. just lint for?
3. Lint tooling — `eslint-plugin-jsx-a11y` (React/Next), `eslint-plugin-vuejs-accessibility` (Vue/Nuxt), `astro-eslint-parser` + jsx-a11y, `pa11y-ci`, `axe-core/cli`, `@axe-core/playwright`?
4. CI gate — block PRs on axe-core violations, or report-only?
5. Existing a11y audit — has the site been audited? Are there known issues to document but not fix in this pass?
6. Localization — language list for `<html lang>` and inline `lang`; RTL languages requiring `dir="rtl"` (Arabic, Hebrew, Farsi, Urdu)?
7. Skip-link target ID — `#main`, `#content`, custom?
8. Focus ring policy — keep browser default, or design a branded `:focus-visible` style?
9. Reduced motion — disable all transitions or only large ones?
10. Form validation strategy — native `:invalid` + `aria-invalid`, or custom?

### Heading hierarchy policy (mandatory — SEO + a11y concern, applies to every route)

Heading hierarchy is both an accessibility requirement (screen readers use it for document outline navigation) AND an SEO signal (Google uses it to understand page topic structure). The skill enforces the same rules on every route it scaffolds or audits.

Rules:

1. **Exactly one `<h1>` per page.** Zero `<h1>` and multiple `<h1>` are both violations. The `<h1>` is the page's primary topic — should mirror or paraphrase the `<title>` (Surface 1), not be identical to it.
2. **The `<h1>` is the visible page heading, not the site logo.** The header logo wordmark must use a `<p>` / `<span>` / `<div>`, never `<h1>`. Same logo appears on every route; `<h1>` must change per route.
3. **No skipped levels going down.** `<h1>` → `<h2>` → `<h3>`. Never `<h1>` → `<h3>`. You can jump back up freely (`<h3>` → `<h2>` is fine — closing a subsection and opening a new section).
4. **Headings describe the section that follows, not visual size.** Never pick a heading level for font-size reasons; size is CSS. If a heading "looks wrong," restyle the level you actually need.
5. **Card titles inside a feed/grid** — use `<h2>` or `<h3>` per card depending on outer nesting, not `<p class="title">`. Same for blog teaser titles on listing pages.
6. **Hero / banner heading** — counts as the `<h1>` if it's the topmost meaningful heading on the route; otherwise the first content section heading is the `<h1>`.
7. **404 / error / empty-state pages** — still need an `<h1>` ("Page not found", "No results", etc.).
8. **Modal dialogs and side sheets** open a new heading scope: dialog title is `<h2>` inside its own focus trap (heading levels do not span across `role="dialog"` boundaries for SR users, but linting tools still warn — discuss with user).
9. **Component libraries with built-in headings** (Shadcn `Card.Title`, Radix `Dialog.Title`, Vuetify `<v-card-title>`, MUI `CardHeader.title`) — confirm what HTML element they render and override `as`/`component` props if needed.
10. **Heading text length** — under ~70 chars. Long sentences belong in paragraphs.
11. **No styling-only headings.** A "section eyebrow" or kicker label above a heading is a `<p>` / `<span>`, not `<h*>`.
12. **i18n** — the hierarchy travels with the layout, not the language. Every locale must produce the same heading structure for the same route.

### What the skill does to enforce this

- Phase 0 inventory: scan rendered HTML (build output or dev server) of the homepage and one inner route. Report counts: `h1`, skipped-level pairs (e.g. `h1`→`h3`), duplicate `<h1>` siblings.
- During implementation: every new page or component the skill writes uses headings according to these rules. If a framework primitive (e.g. a `<Card>` from a UI lib) renders the wrong element, the skill prefers `as="h2"` props over wrapping hacks.
- Linting: enable `jsx-a11y/heading-has-content` and `jsx-a11y/heading-has-content` rules where supported; add a custom check that fails CI when a built route has 0 or > 1 `<h1>`.
- Existing pages: produce a `heading-audit.csv` (route, h1_count, max_jump, first_skipped_pair) but never silently rewrite content — user reviews and fixes.

### Anti-patterns the skill refuses

- Wrapping the site logo in `<h1>` so "every page has an h1."
- Using `<h1>` on multiple cards in a feed because each card has its own "title."
- Setting `<h1 class="text-sm">` to fake a smaller heading; or `<h3>` styled large to fake a hero.
- Replacing `<h2>` with `<div role="heading" aria-level="2">` when a native `<h2>` works.
- Auto-generating heading text from slugs without human review ("blog-post-test-2" as `<h1>`).

---

### Image alt-text policy (mandatory section — covered here AND referenced from Surfaces 5, 6, 7)

The skill MUST enforce the following whenever it touches markup, schema, or content forms:

1. **Every `<img>` requires an `alt` attribute.** No exceptions. Missing `alt` ≠ empty `alt`. The skill refuses to emit `<img>` without `alt=`.
2. **Decorative images:** `alt=""` (empty string). Also add `role="presentation"` or `aria-hidden="true"` for fully decorative cases. CSS background images are fine for purely decorative visuals.
3. **Content images:** `alt` describes the image's purpose in context — not a literal description. "Founder Ada Yıldız speaking at TEDx Istanbul 2025" beats "woman on stage with microphone."
4. **Functional images** (image inside a link/button): `alt` describes the destination/action — "Search" not "magnifying glass icon."
5. **Informative images with text on them:** `alt` repeats the on-image text verbatim.
6. **Complex images** (charts, diagrams): short `alt` + long description via `aria-describedby` or adjacent `<figcaption>`.
7. **Icons next to text labels:** `aria-hidden="true"` on the icon, since the adjacent text already labels it.
8. **Length:** ≤ 125 chars where possible; never include "image of", "picture of", "graphic of" — screen readers already announce that.
9. **Schema.org image fields** (`Article.image`, `Product.image`, `Organization.logo`, `og:image`, `twitter:image`) all require accompanying `image:alt` / `caption` whenever the consumer supports it.
10. **Admin panel form** (Surface 11): the image upload widget MUST require an `alt` text input before save. Form validation rejects empty.
11. **Database schema** (Surface 12): the image / media table MUST have an `alt_text` column (`varchar(255)`, not null, default `''` only for decorative). For i18n, alt text lives in the translation table per locale.
12. **Migration of existing images:** if Phase 0 finds existing images without alt, the skill produces a report (`alt-audit.csv`: path, page, missing/empty/present) but does NOT auto-fill — fabricated alt text is worse than missing.

### Output rules

- Add `eslint-plugin-jsx-a11y` (or framework equivalent) to dev deps and enable the `recommended` ruleset; bump to `strict` only with user approval.
- Add an `axe-core` smoke test that runs against the homepage and one inner route in CI.
- Emit a `docs/accessibility.md` statement page (required by EU EAA for public sites) — content TODO, user fills.
- Add a "Skip to content" link as the first focusable element in the root layout.
- Wire `prefers-reduced-motion` into the global CSS reset.
- For frameworks with route titles (`document.title`), confirm titles update on client-side navigation.

### Anti-patterns the skill refuses

- Generating `alt="image"`, `alt="photo"`, `alt="logo"`, `alt="picture"`, `alt="<filename>"`, or auto-filled alt from the filename. Refuse and ask.
- Removing the focus outline globally (`*:focus { outline: none }`) without an alternative focus style.
- Using `role="button"` on `<div>` instead of using `<button>`.
- Placeholder text used as the only label for a form input.
- Color as the only differentiator (e.g., red text == error with no icon or text).
- `tabindex` values > 0 (breaks natural focus order).
- ARIA attributes on elements that already have native semantics (e.g., `role="button"` on a `<button>`).

---

## Surface 16 — OG Image Generation

### Questions
1. Static (one image per route, committed) / templated (build-time generation from a layout) / on-demand (runtime / edge)?
2. If on-demand: `@vercel/og`, `satori`, `puppeteer`, `playwright`, `resvg`, Cloudinary, imgproxy, ImageKit?
3. Caching — CDN with long TTL, or stamp filename with content hash?
4. Fonts — bundled, fetched at build, fetched at runtime?
5. Fallback when generation fails?

---

## Surface 17 — Core Web Vitals & Page Performance

Google uses LCP, CLS, INP as ranking signals (the "page experience" group). They are not the dominant factor, but they break ties on competitive queries. The skill measures and gates against them.

### Targets (Google's "Good" thresholds, mobile)

- **LCP** (Largest Contentful Paint) ≤ 2.5 s
- **CLS** (Cumulative Layout Shift) ≤ 0.1
- **INP** (Interaction to Next Paint) ≤ 200 ms — replaced FID in March 2024
- **TTFB** (Time to First Byte) ≤ 800 ms — supporting metric
- **FCP** (First Contentful Paint) ≤ 1.8 s — supporting metric

### Rules the skill enforces in scaffolded code

1. **LCP element gets `fetchpriority="high"`** and is NOT lazy-loaded. Usually the hero image or the H1's neighbouring image. Identify it explicitly; do not blanket-apply.
2. **Above-the-fold images use `loading="eager"`**; below-the-fold use `loading="lazy"`. Default browser behaviour is eager — explicit `eager` only matters when overriding a framework's lazy default.
3. **Every `<img>` has explicit `width` and `height` attributes** (or aspect-ratio CSS). Missing dimensions = guaranteed CLS. Non-negotiable.
4. **No layout-shifting late content insertion** above the fold (cookie banners, top ads, sticky headers that grow). Reserve space with min-height.
5. **Self-host critical fonts or preload them.** Use `font-display: swap`. `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the LCP-affecting font.
6. **System font fallback stack** that visually approximates the brand font (`size-adjust`, `ascent-override`) to reduce font-swap CLS.
7. **No render-blocking inline JS** above `<title>`. Move third-party scripts to `defer` / `async` or `next/script` with `strategy="lazyOnload"`.
8. **Critical CSS inlined**, rest deferred — only if the framework supports it cleanly (Next App Router auto-inlines per-route critical CSS; Astro inlines per-island; for Laravel/Django ask before adding `critters` or similar).
9. **No `document.write`** anywhere.
10. **Long tasks split** — INP regressions usually come from > 50 ms main-thread tasks. Heavy client components opt into `'use client'` only where needed.

### Questions

1. Confirm performance budget — accept the Google "Good" defaults, or stricter?
2. CI gate — block PRs on CWV regression, report-only, or off?
3. Measurement source — Lighthouse-CI on each PR, real-user monitoring (CrUX / Vercel Speed Insights / Sentry / Datadog), or both?
4. Identify the LCP element per route group — hero image, hero text, video poster?
5. Font strategy — self-hosted, Google Fonts (banned in EU due to GDPR after 2022 ruling, confirm), Bunny Fonts, Adobe Fonts?
6. Third-party scripts to defer / replace — Google Tag Manager, Facebook Pixel, chat widgets, A/B test tools?

### Verify (Phase 5)

- Run `npx unlighthouse` or `lighthouse-ci` against homepage + one inner route.
- Print scores: Performance, LCP, CLS, INP, TTFB.
- Fail "done" if any Core Web Vital is in the red zone.

---

## Surface 18 — Image Optimization

Images are the heaviest payload on most pages and the most common LCP culprit. Tightly coupled with Surface 15 (alt) and Surface 17 (performance).

### Rules

1. **Modern formats first.** AVIF preferred, WebP fallback, JPEG/PNG last. Use `<picture>` with multiple `<source type>`s when a framework's `<Image>` component doesn't do it automatically.
2. **`srcset` + `sizes` on every responsive image.** `srcset` lists widths (`hero-640.avif 640w, hero-1280.avif 1280w, …`); `sizes` describes the rendered size at each breakpoint (`(max-width: 768px) 100vw, 50vw`). Wrong `sizes` is the #1 cause of "right-image-but-too-big" downloads.
3. **Explicit `width` + `height`** (intrinsic, not rendered). Prevents CLS. Aspect-ratio CSS works too but the HTML attrs are belt-and-braces.
4. **Lazy-load below the fold** (`loading="lazy"`), eager above (`fetchpriority="high"` on the LCP image).
5. **`decoding="async"`** on all images except the LCP one.
6. **DPR-aware** — serve a 2x and 3x variant via `srcset` density descriptor (`logo.png 1x, logo@2x.png 2x`).
7. **Strip EXIF** on user uploads (privacy + size).
8. **Maximum dimensions enforced.** Reject uploads > 6000 px on the longest side at the API layer.
9. **Background CDN / image proxy** — Cloudinary, imgproxy, ImageKit, Vercel Image Optimization, Cloudflare Images, `next/image` loader. Confirm with user before configuring.
10. **SVG sanitization.** Strip `<script>`, foreign elements, and `onclick` from any user-uploaded SVG. The skill refuses to render raw user SVG without sanitization.
11. **Image dimensions in JSON-LD** (Surface 7) match the largest variant actually served.

### Questions

1. Image source — local `/public`, S3 / R2 / GCS, headless CMS (Sanity/Contentful/Strapi), Cloudinary, custom?
2. Optimization point — build-time (sharp / vite-imagetools / astro:assets), request-time (CDN), or pre-uploaded only?
3. Formats served — AVIF + WebP + JPEG, or subset?
4. Breakpoints / widths to generate?
5. LCP image opt-in mechanism — `priority` prop, manual `fetchpriority`, route metadata?
6. User-uploaded image rules — max bytes, max dimensions, allowed MIME, SVG yes/no?

### Verify

- Grep built HTML for `<img>` without `srcset` (report list).
- Grep for `<img>` without `width`/`height` (must be 0).
- Confirm LCP image has `fetchpriority="high"` and is not lazy.

---

## Surface 19 — URL Structure & Slug Rules

URL shape is a permanent decision; getting it wrong creates years of redirect debt. The skill enforces a consistent slug policy.

### Default policy (adjustable per user)

- All-lowercase. Mixed case URLs `301` to lowercase (Surface 2).
- Hyphen `-` as word separator. Underscores banned (Google reads underscores as word-joiners; hyphens as separators).
- ASCII only, OR explicit Unicode policy. For Turkish content, two options:
  - **A. ASCII-fold** — `şarküteri` → `sarkuteri`. Pros: portable, no encoding bugs. Cons: loses local feel.
  - **B. UTF-8 percent-encode** — `şarküteri` → `%C5%9Fark%C3%BCteri`. Pros: native. Cons: long, ugly when copy-pasted, breaks in some legacy systems.
  - **C. ASCII-fold but redirect Unicode requests to the ASCII form.** Recommended default for TR sites.
- Max slug length ~75 chars; max full URL ~2000 chars (browser-safe).
- No trailing slash for files, OR trailing slash everywhere — pick one, enforce via 301 (Surface 2).
- No stop words for SEO purposes is a myth — keep slugs natural-language; don't strip "the", "and", "of".
- No date in the slug unless the content is time-bound (news only). Date in URL makes evergreen content look stale.
- Stable slugs — slug changes require `301` from the old slug. The skill scaffolds a `redirects` table per the admin decision (Surface 11).
- IDs in URL — acceptable if the slug AND id are both present (`/blog/<slug>-<id>`), so renames don't 404. Discuss with user.

### Questions

1. Turkish/Unicode policy — A / B / C above?
2. Trailing slash — yes / no / framework-default?
3. Slug source — title-derived auto-slug (with manual override), full manual, or content-id only?
4. Slug uniqueness scope — global, per-locale, per-section?
5. Slug change behavior — auto-301 old slug, or require manual redirect entry?
6. Maximum slug length the admin form enforces?

### Verify

- Run a build-time linter pass: any new slug containing uppercase / underscore / disallowed chars fails the build.

---

## Surface 20 — Internal Linking & Orphan Detection

Internal links distribute crawl budget and PageRank-equivalent signals. An "orphan" page is one with no internal link pointing to it — Google may discover it via the sitemap, but it has no in-graph authority.

### Rules

1. **Every indexable URL must be reachable from at least one other indexable URL.** The skill builds a link graph during Phase 0 / Phase 5 and reports orphans.
2. **Anchor text rules**:
   - Banned: "click here", "read more", "buradan", "tıkla", "more info" as the only anchor.
   - Acceptable for screen-readers: visually hidden contextual span (`<a>Read more <span class="sr-only">about Q4 earnings</span></a>`).
   - Recommended: keyword-rich but natural; vary across pages.
3. **No `rel="nofollow"` on internal links** unless the target is genuinely external-equivalent (user-submitted content, login pages). `rel="nofollow"` on internal nav is wasted crawl budget.
4. **Link depth** — every indexable page reachable in ≤ 3 clicks from the homepage for small sites, ≤ 5 for large. The skill reports depth distribution.
5. **Breadcrumbs are an internal-linking pattern**, not just visual. They feed Surface 7's `BreadcrumbList` schema and Surface 11's admin UX.
6. **Faceted navigation** — filters that create infinite URL permutations (`?color=red&size=l&sort=price-asc`). Block in `robots.txt`, mark `noindex, follow`, or use canonical to parent — user decides. Default: block aggressive faceting in `robots.txt`.
7. **Pagination links** — see Surface 2 pagination canonical policy.
8. **External link attribute defaults** — `rel="noopener noreferrer"` for security; `rel="ugc"` for user-generated, `rel="sponsored"` for paid links (Google requires).

### Questions

1. Orphan threshold — 0 (strict), or allowed list?
2. Faceted nav handling — `robots.txt` block, `noindex`, canonical, or all?
3. UGC links — automatic `rel="ugc nofollow"` on content the admin marks as UGC?
4. Sponsored content disclosure — automatic `rel="sponsored"` based on a DB flag?

### Verify

- Build the internal link graph (parse rendered HTML or sitemap routes + DOM).
- Report orphans, depth histogram, broken internal links (404 targets), "click here"-style anchors.

---

## Surface 21 — Security & Lighthouse Headers

Google does not directly rank by security headers, but Lighthouse's "Best Practices" and "SEO" scores penalize their absence, and several (HSTS, HTTPS) are now de-facto requirements for indexation. They also reduce browser warnings that cause bounce.

### Headers the skill scaffolds (with sensible defaults; user confirms)

- **`Strict-Transport-Security`** — `max-age=31536000; includeSubDomains; preload`. Pre-flight: confirm subdomains are actually all HTTPS before enabling `includeSubDomains`.
- **`Content-Security-Policy`** — start in `Content-Security-Policy-Report-Only` mode with a basic policy; tighten over weeks. The skill scaffolds the report-only header and an endpoint; promotion to enforcing mode is user-triggered.
- **`X-Content-Type-Options: nosniff`** — always.
- **`Referrer-Policy: strict-origin-when-cross-origin`** — sensible default.
- **`Permissions-Policy`** — minimal allowlist (`camera=(), microphone=(), geolocation=()` for sites that don't use them).
- **`X-Frame-Options: DENY`** OR CSP `frame-ancestors 'none'` — pick one; CSP supersedes when both present.
- **`Cross-Origin-Opener-Policy: same-origin`** and **`Cross-Origin-Embedder-Policy`** — only if the app needs them; can break embeds.

### Anti-patterns

- `Server:` header leaking version (`nginx/1.18.0`, `Apache/2.4.41`).
- `X-Powered-By:` leaking framework — strip via middleware.
- Wildcard `Access-Control-Allow-Origin: *` on authenticated endpoints.
- HSTS preload before confirming all subdomains are HTTPS (irreversible for months).

### Output locations

- Next.js → `next.config.js` `headers()` or middleware.
- Nuxt → `nuxt.config` `routeRules` or server middleware.
- Astro → `astro.config` `vite.server.headers` for dev, hosting platform for prod.
- Laravel → `App\Http\Middleware\SecurityHeaders`.
- Django → `django-csp`, `SecurityMiddleware`.
- Vercel / Netlify / Cloudflare Pages → platform config file.
- nginx / Apache → server config.

### Questions

1. HSTS preload — opt in now, or wait until subdomains audited?
2. CSP — start in report-only? Where does the report endpoint live?
3. Reverse proxy / CDN — Cloudflare can inject some of these; avoid double-emitting.

---

## Surface 22 — Search Engine Submission & IndexNow

After deploying SEO infrastructure, the site must be discoverable. Submission is a one-time action per property, plus an ongoing notify-on-change mechanism.

### Tasks the skill scaffolds (does NOT auto-perform — user actions)

1. **Google Search Console** — verify property (Surface 9), submit `sitemap.xml`, monitor coverage. The skill emits the verification meta tag and the sitemap URL; the user clicks "Submit" in GSC.
2. **Bing Webmaster Tools** — same flow. Can import from GSC automatically.
3. **Yandex Webmaster** — only if targeting RU/CIS.
4. **Naver Search Advisor** — only if targeting KR.
5. **Baidu Webmaster Tools** — only if targeting CN; also requires hosting inside CN (ICP license) for full crawl coverage.

### IndexNow protocol (Bing + Yandex + Seznam; Google does NOT support)

IndexNow lets the site push URL change notifications to participating search engines. One HTTP POST per change. Faster recrawl on Bing/Yandex.

- Generate a single hex key (32–128 chars), serve it at `/<key>.txt` containing the key.
- On every publish / update / delete of an indexable URL, POST to `https://api.indexnow.org/IndexNow` with `host`, `key`, `keyLocation`, and `urlList`.
- Bing automatically shares to other IndexNow members.
- Google announced it does not use IndexNow (2025); do NOT pitch it to the user as a Google booster.

### Questions

1. Engines in scope — Google + Bing default; add Yandex/Naver/Baidu?
2. Verification methods preferred (meta tag, DNS TXT, file upload)?
3. IndexNow — opt in? If yes, which content events trigger notify (publish, update, delete, all)?
4. Sitemap auto-ping endpoints — Google and Bing both **deprecated** their `/ping?sitemap=` endpoints in 2023; the skill refuses to call them. Notify via Search Console / Webmaster Tools APIs instead if needed.

### Output

- IndexNow key file at `/public/<key>.txt`.
- A queue / job worker that posts to IndexNow on content events (Surface 12 model hooks).

---

## Surface 23 — SPA Hydration & Client-side Meta Updates

Single-page apps (and SSR apps with client-side route transitions) commonly fail SEO in one specific way: the initial server response has correct `<title>` / meta, but client-side navigation changes the URL without updating `document.title` or `<meta>` tags. Google's bot does a second render with JS; it sees the stale meta on intra-app navigation and indexes it wrong.

### Rules

1. **`document.title` must update on every client-side route change.** Framework hooks: Next App Router updates automatically via `generateMetadata`; React Router 6 needs `useEffect` per route or a `<title>` component (`react-helmet-async`, `@unhead/react`); Vue Router needs `useHead` from `@unhead/vue`; SvelteKit's `<svelte:head>` reactivates.
2. **All head-managed tags update on navigation**, not just `<title>` — description, canonical, OG, Twitter, JSON-LD. Stale OG on share = wrong preview.
3. **No double-emission.** Server renders the tags; client must replace, not append. `react-helmet-async` / `@unhead` handle this; manual `document.head.appendChild` does not.
4. **Programmatic focus on route change.** For a11y (Surface 15) — move focus to the new `<h1>` or to the page container with `tabindex="-1"`, so screen readers announce the new page.
5. **Scroll restoration** — restore on back/forward, top on new navigation. Framework defaults usually correct; verify.
6. **Render-blocking client routing** — the visible content of the new route must appear in the rendered HTML when the bot fetches the URL directly (SSR/SSG), not only after JS runs. Pure-CSR routes that show a loader to Googlebot are functionally invisible.
7. **`prerender: false` confirmation** — for routes intentionally CSR-only (admin, gated), explicitly mark them `noindex`; do not rely on bots failing to render.

### Questions

1. Rendering mode per route group — SSR / SSG / ISR / CSR?
2. Library managing the head — confirm (`@unhead/*`, `next/head`, `react-helmet-async`, native framework, …) and that it handles client-side updates.
3. Test plan — run Lighthouse against `--view-trace=cold` AND against a client-side-navigated route to detect drift.
4. Focus management on route change — implement now or audit only?

### Verify

- Boot the dev server.
- Fetch the homepage with `curl` and grep `<title>` — record value A.
- Use Puppeteer / Playwright: load home, click an internal link, read `document.title` and `link[rel=canonical]` — value B.
- If B equals A (stale), FAIL. Print which library should own the update.
- Disable JS in the browser and load an inner route directly — confirm content + meta still render (SSR check).

---

## Implementation Rules (apply to every surface)

1. **Idempotent.** Re-running the skill must not duplicate routes, tags, or migrations. Detect existing artifacts first.
2. **No silent defaults.** If a value isn't decided, hold the field empty and ask before filling.
3. **No secrets in code.** GSC tokens, API keys → `.env` / `.env.example`. Never commit real tokens.
4. **No fake data.** Placeholders must read `TODO:` and the skill must list every `TODO:` at the end.
5. **One framework path.** If the project mixes (e.g. Next + a legacy Express layer), ask which surface owns each route.
6. **Respect existing libraries.** If `next-seo`, `@nuxtjs/seo`, `vue-meta`, `react-helmet-async`, `spatie/laravel-seo`, `astro-seo` are already installed, prefer extending them over hand-rolling tags. Confirm with user.
7. **Output order in `<head>`.** Charset first, viewport second, then title, description, canonical, robots, OG, Twitter, JSON-LD, icons. Keep order stable.
8. **Escape everything user-supplied.** Especially in JSON-LD and meta `content`.
9. **Test in real browsers / validators after writing.** Curl the page, grep tags, validate JSON-LD. Don't claim "done" without proof.
10. **Stop on ambiguity.** If two interpretations are reasonable, ask.

---

## Anti-patterns (skill must refuse / flag)

- Generating `<meta name="keywords">` and claiming it helps Google ranking. (It doesn't.)
- Adding `priority` / `changefreq` and claiming Google respects them. (It mostly doesn't.)
- Adding `llms.txt` and claiming it improves Google AI Overview placement. (It doesn't — see Surface 10.)
- Emitting `FAQPage` JSON-LD for a brand-authored FAQ section and claiming it produces Google rich results. (As of May 7, 2026 it does not — see Surface 7.) Use `QAPage` only when the page is genuine community Q&A.
- Fabricating `AggregateRating`, `Review`, ratings, review counts, prices, or stock status to "fill" required schema fields. Violates Google's structured data policy; can trigger manual actions.
- **Soft 404** — emitting `200 OK` for a "not found" page (custom `not-found.tsx`/`404.blade.php`/etc. that the framework wraps with the wrong status). Soft-404 gets the URL indexed as a real page, wastes crawl budget, then gets demoted with a Search Console "Soft 404" warning. See Surface 2 HTTP status policy.
- Serving a `200` maintenance page during downtime instead of `503` with `Retry-After`. Googlebot caches the maintenance text as your real content.
- Redirect chains (`/a` → `/b` → `/c`). Collapse to one hop; each extra hop loses crawl efficiency.
- Emitting `<link rel="prev/next">` and claiming it helps Google. Deprecated 2019. Self-canonical each paginated page instead. See Surface 2.
- Canonical from page 2+ of pagination back to page 1. Hides deeper pages from Google. See Surface 2.
- Adding `<meta name="keywords">` for sites targeting Google/Bing/DuckDuckGo audiences only. Dead weight. See Surface 1 policy.
- Auto-redirecting on first visit based on Accept-Language or geo-IP. Google explicitly recommends against; offer a banner instead. See Surface 14.
- One-way hreflang. Every hreflang pair must be bidirectional or Google rejects the cluster. See Surface 14.
- `<img>` without explicit `width` / `height`. Guaranteed CLS. See Surface 18.
- `<img>` without `srcset` and `sizes` on responsive layouts. Wastes bandwidth, hurts LCP. See Surface 18.
- Calling Google's / Bing's deprecated sitemap-ping endpoints (`google.com/ping?sitemap=`, `bing.com/ping`). Deprecated 2023. See Surface 22.
- Pitching IndexNow as a Google ranking booster. Google does not support IndexNow. See Surface 22.
- Stale `<title>` / meta on client-side SPA navigation. Bot sees the wrong meta. See Surface 23.
- `rel="nofollow"` on internal nav links. Wastes crawl budget. See Surface 20.
- "Click here" / "buradan" as the only anchor text on a link. See Surface 20.
- `Server` / `X-Powered-By` headers leaking framework versions. See Surface 21.
- Auto-pinging deprecated sitemap-ping endpoints (`google.com/ping?sitemap=`, `bing.com/ping` — both deprecated as of 2023).
- Stuffing duplicate `<title>` or multiple `canonical` links.
- Setting `noindex` and `canonical` together pointing elsewhere (conflict).
- Cloaking — serving different meta to bots vs. users.
- Auto-installing analytics / GTM without asking; that's not in scope here.

---

## Deliverables checklist (the skill prints this at the end)

```
[ ] Phase 0 report saved
[ ] User selections recorded in seo.config.md (or similar)
[ ] Files created: <list>
[ ] Files modified: <list>
[ ] Migrations added: <list>
[ ] Admin routes added: <list>
[ ] .env.example updated with: <list>
[ ] robots.txt served at: <url>
[ ] sitemap served at: <url>
[ ] llms.txt served at: <url or "skipped">
[ ] Build passes
[ ] Typecheck passes
[ ] curl -I <homepage> shows: <key headers>
[ ] Status checks pass:
    [ ] homepage → 200
    [ ] unknown URL → 404 (NOT soft-404)
    [ ] http://<host> → 301 → https
    [ ] mixed-case / trailing-slash variants → 301 to canonical
    [ ] retired URLs → 410 or 301
    [ ] auth-walled URL (no creds) → 401 / 302, not 200
[ ] JSON-LD validates
[ ] axe-core violations (critical/serious): <count>
[ ] Images without alt: <count> (must be 0 for "done")
[ ] alt-audit.csv saved at: <path>
[ ] Routes with 0 or > 1 <h1>: <count> (must be 0 for "done")
[ ] Routes with skipped heading levels: <count>
[ ] heading-audit.csv saved at: <path>
[ ] Core Web Vitals (mobile): LCP <value>, CLS <value>, INP <value>
[ ] Images without srcset/sizes on responsive layouts: <count>
[ ] Images without width/height: <count> (must be 0)
[ ] hreflang one-way violations: <count> (must be 0)
[ ] hreflang BCP 47 invalid values: <count> (must be 0)
[ ] hreflang-audit.csv saved at: <path>
[ ] Orphan pages: <count>
[ ] Broken internal links: <count>
[ ] "Click here"-style anchors: <count>
[ ] Security headers present: HSTS / CSP-RO / X-Content-Type-Options / Referrer-Policy / Permissions-Policy
[ ] IndexNow key file served: <url or "skipped">
[ ] SPA meta updates on client navigation: pass / fail
[ ] Open TODOs: <list>
```

---

## Cross-platform compatibility notes

This file is intentionally a single Markdown document so it can be consumed by:

| Platform              | How it picks this file up                                                        |
|-----------------------|----------------------------------------------------------------------------------|
| Claude Code           | Drop in `~/.claude/skills/seo-pro-max/SKILL.md` or `.claude/skills/...`          |
| Cursor                | Save as `.cursor/rules/seo-pro-max.mdc` (add a `description` frontmatter line)   |
| Windsurf              | Save as `.windsurfrules` (or `.windsurf/rules/seo-pro-max.md`)                   |
| Cline / Roo Code      | Save as `.clinerules` / `.roo/rules/seo-pro-max.md`                              |
| GitHub Copilot Chat   | Save as `.github/copilot-instructions.md` (one file, append section)             |
| Continue.dev          | Reference in `~/.continue/config.json` under `customCommands` / `rules`          |
| Aider                 | Save as `CONVENTIONS.md` and pass `--read CONVENTIONS.md`                        |
| Zed AI                | Reference in Zed `settings.json` under `assistant.default_model.rules_file`      |
| Cody (Sourcegraph)    | Add as a custom command pointing at this file                                    |
| Plain LLM             | Paste the file into the system prompt                                            |

See `PUBLISHING.md` (Turkish) for the full step-by-step publishing guide per platform.

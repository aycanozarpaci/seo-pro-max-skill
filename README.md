# seo-pro-max

[![GitHub stars](https://img.shields.io/github/stars/aycanozarpaci/seo-pro-max-skill?style=social)](https://github.com/aycanozarpaci/seo-pro-max-skill/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/aycanozarpaci/seo-pro-max-skill?style=social)](https://github.com/aycanozarpaci/seo-pro-max-skill/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Works with](https://img.shields.io/badge/works%20with-Claude%20Code%20·%20Cursor%20·%20Windsurf%20·%20Cline%20·%20Copilot-blue)](#supported-platforms)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Can%20Özkan%20Özarpacı-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/canozkanozarpaci/)

> ⭐ **If this skill saved you a day of SEO wiring, please [star the repo](https://github.com/aycanozarpaci/seo-pro-max-skill).** Stars help other developers find it and tell me which features matter most.

Production-grade SEO setup skill for AI coding agents. Analyzes your project first, asks the right questions, then implements exactly what you confirmed — nothing more.

**The skill is an executor, not a decision-maker.** It does not silently pick frameworks, file locations, database schemas, or admin-panel placements. You decide; it implements.

## Why this exists

SEO setup is full of small, opinionated decisions — title strategy, canonical rules, schema choices, where the admin UI lives, how the DB stores per-page overrides, whether to emit `keywords` meta, what to do about `FAQPage` after Google deprecated it, how to handle hreflang for a TR-first / EN-second site. Every project answers them differently.

AI coding agents tend to either:

- silently pick **one opinionated default** (which is wrong for half the projects), or
- emit a generic SEO blob with no project awareness (which goes stale by next month's Google policy update).

`seo-pro-max` fixes both: it analyzes your project, asks you the decisions the agent shouldn't make alone, and only then writes code. The policies it enforces are tracked against current Google / Bing / WCAG / Schema.org documentation — `FAQPage` deprecation (May 7, 2026), `rel="prev/next"` deprecation, IndexNow support boundaries, soft-404 detection, and BCP 47 hreflang validation are all encoded so the agent doesn't recommend dead patterns.

## Quick start

Once the npm package is published (coming with v1.0):

```bash
npx seo-pro-max install
```

The installer auto-detects Claude Code, Cursor, Windsurf, Cline, Copilot, Aider, Continue, or Zed and drops the skill in the right place.

Until then, manual install per platform is one `curl` (or `Invoke-WebRequest`) per platform — see [Install](#install) below.

## What it covers

- Meta basics (title, description, viewport, charset, theme-color, lang, `keywords` policy per target market)
- Indexing controls (robots meta, X-Robots-Tag, canonical, hreflang, pagination canonical)
- HTTP status correctness — real 404 (not soft-404), 410 for retired, 301 chain collapse, 503 + `Retry-After` for maintenance, branded friendly-404 UX
- `robots.txt`
- XML sitemap (single / index / per-locale / per-content-type)
- Open Graph (Facebook, LinkedIn, WhatsApp, Slack, Discord)
- Twitter / X Cards
- Schema.org JSON-LD — recommendation matrix driven by Phase 0 project analysis (Organization, WebSite + SearchAction, BlogPosting, Product, BreadcrumbList, **QAPage**, LocalBusiness, Event, Course, JobPosting, Recipe, VideoObject, Dataset, …)
- Favicons & PWA manifest
- Search-engine verification (GSC, Bing, Yandex, Naver, Baidu) + IndexNow protocol (Bing+Yandex only; Google does not support)
- `llms.txt` — included with the explicit disclaimer that Google does **not** use it for AI ranking ([source](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide))
- Admin-panel UI wiring (where the SEO editor lives — you choose)
- Database schema (polymorphic / per-table / JSON / settings — you choose)
- Per-page overrides, **language / i18n / hreflang** (BCP 47, RTL, bidirectional hreflang validation, x-default), OG image generation
- **Accessibility (WCAG 2.2 AA)** — image `alt` enforcement (refuses empty / auto-filled / placeholder alt), color contrast, keyboard reachability, landmarks, **heading hierarchy** (single `<h1>`, no skipped levels), focus management, `prefers-reduced-motion`, axe-core CI gate
- **Core Web Vitals** — LCP / CLS / INP gates; LCP image `fetchpriority`; font preload
- **Image optimization** — AVIF / WebP, `srcset` + `sizes`, explicit `width`/`height` (CLS prevention), lazy/eager policy
- **URL & slug rules** — case, separator, Turkish/Unicode policy, length, stable slugs with 301
- **Internal linking & orphan detection** — link graph, anchor text rules, faceted nav handling
- **Security & Lighthouse headers** — HSTS, CSP (report-only first), Referrer-Policy, Permissions-Policy, strip `Server` / `X-Powered-By`
- **SPA hydration & client-side meta updates** — `document.title` and head tags must update on client-side route changes

### FAQPage deprecation

Google removed FAQ rich results on **May 7, 2026** and is dropping the FAQ rich-result report and Rich Results Test support in **June 2026**. Search Console API support ends in **August 2026**. ([source](https://developers.google.com/search/docs/appearance/structured-data/faqpage))

This skill **does not emit `FAQPage` JSON-LD** for new builds. Brand-authored FAQ content is rendered as plain accessible HTML. Real community Q&A pages use `QAPage` instead.

## Install

### Recommended (after v1.0): npx

```bash
npx seo-pro-max install
```

Auto-detects platform, asks for confirmation, and copies the right file in. Use `--target` to install on a specific platform (`claude`, `cursor`, `windsurf`, `cline`, `roo`, `copilot`, `aider`, `continue`, `zed`, `all`).

### Manual install (works today, no dependencies)

#### Claude Code

macOS / Linux:

```bash
mkdir -p ~/.claude/skills/seo-pro-max
curl -L https://raw.githubusercontent.com/aycanozarpaci/seo-pro-max-skill/main/SKILL.md \
  -o ~/.claude/skills/seo-pro-max/SKILL.md
```

Windows (PowerShell):

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\skills\seo-pro-max" | Out-Null
Invoke-WebRequest `
  -Uri "https://raw.githubusercontent.com/aycanozarpaci/seo-pro-max-skill/main/SKILL.md" `
  -OutFile "$env:USERPROFILE\.claude\skills\seo-pro-max\SKILL.md"
```

#### Cursor

```bash
mkdir -p .cursor/rules
curl -L https://raw.githubusercontent.com/aycanozarpaci/seo-pro-max-skill/main/platforms/cursor/seo-pro-max.mdc \
  -o .cursor/rules/seo-pro-max.mdc
```

```powershell
New-Item -ItemType Directory -Force ".cursor\rules" | Out-Null
Invoke-WebRequest `
  -Uri "https://raw.githubusercontent.com/aycanozarpaci/seo-pro-max-skill/main/platforms/cursor/seo-pro-max.mdc" `
  -OutFile ".cursor\rules\seo-pro-max.mdc"
```

#### Windsurf (short form, fits the 6 KB rule budget)

```bash
curl -L https://raw.githubusercontent.com/aycanozarpaci/seo-pro-max-skill/main/platforms/windsurf/.windsurfrules \
  -o .windsurfrules
```

```powershell
Invoke-WebRequest `
  -Uri "https://raw.githubusercontent.com/aycanozarpaci/seo-pro-max-skill/main/platforms/windsurf/.windsurfrules" `
  -OutFile ".windsurfrules"
```

#### Cline

```bash
curl -L https://raw.githubusercontent.com/aycanozarpaci/seo-pro-max-skill/main/platforms/cline/.clinerules \
  -o .clinerules
```

#### GitHub Copilot Chat

```bash
mkdir -p .github
curl -L https://raw.githubusercontent.com/aycanozarpaci/seo-pro-max-skill/main/platforms/copilot/.github/copilot-instructions.md \
  -o .github/copilot-instructions.md
```

#### Aider

```bash
curl -L https://raw.githubusercontent.com/aycanozarpaci/seo-pro-max-skill/main/platforms/aider/CONVENTIONS.md \
  -o CONVENTIONS.md
aider --read CONVENTIONS.md
```

### Update

Re-run the same install command. Files are overwritten with the latest `main` (or the version you pin in the URL).

```bash
# npx
npx seo-pro-max update

# Manual (Claude Code, macOS/Linux)
curl -L https://raw.githubusercontent.com/aycanozarpaci/seo-pro-max-skill/main/SKILL.md \
  -o ~/.claude/skills/seo-pro-max/SKILL.md
```

Pin to a tagged release instead of `main` if you want reproducibility: replace `main` with `v1.0.0` in any raw URL.

### Uninstall

```bash
# npx
npx seo-pro-max uninstall --target cursor

# Manual
rm -rf ~/.claude/skills/seo-pro-max         # Claude Code
rm .cursor/rules/seo-pro-max.mdc            # Cursor
rm .windsurfrules                            # Windsurf
rm .clinerules                               # Cline
rm .github/copilot-instructions.md           # Copilot (or remove the section if you have other rules in the file)
```

## How it works

1. **Phase 0** — inventories your framework, routing, admin, DB, i18n, hosting.
2. **Phase 1** — asks which SEO surfaces are in scope (all opt-in, no defaults).
3. **Phase 2** — drills down per surface with concrete questions; for Schema.org, the skill proposes a type list from the recommendation matrix based on Phase 0 findings.
4. **Phase 3** — prints a written plan and waits for explicit confirmation.
5. **Phase 4** — implements in commit-sized chunks.
6. **Phase 5** — verifies (build, typecheck, `curl -I`, real 404 probe, JSON-LD parse, sitemap fetch, alt-text audit, heading audit, Lighthouse CWV).

Full protocol and all 23 surfaces: [`SKILL.md`](SKILL.md).

## Supported platforms

| Platform              | File                                                                                       |
|-----------------------|--------------------------------------------------------------------------------------------|
| Claude Code           | [`platforms/claude-code/seo-pro-max/SKILL.md`](platforms/claude-code/seo-pro-max/SKILL.md) |
| Cursor                | [`platforms/cursor/seo-pro-max.mdc`](platforms/cursor/seo-pro-max.mdc)                     |
| Windsurf              | [`platforms/windsurf/.windsurfrules`](platforms/windsurf/.windsurfrules) (short form)      |
| Cline                 | [`platforms/cline/.clinerules`](platforms/cline/.clinerules)                               |
| Roo Code              | [`platforms/roo/.roo/rules/seo-pro-max.md`](platforms/roo/.roo/rules/seo-pro-max.md)       |
| GitHub Copilot Chat   | [`platforms/copilot/.github/copilot-instructions.md`](platforms/copilot/.github/copilot-instructions.md) |
| Aider                 | [`platforms/aider/CONVENTIONS.md`](platforms/aider/CONVENTIONS.md)                         |
| Continue.dev          | [`platforms/continue/config-snippet.json`](platforms/continue/config-snippet.json)         |
| Zed AI                | [`platforms/zed/settings-snippet.json`](platforms/zed/settings-snippet.json)               |
| Plain LLM / Custom GPT| [`platforms/plain-llm/system-prompt.md`](platforms/plain-llm/system-prompt.md)             |

All platform files are auto-generated from [`SKILL.md`](SKILL.md) by [`scripts/build-platforms.mjs`](scripts/build-platforms.mjs). Edit `SKILL.md` only.

## How it compares

|                                  | `seo-pro-max` | `next-seo` / `@nuxtjs/seo` / `astro-seo` / Spatie SEO | Lighthouse / Pa11y | Hand-rolled |
|----------------------------------|---------------|--------------------------------------------------------|--------------------|-------------|
| Asks before deciding             | ✅            | ❌ library                                              | ❌ auditor          | depends     |
| Multi-framework                  | ✅            | ❌ framework-specific                                   | ✅                  | depends     |
| Multi-IDE (Claude / Cursor / …)  | ✅            | n/a                                                    | n/a                | n/a         |
| Schema.org type recommendation   | ✅ project-aware | ❌                                                   | ❌                  | ❌           |
| WCAG 2.2 AA enforcement          | ✅            | ❌                                                     | partial (audit)    | ❌           |
| HTTP status / soft-404 detection | ✅            | ❌                                                     | partial            | depends     |
| Tracks current Google deprecations (FAQPage, prev/next, sitemap ping) | ✅ | drifts | ✅ | drifts |
| Admin-panel UI scaffolding       | ✅            | ❌                                                     | ❌                  | depends     |
| Database schema decision         | ✅            | ❌                                                     | ❌                  | depends     |

This skill is **not** a replacement for `next-seo` / `astro-seo` / Spatie SEO — if any of them is already in your project, the skill detects and extends them rather than re-implementing. It's the workflow layer above the library.

## FAQ

**Is this just a long prompt?**
Yes, and intentionally so. The artifact is `SKILL.md`. The value is in (a) the executor-not-decider protocol that prevents the agent from silently picking opinionated defaults, and (b) the encoded current state of Google / Bing / Schema.org / WCAG policies as of 2026 (FAQPage deprecation, IndexNow boundaries, BCP 47 rules, soft-404 patterns, CWV thresholds). Treat it as a living spec, not a magic incantation.

**Why is it so opinionated about things like `keywords` meta or `FAQPage`?**
Because most SEO drift comes from agents and developers shipping patterns that **used to work**. Google quietly retires features (FAQPage May 2026, `rel="prev/next"` 2019, sitemap ping 2023); without an active opinion, AI agents recommend them for years afterward. The skill bakes in a refusal-list with sources so you can argue from facts in code review.

**Will it conflict with `next-seo` / `@nuxtjs/seo` / `astro-seo` / Spatie SEO?**
No. Phase 0 detects them. If present, the skill extends them (writes config / per-route metadata into the library's API) instead of hand-rolling tags. The skill also asks before installing any new dependency.

**Does it actually write files, or just suggest?**
It writes — but only after Phase 3 prints the full plan and you confirm. Every write is reported as path + 1-line description. No silent file creation.

**My site is Turkish. How does it handle `ş`, `ğ`, `ı`, `ç` in slugs?**
Surface 19 makes you pick: A) ASCII-fold (`şarküteri` → `sarkuteri`), B) UTF-8 percent-encode, or C) ASCII-fold + 301 from Unicode form (recommended default). The skill never silently strips characters; you decide once and it enforces everywhere.

**Does it optimize for Google AI Overviews / AI search?**
No, because there is currently no public, verifiable lever for that. Google has explicitly stated that `llms.txt` is not used for AI surfaces ([source](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)). The skill includes `llms.txt` as an opt-in with that disclaimer printed verbatim. Strong fundamentals (semantic HTML, real schema, accurate metadata) are what AI Overviews actually surface — and the skill covers those.

**Why is the skill in English when the author is Turkish?**
To reach a global user base on Claude Code / Cursor / Windsurf. The skill itself works on projects of any language and explicitly handles multilingual content rules (Surface 14). My personal docs (publishing notes, NPM publishing guide) are in Turkish and gitignored.

**How do I add a new Surface or improve an existing one?**
Edit `SKILL.md`, run `node scripts/build-platforms.mjs`, open a PR. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Roadmap

- [ ] `npx seo-pro-max install` — one-line installer with auto-detection (v1.0)
- [ ] Demo video / screen recording of the Phase 0 → Phase 5 flow
- [ ] More framework examples: Astro Starlight, Hugo, Jekyll, Rails, Phoenix
- [ ] Schema.org type pack for SaaS pricing pages (`SoftwareApplication` + `Offer` + `AggregateRating` with real-data guard)
- [ ] Per-locale OG image template generator
- [ ] Optional GitHub Action that re-runs the Phase 5 verify on every PR

Open an issue if you want to vote on or add to this list.

## Repo layout

```
seo-pro-max-skill/
├── SKILL.md                          # Single source of truth
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── package.json                      # npm package metadata (name, bin, files)
├── .gitignore
├── .gitattributes                    # LF line endings for .mjs / shebang safety
├── .markdownlint-cli2.jsonc
├── bin/
│   └── seo-pro-max.mjs               # CLI entry — `npx seo-pro-max <cmd>`
├── cli/
│   ├── install.mjs                   # install command
│   ├── update.mjs                    # update command
│   ├── uninstall.mjs                 # uninstall command
│   ├── doctor.mjs                    # diagnostic command
│   ├── detect-platform.mjs           # auto-detection of IDE / agent
│   ├── targets.mjs                   # per-platform paths & metadata
│   ├── prompt.mjs                    # zero-dep interactive prompts
│   └── version.mjs                   # reads version from package.json
├── scripts/
│   └── build-platforms.mjs           # Regenerates platforms/* from SKILL.md
├── examples/
│   ├── seo.config.md                 # Example output the skill writes after Phase 3
│   └── json-ld/                      # Validated JSON-LD samples
├── platforms/                        # Auto-generated, do not edit by hand
│   ├── claude-code/seo-pro-max/SKILL.md
│   ├── cursor/seo-pro-max.mdc
│   ├── windsurf/.windsurfrules
│   ├── cline/.clinerules
│   ├── roo/.roo/rules/seo-pro-max.md
│   ├── copilot/.github/copilot-instructions.md
│   ├── aider/CONVENTIONS.md
│   ├── continue/config-snippet.json
│   ├── zed/settings-snippet.json
│   └── plain-llm/system-prompt.md
└── .github/
    └── workflows/
        ├── lint.yml                  # markdownlint + JSON parse + CLI smoke test (Linux/macOS/Windows × Node 18/20/22)
        ├── sync-platforms.yml        # Rebuilds platforms/ on push to main
        └── npm-publish.yml           # Publishes to npm on tag push (OIDC + provenance)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Short version: edit `SKILL.md` (the single source of truth), regenerate platform files with `node scripts/build-platforms.mjs`, open a PR. Framework corrections, Google / Bing policy updates, and new Schema.org types are especially welcome.

## Support the project

If `seo-pro-max` saved you time on a real project:

- ⭐ **[Star this repository](https://github.com/aycanozarpaci/seo-pro-max-skill)** — it's free and helps a lot with discovery.
- 🔁 Share it with someone setting up SEO on a Next / Nuxt / Astro / Laravel / Django site.
- 🐛 [Open an issue](https://github.com/aycanozarpaci/seo-pro-max-skill/issues) if you hit a framework path the skill doesn't handle yet, or if a Google / Bing policy changes.

## Author

**Can Özkan Özarpacı** — [LinkedIn](https://www.linkedin.com/in/canozkanozarpaci/)

Feedback, bug reports, and feature suggestions are best sent via GitHub Issues. For collaboration or consulting inquiries, LinkedIn DMs are open.

## License

MIT — see [LICENSE](LICENSE).

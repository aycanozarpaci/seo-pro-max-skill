# Contributing to seo-pro-max

Thanks for considering a contribution. This project is most useful when its policies stay current — Google / Bing / Schema.org / WCAG change every few months, and a stale skill is worse than no skill.

## What's most welcome

- **Policy updates** — a Google announcement deprecates a feature, a Schema.org type adds required fields, WCAG releases a clarification. Cite the source URL in the PR.
- **Framework corrections** — the skill mentions the wrong way to scaffold a 404 in your favorite framework, or a new framework deserves first-class treatment.
- **New Schema.org types** — the recommendation matrix in Surface 7 grows.
- **Edge-case anti-patterns** — something the skill currently allows that ruins SEO in production.

## What's out of scope

- Changing the executor-not-decider principle. The skill must keep asking before writing; PRs that silently introduce defaults will be declined.
- Adding telemetry, analytics, or auto-installing third-party tools.
- Re-implementing functionality that mature libraries already do (`next-seo`, `astro-seo`, Spatie SEO) — the skill extends, doesn't replace.

## How to contribute

1. Fork the repo and create a feature branch from `main`.
2. **Edit `SKILL.md` only.** It is the single source of truth. Platform files under `platforms/` are auto-generated.
3. Regenerate the platform copies:
   ```bash
   node scripts/build-platforms.mjs
   ```
4. Validate JSON-LD and lint:
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('examples/json-ld/article.json','utf8'))"
   npx markdownlint-cli2 SKILL.md README.md
   ```
5. Commit both `SKILL.md` and the regenerated `platforms/` so CI runs on the actual diff.
6. Open a PR with:
   - **What changed** — one sentence.
   - **Why** — link to the source / spec / Google blog post if the change tracks an external announcement.
   - **Affected Surfaces** — list the surface numbers.

## Style

- Markdown only. No HTML, no images checked in to PRs (file an issue if you need to add an asset).
- Short, declarative sentences. Avoid hedging ("might", "could potentially") when the policy is firm.
- Cite sources for any factual claim about a search engine's behavior.
- Do not add Turkish-language content to `SKILL.md` — keep it English. Author's personal notes that ship in Turkish live in `*.PUBLISHING.md` files which are gitignored.

## Reviewing PRs from other contributors

Maintainers and triage reviewers: a contribution that adds an SEO claim **must** carry a source URL. "I read somewhere that…" is grounds to request changes. The skill's value collapses if it accumulates folklore.

## Releasing

Versioning follows [SemVer](https://semver.org/):

- **patch** — typo, clarification, source-link update, framework-list extension.
- **minor** — new Surface, new Schema.org type, new platform target, new CLI subcommand.
- **major** — change to the Phase 0 → Phase 5 protocol, change to the executor-not-decider principle, removal of a Surface.

Releases:

```bash
npm version patch   # or minor / major
git push --follow-tags
```

CI publishes to npm on tag push (once the npm package is live).

## Questions

Open a Discussion or an Issue. For private inquiries about commercial use, see the LinkedIn link in the README.

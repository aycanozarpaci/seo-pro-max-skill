#!/usr/bin/env node
// Build platform-specific copies of SKILL.md.
// SKILL.md is the single source of truth. Run via `node scripts/build-platforms.mjs`.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(ROOT, "SKILL.md");

const raw = readFileSync(SRC, "utf8");

function stripFrontmatter(md) {
  if (!md.startsWith("---")) return { body: md, frontmatter: null };
  const end = md.indexOf("\n---", 3);
  if (end === -1) return { body: md, frontmatter: null };
  return {
    frontmatter: md.slice(0, end + 4),
    body: md.slice(end + 4).replace(/^\s*\n/, ""),
  };
}

function write(rel, content) {
  const out = resolve(ROOT, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, content);
  console.log("wrote", rel, `(${content.length} bytes)`);
}

const { body } = stripFrontmatter(raw);

// 1. Cursor — .mdc with Cursor frontmatter, full body.
write(
  "platforms/cursor/seo-pro-max.mdc",
  `---
description: Production-grade SEO setup; analyze project first, then ask before writing. Executor, not decision-maker.
globs:
  - "**/*"
alwaysApply: false
---

${body}`,
);

// 2. Cline — plain .clinerules with the full body.
write("platforms/cline/.clinerules", body);

// 3. Roo Code — same content under .roo/rules.
write("platforms/roo/.roo/rules/seo-pro-max.md", body);

// 4. GitHub Copilot — copilot-instructions.md.
write("platforms/copilot/.github/copilot-instructions.md", body);

// 5. Aider — CONVENTIONS.md.
write("platforms/aider/CONVENTIONS.md", body);

// 6. Windsurf — character-budgeted shortened form (~6000 char limit).
//    Keep the operating protocol + surface index; drop framework-specific minutiae.
const windsurf = buildWindsurfShort(body);
write("platforms/windsurf/.windsurfrules", windsurf);

// 7. Continue.dev — config snippet (JSON).
write(
  "platforms/continue/config-snippet.json",
  JSON.stringify(
    {
      customCommands: [
        {
          name: "seo-pro-max",
          description: "Production-grade SEO setup (executor, not decision-maker)",
          prompt:
            "Read the file ./SKILL.md (or paste its body here) and follow its Phase 0 → Phase 5 protocol strictly. Do not silently choose frameworks, file paths, database schemas, or admin placement. Ask the user before every write.",
        },
      ],
      rules: [
        {
          name: "seo-pro-max",
          path: "./.continue/rules/seo-pro-max.md",
          when: "manual",
        },
      ],
    },
    null,
    2,
  ) + "\n",
);

// 8. Zed — settings.json snippet.
write(
  "platforms/zed/settings-snippet.json",
  JSON.stringify(
    {
      assistant: {
        version: "2",
        default_model: { provider: "anthropic", model: "claude-opus-4-7" },
        rules: [
          "Follow the SEO setup protocol defined in SKILL.md in this workspace. Phase 0 → Phase 5. Do not pick frameworks, paths, database schemas, or admin placement silently. Ask before writing.",
        ],
      },
    },
    null,
    2,
  ) + "\n",
);

// 9. Plain LLM / Custom GPT — system prompt copy.
write("platforms/plain-llm/system-prompt.md", body);

// 10. Claude Code — direct copy (canonical filename and folder).
write("platforms/claude-code/seo-pro-max/SKILL.md", raw);

// ---- helpers ----

function buildWindsurfShort(fullBody) {
  // Pull out top-level headings + first paragraph of each section.
  // Keep size under ~6000 chars.
  const lines = fullBody.split("\n");
  const out = [];
  let inSurfaceDeepDive = false;
  let charBudget = 5800;
  let used = 0;

  const push = (s) => {
    if (used + s.length + 1 > charBudget) return false;
    out.push(s);
    used += s.length + 1;
    return true;
  };

  push("# seo-pro-max (Windsurf short form)");
  push("");
  push(
    "Executor, not decision-maker. Analyze the project first; ask the user before every write; never silently pick framework, file path, DB schema, or admin placement.",
  );
  push("");
  push("## Protocol");
  push("0. Inventory: framework, rendering, routing, admin, DB/ORM, i18n, hosting.");
  push("1. Ask which SEO surfaces are in scope. Default: none. All opt-in.");
  push("2. Per surface, drill down with concrete questions. No silent defaults.");
  push("3. Print a written plan. Wait for explicit 'go' before writing.");
  push("4. Implement in commit-sized chunks. Report path + 1-line description per chunk.");
  push("5. Verify: build, typecheck, curl headers, fetch HTML, validate JSON-LD.");
  push("");
  push("## Surfaces (ask per-surface questions on demand)");
  const surfaceHeadings = lines.filter((l) => /^## Surface \d+/.test(l));
  for (const h of surfaceHeadings) push(`- ${h.replace(/^## /, "")}`);
  push("");
  push("## FAQPage deprecation (must tell user)");
  push(
    "Google removed FAQ rich results May 7, 2026. Do NOT emit FAQPage JSON-LD for new builds. Render FAQ as plain HTML. Use QAPage only for real community Q&A. Source: https://developers.google.com/search/docs/appearance/structured-data/faqpage",
  );
  push("");
  push("## llms.txt disclaimer (must tell user)");
  push(
    "Google does NOT use llms.txt for AI Overviews or AI ranking. Source: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide. Adding it is optional, not a ranking factor.",
  );
  push("");
  push("## HTTP status policy (mandatory; Surface 2; verified in Phase 5)");
  push(
    "- Real 404 for unknown URLs (NOT 200 with a 'not found' UI = soft-404; Google demotes it).",
  );
  push(
    "- 410 for permanently retired URLs; 301 for permanent moves (one hop, no chains); 308 to preserve method.",
  );
  push(
    "- 503 + Retry-After during maintenance, never 200 with a maintenance page.",
  );
  push(
    "- 401/403 for auth-walled hits without creds, not 200 with a login form for bots.",
  );
  push(
    "- HTTPS upgrade is 301; mixed-case and trailing-slash variants 301 to canonical form.",
  );
  push(
    "- Sitemap excludes any URL that returns 404/410/5xx.",
  );
  push(
    "- Framework wiring: Next notFound(), Nuxt createError({statusCode:404}), SvelteKit error(404), Astro Astro.response.status=404, Laravel abort(404), Django Http404. Verify the wrapper preserves status.",
  );
  push(
    "- Verify in Phase 5 with: curl -sI <homepage>, curl -sI <random-unknown-url>, curl -sIL http://<host>, curl -sIL <mixed-case>, curl -sIL <trailing-slash>. Print HTTP/1.1 200 on the unknown-URL probe as a FAIL.",
  );
  push("");
  push("## Heading hierarchy policy (mandatory; Surface 15)");
  push(
    "- Exactly one <h1> per page; <h1> mirrors/paraphrases <title>. Site logo is NOT an <h1>.",
  );
  push(
    "- No skipped levels down (h1→h3 forbidden). Jump back up freely (h3→h2 ok).",
  );
  push(
    "- Heading level by document structure, never by font size. Style is CSS.",
  );
  push(
    "- Card / teaser titles use real headings (h2/h3 per nesting), not <p class=\"title\">.",
  );
  push(
    "- 404 / empty-state pages still need an <h1>.",
  );
  push(
    "- Refuse: wrapping logo in <h1>, multiple <h1> per page, <h1> styled tiny, slug-derived auto-headings.",
  );
  push("");
  push("## Image alt-text policy (mandatory; Surface 15)");
  push(
    "- Every <img> MUST have alt=. Decorative: alt=\"\" + aria-hidden=\"true\". Content: describe purpose in context, not literal pixels.",
  );
  push(
    "- Refuse alt values that are: empty for non-decorative images, the filename, \"image\"/\"photo\"/\"logo\"/\"picture\", or auto-generated placeholders.",
  );
  push(
    "- The same alt source feeds: og:image:alt, twitter:image:alt, JSON-LD ImageObject.caption, admin upload widget, media DB column.",
  );
  push(
    "- Existing images without alt → produce alt-audit.csv (path, page, missing/empty/present). Never auto-fill.",
  );
  push("");
  push("## Lang / i18n / hreflang (Surface 14)");
  push(
    "- <html lang> mandatory every route; BCP 47 (tr, en-US, pt-BR, zh-CN), NOT en_US / TR / cn.",
  );
  push(
    "- RTL locales (ar, he, fa, ur) require dir='rtl' + logical CSS properties.",
  );
  push(
    "- Inline <span lang> for foreign-language quotes/names.",
  );
  push(
    "- hreflang: self-reference mandatory; bidirectional pairs mandatory (one-way = Google rejects cluster); x-default exactly once; emit in head OR sitemap (not both).",
  );
  push(
    "- Never auto-redirect on Accept-Language / geo-IP (banner only). Never serve wrong language with mismatched <html lang> (soft-404 + language mismatch).",
  );
  push(
    "- Translated title/description/og/twitter/JSON-LD per locale.",
  );
  push("");
  push("## keywords meta policy (Surface 1)");
  push(
    "- Google/Bing/DuckDuckGo: IGNORE. Omit by default.",
  );
  push(
    "- Yandex (RU/CIS) / Baidu (CN): still read. Emit ONLY for these markets; 3-6 honest terms per page; no stuffing; never fabricate from slug.",
  );
  push("");
  push("## Pagination (Surface 2)");
  push(
    "- rel=prev/next DEPRECATED by Google (2019). Do not emit.",
  );
  push(
    "- Each paginated page self-canonicals; never canonical page 2+ back to page 1.",
  );
  push(
    "- Paginated pages stay index,follow unless content is dup.",
  );
  push("");
  push("## Core Web Vitals (Surface 17)");
  push(
    "- LCP <= 2.5s, CLS <= 0.1, INP <= 200ms (mobile, Google Good).",
  );
  push(
    "- LCP image: fetchpriority=high, NOT lazy. Above-fold eager, below lazy.",
  );
  push(
    "- Every <img> needs width+height (CLS). font-display:swap; preload LCP font.",
  );
  push(
    "- No render-blocking inline JS above <title>. Third-party defer/async.",
  );
  push("");
  push("## Image optimization (Surface 18)");
  push(
    "- AVIF > WebP > JPEG/PNG. <picture> + multiple <source type>.",
  );
  push(
    "- srcset + sizes mandatory on responsive images. Width descriptors.",
  );
  push(
    "- Explicit width/height attrs. decoding=async. EXIF stripped. SVG sanitized.",
  );
  push(
    "- JSON-LD image dimensions match largest variant served.",
  );
  push("");
  push("## URL / slugs (Surface 19)");
  push(
    "- lowercase, hyphen-separator, ASCII-fold or UTF-8 percent-encode (pick one). Underscore banned.",
  );
  push(
    "- Max ~75 chars. Trailing slash policy enforced via 301.",
  );
  push(
    "- Slug changes => 301 from old. Stable slugs.",
  );
  push("");
  push("## Internal linking (Surface 20)");
  push(
    "- Every indexable URL must be reachable from another indexable URL (no orphans).",
  );
  push(
    "- Anchor text: never 'click here'/'buradan'/'read more' alone. Add visually-hidden context.",
  );
  push(
    "- No rel=nofollow on internal nav. Link depth <= 3 (small) / <= 5 (large).",
  );
  push(
    "- Faceted nav: robots.txt block / noindex / canonical-to-parent (user picks).",
  );
  push("");
  push("## Security headers (Surface 21)");
  push(
    "- HSTS (with caveat re: includeSubDomains+preload), CSP report-only first, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy minimal.",
  );
  push(
    "- Strip Server / X-Powered-By headers.",
  );
  push("");
  push("## IndexNow / submission (Surface 22)");
  push(
    "- IndexNow: Bing + Yandex + Seznam. Google does NOT support. Don't pitch as Google booster.",
  );
  push(
    "- Sitemap auto-ping endpoints DEPRECATED 2023. Don't call them.",
  );
  push(
    "- Verification meta: GSC, Bing, optionally Yandex/Naver/Baidu.",
  );
  push("");
  push("## SPA hydration (Surface 23)");
  push(
    "- document.title and ALL head tags must update on client-side route changes (not just initial render).",
  );
  push(
    "- Use a head manager (@unhead, react-helmet-async, next/head) that replaces, not appends.",
  );
  push(
    "- Move focus to new <h1> on route change (a11y).",
  );
  push(
    "- CSR-only routes: explicit noindex; don't rely on bot failing to render.",
  );
  push("");
  push("## Hard rules");
  push("- Idempotent. Detect existing artifacts; never duplicate.");
  push("- No fake data in JSON-LD (ratings, reviews, prices). Refuse if synthetic.");
  push("- Escape user-supplied content in meta `content` and JSON-LD.");
  push("- Head order: charset, viewport, title, description, canonical, robots, OG, Twitter, JSON-LD, icons.");
  push("- Stop on ambiguity. Ask the user.");
  push("");
  push("Full skill: https://github.com/aycanozarpaci/seo-pro-max-skill/blob/main/SKILL.md");

  return out.join("\n") + "\n";
}

console.log("\nbuild-platforms: done.");

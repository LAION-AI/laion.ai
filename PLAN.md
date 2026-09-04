# LAION.ai — Astro Rewrite Plan

**Branch:** `astro-rewrite` · **Baseline:** `main` @ `1a16c61e` · **Written:** 2026-09-04

Goal: rebuild https://laion.ai on a modern stack with a cleaner, more contemporary
layout, **full parity with today's site**, plus the functionality it never had —
starting with a real, self-owned form backend.

This document is the build order. Each step is meant to be a reviewable commit or PR.
Steps 1–3 are the sequence you asked for; steps 4–11 carry it to a shippable site.

---

## 0. Where we are today (assessment)

### 0.1 Stack

| Layer | Today |
|---|---|
| Framework | Next.js `12.1.6` (Pages Router), React `18.1.0` |
| Styling | Tailwind `3.1.2` + `tailwind-children` plugin + 255 lines of global CSS |
| Markdown | `gray-matter` + `markdown-it` + `markdown-it-github-headings`, injected via `dangerouslySetInnerHTML` |
| Images | `next-image-export-optimizer` (custom Next image loader, build-time WEBP) |
| Animation | `framer-motion` 6 (page fade), `react-slideshow-image` (hero), `react-burger-menu` (mobile nav) |
| Dates | `dateformat` |
| Icons | `react-icons` |
| Forms | `@formspark/use-formspark` → third-party endpoint, form id `lMcR2WFx` hardcoded in two pages |
| Build | `next build && next export && next-image-export-optimizer` → `out/` |
| Deploy | GitHub Actions → `peaceiris/actions-gh-pages` → `gh-pages` branch → GitHub Pages, `CNAME` = `laion.ai`, `.nojekyll` |

Next.js 12 is four major versions behind and out of support. React 18.1, Tailwind 3
and framer-motion 6 are all superseded. The whole app is **1,855 lines** across 25
page files and 2 components — small enough to port deliberately rather than
mechanically.

### 0.2 Route inventory and data sources

| URL | Source file | Data source |
|---|---|---|
| `/` | `src/pages/index.js` | hardcoded JSX + 4-image hero slideshow |
| `/projects` | `src/pages/projects.js` | `content/projects.json` |
| `/team` | `src/pages/team.js` | `content/team.json` |
| `/blog` | `src/pages/blog/index.js` | `blog/*.md` |
| `/blog/[slug]` | `src/pages/blog/[slug].js` | `blog/*.md` (36) |
| `/notes` | `src/pages/notes/index.js` | `notes/*.md` |
| `/notes/[slug]` | `src/pages/notes/[slug].js` | `notes/*.md` (10) |
| `/blog-de` | `src/pages/blog-de/index.js` | `blog-de/*.md` |
| `/blog-de/[slug]` | `src/pages/blog-de/[slug].js` | `blog-de/*.md` (2) |
| `/press` | `src/pages/press.js` | `content/press.json` (31 links) |
| `/about` | `src/pages/about.js` | `content/about.md` |
| `/faq` | `src/pages/faq.js` | `content/faq.json` (7 Q&A) |
| `/donations` | `src/pages/donations.js` | `content/donations.md` (IBAN/BIC in frontmatter) |
| `/privacy-policy` | `src/pages/privacy-policy.js` | `content/privacy-policy.json` (29 Q&A) **+ a stray dataset-request form** |
| `/dataset-requests` | `src/pages/dataset-requests.js` | `content/dataset-requests.json` + Formspark |
| `/impressum` | `src/pages/impressum.js` | `content/impressum.md` |
| `/gep-policy` | `src/pages/gep-policy.js` | `content/gep-policy.md` |
| `/404` | `src/pages/404.js` | — |
| `/laion-400-open-dataset` | redirect page | client-side `router.push` → `/blog/laion-400-open-dataset` |
| `/laion-5b-a-new-era-of-open-large-scale-multi-modal-datasets` | redirect page | client-side `router.push` → `/blog/laion-5b` |

Shared: `src/components/Nav.js` (desktop sidebar + burger menu, 12 links + 3 social
icons), `src/components/Tags.js` (per-page `<head>`: title/description/OG/Twitter/
favicon + 6 font preloads).

### 0.3 Content inventory

- **48 markdown documents**: `blog/` 36, `notes/` 10, `blog-de/` 2.
  Frontmatter is uniform and minimal: `title`, `author`, `date`, `previewImg` — all
  four present on all 48 files, nothing else.
- `date` is free-form English (`"Aug 26, 2026"`, `"January 20 2025"`, `"Sep 15, 2022"`).
  All 48 parse with `new Date()`, so `z.coerce.date()` will accept them unchanged.
- **10 content files**: 4 markdown (`about`, `donations`, `gep-policy`, `impressum`),
  6 JSON (`team` 22 people, `projects` 4 groups / 25 entries, `faq` 7, `press` 31,
  `privacy-policy` 29, `dataset-requests` 1).
- **`public/images` is 131 MB**: `blog/` 119 MB (123 files, incl. a 14 MB `.mp4` and an
  11 MB `.gif`), `team/` 8.7 MB (2 portraits over 2.4 MB each), `gallery/` (4 hero
  images × avif/webp/jpg). Formats: 139 `.png`, 45 `.jpg`, 3 `.PNG` (uppercase),
  8 `.webp`, 7 `.gif`, 4 `.avif`, 1 `.svg`, 1 `.mp4`.
- `public/documents`: 3 PDFs + 1 standalone HTML report (592 KB) — must keep working URLs.
- `public/fonts`: **Dinish** (Regular / Italic / Condensed-Bold, woff+woff2) loaded via
  a plain `public/fonts/load.css` and 6 manual `<link rel=preload>` tags.
- Content uses raw HTML in 14 files (`<div>`, `<img>`, `<iframe>` YouTube embed,
  `<video>`, `<table>`, `<sup>`), 7 files use fenced code blocks. No LaTeX/math,
  no footnote syntax. One `previewImg` points at a **remote** `raw.githubusercontent.com`
  URL (`notes/realfake.md`).

### 0.4 What is worth keeping

- **Git-based, markdown-first editing.** 340+ commits from `robvanvolt`, and posts land
  from researchers via the GitHub web UI. Any new stack must keep "drop a `.md` in a
  folder, push, done" — no CMS login required. This rules out anything that needs a
  build step to author.
- **Static output.** The site is content, not an app. Fast, cheap, crawlable.
- **The brand.** Dinish type, `#1D374E` "sky" / `#F6F6F6` "paper", the oversized
  condensed headline treatment, the hero slideshow of community-generated images.
  Modernise the layout, don't rebrand.
- **Every existing URL.** 48 post URLs are cited in papers and on social media.

### 0.5 Known bugs and debt to fix during the port

These are real, currently live, and each is a one-line fix in the new codebase —
worth folding into the rewrite rather than filing separately.

1. `src/pages/privacy-policy.js:39-131` renders a **complete dataset-request form**
   (name / email / dataset / sample ID / website) at the bottom of the privacy policy,
   with no heading or explanation, posting to the same Formspark id. Almost certainly
   a copy-paste from `dataset-requests.js`. Decide: remove, or make it a deliberate
   "exercise your GDPR rights" form.
2. Both forms POST a field named **`datset`** (typo) — so every submission since has a
   misnamed column.
3. `src/pages/index.js:11-13` redirects `#contact` to **`/gdpr`**, a route that does not
   exist → hard 404.
4. `src/pages/404.js` uses the legacy `<Link><a>` nesting and renders **no `<Tags>`**,
   so the 404 page has no title or meta.
5. `notes/index.js` and `blog-de/index.js` both set `<Tags title="Blog" />` — wrong
   title on two sections.
6. Blog/notes/blog-de indexes render **the full markdown of every post** just to slice a
   300-character excerpt, then strip tags with a regex. That is 48 markdown renders per
   index build, and it truncates mid-word/mid-entity.
7. `blog-de/[slug].js` hardcodes `lang="en"` on German articles.
8. `press.js:19` derives the outlet name via `item.url.split("www.")[1].split('/')[0]`.
   All 31 URLs happen to contain `www.` today; the 32nd that doesn't will crash the build.
9. `src/api/hello.js` — dead Next.js API stub, and in the wrong directory
   (`src/api/`, not `src/pages/api/`), so it was never even routed.
10. `sci.jpg` and `sci2.jpg` sit in the **repo root** (278 KB), unused — the real copies
    are `public/images/blog/sci{,2}.jpg`.
11. `globals.css:14` — `div { font-family: "Dinish" !important; }` applies to every div
    on the site and can't be overridden.
12. `.article img` forces `width:100%` on every in-article image regardless of intrinsic size.
13. Three image files use an uppercase `.PNG` extension — will need case-insensitive
    globs or a rename.
14. `_app.js` uses framer-motion 6's deprecated `exitBeforeEnter`.
15. No `sitemap.xml`, no `robots.txt`, no RSS feed, no canonical URLs, no JSON-LD.
16. Clickable cards are `<div>` inside `<Link>` — not keyboard focusable, no accessible name.

---

## 1. Target stack, and the one decision to make first

### 1.1 Stack

| Layer | New |
|---|---|
| Framework | **Astro 6** (Node 22+ required) |
| Language | TypeScript (`strict`) |
| Content | **Content Collections** with `glob()` / `file()` loaders + Zod 4 schemas |
| Styling | **Tailwind CSS 4** (`@tailwindcss/vite`, CSS-first config) + `@tailwindcss/typography` |
| Markdown | Astro's built-in remark/rehype + Shiki, `rehype-slug` + `rehype-autolink-headings` (replaces `markdown-it-github-headings`), `rehype-external-links` |
| Images | `astro:assets` (sharp) — responsive `srcset`, AVIF/WebP, lazy by default |
| Fonts | Astro 6 **Fonts API** with `fontProviders.local()` — replaces hand-rolled `load.css` + 6 preload tags |
| Interactivity | Astro islands; vanilla TS for nav/theme/search. No React unless a component earns it |
| Transitions | `<ClientRouter />` (`astro:transitions`) — replaces framer-motion |
| Feeds/SEO | `@astrojs/rss`, `@astrojs/sitemap`, per-page canonical + JSON-LD |
| Search | **Pagefind** via `astro-pagefind` (build-time index, runs in the browser, no API key) |
| Forms | **Astro Actions** (`astro:actions`) — server-side, Zod-validated, progressive enhancement |
| Hosting | see 1.2 |

Why Astro specifically: the site is 48 markdown documents and 20 mostly-static pages.
Astro ships zero JS by default, and its content collections give us schema validation
at build time — the last commit on `main` is literally *"fix json syntax error"*, which
a Zod schema would have caught before it was pushed. Astro 6 also brings first-class
Cloudflare Workers support (dev runs the real production runtime via Vite's Environment
API), a built-in Fonts API, and a CSP API — all directly useful here.

### 1.2 Hosting decision — needed before Step 3, not before Step 1

A self-owned form backend needs somewhere to run server code. Three options:

**Option A — Cloudflare Workers (recommended).**
`@astrojs/cloudflare` adapter, `output: 'static'` with `export const prerender = false`
on just the form routes. Everything else is still prerendered static HTML. Gives us
D1 (submissions), KV (rate limiting), Turnstile (spam), Workers free tier, and Astro 6
treats Workers as a first-class target so `astro dev` runs the same runtime as prod.
*Cost:* free at our traffic. *Requires:* pointing `laion.ai` DNS at Cloudflare, and
retiring the `gh-pages` deploy.

**Option B — Stay on GitHub Pages, add one Worker.**
Astro stays `output: 'static'` (no adapter), keeps deploying to `gh-pages` exactly as
today. The form posts to a standalone Cloudflare Worker on `api.laion.ai`. Same
validation code, same D1/Turnstile — just not inside the Astro app.
*Requires:* one new DNS record. Zero risk to the main site.

**Option C — Keep Formspark.**
No backend work; port the two forms as-is. Submissions stay on a third party, the
`datset` typo stays, and we don't own the data — a poor fit for an org whose own
privacy policy is 29 questions long.

**Recommendation: A**, with B as the fallback if moving DNS is inconvenient. Step 3 is
written so that the validation + persistence logic is identical either way — only the
transport differs. **Do not let this decision block Steps 1 and 2.**

---

## Step 1 — Scaffold the Astro project

Node 22+ is required by Astro 6 (`node -v` to confirm; Node is not currently on PATH
in this checkout).

Scaffold into a temporary directory so the existing Next.js app stays intact and
runnable for side-by-side comparison:

```bash
npm create astro@latest -- ./astro-tmp --template minimal --typescript strict --no-install --no-git
```

Then move it into place and remove the Next.js app in the same commit:

```bash
cd /Users/robert/Developer/laion/laion.ai
rsync -a astro-tmp/ ./ && rm -rf astro-tmp
git rm -r --cached src next.config.js postcss.config.js tailwind.config.js .eslintrc.json
rm -rf src/pages src/components src/api next.config.js postcss.config.js tailwind.config.js .eslintrc.json
rm -f sci.jpg sci2.jpg              # unused root strays (0.5 #10)
npm install
```

Add the integrations:

```bash
npx astro add tailwind mdx sitemap --yes
npm i @astrojs/rss astro-pagefind @tailwindcss/typography rehype-slug rehype-autolink-headings rehype-external-links
npm i -D prettier prettier-plugin-astro eslint eslint-plugin-astro @astrojs/check typescript
# Option A only:
npx astro add cloudflare --yes
```

`astro.config.mjs` — the starting point:

```js
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
// Option A:
// import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://laion.ai',
  trailingSlash: 'always',           // matches today's next.config.js
  output: 'static',
  // adapter: cloudflare(),          // Option A only
  integrations: [mdx(), sitemap(), pagefind()],
  vite: { plugins: [tailwindcss()] },
  image: {
    // notes/realfake.md uses a remote previewImg
    domains: ['raw.githubusercontent.com'],
  },
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
  fonts: [{
    provider: fontProviders.local(),
    name: 'Dinish',
    cssVariable: '--font-dinish',
    options: {
      variants: [
        { weight: 400, style: 'normal',  src: ['./src/assets/fonts/Dinish-Regular.woff2', './src/assets/fonts/Dinish-Regular.woff'] },
        { weight: 400, style: 'italic',  src: ['./src/assets/fonts/Dinish-Italic.woff2',  './src/assets/fonts/Dinish-Italic.woff'] },
        { weight: 700, style: 'normal',  src: ['./src/assets/fonts/DinishCondensed-Bold.woff2', './src/assets/fonts/DinishCondensed-Bold.woff'] },
      ],
    },
  }],
});
```

**Exit criteria:** `npm run dev` serves a blank Astro page; `npm run build` passes;
`npx astro check` is clean; Tailwind 4 utilities apply.

---

## Step 2 — Bring the content across from `main`

Content moves **as-is**. No frontmatter rewriting, no renaming, no reformatting — the
whole point is that authors' existing workflow and all 48 URLs survive.

```bash
git checkout astro-rewrite

# Markdown collections -> src/content/
mkdir -p src/content
git checkout main -- blog notes blog-de content
git mv blog        src/content/blog
git mv notes       src/content/notes
git mv blog-de     src/content/blog-de
git mv content     src/content/pages

# Static assets: images, documents, favicons, social card, CNAME stay in public/
git checkout main -- public
git mv public/fonts src/assets/fonts     # fonts move into src/ for the Fonts API

git commit -m "Move blog, notes, blog-de and content from main into Astro layout"
```

Result:

```
src/content/blog/*.md          36 posts, untouched
src/content/notes/*.md         10 notes, untouched
src/content/blog-de/*.md       2 German posts, untouched
src/content/pages/             about.md, donations.md, gep-policy.md, impressum.md,
                               team.json, projects.json, faq.json, press.json,
                               privacy-policy.json, dataset-requests.json
src/assets/fonts/              Dinish woff/woff2 (+ the unused .otf can be dropped)
public/images/                 131 MB, unchanged paths -> /images/... keeps working
public/documents/              3 PDFs + llava_cogvlm_pop.html, unchanged URLs
public/{favicon.png,favicon.svg,social.png,CNAME}
```

Then declare the schemas — `src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';        // Astro 6 ships Zod 4

// Matches the frontmatter that all 48 existing posts already have.
const post = z.object({
  title: z.string(),
  author: z.string(),
  date: z.coerce.date(),                    // parses "Aug 26, 2026" and "January 20 2025"
  previewImg: z.string(),                   // local /images/... path or remote URL
  // additive, all optional -> no existing file needs to change:
  description: z.string().optional(),       // hand-written excerpt (replaces the regex slice)
  tags: z.array(z.string()).default([]),
  lang: z.enum(['en', 'de']).default('en'),
  draft: z.boolean().default(false),
  canonical: z.string().url().optional(),   // for cross-posted papers
});

const blog    = defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),    schema: post });
const notes   = defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),   schema: post });
const blogDe  = defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog-de' }), schema: post });

const team = defineCollection({
  loader: file('./src/content/pages/team.json'),
  schema: z.object({ name: z.string(), title: z.string(), desc: z.string(), img: z.string().optional() }),
});

const projects = defineCollection({
  loader: file('./src/content/pages/projects.json'),
  schema: z.object({
    name: z.string(),
    entries: z.array(z.object({
      name: z.string(), link: z.string(), modality: z.string(),
      kind: z.string(), status: z.string(), desc: z.string().optional(),
    })),
  }),
});

const faq          = defineCollection({ loader: file('./src/content/pages/faq.json'),             schema: z.object({ q: z.string(), a: z.string() }) });
const privacy      = defineCollection({ loader: file('./src/content/pages/privacy-policy.json'),  schema: z.object({ q: z.string(), a: z.string() }) });
const datasetIntro = defineCollection({ loader: file('./src/content/pages/dataset-requests.json'),schema: z.object({ q: z.string(), a: z.string() }) });
const press        = defineCollection({ loader: file('./src/content/pages/press.json'),           schema: z.object({ dt: z.coerce.date(), url: z.string().url() }) });

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    heading: z.string().optional(),
    name: z.string().optional(), iban: z.string().optional(), bic: z.string().optional(), // donations.md
  }),
});

export const collections = { blog, notes, blogDe, team, projects, faq, privacy, datasetIntro, press, pages };
```

**Important:** unlike `glob()`, the `file()` loader does **not** generate ids — every
entry needs a unique `id`, either as an object key or an `id` property. None of our six
JSON files have one. Rather than editing the content, add ids in a `parser`:

```ts
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const team = defineCollection({
  loader: file('./src/content/pages/team.json', {
    parser: (text) => JSON.parse(text).map((e: any) => ({ id: slugify(e.name), ...e })),
  }),
  schema: z.object({ name: z.string(), title: z.string(), desc: z.string(), img: z.string().optional() }),
});
```

Same pattern for the rest: `projects` → `slugify(name)`, `faq`/`privacy`/`datasetIntro`
→ `slugify(q)`, `press` → `hostname + '-' + dt`. Write the `parser` once as a helper and
reuse it.

**Exit criteria:** `npx astro check && npm run build` passes with all 48 posts and 6 JSON
files validating. Any schema failure is a real content bug — fix the content, not the schema.

---

## Step 3 — The form backend, and the rest of the new functionality

### 3.1 Priority list

| # | Functionality | Priority | Notes |
|---|---|---|---|
| 1 | **Self-owned form backend** (dataset requests + GDPR requests + general contact) | P0 | Replaces Formspark. Details below. |
| 2 | Site search over posts, notes, team, projects | P0 | Pagefind, build-time index, zero infra |
| 3 | RSS/Atom feeds — `/rss.xml`, `/notes/rss.xml`, `/blog-de/rss.xml` | P0 | `@astrojs/rss`. Most-requested thing a research blog can lack |
| 4 | `sitemap.xml` + `robots.txt` + canonical URLs + JSON-LD (`Organization`, `BlogPosting`) | P0 | `@astrojs/sitemap` |
| 5 | Tags / topics with `/blog/tag/[tag]` archives; author pages | P1 | Schema field added in Step 2; backfill gradually |
| 6 | Paginated blog index + real excerpts (`description`) instead of a 300-char regex slice | P1 | Astro `paginate()` |
| 7 | Real i18n routing (`/de/...`) replacing the copy-pasted `blog-de/` directory | P1 | Astro i18n config; keep `/blog-de/*` as redirects |
| 8 | Light/dark theme (site is currently dark-only) with `prefers-color-scheme` + toggle | P1 | CSS custom properties, no flash-of-wrong-theme |
| 9 | Publications page from a `publications.json` collection (BibTeX-ish: authors, venue, year, arXiv/DOI, code) | P1 | Currently 2 papers buried in `projects.json` |
| 10 | Newsletter signup (double opt-in) | P2 | Same backend as #1 |
| 11 | Privacy-friendly analytics (Cloudflare Web Analytics or self-hosted Umami — no cookies) | P2 | Must match the privacy policy |
| 12 | Accessibility pass: real `<a>` cards, focus states, skip link, alt text, landmarks | P0 | Cheap now, expensive later |
| 13 | Image pipeline: `astro:assets` responsive AVIF/WebP; compress the 131 MB in `public/images` | P1 | Two 2.4 MB+ team portraits, an 8.3 MB PNG, a 14 MB MP4 |
| 14 | OG image generation per post (`satori`/`@vercel/og`-style, build-time) | P2 | Today every post shares one `social.png` |

### 3.2 The form backend in detail

Today: two React pages call `useFormspark({ formId: 'lMcR2WFx' })` and POST six fields
(one misspelled `datset`) to a third-party service. No validation beyond HTML `required`,
no spam protection, no rate limiting, no record of submissions we control, and the form
doesn't work at all with JS disabled.

**Target: Astro Actions.** Server-side handler, Zod-validated input, works as a plain
HTML form POST (progressive enhancement) and as a `fetch` call from JS.

`src/actions/index.ts`:

```ts
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';

const contactBase = {
  name:    z.string().min(1).max(200),
  email:   z.string().email(),
  message: z.string().min(10).max(5000),
  consent: z.literal('on', { message: 'You must accept the privacy policy.' }),
  honeypot: z.string().max(0).optional(),      // bots fill hidden fields
  'cf-turnstile-response': z.string().min(1),  // Cloudflare Turnstile
};

export const server = {
  datasetRequest: defineAction({
    accept: 'form',
    input: z.object({
      ...contactBase,
      dataset:  z.string().min(1).max(200),
      sampleId: z.string().min(1).max(200),    // NOTE: fixes the `datset` typo
      website:  z.string().url(),
    }),
    handler: async (input, ctx) => {
      await verifyTurnstile(input['cf-turnstile-response'], ctx);
      await rateLimit(ctx, 'dataset-request', { perHour: 5 });
      const id = await saveSubmission(ctx, 'dataset_request', input);
      await notifyTeam('dataset-request', id, input);
      return { ok: true, reference: id };
    },
  }),

  privacyRequest: defineAction({ accept: 'form', input: z.object({ ...contactBase, kind: z.enum(['access','deletion','rectification','objection']) }), handler: /* same shape */ }),
  contact:        defineAction({ accept: 'form', input: z.object(contactBase),                                                                        handler: /* same shape */ }),
};
```

The page — note `prerender = false` on this route only; the other ~20 routes stay static:

```astro
---
// src/pages/dataset-requests.astro
export const prerender = false;
import { actions, isInputError } from 'astro:actions';
const result = Astro.getActionResult(actions.datasetRequest);
const errors = result && isInputError(result.error) ? result.error.fields : {};
---
{result?.data?.ok
  ? <p role="status">Thank you — your request was recorded as {result.data.reference}.</p>
  : <form method="POST" action={actions.datasetRequest}>
      <!-- fields, each rendering errors[name] -->
      <input type="text" name="honeypot" tabindex="-1" autocomplete="off" hidden />
      <div class="cf-turnstile" data-sitekey={import.meta.env.PUBLIC_TURNSTILE_SITE_KEY}></div>
      <label><input type="checkbox" name="consent" required /> I accept the <a href="/privacy-policy/">privacy policy</a>.</label>
      <button type="submit">Send</button>
    </form>}
```

Pipeline behind the handler:

1. **Spam:** Cloudflare Turnstile (no CAPTCHA puzzle, GDPR-friendly) + honeypot field +
   minimum time-on-form check.
2. **Rate limit:** hashed-IP counter in Workers KV — 5 submissions/hour/IP, 50/day/route.
   Store `SHA-256(ip + daily_salt)`, never the raw IP.
3. **Persist:** a D1 table `submissions(id, kind, created_at, payload_json, status)`.
   This is the record we currently don't have.
4. **Notify:** email to `contact@laion.ai` via Resend (or MailChannels). Never trust
   user input in headers; template the body, no HTML from input.
5. **Retention:** a scheduled Worker (cron) purges rows older than the period stated in
   the privacy policy. Pick the number, then write it into `privacy-policy.json` — the
   two must agree.
6. **Secrets:** `TURNSTILE_SECRET`, `RESEND_API_KEY` as Worker secrets / GitHub Actions
   secrets. `PUBLIC_TURNSTILE_SITE_KEY` is the only one in client code.

**Option B variant:** the exact same Zod schema and pipeline live in a standalone Worker
(`workers/forms/src/index.ts`) exposed at `https://api.laion.ai/`. The Astro page keeps
`prerender = true` and the form posts cross-origin to that endpoint (CORS locked to
`https://laion.ai`). We lose `getActionResult`'s no-JS round trip and render the result
client-side instead. Everything else is identical, so switching A↔B later is a
transport change, not a rewrite.

**Also decide here:** whether the form currently sitting at the bottom of
`/privacy-policy` (0.5 #1) becomes a deliberate GDPR-rights form (`privacyRequest`
above) or is deleted. Recommendation: make it deliberate, with a heading that explains it.

---

## Step 4 — Design system, layout, navigation

The redesign lives here. Keep the identity (`#1D374E` sky, `#F6F6F6` paper, Dinish
condensed display type, oversized headlines, community imagery); modernise the shell.

- **Tokens in CSS, not in `tailwind.config.js`.** Tailwind 4 is CSS-first:
  `@theme { --color-sky: #1D374E; --color-paper: #F6F6F6; --font-display: var(--font-dinish); }`
  plus a semantic layer (`--color-surface`, `--color-text`, `--color-border`) so the
  light/dark theme is a token swap rather than a class-by-class rewrite.
- **Fix the type system.** Delete `div { font-family: Dinish !important }`. Set the font
  on `:root`, use a real modular scale, cap measure at ~68ch for article text, and use
  `@tailwindcss/typography` with a `prose-laion` variant instead of the 120 lines of
  hand-written markdown CSS in `globals.css`.
- **Navigation.** Today's fixed 12-link sidebar with a burger duplicate on mobile is the
  main dated element and it will not scale. Restructure to a slim header +
  grouped mega-menu / footer sitemap:
  - *Research*: Blog · Notes · Projects · Publications
  - *Organisation*: About · Team · Press · FAQ
  - *Support*: Donations · Dataset Requests
  - *Legal* (footer only): Privacy Policy · Impressum · GEP Policy
  Add a search entry (`/` or `Cmd+K`) and a theme toggle. One nav definition in
  `src/config/nav.ts`, consumed by header, mobile drawer and footer — no more
  maintaining the same 12 links in two places.
- **`BaseLayout.astro`** owns `<head>`: title/description/canonical/OG/Twitter, JSON-LD,
  `<Font cssVariable="--font-dinish" preload />` (replaces the 6 manual preload tags),
  `<ClientRouter />`, and a `<a href="#main" class="skip-link">`. This is `Tags.js`, done
  properly and typed.
- **`ArticleLayout.astro`** for blog/notes/blog-de: title, author, date, reading time,
  tags, a table of contents from the heading tree, prev/next, share links, and a
  "cite this post" block. Article images get `loading="lazy"`, real dimensions, and
  figure/figcaption instead of a blanket `width:100%`.
- **Cards become `<a>`.** Every clickable card in team/projects/blog/press is a real
  anchor with a visible focus ring.

Deliverable before writing components: 3 desktop + 3 mobile mockups (home, blog index,
article) for sign-off, so layout debate happens once.

---

## Step 5 — Port the pages (route parity matrix)

Port in this order — data-driven pages first (they exercise the collections), home last
(it's the most design-heavy).

| # | New file | URL | Replaces | Notes |
|---|---|---|---|---|
| 1 | `src/pages/blog/index.astro` | `/blog/` | `blog/index.js` | `paginate()`, real `description`, tag filter |
| 2 | `src/pages/blog/[...slug].astro` | `/blog/[slug]/` | `blog/[slug].js` | `getStaticPaths` from collection; `render()` |
| 3 | `src/pages/notes/index.astro` + `[...slug].astro` | `/notes/`, `/notes/[slug]/` | `notes/*` | fix the "Blog" title bug |
| 4 | `src/pages/team.astro` | `/team/` | `team.js` | `astro:assets` portraits, 22 people |
| 5 | `src/pages/projects.astro` | `/projects/` | `projects.js` | 4 groups, internal vs external links, filter by modality/kind/status |
| 6 | `src/pages/press.astro` | `/press/` | `press.js` | derive outlet via `new URL(url).hostname` — kills bug 0.5 #8 |
| 7 | `src/pages/faq.astro` | `/faq/` | `faq.js` | `<details>` accordion + `FAQPage` JSON-LD |
| 8 | `src/pages/about.astro`, `impressum.astro`, `gep-policy.astro` | ditto | markdown pages | one shared `MarkdownPage` layout |
| 9 | `src/pages/donations.astro` | `/donations/` | `donations.js` | IBAN/BIC + copy-to-clipboard + gofundme |
| 10 | `src/pages/privacy-policy.astro` | `/privacy-policy/` | `privacy-policy.js` | 29 Q&A + the GDPR form decision |
| 11 | `src/pages/dataset-requests.astro` | `/dataset-requests/` | `dataset-requests.js` | Step 3 form |
| 12 | `src/pages/404.astro` | `/404/` | `404.js` | add meta + search box + popular links |
| 13 | `src/pages/index.astro` | `/` | `index.js` | see below |
| 14 | `src/pages/search.astro` | `/search/` | *new* | Pagefind UI |
| 15 | `src/pages/publications.astro` | `/publications/` | *new* | new collection |
| 16 | `src/pages/blog/tag/[tag].astro` | `/blog/tag/[tag]/` | *new* | tag archives |
| 17 | `src/pages/rss.xml.ts`, `notes/rss.xml.ts` | `/rss.xml` | *new* | `@astrojs/rss` |
| 18 | `src/pages/de/...` | `/de/blog/...` | `blog-de/*` | i18n; `/blog-de/*` redirects |

**Home page:** keep the hero slideshow (4 community images, avif/webp/jpg already
present) but as CSS-driven crossfade with `astro:assets` instead of
`react-slideshow-image` — that's one fewer React dependency and no hydration. Keep the
LAION wordmark block, the mission statement, the featured-release banner (currently a
hardcoded Re-LAION 5B link — make it a `featured` field in content so it stops being a
code change), and the four dataset cards. Add: latest 3 blog posts, and drop the broken
`#contact` → `/gdpr` redirect (0.5 #3).

---

## Step 6 — Images and fonts

**Fonts:** already handled by the Fonts API config in Step 1. Delete
`public/fonts/load.css` and the 6 preload `<link>`s. Drop `Dinish-Regular.otf` (unused).

**Images — two phases, so parity isn't blocked on a 131 MB migration:**

*Phase A (with the port).* Leave `public/images/**` where it is, so all 48 posts'
`/images/...` references and `previewImg` values keep working untouched. Add:
- a `sharp`-based `scripts/compress-images.mjs` pass over `public/images` (resize
  anything wider than 2000px, re-encode PNG→WebP where lossless allows) — the 8.3 MB
  `datacomp_samples.png`, the 4.3 MB `h_14_clip_front.png` and the two 2.4 MB+ team
  portraits alone are ~18 MB;
- rename the 3 uppercase `.PNG` files;
- convert `videos_figure.gif` (11 MB) to an MP4/WebM `<video>`;
- explicit `width`/`height` + `loading="lazy"` on everything.

*Phase B (optional, later PR).* Move images under `src/assets/images/` and rewrite
references to relative paths so `astro:assets` optimises them into responsive AVIF/WebP:

```bash
git mv public/images src/assets/images
# frontmatter previewImg -> relative, then use the image() schema helper
find src/content -name '*.md' -exec sed -i '' 's|previewImg: "/images/|previewImg: "../../assets/images/|g' {} +
# body references
find src/content -name '*.md' -exec sed -i '' 's|](/images/|](../../assets/images/|g' {} +
```

Phase B is the bigger win (131 MB → likely under 30 MB served) but it touches all 48
content files and changes where contributors upload images, so it needs a README update
(Appendix B) and its own review.

---

## Step 7 — SEO, feeds, search, i18n, theme

- **`@astrojs/sitemap`** with `site: 'https://laion.ai'`, plus a `public/robots.txt`
  pointing at it.
- **RSS** at `/rss.xml` (blog), `/notes/rss.xml`, `/de/rss.xml`; full `<content:encoded>`,
  correct `pubDate` from the coerced dates. Link them with `<link rel="alternate">`.
- **JSON-LD:** `Organization` + `NonProfit` on `/`, `BlogPosting` (with `author` split
  from the comma-separated frontmatter string) per post, `FAQPage` on `/faq`,
  `BreadcrumbList` site-wide.
- **Per-post OG images** (P2): build-time generation from title + author + date so
  shared links stop all showing the same `social.png`.
- **Pagefind:** runs after `astro build`, indexes the emitted HTML. Mark article bodies
  `data-pagefind-body`, exclude nav/footer. `/search/` page + `Cmd+K` dialog. Weight
  titles above body, index team names and project names too. Use Pagefind's own UI
  component (Pagefind ≥ 1.5.0) rather than `astro-pagefind/components/Search.astro` —
  that component is in maintenance mode.
- **i18n:** `i18n: { defaultLocale: 'en', locales: ['en','de'], routing: { prefixDefaultLocale: false } }`.
  German posts move to `src/content/blog/de/` (or keep a `de` collection) and serve at
  `/de/blog/[slug]/`. **`/blog-de/*` must 301 to `/de/blog/*`** — 2 URLs, both indexed.
  Note Astro 6 changed the default for `i18n.redirectToDefaultLocale`; set it explicitly.
- **Theme:** semantic CSS custom properties; inline a tiny blocking script that reads
  `localStorage.theme` ?? `prefers-color-scheme` and sets `data-theme` on `<html>` before
  first paint. Verify both themes hit WCAG AA — today's `#F6F6F6` on `#1D374E` is fine,
  the light inversion needs checking.

---

## Step 8 — Redirects and URL parity

Non-negotiable: every URL that resolves today must resolve after cutover.

- `trailingSlash: 'always'` matches today's Next config — keep it, or accept a
  site-wide redirect. Don't change it silently.
- Replace the two client-side redirect pages (`laion-400-open-dataset.js`,
  `laion-5b-a-new-era-...js`) with real redirects in `astro.config.mjs`:

```js
redirects: {
  '/laion-400-open-dataset/': '/blog/laion-400-open-dataset/',
  '/laion-5b-a-new-era-of-open-large-scale-multi-modal-datasets/': '/blog/laion-5b/',
  '/blog-de/[slug]/': '/de/blog/[slug]/',
}
```

  On Option A these are 301s from the Worker; on Option B, static meta-refresh pages
  (GitHub Pages can't do server redirects) — a reason to prefer A.
- **Verification gate:** crawl the current production sitemap-equivalent (or
  `git checkout main && npm run deploy`, then `find out -name '*.html'`) into a list of
  URLs, and assert every one 200s (or 301s to a 200) against the new build. Script this;
  don't spot-check 48 posts by hand.

---

## Step 9 — CI/CD

Replace `.github/workflows/integrate.yml` (which pins `actions/checkout@v2` and runs
`npm i && next build && next export`).

**Option A — Cloudflare Workers:**
`deploy.yml` on push to `main`: `actions/checkout` → `actions/setup-node` (Node 22, npm
cache — both pinned to their current major, today's workflow is still on `checkout@v2`) →
`npm ci` → `astro check` → `astro build` → `cloudflare/wrangler-action` deploy.
Preview deployments per PR come for free and give reviewers a URL — a big improvement
over reviewing markdown diffs blind.

**Option B — GitHub Pages:** keep the `gh-pages` publish, but move to the official
`actions/upload-pages-artifact` + `actions/deploy-pages` flow, and deploy the separate
form Worker from `workers/forms` with its own workflow.

Either way add a `ci.yml` on pull requests: `npm ci`, `astro check`, `astro build`,
Prettier/ESLint, link check (`lychee`), and the Step 8 URL-parity script. Content PRs
from researchers then fail fast on a bad date or a missing image instead of after merge.

---

## Step 10 — QA gates before cutover

- [ ] `astro check` clean, `astro build` clean, no console errors on any page
- [ ] All 48 posts render: raw HTML preserved (14 files), the YouTube `<iframe>` in
      `do-they-see-what-we-see.md`, the `<video>` in `video2dataset.md`, tables, `<sup>`,
      and all 7 code-fenced files highlighted
- [ ] Every URL from the current build resolves (Step 8 script)
- [ ] Both forms: happy path, every validation error, Turnstile failure, rate limit hit,
      **and with JavaScript disabled**
- [ ] Submission lands in D1 *and* the notification email arrives
- [ ] Lighthouse ≥ 95 on Performance / A11y / Best Practices / SEO for `/`, `/blog/`,
      a long article, `/team/`
- [ ] Keyboard-only pass: skip link, nav, search dialog, forms, all cards focusable
- [ ] Screen-reader pass on one article and the dataset-request form
- [ ] RSS validates; sitemap lists every page; `robots.txt` correct
- [ ] OG/Twitter cards preview correctly (both a post and the home page)
- [ ] 375 px / 768 px / 1440 px / 2560 px; light and dark
- [ ] Privacy policy text matches what the backend actually does (retention, IP hashing,
      Turnstile, email processor) — this is a compliance item, not a nicety

## Step 11 — Cutover and rollback

1. Merge `astro-rewrite` → a long-lived `astro` branch; deploy to a preview URL
   (`astro.laion.ai` or a Workers preview) and circulate for review.
2. Freeze content merges to `main` for the switch window (short — hours).
3. Rebase the last `main` content commits onto the branch, rebuild, re-run Step 10.
4. Cut over: merge to `main`. Option A also switches DNS.
5. Keep the `gh-pages` branch untouched for 30 days — rollback is repointing DNS /
   re-enabling GitHub Pages, no rebuild needed.
6. After cutover: submit the new sitemap, watch Search Console for 404s for two weeks,
   confirm the first real form submission end-to-end.

---

## Appendix A — target layout

```
├── astro.config.mjs
├── src/
│   ├── content.config.ts            # collections + Zod schemas
│   ├── content/
│   │   ├── blog/          (36 .md, from main:blog/)
│   │   ├── notes/         (10 .md, from main:notes/)
│   │   ├── blog-de/       (2 .md → later src/content/blog/de/)
│   │   └── pages/         (4 .md + 6 .json, from main:content/)
│   ├── assets/
│   │   ├── fonts/         (Dinish woff/woff2, from main:public/fonts/)
│   │   └── images/        (Phase B target)
│   ├── layouts/           BaseLayout, ArticleLayout, MarkdownPage
│   ├── components/        Header, MobileNav, Footer, ThemeToggle, Search,
│   │                      PostCard, TeamCard, ProjectCard, Prose, Hero, Toc, Form/*
│   ├── actions/index.ts   # Step 3 (Option A)
│   ├── config/nav.ts      # single nav source of truth
│   ├── pages/             # Step 5 matrix
│   └── styles/global.css  # @theme tokens + prose
├── public/                images (Phase A), documents, favicons, social.png, CNAME, robots.txt
├── workers/forms/         # Option B only
├── scripts/               compress-images.mjs, check-urls.mjs
└── .github/workflows/     ci.yml, deploy.yml
```

## Appendix B — contributor workflow (update `README.md` + `CONTRIBUTING.md`)

Must stay true after the rewrite: *"add a markdown file to `src/content/blog/` with
`title`, `author`, `date`, `previewImg` in the frontmatter, push, done."* What changes:

- Path is `src/content/blog/` instead of `blog/`.
- `description`, `tags`, `draft` and `canonical` are now available (all optional).
- Frontmatter is schema-validated in CI — a typo fails the PR with a precise message
  instead of silently breaking the build (cf. `main`'s last commit, *"fix json syntax error"*).
- Every PR gets a preview URL to check before merge.
- Images: `public/images/blog/` in Phase A; `src/assets/images/blog/` after Phase B.

## Appendix C — dependency map

| Removed | Replaced by |
|---|---|
| `next`, `react`, `react-dom` | `astro` |
| `next-image-export-optimizer` | `astro:assets` (sharp) |
| `gray-matter`, `markdown-it`, `markdown-it-github-headings` | Astro content collections + remark/rehype + `rehype-slug`/`rehype-autolink-headings` |
| `framer-motion` | `astro:transitions` (`<ClientRouter />`) + CSS |
| `react-slideshow-image` | CSS crossfade + `astro:assets` |
| `react-burger-menu` | `<dialog>` / details-based drawer, ~30 lines of TS |
| `react-icons` | inline SVG sprite (3 icons are actually used) |
| `dateformat` | `Intl.DateTimeFormat` |
| `tailwind-children` | Tailwind 4 `*:` variant (built in) |
| `@formspark/use-formspark` | Astro Actions + Turnstile + D1 (Step 3) |
| `eslint-config-next` | `eslint-plugin-astro` + `@astrojs/check` |

## Open decisions

1. **Hosting** (1.2): Cloudflare Workers (A), GitHub Pages + Worker (B), or keep Formspark (C).
2. Where form submissions live and for how long — must match the privacy policy wording.
3. The stray form on `/privacy-policy`: make it a real GDPR-rights form, or delete it.
4. Images Phase B now or later (touches all 48 content files).
5. `/blog-de/*` → `/de/blog/*` now, or keep German posts where they are for this release.
6. Analytics: none, Cloudflare Web Analytics, or self-hosted Umami.

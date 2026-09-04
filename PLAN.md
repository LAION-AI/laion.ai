# LAION.ai — Astro Rewrite Plan

**Branch:** `astro-rewrite` · **Baseline:** `main` @ `1a16c61e` · **Revised:** 2026-09-04 (rev 2)

Goal: rebuild https://laion.ai on a modern stack with a cleaner, more contemporary
layout, **full parity with today's site**, plus functionality it never had.

**Target stack:** Astro 7 · Tailwind CSS 4 · shadcn/ui (selectively) · Bun ·
Formspark (kept) · GitHub Pages (kept).

Steps 1–3 are the sequence originally requested: scaffold → move content → new
functionality. Steps 4–11 carry it to a shippable site. Each step is meant to be one
reviewable PR.

> **Rev 2 changes:** Formspark is retained (it works and has built-in spam protection),
> so there is no backend to build and no hosting migration — the site stays fully static
> on GitHub Pages. Astro **7** replaces Astro 6, which changes the markdown pipeline
> significantly (see §1.3). Bun and shadcn/ui are both adopted, with the trade-offs
> spelled out in §1.2.

---

## 0. Where we are today (assessment)

### 0.1 Stack

| Layer | Today |
|---|---|
| Framework | Next.js `12.1.6` (Pages Router), React `18.1.0` |
| Styling | Tailwind `3.1.2` + `tailwind-children` plugin + 255 lines of global CSS |
| Markdown | `gray-matter` + `markdown-it` (`html: true`) + `markdown-it-github-headings`, injected via `dangerouslySetInnerHTML` |
| Images | `next-image-export-optimizer` (custom Next image loader, build-time WEBP) |
| Animation | `framer-motion` 6 (page fade), `react-slideshow-image` (hero), `react-burger-menu` (mobile nav) |
| Dates | `dateformat` · Icons: `react-icons` |
| Forms | `@formspark/use-formspark`, form id `lMcR2WFx` hardcoded in two pages |
| Build | `next build && next export && next-image-export-optimizer` → `out/` |
| Deploy | GitHub Actions → `peaceiris/actions-gh-pages` → `gh-pages` branch → GitHub Pages, `CNAME` = `laion.ai`, `.nojekyll` |

Next.js 12 is four majors behind and out of support. React 18.1, Tailwind 3 and
framer-motion 6 are all superseded. The whole app is **1,855 lines** across 25 page
files and 2 components — small enough to port deliberately rather than mechanically.

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

- **48 markdown documents**: `blog/` 36, `notes/` 10, `blog-de/` 2. Frontmatter is
  uniform and minimal: `title`, `author`, `date`, `previewImg` — all four present on all
  48 files, nothing else.
- `date` is free-form English (`"Aug 26, 2026"`, `"January 20 2025"`, `"Sep 15, 2022"`).
  All 48 parse with `new Date()`, so `z.coerce.date()` accepts them unchanged.
- **10 content files**: 4 markdown (`about`, `donations`, `gep-policy`, `impressum`),
  6 JSON (`team` 22 people, `projects` 4 groups / 25 entries, `faq` 7, `press` 31,
  `privacy-policy` 29, `dataset-requests` 1).
- **`public/images` is 131 MB**: `blog/` 119 MB (123 files, incl. a 14 MB `.mp4` and an
  11 MB `.gif`), `team/` 8.7 MB (two portraits over 2.4 MB each), `gallery/` (4 hero
  images × avif/webp/jpg). Formats: 139 `.png`, 45 `.jpg`, 3 `.PNG` (uppercase),
  8 `.webp`, 7 `.gif`, 4 `.avif`, 1 `.svg`, 1 `.mp4`.
- `public/documents`: 3 PDFs + 1 standalone HTML report (592 KB) — URLs must keep working.
- `public/fonts`: **Dinish** (Regular / Italic / Condensed-Bold, woff+woff2) loaded via a
  plain `public/fonts/load.css` and 6 manual `<link rel=preload>` tags.
- **14 content files contain raw HTML** (`<div>`, `<img>`, `<iframe>` YouTube embed,
  `<video>`, `<table>`, `<sup>`); 7 use fenced code blocks. No LaTeX/math, no footnote
  syntax. One `previewImg` points at a **remote** `raw.githubusercontent.com` URL
  (`notes/realfake.md`). *The raw HTML is the single biggest Astro 7 migration risk —
  see §1.3.*

### 0.4 What is worth keeping

- **Git-based, markdown-first editing.** 340+ commits from `robvanvolt`, and posts land
  from researchers via the GitHub web UI. Any new stack must keep "drop a `.md` in a
  folder, push, done" — no CMS login, no local toolchain required.
- **Static output on GitHub Pages.** The site is content, not an app. Fast, cheap,
  crawlable, and nothing about this rewrite needs a server.
- **Formspark.** It works, it has spam protection, and the two forms are low-volume.
  Replacing it would mean owning a backend, a database and a retention policy for no
  user-visible gain. Keep it — and improve how we call it (Step 3).
- **The brand.** Dinish type, `#1D374E` "sky" / `#F6F6F6` "paper", the oversized
  condensed headline treatment, the hero slideshow of community-generated images.
  Modernise the layout, don't rebrand.
- **Every existing URL.** 48 post URLs are cited in papers and on social media.

### 0.5 Known bugs and debt to fix during the port

Real, currently live, and each a small fix in the new codebase — worth folding into the
rewrite rather than filing separately.

1. `src/pages/privacy-policy.js:39-131` renders a **complete dataset-request form**
   (name / email / dataset / sample ID / website) at the bottom of the privacy policy,
   with no heading or explanation, posting to the same Formspark id. Almost certainly a
   copy-paste from `dataset-requests.js`. Decide: delete, or make it a deliberate
   "exercise your GDPR rights" form.
2. Both forms POST a field named **`datset`** (typo) — so every submission to date has a
   misnamed column. Fixing it renames the field in Formspark's dashboard and CSV exports,
   so coordinate with whoever reads those submissions before changing it.
3. `src/pages/index.js:11-13` redirects `#contact` to **`/gdpr`**, a route that does not
   exist → hard 404.
4. `src/pages/404.js` uses the legacy `<Link><a>` nesting and renders **no `<Tags>`**, so
   the 404 page has no title or meta.
5. `notes/index.js` and `blog-de/index.js` both set `<Tags title="Blog" />` — wrong title
   on two sections.
6. Blog/notes/blog-de indexes render **the full markdown of every post** just to slice a
   300-character excerpt, then strip tags with a regex. That is 48 markdown renders per
   index build, and it truncates mid-word/mid-entity.
7. `blog-de/[slug].js` hardcodes `lang="en"` on German articles.
8. `press.js:19` derives the outlet name via `item.url.split("www.")[1].split('/')[0]`.
   All 31 URLs happen to contain `www.` today; the 32nd that doesn't will crash the build.
9. `src/api/hello.js` — dead Next.js API stub, and in the wrong directory (`src/api/`,
   not `src/pages/api/`), so it was never even routed.
10. `sci.jpg` and `sci2.jpg` sit in the **repo root** (278 KB), unused — the real copies
    are `public/images/blog/sci{,2}.jpg`.
11. `globals.css:14` — `div { font-family: "Dinish" !important; }` applies to every div on
    the site and cannot be overridden.
12. `.article img` forces `width:100%` on every in-article image regardless of intrinsic size.
13. Three image files use an uppercase `.PNG` extension — needs case-insensitive globs or a rename.
14. `_app.js` uses framer-motion 6's deprecated `exitBeforeEnter`.
15. No `sitemap.xml`, no `robots.txt`, no RSS feed, no canonical URLs, no JSON-LD.
16. Clickable cards are `<div>` inside `<Link>` — not keyboard focusable, no accessible name.
17. Formspark's default behaviour **appends submitted values to the redirect URL's query
    string**. For a form that collects name and email, that puts personal data in a URL
    (and into browser history and any analytics). Must be disabled with `_append=false`
    (Step 3).

---

## 1. Stack decisions

### 1.1 Target stack

| Layer | New | Why |
|---|---|---|
| Framework | **Astro 7.3.x** (Node ≥ 22.12.0) | Zero JS by default, content collections, markdown-first. Astro 7 adds a Rust compiler, a Rust markdown pipeline and Vite 8/Rolldown: 15–61 % faster builds |
| Package manager / runner | **Bun** | Fastest install and script runner; see §1.2 |
| Language | TypeScript (`strict`) | |
| Content | **Content Collections** — `glob()` / `file()` loaders + Zod schemas | Build-time validation of all 48 posts and 6 JSON files |
| Markdown | `@astrojs/markdown-remark` via `markdown.processor: unified()` | **Required for parity** — see §1.3 |
| Styling | **Tailwind CSS 4** (`@tailwindcss/vite`, CSS-first `@theme`) + `@tailwindcss/typography` | |
| Components | **shadcn/ui**, selectively, on `@astrojs/react` | Themable primitives for the interactive parts; see §1.2 |
| Images | `astro:assets` (sharp) | Responsive `srcset`, AVIF/WebP, lazy by default |
| Fonts | Astro **Fonts API** with `fontProviders.local()` | Replaces hand-rolled `load.css` + 6 preload tags |
| Transitions | `<ClientRouter />` (`astro:transitions`) | Replaces framer-motion |
| Feeds/SEO | `@astrojs/rss`, `@astrojs/sitemap`, canonical + JSON-LD | All currently missing |
| Search | **Pagefind** (`astro-pagefind`) | Build-time index, runs in the browser, no API key, no server |
| Forms | **Formspark**, plain HTML POST | Kept. Works without JS once we stop routing it through React |
| Hosting | **GitHub Pages**, unchanged | `output: 'static'`, no adapter, same `CNAME` |

Why Astro specifically: the site is 48 markdown documents and ~20 mostly-static pages.
Astro ships no JavaScript unless a component asks for it, and its content collections
validate frontmatter at build time — the last commit on `main` is literally *"fix json
syntax error"*, which a Zod schema would have caught before it was pushed.

### 1.2 Answers to the three stack questions

#### Formspark — keep it. ✅

Agreed, and it simplifies the whole plan. Formspark has honeypot spam protection built
in (plus optional reCAPTCHA v2 / Botpoison), the two forms are low-volume, and owning a
backend would mean owning a database, a retention policy and a GDPR processor agreement
for zero user-visible benefit.

The consequences are all good ones: **no server adapter, no Cloudflare, no DNS change,
no Astro Actions.** The site stays `output: 'static'` and keeps deploying to GitHub Pages
exactly as today. Step 3 becomes "call Formspark better" rather than "build a backend" —
and the single most valuable change there needs no backend at all: submitting via a plain
HTML `<form action="https://submit-form.com/{id}">` instead of a React hook makes the
form **work with JavaScript disabled**, which it currently doesn't.

#### Bun — yes, and GitHub Pages is irrelevant to it. ✅

GitHub Pages never runs your build. It serves a directory of static files that CI hands
it. So the package manager and runtime are a **local + CI decision only** — Bun, npm and
pnpm all produce byte-identical `dist/` output here. Nothing about Bun can break Pages.

What Bun actually buys us: install time (the big one — this repo's `package-lock.json` is
336 KB and `npm i` in CI is the slowest step of the current workflow), and a faster script
runner. Note that Astro 7 already moved the *build* to Rust and Rolldown, so the build
speedup is coming from Astro, not from Bun.

The honest caveat, straight from Astro's own docs: *"Using Bun with Astro may reveal rough
edges. Some integrations may not work as expected."* Astro documents Bun and it is widely
used, but it is not the primary tested path. Three things in this stack are worth smoke-
testing on day one (Step 1 exit criteria):

1. **`sharp`** — native module, powers `astro:assets` for 131 MB of images.
2. **`astro-pagefind`** — runs a Rust binary as a post-build step.
3. **the `shadcn` CLI** — run it as `bunx shadcn@latest`.

If any of them misbehaves, the fallback is one line in CI and costs nothing: keep Bun for
`bun install` and run the build with Node. Recommendation: **adopt Bun**, commit
`bun.lock`, delete `package-lock.json`, and use `oven-sh/setup-bun` in CI. Keep the npm
script names (`dev`, `build`, `preview`) so `npm run build` still works for anyone who
doesn't have Bun — contributors editing markdown shouldn't need to install anything.

#### shadcn/ui — yes, but selectively. ✅ (with a caveat worth reading)

It works with Astro, and it works on GitHub Pages. shadcn/ui is React components (Radix
primitives + Tailwind utilities) that you **copy into your repo** — there is no runtime
service and nothing that needs a server. They hydrate in the browser, so static hosting
is fine. Official Astro install path: add `@astrojs/react` + Tailwind v4, set the `@/*`
path alias, `bunx shadcn@latest init`, then `bunx shadcn@latest add <component>`.
Current shadcn targets Tailwind v4 and React 19 — both of which we want anyway.

**On custom colours: this is shadcn's strongest argument for us.** Its entire theme is
CSS custom properties — `--background`, `--foreground`, `--primary`, `--muted`,
`--border`, `--ring` and so on — so mapping LAION's palette is exactly the intended
workflow, not a fight with the library:

```css
/* src/styles/global.css */
@theme {
  --color-sky:   #1D374E;   /* today's bg   */
  --color-paper: #F6F6F6;   /* today's text */
}
:root {                      /* shadcn tokens -> LAION palette */
  --background: var(--color-sky);
  --foreground: var(--color-paper);
  --primary:    var(--color-paper);
  --primary-foreground: var(--color-sky);
  --border:     var(--color-paper);
  --ring:       var(--color-paper);
  /* ... */
}
```

Every shadcn component then renders in LAION colours with no per-component overrides, and
the light theme (Step 7) becomes a second block of the same variables.

**The caveat:** every shadcn component you use ships React to the browser. On a content
site that mostly cuts against the reason to choose Astro — a team card, a project card, a
press link and an article body need exactly zero JavaScript, and wrapping them in React
would make the site slower than the Next.js version it replaces. So:

- **Use shadcn** where behaviour is genuinely interactive and Radix saves real
  accessibility work: `command` (Cmd+K search), `dialog` / `sheet` (mobile nav),
  `accordion` (FAQ's 7 items, privacy policy's 29), `dropdown-menu` (grouped nav),
  `tabs` + `select` (projects filtering), `sonner` (form feedback), `tooltip`.
- **Don't use it** for static content: cards, prose, tables, headers, footers, the hero.
  Plain `.astro` components with the same Tailwind tokens look identical and ship nothing.
- Hydrate with `client:idle` or `client:visible`, never `client:load`, and never on the
  critical path of a first paint.

Also worth knowing: shadcn is copy-in, so we own the code and can delete React later if
we decide the interactive surface is small enough to hand-write. Adopting it is not a
one-way door.

### 1.3 Astro 7 changes the markdown pipeline — read this before Step 2

This is the one genuinely load-bearing consequence of targeting Astro 7 (`7.3.1`,
released 22 June 2026; requires Node ≥ 22.12.0).

**Astro 7 replaced the default markdown processor.** It is now **Sätteri**, a Rust
pipeline (pulldown-cmark for CommonMark, Oxc for MDX expressions), and **remark/rehype
plugins do not run under it.** Sätteri brings GFM, smart punctuation, heading IDs, math
and container directives in natively, and it is dramatically faster — but the JS plugin
ecosystem is not part of it, because MDAST/HAST plugins are JavaScript and a Rust pipeline
can't execute them.

What that means for this site:

| Need | Under unified | Under Sätteri |
|---|---|---|
| Raw HTML in 14 content files (`<iframe>`, `<video>`, `<table>`, `<div>`, `<sup>`) | ✅ `rehype-raw` is a dependency of `@astrojs/markdown-remark` | **Unverified** — not documented either way |
| GitHub-style heading anchors (today: `markdown-it-github-headings`) | ✅ `rehype-slug` + `rehype-autolink-headings` | Heading **IDs** built in; the clickable anchor link needs a HAST plugin |
| External links → `target=_blank rel=noopener` | ✅ `rehype-external-links` | needs a HAST plugin |
| GFM tables, code fences, Shiki highlighting | ✅ | ✅ built in |

**Decision: start on the unified processor.** It is a documented, supported path in
Astro 7 and it reproduces today's `markdown-it({html: true})` behaviour exactly — which
matters because 14 of 48 files would break silently if raw HTML were dropped, and the
YouTube `<iframe>` in `do-they-see-what-we-see.md` and the `<video>` in
`video2dataset.md` are the kind of thing nobody notices is missing until a reader
complains.

```js
// astro.config.mjs
import { unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  markdown: {
    // Astro 7's default is Sätteri; opt back into unified for raw-HTML + plugin parity.
    processor: unified({
      gfm: true,
      smartypants: true,
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      ],
    }),
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
});
```

Note the top-level `markdown.remarkPlugins` / `rehypePlugins` / `gfm` / `smartypants`
options still work but are **deprecated and will be removed in Astro 8** — configure them
inside `unified({...})` as above, not at the top level.

**Sätteri is a fast-follow, not a blocker.** Once the site is live, evaluate switching:
build 48 files, diff the rendered HTML against the unified output, and port the two
missing behaviours (heading anchors, external links) as HAST plugins. Two things to weigh:
`satteri` is at `0.10.x` and `@astrojs/markdown-satteri` at `0.4.0` — young for the
pipeline that renders every page of the site — and at 48 documents our build is not
slow enough for the speed to matter yet. Revisit when either changes.

**Two more Astro 7 behaviours to expect while porting (Step 5):**

- The Rust `.astro` compiler is **stricter**: unclosed tags now error and invalid HTML
  nesting is no longer silently corrected. Hand-porting JSX will surface latent markup
  bugs — that is a feature, but budget for it.
- `compressHTML` now defaults to `'jsx'`, which collapses whitespace the way React does.
  Spaces between inline elements can disappear; add explicit `{" "}` where it matters
  (the nav and inline article links are where this will show up).
- `@astrojs/db` was removed in Astro 7 — irrelevant now that we're keeping Formspark, but
  worth knowing if a database is ever proposed.
- Astro ships an upgrade tool: `bunx @astrojs/upgrade`. Useful later, not for a fresh scaffold.

---

## Step 1 — Scaffold the Astro project

Requires **Node ≥ 22.12.0** (Astro 7's engine constraint) and Bun. Neither is currently
on `PATH` in this checkout — install both first.

Scaffold into a temporary directory so the existing Next.js app stays intact and runnable
for side-by-side comparison:

```bash
bun create astro@latest ./astro-tmp -- --template minimal --typescript strict --no-install --no-git
```

Move it into place and remove the Next.js app in the same commit:

```bash
cd /Users/robert/Developer/laion/laion.ai
rsync -a astro-tmp/ ./ && rm -rf astro-tmp
git rm -r --cached src next.config.js postcss.config.js tailwind.config.js .eslintrc.json package-lock.json
rm -rf src/pages src/components src/api next.config.js postcss.config.js tailwind.config.js .eslintrc.json package-lock.json
rm -f sci.jpg sci2.jpg                 # unused root strays (0.5 #10)
bun install
```

Integrations:

```bash
bunx astro add tailwind mdx react sitemap --yes
bun add @astrojs/rss astro-pagefind @tailwindcss/typography
bun add @astrojs/markdown-remark rehype-slug rehype-autolink-headings rehype-external-links   # §1.3
bun add -d prettier prettier-plugin-astro eslint eslint-plugin-astro @astrojs/check typescript @types/bun
```

shadcn/ui — needs the `@/*` path alias in `tsconfig.json` first:

```jsonc
// tsconfig.json
{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } } }
```

```bash
bunx shadcn@latest init
# add only what §1.2 justifies, as you need it:
bunx shadcn@latest add button dialog sheet accordion command dropdown-menu tabs sonner tooltip
```

`astro.config.mjs` — the starting point:

```js
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import { unified } from '@astrojs/markdown-remark';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: 'https://laion.ai',
  trailingSlash: 'always',        // matches today's next.config.js — do not change silently
  output: 'static',               // GitHub Pages; no adapter
  integrations: [mdx(), react(), sitemap(), pagefind()],
  vite: { plugins: [tailwindcss()] },

  // notes/realfake.md uses a remote previewImg
  image: { domains: ['raw.githubusercontent.com'] },

  markdown: {
    processor: unified({          // §1.3 — parity for raw HTML + plugins
      gfm: true,
      smartypants: true,
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      ],
    }),
    shikiConfig: { theme: 'github-dark', wrap: true },
  },

  fonts: [{
    provider: fontProviders.local(),
    name: 'Dinish',
    cssVariable: '--font-dinish',
    options: {
      variants: [
        { weight: 400, style: 'normal', src: ['./src/assets/fonts/Dinish-Regular.woff2', './src/assets/fonts/Dinish-Regular.woff'] },
        { weight: 400, style: 'italic', src: ['./src/assets/fonts/Dinish-Italic.woff2',  './src/assets/fonts/Dinish-Italic.woff'] },
        { weight: 700, style: 'normal', src: ['./src/assets/fonts/DinishCondensed-Bold.woff2', './src/assets/fonts/DinishCondensed-Bold.woff'] },
      ],
    },
  }],

  redirects: {                    // replaces the two client-side redirect pages
    '/laion-400-open-dataset/': '/blog/laion-400-open-dataset/',
    '/laion-5b-a-new-era-of-open-large-scale-multi-modal-datasets/': '/blog/laion-5b/',
  },
});
```

**Exit criteria — this is where Bun and shadcn get validated, before any content depends on them:**

- [ ] `bun run dev` serves a page; `bun run build` and `bunx astro check` are clean
- [ ] Tailwind 4 utilities apply; the `@theme` tokens from §1.2 resolve
- [ ] **`sharp` works under Bun** — put one large PNG through `<Image>` and confirm a
      WebP/AVIF variant is emitted (this is the highest-risk Bun interaction)
- [ ] **`astro-pagefind` works under Bun** — `dist/pagefind/` exists after a build
- [ ] **`bunx shadcn@latest add button` works**, and a `<Button client:idle />` renders in
      LAION colours from the token mapping, not shadcn's defaults
- [ ] `npm run build` also works (contributor fallback, no Bun required)

If sharp or pagefind fails under Bun, switch CI's build step to Node and keep
`bun install` — decide it here, not in Step 9.

---

## Step 2 — Bring the content across from `main`

Content moves **as-is**. No frontmatter rewriting, no renaming, no reformatting — the
whole point is that authors' existing workflow and all 48 URLs survive.

```bash
git checkout astro-rewrite

# Markdown collections -> src/content/
mkdir -p src/content
git checkout main -- blog notes blog-de content
git mv blog    src/content/blog
git mv notes   src/content/notes
git mv blog-de src/content/blog-de
git mv content src/content/pages

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
src/assets/fonts/              Dinish woff/woff2 (the unused .otf can be dropped)
public/images/                 131 MB, unchanged paths -> /images/... keeps working
public/documents/              3 PDFs + llava_cogvlm_pop.html, unchanged URLs
public/{favicon.png,favicon.svg,social.png,CNAME}
```

Then declare the schemas — `src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

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

const blog   = defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),    schema: post });
const notes  = defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),   schema: post });
const blogDe = defineCollection({ loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog-de' }), schema: post });

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    heading: z.string().optional(),
    name: z.string().optional(), iban: z.string().optional(), bic: z.string().optional(), // donations.md
  }),
});
```

**Important:** unlike `glob()`, the `file()` loader does **not** generate ids — every
entry needs a unique `id`, either as an object key or an `id` property. None of our six
JSON files have one. Rather than editing the content, add ids in a `parser`:

```ts
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const withIds = (key: (e: any) => string) =>
  (text: string) => JSON.parse(text).map((e: any) => ({ id: slugify(key(e)), ...e }));

const team = defineCollection({
  loader: file('./src/content/pages/team.json', { parser: withIds((e) => e.name) }),
  schema: z.object({ name: z.string(), title: z.string(), desc: z.string(), img: z.string().optional() }),
});

const projects = defineCollection({
  loader: file('./src/content/pages/projects.json', { parser: withIds((e) => e.name) }),
  schema: z.object({
    name: z.string(),
    entries: z.array(z.object({
      name: z.string(), link: z.string(), modality: z.string(),
      kind: z.string(), status: z.string(), desc: z.string().optional(),
    })),
  }),
});

const qa = z.object({ q: z.string(), a: z.string() });
const faq          = defineCollection({ loader: file('./src/content/pages/faq.json',              { parser: withIds((e) => e.q) }), schema: qa });
const privacy      = defineCollection({ loader: file('./src/content/pages/privacy-policy.json',   { parser: withIds((e) => e.q) }), schema: qa });
const datasetIntro = defineCollection({ loader: file('./src/content/pages/dataset-requests.json', { parser: withIds((e) => e.q) }), schema: qa });
const press        = defineCollection({
  loader: file('./src/content/pages/press.json', { parser: withIds((e) => `${new URL(e.url).hostname}-${e.dt}`) }),
  schema: z.object({ dt: z.coerce.date(), url: z.string().url() }),
});

export const collections = { blog, notes, blogDe, pages, team, projects, faq, privacy, datasetIntro, press };
```

**Exit criteria — plus the §1.3 markdown-parity gate, which belongs here:**

- [ ] `bunx astro check && bun run build` passes with all 48 posts and 6 JSON files
      validating. Any schema failure is a real content bug — fix the content, not the schema.
- [ ] Render all 14 raw-HTML files and diff against production: the YouTube `<iframe>`
      (`do-they-see-what-we-see.md`), the `<video>` (`video2dataset.md`), `<table>`,
      `<div>`, `<sup>`, `<img>` all present and rendering.
- [ ] Heading anchors work on all 48 posts (today's `markdown-it-github-headings`
      behaviour) — deep links into long articles are in circulation.
- [ ] All 7 code-fenced files highlight via Shiki.
- [ ] Optional, cheap, worth doing now: build once with `satteri()` instead of
      `unified()` and record what breaks. That is the data the §1.3 fast-follow needs.

---

## Step 3 — Forms (Formspark, done properly) and the new functionality

### 3.1 Formspark: keep the service, change how we call it

Today both forms run through `useFormspark()` in React: `e.preventDefault()`, six
`document.getElementById(...).value` reads, `await submit({...})`, `setDone(true)`. That
means **the form does nothing at all with JavaScript disabled or broken**, there is no
validation beyond HTML `required`, and the form id `lMcR2WFx` is hardcoded in two files.

Formspark accepts an ordinary HTML form POST, so all of that goes away:

```astro
---
// src/components/DatasetRequestForm.astro — no React, no client JS required
const endpoint = `https://submit-form.com/${import.meta.env.PUBLIC_FORMSPARK_FORM_ID}`;
---
<form action={endpoint} method="POST" class="...">
  <input type="hidden" name="_redirect" value="https://laion.ai/thanks/" />
  <input type="hidden" name="_append" value="false" />   <!-- 0.5 #17: keep PII out of the URL -->
  <input type="text" name="_honeypot" tabindex="-1" autocomplete="off" hidden />

  <label for="name">Name</label>            <input id="name"     name="name"     type="text"  required />
  <label for="email">Email</label>          <input id="email"    name="email"    type="email" required />
  <label for="dataset">Dataset</label>      <input id="dataset"  name="dataset"  type="text"  required />
  <label for="sampleId">Sample ID</label>   <input id="sampleId" name="sampleId" type="text"  required />
  <label for="website">Website/URL</label>  <input id="website"  name="website"  type="url"   required />
  <label for="message">Explanation</label>  <textarea id="message" name="message" required></textarea>

  <label><input type="checkbox" name="consent" value="yes" required />
    I accept the <a href="/privacy-policy/">privacy policy</a>.</label>
  <button type="submit">Send</button>
</form>
```

Concretely this fixes, in order of importance:

1. **Works without JavaScript.** A plain POST + `_redirect` to a new `/thanks/` page.
   Progressive enhancement (inline validation, no-reload submit via `fetch`) can be
   layered on top as an island later — but the baseline works for everyone.
2. **`_append=false`** stops Formspark appending submitted values to the redirect URL —
   otherwise name and email land in the URL bar, browser history and any analytics
   (0.5 #17). For an org with a 29-question privacy policy this is the most important
   line in the file.
3. **`_honeypot`** activates Formspark's built-in honeypot on top of whatever spam
   protection the account already has.
4. **`sampleId` replaces the `datset` typo** (0.5 #2) — coordinate first: it renames the
   field in Formspark's dashboard and CSV exports.
5. **One shared component, one form id.** `PUBLIC_FORMSPARK_FORM_ID` in `.env` (with a
   committed `.env.example`), consumed by both forms — replacing two copy-pasted
   ~130-line blocks and two hardcoded ids.
6. **Real labels and accessible errors.** Today's markup has labels but the React
   handler reads values by `getElementById` and reports nothing back per field.

Also decide here: whether the stray form at the bottom of `/privacy-policy` (0.5 #1)
becomes a deliberate GDPR-rights form — a separate Formspark form id, with `kind`
= access / deletion / rectification / objection — or is deleted. Recommendation: make it
deliberate, with a heading that explains what it is for.

*(If submission volume ever justifies owning the data, the swap is one component: point
the `action` at your own endpoint. Nothing else in the site would change. Not now.)*

### 3.2 The rest of the new functionality

| # | Functionality | Priority | Notes |
|---|---|---|---|
| 1 | Forms: no-JS submission, `_append=false`, honeypot, shared component | P0 | §3.1 — all static, no backend |
| 2 | Site search over posts, notes, team, projects | P0 | Pagefind + shadcn `command` for Cmd+K |
| 3 | RSS feeds — `/rss.xml`, `/notes/rss.xml`, `/de/rss.xml` | P0 | `@astrojs/rss`. The most-requested thing a research blog can lack |
| 4 | `sitemap.xml` + `robots.txt` + canonical URLs + JSON-LD (`Organization`, `BlogPosting`, `FAQPage`) | P0 | `@astrojs/sitemap` |
| 5 | Accessibility pass: real `<a>` cards, focus states, skip link, alt text, landmarks | P0 | Cheap now, expensive later (0.5 #16) |
| 6 | Tags / topics with `/blog/tag/[tag]` archives; author pages | P1 | Schema field added in Step 2; backfill gradually |
| 7 | Paginated blog index + real `description` excerpts instead of a 300-char regex slice | P1 | Astro `paginate()` (0.5 #6) |
| 8 | Real i18n routing (`/de/...`) replacing the copy-pasted `blog-de/` directory | P1 | Astro i18n; keep `/blog-de/*` redirects |
| 9 | Light/dark theme (site is dark-only today) | P1 | shadcn's CSS variables make this a token swap (§1.2) |
| 10 | Publications page from a `publications.json` collection (authors, venue, year, arXiv/DOI, code) | P1 | Currently 2 papers buried in `projects.json` |
| 11 | Image pipeline: `astro:assets` responsive AVIF/WebP; compress the 131 MB | P1 | Step 6 |
| 12 | Projects filtering by modality / kind / status | P2 | 25 entries across 4 groups; shadcn `tabs` + `select` |
| 13 | Newsletter signup | P2 | A third Formspark form — still no backend |
| 14 | Privacy-friendly analytics (Cloudflare Web Analytics or self-hosted Umami, no cookies) | P2 | Must match the privacy policy |
| 15 | Per-post OG images generated at build time | P2 | Today every post shares one `social.png` |

---

## Step 4 — Design system, layout, navigation

The redesign lives here. Keep the identity (`#1D374E` sky, `#F6F6F6` paper, Dinish
condensed display type, oversized headlines, community imagery); modernise the shell.

- **Tokens in CSS, not in `tailwind.config.js`.** Tailwind 4 is CSS-first: `@theme` for
  the brand scale, plus the shadcn semantic layer from §1.2 (`--background`,
  `--foreground`, `--primary`, `--border`, `--ring`) so the light theme in Step 7 is a
  token swap rather than a class-by-class rewrite.
- **Fix the type system.** Delete `div { font-family: Dinish !important }` (0.5 #11). Set
  the font on `:root`, use a real modular scale, cap article measure at ~68 ch, and use
  `@tailwindcss/typography` with a `prose-laion` variant instead of the ~120 lines of
  hand-written markdown CSS in `globals.css`.
- **Navigation.** Today's fixed 12-link sidebar with a burger duplicate on mobile is the
  most dated element and it will not scale. Restructure to a slim header with grouped
  menus (shadcn `dropdown-menu`) + a footer sitemap:
  - *Research*: Blog · Notes · Projects · Publications
  - *Organisation*: About · Team · Press · FAQ
  - *Support*: Donations · Dataset Requests
  - *Legal* (footer only): Privacy Policy · Impressum · GEP Policy
  Plus search (`/` or Cmd+K, shadcn `command`) and the theme toggle. Mobile uses shadcn
  `sheet` instead of `react-burger-menu`. **One nav definition in `src/config/nav.ts`**
  consumed by header, drawer and footer — no more maintaining the same 12 links twice.
- **`BaseLayout.astro`** owns `<head>`: title/description/canonical/OG/Twitter, JSON-LD,
  `<Font cssVariable="--font-dinish" preload />` (replaces the 6 manual preload tags),
  `<ClientRouter />`, and `<a href="#main" class="skip-link">`. This is `Tags.js`, done
  properly and typed.
- **`ArticleLayout.astro`** for blog/notes/de: title, author, date, reading time, tags,
  a table of contents from the heading tree, prev/next, share links, and a "cite this
  post" block. Article images get `loading="lazy"`, real dimensions, and
  figure/figcaption instead of a blanket `width:100%` (0.5 #12).
- **Cards become `<a>`.** Every clickable card in team/projects/blog/press is a real
  anchor with a visible focus ring — and stays a plain `.astro` component, no React.

Deliverable before writing components: 3 desktop + 3 mobile mockups (home, blog index,
article) for sign-off, so the layout debate happens once.

---

## Step 5 — Port the pages (route parity matrix)

Data-driven pages first (they exercise the collections); home last (most design-heavy).
Expect the stricter Astro 7 compiler to reject some markup carried over from JSX (§1.3).

| # | New file | URL | Replaces | Notes |
|---|---|---|---|---|
| 1 | `src/pages/blog/index.astro` | `/blog/` | `blog/index.js` | `paginate()`, real `description`, tag filter |
| 2 | `src/pages/blog/[...slug].astro` | `/blog/[slug]/` | `blog/[slug].js` | `getStaticPaths` from collection + `render()` |
| 3 | `src/pages/notes/index.astro` + `[...slug].astro` | `/notes/`, `/notes/[slug]/` | `notes/*` | fix the "Blog" title bug (0.5 #5) |
| 4 | `src/pages/team.astro` | `/team/` | `team.js` | `astro:assets` portraits, 22 people |
| 5 | `src/pages/projects.astro` | `/projects/` | `projects.js` | 4 groups, internal vs external links, filtering |
| 6 | `src/pages/press.astro` | `/press/` | `press.js` | outlet via `new URL(url).hostname` — kills 0.5 #8 |
| 7 | `src/pages/faq.astro` | `/faq/` | `faq.js` | shadcn `accordion` + `FAQPage` JSON-LD |
| 8 | `about.astro`, `impressum.astro`, `gep-policy.astro` | ditto | markdown pages | one shared `MarkdownPage` layout |
| 9 | `src/pages/donations.astro` | `/donations/` | `donations.js` | IBAN/BIC + copy-to-clipboard + gofundme |
| 10 | `src/pages/privacy-policy.astro` | `/privacy-policy/` | `privacy-policy.js` | 29 Q&A + the 0.5 #1 form decision |
| 11 | `src/pages/dataset-requests.astro` | `/dataset-requests/` | `dataset-requests.js` | §3.1 form |
| 12 | `src/pages/thanks.astro` | `/thanks/` | *new* | Formspark `_redirect` target |
| 13 | `src/pages/404.astro` | `/404/` | `404.js` | add meta + search + popular links |
| 14 | `src/pages/index.astro` | `/` | `index.js` | see below |
| 15 | `src/pages/search.astro` | `/search/` | *new* | Pagefind |
| 16 | `src/pages/publications.astro` | `/publications/` | *new* | new collection |
| 17 | `src/pages/blog/tag/[tag].astro` | `/blog/tag/[tag]/` | *new* | tag archives |
| 18 | `src/pages/rss.xml.ts`, `notes/rss.xml.ts` | `/rss.xml` | *new* | `@astrojs/rss` |
| 19 | `src/pages/de/...` | `/de/blog/...` | `blog-de/*` | i18n; `/blog-de/*` redirects |

**Home page:** keep the hero slideshow (4 community images, avif/webp/jpg already
present) as a CSS-driven crossfade with `astro:assets` instead of
`react-slideshow-image` — one fewer React dependency and no hydration. Keep the LAION
wordmark block, the mission statement, the featured-release banner (currently a hardcoded
Re-LAION 5B link — make it a `featured` flag in content so it stops being a code change)
and the four dataset cards. Add the latest 3 blog posts. Drop the broken `#contact` →
`/gdpr` redirect (0.5 #3).

---

## Step 6 — Images and fonts

**Fonts:** handled by the Fonts API config in Step 1. Delete `public/fonts/load.css` and
the 6 preload `<link>`s. Drop the unused `Dinish-Regular.otf`.

**Images — two phases, so parity isn't blocked on a 131 MB migration:**

*Phase A (with the port).* Leave `public/images/**` where it is, so all 48 posts'
`/images/...` references and `previewImg` values keep working untouched. Add:

- a sharp-based `scripts/compress-images.mjs` pass (resize anything wider than 2000 px,
  re-encode PNG→WebP where lossless allows) — the 8.3 MB `datacomp_samples.png`, the
  4.3 MB `h_14_clip_front.png` and the two 2.4 MB+ team portraits alone are ~18 MB;
- rename the 3 uppercase `.PNG` files (0.5 #13);
- convert `videos_figure.gif` (11 MB) to MP4/WebM in a `<video>`;
- explicit `width`/`height` + `loading="lazy"` everywhere.

*Phase B (optional, later PR).* Move images under `src/assets/images/` and rewrite
references to relative paths so `astro:assets` optimises them into responsive AVIF/WebP:

```bash
git mv public/images src/assets/images
find src/content -name '*.md' -exec sed -i '' 's|previewImg: "/images/|previewImg: "../../assets/images/|g' {} +
find src/content -name '*.md' -exec sed -i '' 's|](/images/|](../../assets/images/|g' {} +
```

Phase B is the bigger win (131 MB → likely under 30 MB served) but it touches all 48
content files and changes where contributors upload images, so it needs a README update
(Appendix B) and its own review. Note it does **not** help the raw `<img>` tags inside
the 14 raw-HTML files — those need hand-editing or leaving on absolute paths.

---

## Step 7 — SEO, feeds, search, i18n, theme

- **`@astrojs/sitemap`** with `site: 'https://laion.ai'`, plus a `public/robots.txt`
  pointing at it.
- **RSS** at `/rss.xml` (blog), `/notes/rss.xml`, `/de/rss.xml`; full `<content:encoded>`,
  correct `pubDate` from the coerced dates. Link with `<link rel="alternate">`.
- **JSON-LD:** `Organization` + `NonProfit` on `/`, `BlogPosting` per post (splitting the
  comma-separated `author` string into an array), `FAQPage` on `/faq`, `BreadcrumbList`
  site-wide.
- **Pagefind:** runs after `astro build`, indexes the emitted HTML — no server, so it fits
  GitHub Pages exactly. Mark article bodies `data-pagefind-body`, exclude nav/footer.
  A `/search/` page plus a Cmd+K dialog built on shadcn `command`. Weight titles above
  body; index team and project names too. Use Pagefind's own UI component (Pagefind
  ≥ 1.5.0) rather than `astro-pagefind/components/Search.astro`, which is in maintenance mode.
- **i18n:** `i18n: { defaultLocale: 'en', locales: ['en','de'], routing: { prefixDefaultLocale: false } }`.
  German posts serve at `/de/blog/[slug]/`; fix the hardcoded `lang="en"` (0.5 #7).
  **`/blog-de/*` must redirect to `/de/blog/*`** — 2 URLs, both indexed. Set
  `i18n.redirectToDefaultLocale` explicitly (its default changed in Astro 6).
- **Theme:** the shadcn token layer from §1.2, with a blocking inline script that reads
  `localStorage.theme ?? prefers-color-scheme` and sets `data-theme` on `<html>` before
  first paint. Verify both themes hit WCAG AA — today's `#F6F6F6` on `#1D374E` is fine,
  the light inversion needs checking.

---

## Step 8 — Redirects and URL parity

Non-negotiable: every URL that resolves today must resolve after cutover.

- `trailingSlash: 'always'` matches today's Next config — keep it, or accept a site-wide
  redirect. Don't change it silently.
- **GitHub Pages cannot send 301s.** In `output: 'static'`, Astro's `redirects` config
  emits a small HTML page with a `<meta http-equiv="refresh">` and a canonical link. That
  is strictly better than today's two client-side `router.push` pages (which need React
  to boot before redirecting), but it is not a real 301 — so keep the redirect list short
  and make sure every redirect target also carries `<link rel="canonical">`.
- **Verification gate:** build `main` (`npm run deploy`, then `find out -name '*.html'`)
  into a list of URLs and assert every one 200s — or resolves via a redirect page —
  against the new build. Script it (`scripts/check-urls.mjs`); don't spot-check 48 posts
  by hand.

---

## Step 9 — CI/CD

Replace `.github/workflows/integrate.yml` (which pins `actions/checkout@v2` and runs
`npm i && next build && next export`). Deployment target does **not** change: still
GitHub Pages, still the `laion.ai` `CNAME`.

`deploy.yml` on push to `main`:

```yaml
- uses: actions/checkout@v5
- uses: oven-sh/setup-bun@v2          # §1.2
  with: { bun-version: latest }
- run: bun install --frozen-lockfile
- run: bunx astro check
- run: bun run build                  # -> dist/
- uses: actions/upload-pages-artifact@v3
  with: { path: dist }
- uses: actions/deploy-pages@v4
```

Move to the official `upload-pages-artifact` + `deploy-pages` flow rather than pushing a
`gh-pages` branch — no deploy key to rotate, and a proper deployment history in the repo.
Make sure `public/CNAME` still lands in `dist/` (Astro copies `public/` verbatim) and keep
`.nojekyll`.

`ci.yml` on pull requests: `bun install`, `astro check`, `bun run build`,
Prettier/ESLint, link check (`lychee`), and the Step 8 URL-parity script. Content PRs from
researchers then fail fast on a bad date or a missing image instead of after merge.
Add a preview deploy (Cloudflare Pages preview or Netlify Deploy Preview on PRs only —
production stays on GitHub Pages) so reviewers get a URL instead of reviewing markdown
diffs blind. That is the one thing GitHub Pages genuinely doesn't give us.

---

## Step 10 — QA gates before cutover

- [ ] `bunx astro check` clean, `bun run build` clean, no console errors on any page
- [ ] **Markdown parity (§1.3):** all 48 posts render; the 14 raw-HTML files keep their
      `<iframe>` / `<video>` / `<table>` / `<div>` / `<sup>`; heading anchors work; all 7
      code-fenced files highlight
- [ ] Whitespace check after the `compressHTML: 'jsx'` change — nav items and inline links
      not run together
- [ ] Every URL from the current build resolves (Step 8 script)
- [ ] Both Formspark forms: happy path, every validation error, **with JavaScript
      disabled**, honeypot triggered, and `_append=false` verified (no name/email in the
      redirect URL)
- [ ] A real submission arrives in the Formspark dashboard with the expected field names
      (especially `sampleId`, post-rename)
- [ ] Lighthouse ≥ 95 on Performance / A11y / Best Practices / SEO for `/`, `/blog/`, a
      long article, `/team/`
- [ ] JS payload check: confirm the pages with no interactive islands ship **zero** JS,
      and that shadcn/React only loads where §1.2 says it should
- [ ] Keyboard-only pass: skip link, nav, Cmd+K dialog, accordions, forms, all cards focusable
- [ ] Screen-reader pass on one article and the dataset-request form
- [ ] RSS validates; sitemap lists every page; `robots.txt` correct
- [ ] OG/Twitter cards preview correctly (a post and the home page)
- [ ] 375 / 768 / 1440 / 2560 px; light and dark
- [ ] Privacy policy text still matches what the site actually does (Formspark as
      processor, `_append=false`, analytics choice)

## Step 11 — Cutover and rollback

Simpler than a hosting migration: same host, same DNS, same domain.

1. Merge `astro-rewrite` → a long-lived `astro` branch; deploy to a preview URL and
   circulate for review.
2. Freeze content merges to `main` for the switch window (hours, not days).
3. Rebase the last `main` content commits onto the branch, rebuild, re-run Step 10.
4. Cut over: merge to `main`. The Pages deployment replaces the site in place.
5. Keep the old `gh-pages` branch untouched for 30 days — rollback is re-pointing Pages
   at it, no rebuild needed. Tag the last Next.js commit (`git tag pre-astro`).
6. After cutover: submit the new sitemap, watch Search Console for 404s for two weeks,
   confirm the first real form submission end-to-end.

---

## Appendix A — target layout

```
├── astro.config.mjs
├── bun.lock                         # package-lock.json deleted
├── components.json                  # shadcn config
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
│   ├── components/
│   │   ├── ui/            shadcn components (React, copied in)
│   │   └── *.astro        Header, MobileNav, Footer, PostCard, TeamCard,
│   │                      ProjectCard, Hero, Toc, DatasetRequestForm
│   ├── config/nav.ts      # single nav source of truth
│   ├── pages/             # Step 5 matrix
│   └── styles/global.css  # @theme tokens + shadcn variables + prose
├── public/                images (Phase A), documents, favicons, social.png,
│                          CNAME, robots.txt, .nojekyll
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
- Bun is optional for contributors — `npm run build` still works. Only CI and the core
  maintainers need Bun.

## Appendix C — dependency map

| Removed | Replaced by |
|---|---|
| `next`, `react-dom` (as a framework) | `astro` |
| `next-image-export-optimizer` | `astro:assets` (sharp) |
| `gray-matter`, `markdown-it`, `markdown-it-github-headings` | content collections + `@astrojs/markdown-remark` (`unified()`) + `rehype-slug`/`rehype-autolink-headings` |
| `framer-motion` | `astro:transitions` (`<ClientRouter />`) + CSS |
| `react-slideshow-image` | CSS crossfade + `astro:assets` |
| `react-burger-menu` | shadcn `sheet` |
| `react-icons` | inline SVG sprite (3 icons are actually used) + `lucide-react` (shadcn's icon set) |
| `dateformat` | `Intl.DateTimeFormat` |
| `tailwind-children` | Tailwind 4 `*:` variant (built in) |
| `@formspark/use-formspark` | plain HTML POST to `https://submit-form.com/{id}` (§3.1) |
| `eslint-config-next` | `eslint-plugin-astro` + `@astrojs/check` |
| `npm` + `package-lock.json` | `bun` + `bun.lock` |
| *(new)* | `@astrojs/react` + React 19 — only for shadcn islands (§1.2) |

## Open decisions

1. The stray form on `/privacy-policy` (0.5 #1): make it a real GDPR-rights form with its
   own Formspark id, or delete it.
2. Renaming `datset` → `sampleId` (0.5 #2) — who reads the Formspark exports, and are they
   fine with the column rename?
3. Images Phase B now or later (touches all 48 content files).
4. `/blog-de/*` → `/de/blog/*` in this release, or keep German posts where they are.
5. Analytics: none, Cloudflare Web Analytics, or self-hosted Umami.
6. PR preview deploys: Cloudflare Pages, Netlify, or none (production stays GitHub Pages
   either way).
7. Sätteri fast-follow (§1.3): revisit after launch, once the Step 2 experiment says what
   would break.

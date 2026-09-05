# LAION.ai — Astro Rewrite Plan

**Branch:** `astro-rewrite`

**Legacy baseline:** `main` at `1a16c61e` (refresh before cutover)

**Revised:** 2026-09-05

## Goal

Replace the unsupported Next.js 12 site with a maintainable static Astro site while:

- preserving every current page and public asset URL;
- preserving article content, heading links, forms, and the LAION identity;
- improving accessibility, metadata, performance, and contributor feedback;
- keeping GitHub Pages and the markdown-first editing workflow.

“Parity” means content, URLs, behavior, and capabilities—not visual parity. The existing
layout is not a constraint and may be substantially redesigned. Search, new sections, URL
restructuring, themes, and analytics must not block the rewrite.

## Stack

- Astro 7, static output, TypeScript strict mode
- Astro content collections with Zod validation
- Sätteri markdown with raw HTML enabled for trusted repository content
- Tailwind CSS 4 and the local Dinish fonts
- Plain Astro components by default
- React/shadcn only where a genuinely interactive, accessible component earns its payload
- Formspark through ordinary HTML form posts
- Bun with a pinned version and committed lockfile
- GitHub Pages through GitHub Actions

Do not add MDX or site-wide client routing. Add Pagefind only when search is implemented.

## Delivery model

Incomplete rewrite commits must not merge into `main`, because every merge deploys the live
site. Work on the rewrite branch, use preview deployments for review, and open one final
cutover PR after all release gates pass.

### 1. Capture the legacy baseline

Create a separate worktree so the old and new sites can be compared without switching the
rewrite checkout between branches:

```bash
git worktree add ../laion.ai-legacy 1a16c61e
```

Generate and commit a compact parity manifest containing:

- every generated page URL;
- every public image, document, favicon, and social-card URL;
- article visible text, heading IDs, links, media sources, lists, tables, and code blocks.

Record the source commit used to create it. Refresh the manifest from current `main` during
the final content freeze.

### 2. Scaffold and validate the toolchain

- Install a supported even-numbered Node release; prefer Node 24 LTS.
- Scaffold Astro with TypeScript, Tailwind, React, sitemap, RSS, and Sätteri.
- Pin Astro, Bun, and integrations through `package.json` and `bun.lock`.
- Configure `site: "https://laion.ai"`, static output, trailing slashes, local fonts, and
  the two existing legacy redirects.
- Smoke-test Bun with Astro, Sharp, the shadcn CLI, and one disposable hydrated component.
- Remove test-only components before committing.

Exit gate: clean install, `astro check`, and production build all pass from a clean checkout.

### 3. Move and validate content

Bring the latest content and assets from `main` into:

```text
src/content/blog/       36 posts
src/content/notes/      10 notes
src/content/blog-de/     2 posts
src/content/pages/      4 markdown + 6 JSON files
src/assets/fonts/       Dinish fonts
public/                 images, documents, favicons, social.png, CNAME, .nojekyll
```

Keep content and public URLs unchanged during this phase. Define schemas around the actual
legacy data, including these known irregularities:

- `projects.json`: `kind` is missing on 16 entries and `desc` on two;
- `privacy-policy.json`: “7.4 Right to rectification” occurs twice, so generated IDs need
  deterministic collision handling;
- post dates use several English text formats;
- one preview image is remote;
- 16 markdown files contain trusted raw HTML.

Normalize inconsistent project values only in view models; do not silently rewrite source
content. Use `.md` only.

Exit gate: all collections validate and all 48 documents pass the semantic parity comparison.

### 4. Build route parity

Port the existing routes before creating new ones:

- `/`, `/projects/`, `/team/`, `/press/`, `/about/`, `/faq/`, `/donations/`
- `/privacy-policy/`, `/dataset-requests/`, `/impressum/`, `/gep-policy/`, `/404/`
- `/blog/` and all 36 posts
- `/notes/` and all 10 notes
- `/blog-de/` and both German posts, with `lang="de"`
- the two current legacy redirect URLs

Use shared layouts for page metadata and articles. Preserve the legacy heading slug and
permalink behavior; Astro assigns heading IDs after user Sätteri plugins, so the built-in
heading-ID plugin must run before any custom permalink plugin.

Fix straightforward legacy defects while porting:

- broken `#contact` → `/gdpr` behavior;
- incorrect titles on Notes and German Blog;
- inaccessible clickable `<div>` cards;
- fragile press hostname parsing;
- missing 404 metadata;
- regex-truncated article excerpts;
- blanket image sizing and global `div` font override.

Forms remain no-JS HTML posts to Formspark. Include `_append=false`, a honeypot, labels,
constraints, and a local thank-you page.

Two form changes require confirmation before implementation:

- remove the unexplained duplicate dataset-request form from the privacy policy;
- rename Formspark fields `datset` → `dataset` and `sampleID` → `sampleId`.

Until confirmed, preserve the existing field names and do not invent a GDPR-rights workflow
or consent wording.

Exit gate: every legacy route and asset resolves, internal links/fragments pass, and the
dataset form succeeds with JavaScript disabled without placing personal data in the URL.

### 5. Apply the redesign and release essentials

Preserve the LAION brand assets: the existing logo, Dinish typeface, dark blue/paper palette,
and recognizable use of community imagery. Everything else may be substantially overhauled,
including the page composition, visual hierarchy, spacing, grid, navigation, cards, article
layout, and responsive behavior. The result should feel contemporary rather than like a
restyled version of the old site.

Introduce a responsive header/footer and one navigation definition shared across desktop
and mobile. Do not link routes that do not yet exist.

Release essentials:

- keyboard navigation, focus states, skip link, landmarks, and useful alt text;
- canonical URLs, sitemap, robots.txt, Open Graph/Twitter metadata;
- accurate `NGO` and `FAQPage` structured data;
- RSS for Blog and Notes;
- responsive layout at 375, 768, 1440, and 2560 px;
- zero client JavaScript on pages without intentional interactive islands.

Do not split the free-form author string to manufacture structured authors. Add a structured
authors field before emitting `BlogPosting.author` entities.

For the first release, keep images in `public/` and add dimensions/lazy loading where safe.
If responsive Astro image processing is included, preserve every old `/images/...` URL by
copying original bytes into `dist/images/` while pages use hashed optimized variants.

Exit gate: design sign-off, accessibility checks, representative Lighthouse budgets, no
console errors, and no regression in the parity manifest.

### 6. CI/CD and cutover

Pull requests must run a frozen install, type/content checks, build, formatting/linting,
parity checks, internal-link checks, and asset-reference checks. Provide a preview URL.

Production deployment must use separate build and deploy jobs with current supported action
versions and these permissions:

- workflow/build: `contents: read`
- deploy job: `pages: write`, `id-token: write`
- environment: `github-pages`

Keep `public/CNAME` and `public/.nojekyll`. Pin Bun in CI rather than using `latest`.

Cutover:

1. Freeze content merges to `main` briefly.
2. Sync only content/assets changed since the recorded source commit; do not late-rebase the
   entire stripped rewrite branch.
3. Refresh the parity baseline and rerun every release gate.
4. Tag the last Next.js commit `pre-astro` and record the last good deployment.
5. Switch Settings → Pages source from `gh-pages` to GitHub Actions.
6. Merge the cutover PR and immediately run production smoke tests.

Keep `gh-pages` untouched for at least 30 days. Rollback means switching Pages back to
“Deploy from a branch: gh-pages / root” and verifying the custom domain and HTTPS state.

## Post-launch backlog

Implement each independently after the rewrite is stable:

- Pagefind search and Cmd+K UI
- responsive image migration and source-image cleanup
- markdown HTML cleanup where it materially helps image processing or maintainability
- structured authors, tags, author archives, and generated post OG images
- `/de/blog/` routing, but only with real HTTP redirects from `/blog-de/`
- publications page backed by an approved complete data source
- projects filtering
- light theme
- newsletter signup with its own approved form and retention text
- privacy-reviewed analytics; default is none

## Definition of done

- All current page and public asset URLs still work.
- All 48 posts preserve visible content, headings, links, tables, code, and media.
- Forms work without JavaScript and do not leak submitted values into redirect URLs.
- Content errors fail CI before merge.
- Accessibility, metadata, RSS, sitemap, responsive layout, and agreed performance budgets
  pass on representative pages.
- Production deployment and rollback procedures have both been verified.

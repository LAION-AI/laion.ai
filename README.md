# laion.ai

The LAION website, rebuilt as a static [Astro](https://astro.build/) site for GitHub Pages.

## Local development

This project uses Bun 1.3.14 and requires Node.js 22.12 or newer when run with Node.

```sh
bun install
bun run dev
```

The production checks are:

```sh
bun run check
bun run lint
bun run test
```

`bun run test` builds the complete site and verifies that every legacy route and file still exists, representative heading anchors, local asset references, and the security baseline: no client JavaScript, inline event handlers, or `javascript:` URLs, and a Content-Security-Policy on every page. Editing existing content never fails these checks. Deleting or renaming a legacy post or file does, because old links would break: add a redirect, or remove its entry from `tests/fixtures/legacy-manifest.json` if it is retired on purpose.

## Content

- Blog posts: `src/content/blog`
- Notes: `src/content/notes`
- German blog posts: `src/content/blog-de`
- Page copy and structured data: `src/content/pages`
- Static images and documents: `public`

Posts need `title`, `author`, `date`, and `previewImg` frontmatter. Schemas in `src/content.config.ts` validate these fields at build time.

## Editorial updates

The homepage selects the latest blog entry by date, with the slug as a stable tie-breaker, and uses its title, preview image, and excerpt automatically.

Current project descriptions, resource links, and status corrections live in `src/data/projects.ts`; new team members go in `src/content/pages/team.json` (portraits in `public/images/team`), and `src/data/team.ts` holds copy edits layered over those records. About and Donations share `FundingStatement.astro` so their funding description stays consistent.

Press titles and publication names are maintained in `src/data/press-metadata.json`, keyed by the original article URL. `isHeadline: false` identifies descriptive archive labels for sources whose headlines could not be verified. Those links are labelled “Archive link” on the page. Do not infer article headlines from URLs or bypass subscription requirements.

## Deployment

The workflow in `.github/workflows/deploy.yml` builds and deploys `dist` to GitHub Pages when changes reach `main`. The Pages source must be set to **GitHub Actions** before the first deployment. `public/CNAME` preserves the `laion.ai` custom domain.

## Credits

Thanks to Tomas, Technobird, and NeoGen for the previous site and for the Technobot work used in the LAION [Discord](https://discord.com/invite/eq3cAMZtCC). The original community-generated landing-page images remain in the asset archive.

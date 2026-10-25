import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

interface Manifest {
  routes: string[];
  files: Array<{ legacyPath: string; targetPath: string }>;
  knownMissingAssets: string[];
}

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = join(root, 'dist');
const manifest = JSON.parse(
  readFileSync(join(root, 'tests/fixtures/legacy-manifest.json'), 'utf8'),
) as Manifest;
const failures: string[] = [];

const outputFor = (route: string) =>
  route === '/404'
    ? join(dist, '404.html')
    : route === '/'
      ? join(dist, 'index.html')
      : join(dist, route, 'index.html');

for (const route of manifest.routes) {
  if (!existsSync(outputFor(route))) failures.push(`Missing built route: ${route}`);
}

// Legacy files may be edited freely; they only have to keep existing so old URLs still resolve.
for (const file of manifest.files) {
  if (!existsSync(join(root, file.targetPath)))
    failures.push(`Missing legacy file: ${file.targetPath}`);
}

for (const directory of [
  'src/content/blog',
  'src/content/notes',
  'src/content/blog-de',
  'src/content/pages',
]) {
  for (const name of readdirSync(join(root, directory))) {
    const source = readFileSync(join(root, directory, name), 'utf8');
    for (const match of source.matchAll(
      /(?:src=["']|]\()(?<path>\/(?:images|documents)\/[^)'"\s>]+)/g,
    )) {
      const assetPath = match.groups?.path;
      if (
        assetPath &&
        !existsSync(join(root, 'public', assetPath)) &&
        !manifest.knownMissingAssets.includes(assetPath)
      ) {
        failures.push(`Broken local asset in ${directory}/${name}: ${assetPath}`);
      }
    }
  }
}

const htmlFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  });
for (const path of htmlFiles(dist)) {
  const html = readFileSync(path, 'utf8');
  // Markdown renders raw HTML, so anything executable fails the build. JSON-LD is inert data.
  for (const script of html.matchAll(/<script\b[^>]*>/gi)) {
    if (!/\btype="application\/ld\+json"/i.test(script[0]))
      failures.push(`Unexpected client JavaScript: ${path.slice(dist.length)}`);
  }
  for (const tag of html.matchAll(/<[a-z][^>]*>/gi)) {
    if (/\son[a-z]+\s*=/i.test(tag[0].replace(/"[^"]*"|'[^']*'/g, '""')))
      failures.push(`Inline event handler in ${path.slice(dist.length)}: ${tag[0].slice(0, 80)}`);
  }
  if (/\b(?:href|src|action|formaction)\s*=\s*["']?\s*javascript:/i.test(html))
    failures.push(`javascript: URL in ${path.slice(dist.length)}`);
  if (/<main\b/i.test(html) && !html.includes('http-equiv="Content-Security-Policy"'))
    failures.push(`Missing Content-Security-Policy in ${path.slice(dist.length)}`);
  for (const match of html.matchAll(
    /<(?:a|img|source|video)\b[^>]*(?:href|src|srcset)="(?<url>\/[^"]+)"/gi,
  )) {
    const url = match.groups?.url.split(/[?#]/)[0];
    if (!url || manifest.knownMissingAssets.includes(url)) continue;
    const target = join(dist, decodeURI(url));
    if (
      !existsSync(target) &&
      !existsSync(join(target, 'index.html')) &&
      !existsSync(`${target}.html`)
    ) {
      failures.push(`Broken built URL in ${path.slice(dist.length)}: ${url}`);
    }
  }
  if (!path.startsWith(join(dist, 'documents'))) {
    for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
      if (!/\balt="[^"]*"/i.test(image[0])) {
        failures.push(`Image without alt attribute in ${path.slice(dist.length)}`);
      }
    }
  }
}

const anchorFixtures: Record<string, string[]> = {
  '/blog/laion-5b': ['introduction', 'license', 'dataset-statistics', 'acquisition-pipeline'],
  '/blog/open-flamingo': ['multimodal-c4', 'benchmark', 'model-release'],
};
for (const [route, ids] of Object.entries(anchorFixtures)) {
  const html = readFileSync(outputFor(route), 'utf8');
  for (const id of ids)
    if (!html.includes(`id="${id}"`)) failures.push(`Missing heading #${id} on ${route}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(
  `Parity verified: ${manifest.routes.length} routes, ${manifest.files.length} legacy files present, no client JavaScript. ${manifest.knownMissingAssets.length} inherited missing assets recorded.`,
);

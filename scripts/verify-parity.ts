import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

interface Manifest {
  routes: string[];
  files: Array<{ targetPath: string; bytes: number; sha256: string }>;
  knownMissingAssets: string[];
}

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = join(root, 'dist');
const manifest = JSON.parse(
  readFileSync(join(root, 'tests/fixtures/legacy-manifest.json'), 'utf8'),
) as Manifest;
const failures: string[] = [];

const sha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const outputFor = (route: string) =>
  route === '/404'
    ? join(dist, '404.html')
    : route === '/'
      ? join(dist, 'index.html')
      : join(dist, route, 'index.html');

for (const route of manifest.routes) {
  if (!existsSync(outputFor(route))) failures.push(`Missing built route: ${route}`);
}

for (const file of manifest.files) {
  const target = join(root, file.targetPath);
  if (!existsSync(target)) failures.push(`Missing legacy file: ${file.targetPath}`);
  else if (sha256(target) !== file.sha256) failures.push(`Changed legacy file: ${file.targetPath}`);
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
  if (/<script\b[^>]*\bsrc=/i.test(html))
    failures.push(`Unexpected client JavaScript: ${path.slice(dist.length)}`);
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
  `Parity verified: ${manifest.routes.length} routes, ${manifest.files.length} unchanged legacy files, no client JavaScript. ${manifest.knownMissingAssets.length} inherited missing assets recorded.`,
);

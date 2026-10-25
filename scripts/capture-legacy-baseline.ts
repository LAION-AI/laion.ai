import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const legacyRoot = resolve(process.argv[2] ?? '../laion.ai-legacy');
const output = resolve(process.argv[3] ?? 'tests/fixtures/legacy-manifest.json');

if (!existsSync(join(legacyRoot, 'package.json'))) {
  throw new Error(`Legacy checkout not found at ${legacyRoot}`);
}
const legacyCommit = execFileSync('git', ['-C', legacyRoot, 'rev-parse', '--short=8', 'HEAD'], {
  encoding: 'utf8',
}).trim();

function filesBelow(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  });
}

function sha256(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

const mappings = [
  ['blog', 'src/content/blog'],
  ['notes', 'src/content/notes'],
  ['blog-de', 'src/content/blog-de'],
  ['content', 'src/content/pages'],
] as const;

const missingAssets = new Set<string>();
for (const [legacyDirectory] of mappings) {
  for (const path of filesBelow(join(legacyRoot, legacyDirectory))) {
    if (!path.endsWith('.md')) continue;
    const source = readFileSync(path, 'utf8');
    for (const match of source.matchAll(
      /(?:src=["']|]\()(?<path>\/(?:images|documents)\/[^)'"\s>]+)/g,
    )) {
      const assetPath = match.groups?.path;
      if (assetPath && !existsSync(join(legacyRoot, 'public', assetPath)))
        missingAssets.add(assetPath);
    }
  }
}

const files = mappings.flatMap(([legacyDirectory, targetDirectory]) =>
  filesBelow(join(legacyRoot, legacyDirectory)).map((path) => ({
    legacyPath: relative(legacyRoot, path),
    targetPath: join(targetDirectory, relative(join(legacyRoot, legacyDirectory), path)),
    bytes: statSync(path).size,
    sha256: sha256(path),
  })),
);

for (const path of filesBelow(join(legacyRoot, 'public'))) {
  const legacyPath = relative(legacyRoot, path);
  const publicPath = relative(join(legacyRoot, 'public'), path);
  files.push({
    legacyPath,
    targetPath: publicPath.startsWith('fonts/')
      ? join('src/assets', publicPath)
      : join('public', publicPath),
    bytes: statSync(path).size,
    sha256: sha256(path),
  });
}

const routes = [
  '/',
  '/projects',
  '/team',
  '/press',
  '/about',
  '/faq',
  '/donations',
  '/privacy-policy',
  '/dataset-requests',
  '/impressum',
  '/gep-policy',
  '/404',
  '/blog',
  '/notes',
  '/blog-de',
  '/laion-400-open-dataset',
  '/laion-5b-a-new-era-of-open-large-scale-multi-modal-datasets',
  ...filesBelow(join(legacyRoot, 'blog')).map(
    (path) => `/blog/${relative(join(legacyRoot, 'blog'), path).replace(/\.md$/, '')}`,
  ),
  ...filesBelow(join(legacyRoot, 'notes')).map(
    (path) => `/notes/${relative(join(legacyRoot, 'notes'), path).replace(/\.md$/, '')}`,
  ),
  ...filesBelow(join(legacyRoot, 'blog-de')).map(
    (path) => `/blog-de/${relative(join(legacyRoot, 'blog-de'), path).replace(/\.md$/, '')}`,
  ),
].sort();

mkdirSync(dirname(output), { recursive: true });
writeFileSync(
  output,
  `${JSON.stringify({ capturedFrom: `main@${legacyCommit}`, routes, files, knownMissingAssets: [...missingAssets].sort() }, null, 2)}\n`,
);
console.log(
  `Captured ${routes.length} routes, ${files.length} files, and ${missingAssets.size} known missing assets in ${output}`,
);

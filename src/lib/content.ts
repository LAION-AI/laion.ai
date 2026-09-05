import type { CollectionEntry } from 'astro:content';

export type PostCollection = 'blog' | 'notes' | 'blogDe';
export type PostEntry = CollectionEntry<PostCollection>;

export const collectionMeta = {
  blog: {
    path: 'blog',
    title: 'Blog',
    eyebrow: 'News & releases',
    description: 'Commentary, releases, and updates from LAION and the open scientific community.',
  },
  notes: {
    path: 'notes',
    title: 'Notes',
    eyebrow: 'Ideas & discussion',
    description:
      'Working notes, calls for collaboration, and perspectives from the LAION community.',
  },
  blogDe: {
    path: 'blog-de',
    title: 'Blog auf Deutsch',
    eyebrow: 'Deutschsprachige Beiträge',
    description: 'Neuigkeiten und Einblicke aus der deutschsprachigen LAION-Community.',
  },
} as const;

export function parseDate(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) throw new Error(`Invalid content date: ${value}`);
  return date;
}

export function formatDate(value: string, locale = 'en-GB'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parseDate(value));
}

export function sortPosts<T extends PostEntry>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) => parseDate(b.data.date).valueOf() - parseDate(a.data.date).valueOf(),
  );
}

export function excerpt(markdown: string, length = 210): string {
  const clean = markdown
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > length ? `${clean.slice(0, length).trimEnd()}…` : clean;
}

export function absoluteImage(image: string): string {
  return image.startsWith('http') ? image : new URL(image, 'https://laion.ai').href;
}

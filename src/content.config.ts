import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  date: z.string().min(1),
  previewImg: z.string().min(1),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: postSchema,
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: postSchema,
});

const blogDe = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog-de' }),
  schema: postSchema,
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(1),
    heading: z.string().optional(),
    name: z.string().optional(),
    iban: z.string().optional(),
    bic: z.string().optional(),
  }),
});

export const collections = { blog, notes, blogDe, pages };

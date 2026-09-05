import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { excerpt, parseDate, sortPosts } from '../../lib/content';

export async function GET(context: { site?: URL }) {
  const posts = sortPosts(await getCollection('notes'));
  return rss({
    title: 'LAION Notes',
    description: 'Working notes and perspectives from the LAION community.',
    site: context.site ?? new URL('https://laion.ai'),
    items: posts.map((post) => ({
      title: post.data.title,
      description: excerpt(post.body ?? '', 320),
      pubDate: parseDate(post.data.date),
      link: `/notes/${post.id}/`,
      author: post.data.author,
    })),
    customData: '<language>en</language>',
  });
}

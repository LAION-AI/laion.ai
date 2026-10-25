// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import tailwindcss from '@tailwindcss/vite';
import { defineHastPlugin } from 'satteri';

const legacyMarkupCompatibility = defineHastPlugin({
  name: 'legacy-markup-compatibility',
  element: {
    filter: ['a', 'img', 'iframe'],
    visit(node, context) {
      // The privacy-enhanced host sets no YouTube cookies until a visitor plays the video.
      const src = node.properties?.src;
      if (node.tagName === 'iframe' && typeof src === 'string') {
        context.setProperty(
          node,
          'src',
          src.replace(
            /^https:\/\/(?:www\.)?youtube\.com\/embed\//,
            'https://www.youtube-nocookie.com/embed/',
          ),
        );
      }
      if (node.tagName === 'a' && node.properties?.href === '/notes/laion-maintenance.md') {
        context.setProperty(node, 'href', '/notes/laion-maintenance');
      }
      if (node.tagName === 'img') {
        if (node.properties?.src === '/public/images/blog/artbot-image-ratings.png') {
          context.setProperty(node, 'src', '/images/blog/artbot-image-ratings.png');
        }
        if (typeof node.properties?.alt !== 'string') {
          context.setProperty(node, 'alt', '');
        }
      }
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: 'https://laion.ai',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    processor: satteri({
      features: { rawHtml: true },
      hastPlugins: [legacyMarkupCompatibility],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

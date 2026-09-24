// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://teepul.com',
  output: 'server',
  build: {
    inlineStylesheets: 'auto',
  },
  security: {
    checkOrigin: false,
  },
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [tailwind()],
});

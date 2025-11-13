// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://murderdogfb.github.io';
const BASE = '/home';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});

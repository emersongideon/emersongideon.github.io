// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// User GitHub Pages site: served from the domain root, so base is "/".
// If this ever moves to a project repo, set base to "/<repo>/" and every
// internal link (built with `url()` in src/lib/url.ts) follows automatically.
export default defineConfig({
  site: 'https://emersongideon.github.io',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  image: {
    // Cap generated widths so the build stays fast and the repo output small.
    responsiveStyles: true,
  },
});

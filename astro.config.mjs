// @ts-check
import { defineConfig } from 'astro/config';

// Static site on Cloudflare (Workers static assets, wrangler.jsonc). French at /, English at /en/.
// The sitemap is written by src/pages/sitemap.xml.ts from the same route list as the pages.
export default defineConfig({
  site: 'https://camilbenameur.com',
  trailingSlash: 'always',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'always', format: 'directory' },
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1' },
});

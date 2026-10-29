// The sitemap, from the same data as the pages: each page with its other-language twin (hreflang).
import type { APIRoute } from 'astro';
import { routes, site } from '../data/site';
import { projects } from '../data/projects';

const pairs: [string, string][] = [
  [routes.home.fr, routes.home.en],
  ...projects.filter((p) => p.page).map((p) => [`${routes.project.fr}${p.slug}/`, `${routes.project.en}${p.slug}/`] as [string, string]),
  [routes.legal.fr, routes.legal.en],
];

export const GET: APIRoute = () => {
  const abs = (p: string) => new URL(p, site.origin).href;
  const urls = pairs.flatMap(([fr, en]) => [fr, en].map((loc) => `  <url>
    <loc>${abs(loc)}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${abs(fr)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${abs(en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(fr)}"/>
  </url>`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

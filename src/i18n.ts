// Language helpers. French lives at /, English at /en/.
import type { Lang, T } from './data/site';
export type { Lang, T };

export const langOf = (path: string): Lang => (path === '/en' || path.startsWith('/en/') ? 'en' : 'fr');
export const tr = <V>(x: { fr: V; en: V }, lang: Lang): V => x[lang];

// The same page in the other language. Project slugs are shared; the folder name changes.
const pairs: [string, string][] = [
  ['/mentions/', '/en/legal/'],
  ['/merci/', '/en/thanks/'],
];
export function altPath(path: string): string {
  const p = path.endsWith('/') ? path : `${path}/`;
  for (const [fr, en] of pairs) {
    if (p === fr) return en;
    if (p === en) return fr;
  }
  if (p === '/404/' || p === '/404.html/') return '/en/';
  if (p.startsWith('/projets/')) return p.replace('/projets/', '/en/projects/');
  if (p.startsWith('/en/projects/')) return p.replace('/en/projects/', '/projets/');
  if (p === '/' ) return '/en/';
  if (p === '/en/') return '/';
  return p.startsWith('/en/') ? p.slice(3) : `/en${p}`;
}

// Section anchors differ by language (#realisations / #work).
export const anchor = (s: { id: string; en: string }, lang: Lang) => (lang === 'fr' ? s.id : s.en);

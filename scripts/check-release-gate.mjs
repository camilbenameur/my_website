// Release-order gate: the Writing section (src/data/writing.ts) states things that are only true once
// the blog build carrying the matching posts is live. For each post, in French and in English, this
// script fetches the page and checks that
//   - it answers 200,
//   - its <title> contains the title the Writing section shows, and
//   - when the entry says `corrected`, the page shows the correction note dated that day.
// If a check fails: deploy the blog first, then this site.
//
// Not part of `npm run build` (the build must not depend on the live blog). Run it before deploying:
//   npm run check:release
//   RELEASE_GATE_BLOG_ORIGIN=http://127.0.0.1:4401 npm run check:release   check a local build of the blog
import { blogOrigin, posts, postUrl } from '../src/data/writing.ts';

const origin = (process.env.RELEASE_GATE_BLOG_ORIGIN || blogOrigin).replace(/\/+$/, '');

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
// The site sets typographic apostrophes; the blog may use straight ones.
const norm = (s) => s.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

const problems = [];
let checked = 0;
for (const post of posts) {
  for (const lang of ['fr', 'en']) {
    const url = postUrl(post.slug, lang).replace(blogOrigin, origin);
    let res;
    let lastErr;
    // A first connection can time out on this network (IPv6 first): try again before failing.
    for (let attempt = 0; attempt < 3 && !res; attempt++) {
      try {
        res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
      } catch (err) {
        lastErr = err;
      }
    }
    if (!res) {
      problems.push(`${url}: could not be fetched (${lastErr?.cause?.code || lastErr?.message})`);
      continue;
    }
    if (res.status !== 200) { problems.push(`${url}: answered ${res.status}`); continue; }
    const html = await res.text();
    checked++;
    const title = norm(decode(html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? ''));
    if (!title.includes(norm(post.title[lang]))) problems.push(`${url}: <title> is "${title}", the Writing section shows "${post.title[lang]}"`);
    if (post.corrected) {
      if (!/class="[^"]*\bcorrection\b[^"]*"/.test(html)) problems.push(`${url}: no correction note, the Writing section says "corrected ${post.corrected.iso}"`);
      else if (!html.includes(`datetime="${post.corrected.iso}`)) problems.push(`${url}: the correction is not dated ${post.corrected.iso}`);
    }
  }
}

if (problems.length) {
  console.error('release gate: FAILED. The Writing section describes posts the blog does not serve yet.');
  for (const p of problems) console.error('  - ' + p);
  console.error('Deploy the blog first, check these pages on the live site, then deploy this site.');
  process.exit(1);
}
console.log(`release gate: ok (${checked} pages at ${origin} match the Writing section)`);

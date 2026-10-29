// After the build: replace 'unsafe-inline' in the CSP's script-src with the SHA-256 hashes of the
// inline scripts the pages actually carry (the pre-paint flag script, the 404 path, Astro's own).
// JSON data blocks (application/json, application/ld+json) are not scripts and are not hashed.
// Rewrites dist/_headers; fails if public/_headers has no script-src to rewrite.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const hashes = new Set();

async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith('.html')) {
      const html = await readFile(p, 'utf8');
      for (const m of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi)) {
        const attrs = m[1] || '';
        if (/\bsrc=/.test(attrs) || /type="application\/(ld\+)?json"/.test(attrs) || !m[2]) continue;
        hashes.add(`'sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}'`);
      }
    }
  }
}
await walk(dist);

const file = join(dist, '_headers');
const headers = await readFile(file, 'utf8');
if (!/script-src 'self' 'unsafe-inline'/.test(headers)) {
  console.error("csp: dist/_headers has no \"script-src 'self' 'unsafe-inline'\" to rewrite");
  process.exit(1);
}
await writeFile(file, headers.replace("script-src 'self' 'unsafe-inline'", `script-src 'self' ${[...hashes].sort().join(' ')}`));
console.log(`csp: script-src pinned to ${hashes.size} inline script hash(es)`);

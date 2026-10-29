// French typography pass on the built HTML (runs after `astro build`).
// Text between tags only, never inside <script>, <style>, <pre> or <code>, never in attributes:
//   « word »        → narrow no-break space inside the guillemets
//   word : ; ! ?    → no-break space before the colon, narrow no-break space before ; ! ?
//   3 000 €, 40 %   → no-break space before € and %
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const NBSP = ' ';
const NNBSP = ' ';

function fixText(t) {
  return t
    .replace(/«[  ]?/g, `«${NNBSP}`)
    .replace(/[  ]?»/g, `${NNBSP}»`)
    .replace(/ :(?=\s|$|<)/g, `${NBSP}:`)
    .replace(/ ([;!?])/g, `${NNBSP}$1`)
    .replace(/(\d) (€|%|\$)/g, `$1${NBSP}$2`);
}

function fixHtml(html) {
  let out = '';
  let skip = null; // closing tag we are waiting for
  const re = /(<[^>]+>)/g;
  let last = 0;
  for (const m of html.matchAll(re)) {
    const text = html.slice(last, m.index);
    out += skip ? text : fixText(text);
    const tag = m[0];
    out += tag;
    const open = /^<(script|style|pre|code)\b/i.exec(tag);
    const close = /^<\/(script|style|pre|code)\b/i.exec(tag);
    if (open && !tag.endsWith('/>')) skip = open[1].toLowerCase();
    else if (close && skip === close[1].toLowerCase()) skip = null;
    last = m.index + tag.length;
  }
  return out + (skip ? html.slice(last) : fixText(html.slice(last)));
}

async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith('.html')) await writeFile(p, fixHtml(await readFile(p, 'utf8')));
  }
}

await walk(new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
console.log('typo: French spacing applied to dist/**/*.html');

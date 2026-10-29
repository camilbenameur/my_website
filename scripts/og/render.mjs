// Renders the share images and icons into public/ (run by hand when the card or the favicon changes):
//   public/og.png, public/og-en.png   1200×630 Open Graph cards (scripts/og/card.html, FR and EN)
//   public/apple-touch-icon.png       180×180, from public/favicon.svg
//   public/favicon.ico                32×32 PNG inside an ICO container
// Needs Playwright resolvable from the current directory and a Chromium (awwwards' browser.mjs finds one).
//   node scripts/og/render.mjs
import { launch } from 'file:///C:/Users/benam/.claude/skills/awwwards/scripts/browser.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.resolve(here, '../../public');
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const lang of ['fr', 'en']) {
    await page.goto(pathToFileURL(path.join(here, 'card.html')).href);
    if (lang === 'en') {
      await page.evaluate(() => {
        document.documentElement.lang = 'en';
        document.querySelector('[data-title]').firstChild.textContent = 'Camil Benameur,';
        document.querySelector('[data-role]').textContent = 'AI engineer.';
        document.querySelector('[data-file]').textContent = 'profile.json';
        document.querySelector('[data-meta]').textContent = 'Lyon, France · graduated in 2025';
        document.querySelector('[data-json]').innerHTML = '{\n  <span class="k">"role"</span>: <span class="s">"AI engineer"</span>,\n  <span class="k">"city"</span>: <span class="s">"Lyon"</span>,\n  <span class="k">"ai"</span>: [<span class="s">"MCP"</span>, <span class="s">"RAG"</span>],\n  <span class="k">"next"</span>: [<span class="c">"LangGraph ag</span><span class="h">"]}</span>';
      });
    }
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(pub, lang === 'fr' ? 'og.png' : 'og-en.png') });
  }

  const svg = await readFile(path.join(pub, 'favicon.svg'), 'utf8');
  const icon = async (size) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  };
  await writeFile(path.join(pub, 'apple-touch-icon.png'), await icon(180));
  const png = await icon(32);
  // ICO container with one PNG image (supported by every current browser)
  const head = Buffer.alloc(22);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
  head.writeUInt8(32, 6); head.writeUInt8(32, 7); head.writeUInt8(0, 8); head.writeUInt8(0, 9);
  head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12); head.writeUInt32LE(png.length, 14); head.writeUInt32LE(22, 18);
  await writeFile(path.join(pub, 'favicon.ico'), Buffer.concat([head, png]));
  console.log('wrote og.png, og-en.png, apple-touch-icon.png, favicon.ico');
} finally {
  await browser.close();
}

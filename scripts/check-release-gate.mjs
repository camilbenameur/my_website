// Release-order gate: the Writing section (src/data/content.js `writing`) states things that are only true
// once the blog build carrying the matching posts is live. This script fetches each post and checks that
//   - the page answers 200,
//   - its <title> contains the title the Writing section shows, and
//   - when the entry says `corrected`, the page shows the correction note and badge for that month.
// If any check fails, deploy the blog first, then this site.
//
// It is NOT wired into `npm run build`: the build must not depend on the live blog being reachable.
// Run it by hand before deploying this site:
//   npm run check:release          check now, wherever you are
//   SKIP_RELEASE_GATE=1 npm run build   skip it (for example when the blog host is down and the posts are known good)
//   RELEASE_GATE_BLOG_ORIGIN=http://localhost:4372 npm run check:release   check a local build of the blog

import { writing } from "../src/data/content.js";

const LIVE_ORIGIN = "https://blog.camilbenameur.com";
const origin = (process.env.RELEASE_GATE_BLOG_ORIGIN || LIVE_ORIGIN).replace(/\/+$/, "");

const forced = process.argv.includes("--check") || process.env.RELEASE_GATE === "1";
const ci = Boolean(process.env.CI) && process.env.CI !== "false" && process.env.CI !== "0";

if (process.env.SKIP_RELEASE_GATE === "1") {
  console.log("release gate: skipped (SKIP_RELEASE_GATE=1)");
  process.exit(0);
}
if (!forced && !ci) {
  console.log("release gate: skipped on a local build (it runs when CI is set; `npm run check:release` runs it now)");
  process.exit(0);
}

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const problems = [];

for (const post of writing) {
  const url = post.href.replace(LIVE_ORIGIN, origin);
  let res;
  try {
    res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000) });
  } catch (err) {
    problems.push(`${url}: could not be fetched (${err.cause?.code || err.message})`);
    continue;
  }
  if (res.status !== 200) {
    problems.push(`${url}: answered ${res.status}`);
    continue;
  }
  const html = await res.text();

  const title = decode(html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "");
  if (!title.includes(post.title)) {
    problems.push(`${url}: <title> is "${title}", the Writing section shows "${post.title}"`);
  }

  if (post.corrected) {
    if (!/class="[^"]*\bcorrection\b[^"]*"/.test(html)) {
      problems.push(`${url}: no correction note on the page, the Writing section says "corrected ${post.corrected.label}"`);
    } else if (!html.includes(`datetime="${post.corrected.iso}`)) {
      problems.push(`${url}: the correction is not dated ${post.corrected.iso}, the Writing section says "corrected ${post.corrected.label}"`);
    }
  }
}

if (problems.length > 0) {
  console.error("release gate: FAILED. The Writing section describes posts the blog does not serve yet.");
  for (const p of problems) console.error("  - " + p);
  console.error("Deploy the blog first, check these pages on the live site, then deploy this site.");
  console.error("(SKIP_RELEASE_GATE=1 bypasses this check.)");
  process.exit(1);
}

console.log(`release gate: ok (${writing.length} posts at ${origin} match the Writing section)`);

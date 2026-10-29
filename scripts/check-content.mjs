// Content gate, run before every build (`npm run build`). It reads every string of src/data/*.ts and
// fails the build on the mechanical rules of cv_latex (CLAUDE.md rule 1, CV-GUIDELINES.md §0 and §2):
//   - no seniority words, in French or English;
//   - no present-tense current job, no Claude Code by name, no lightning (abandoned project);
//   - no phone number, no em or en dash;
//   - "en production" / "to production" only where the SoftDPAC Remote Installer is meant;
//   - the FormSubmit endpoints are FormSubmit alias URLs (a broken endpoint once shipped silently).
// What a regex cannot judge (what a sentence implies) stays with the adversarial review.
// Node 24 imports the .ts data files directly (type stripping); they import nothing.
import * as site from '../src/data/site.ts';
import * as projects from '../src/data/projects.ts';
import * as background from '../src/data/background.ts';
import * as skills from '../src/data/skills.ts';
import * as writing from '../src/data/writing.ts';

const banned = [
  /\bexperts?\b/i, /\bexpertise\b/i, /\bseniors?\b/i, /\bconfirmée?s?\b/i, /\blead\b/i, /\bexperienced\b/i,
  /maîtrise avancée/i, /solide expérience/i, /forte expérience/i, /plusieurs années/i, /nombreuses années/i,
  /years of experience/i, /\bgaranti/i, /\bguarantee/i,
  /currently at/i, /actuellement chez/i, /poste actuel/i, /\ben poste\b/i, /période d.essai/i, /current (role|job|employer)/i,
  /claude code/i, /\blightning\b/i,
  /\+33|0?6[ .]?95[ .]?57/, /[—–]/,
];

// Where "production" is allowed: the SRI, and sentences that say something is NOT in production.
const productionOk = [
  /^projects\.projects\.0\./, // SoftDPAC Remote Installer
  /^site\.site\.description\./, /^site\.hero\./, /^site\.stream\./, /^background\.commits\.1\./,
  /^projects\.projects\.2\.page\.limit\./, // « Rien de cette liste n'est présenté comme “en production” »
  /^projects\.projects\.1\.page\.lead\./, // « Le serveur MCP et l'agent RAG n'ont été ni mis en production ni adoptés »
];
const productionRe = /(en|to|in) production|en prod\b/i;

const clean = [];
function walk(value, path) {
  if (typeof value === 'string') {
    for (const re of banned) if (re.test(value)) clean.push(`${path}: « ${value.slice(0, 90)} » matches ${re}`);
    if (productionRe.test(value) && !productionOk.some((re) => re.test(path))) clean.push(`${path}: "production" outside the SoftDPAC Remote Installer: « ${value.slice(0, 90)} »`);
    return;
  }
  if (typeof value === 'function') return;
  if (Array.isArray(value)) return value.forEach((v, i) => walk(v, `${path}.${i}`));
  if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k);
}
walk({ site, projects, background, skills, writing }, '');

const form = site.site.form;
if (!/^https:\/\/formsubmit\.co\/ajax\/[a-f0-9]{20,}$/.test(form.ajax)) clean.push(`site.form.ajax is not a FormSubmit alias AJAX URL: ${form.ajax}`);
if (!/^https:\/\/formsubmit\.co\/[a-f0-9]{20,}$/.test(form.post)) clean.push(`site.form.post is not a FormSubmit alias URL: ${form.post}`);
for (const p of projects.projects) {
  if (p.status === 'public' && !p.href) clean.push(`project ${p.slug}: status public needs an href`);
  if (p.status === 'prive' && p.href) clean.push(`project ${p.slug}: a private project never links to its repository`);
  if (p.status === 'prevu') clean.push(`project ${p.slug}: planned projects go in \`planned\`, not in the project list`);
}

if (clean.length) {
  console.error(`check-content: ${clean.length} problem(s) in src/data:`);
  for (const p of clean) console.error('  - ' + p);
  process.exit(1);
}
console.log('check-content: ok (seniority words, current job, phone, dashes, "production", form endpoints)');

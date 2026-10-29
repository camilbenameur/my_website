// The terminal's file system: this site's content as read-only files, made from src/data at the
// moment the terminal opens. Nothing here is written by hand except the layout of the files: a
// project's file says what its page says, the background file what the background section says.
import { hero, routes, shell, stream, ui, type Lang } from '../data/site';
import { planned, projects, type Project } from '../data/projects';
import { commits, extras } from '../data/background';
import { skills } from '../data/skills';
import { posts, postUrl } from '../data/writing';

export type File = { kind: 'file'; text: string; href?: string; exec?: string };
export type Dir = { kind: 'dir'; children: Map<string, Node>; href?: string };
export type Node = File | Dir;

export const HOME = '/home/camil';

const file = (text: string, more: Omit<File, 'kind' | 'text'> = {}): File => ({ kind: 'file', text, ...more });
const dir = (entries: [string, Node][], href?: string): Dir => ({ kind: 'dir', children: new Map(entries), href });

export function buildFs(lang: Lang, commands: string[]): Dir {
  const t = <V>(x: { fr: V; en: V }) => x[lang];
  const L = t(shell.labels);
  const colon = lang === 'fr' ? ' : ' : ': '; // French puts a space before a colon
  const F = t(shell.files);
  const home = routes.home[lang];
  const anchor = (fr: string, en: string) => `${home}#${lang === 'fr' ? fr : en}`;

  const project = (p: Project): [string, Node] => {
    const out = [`# ${t(p.name)}`, '', `${L.status}${colon}${t(ui.status[p.status])} · ${t(p.where)}`, '', t(p.line)];
    if (p.page) {
      out.push('', t(p.page.lead));
      for (const b of p.page.blocks) out.push('', `## ${t(b.h)}`, ...b.items.map((i) => `- ${t(i)}`));
      out.push('', `${L.stack}${colon}${p.page.stack.join(', ')}`, `${L.limit}${colon}${t(p.page.limit)}`);
      if (p.page.links?.length) out.push(`${L.links}${colon.trimEnd()}`, ...p.page.links.map((l) => `  ${t(l.label)}${colon}${l.href.replace('{lang}', lang === 'fr' ? 'fr/' : '')}`));
    }
    if (p.href) out.push(`${L.code}${colon}${p.href}`);
    const href = p.page ? `${routes.project[lang]}${p.slug}/` : undefined;
    if (href) out.push(`${L.page}${colon}https://camilbenameur.com${href}`);
    return [`${p.slug}.md`, file(out.join('\n'), { href })];
  };

  const background = [
    ...commits.flatMap((c) => [`## ${t(c.role)} · ${t(c.org)}`, t(c.when), t(c.text), '']),
    `## ${t(extras.languages.label)}`, t(extras.languages.text), '',
    `## ${t(extras.certs.label)}`, t(extras.certs.text),
  ].join('\n');

  const skillFiles = skills.map((g, i): [string, Node] => {
    const rows = g.rows.map((r) => `${t(r.key)}: ${Array.isArray(r.values) ? r.values.join(', ') : t(r.values)}`);
    return [F.skillFiles[i], file([`# ${t(g.title)}`, '', ...(g.note ? [t(g.note), ''] : []), ...rows].join('\n'))];
  });

  const writing = posts.map((p): [string, Node] => {
    const url = postUrl(p.slug, lang);
    const out = [`# ${t(p.title)}`, t(p.date.label), '', t(p.line), '', url];
    if (p.corrected) out.splice(2, 0, `${L.corrected} ${t(p.corrected.label)}`);
    return [`${p.slug}.md`, file(out.join('\n'), { href: url })];
  });

  // profil.json: the hero's JSON, whole and valid (its slots with their first value), for jq and stream.
  const json: Record<string, unknown> = { ...(stream[lang] as Record<string, unknown>) };
  for (const s of stream.slots[lang]) json[s.key] = s.values[0];

  const readme = [
    '# Camil Benameur',
    t(shell.whoami),
    '',
    t(hero.lead),
    '',
    t(shell.readme.intro),
    ...t(shell.readme.files).map(([n, d]) => `  ${n.padEnd(15)} ${d}`),
    '',
    t(shell.readme.try),
  ].join('\n');

  const camil = dir([
    ['README.md', file(readme, { href: home })],
    [F.profile, file(JSON.stringify(json, null, 2), { href: home })],
    ['contact.sh', file(`#!/bin/sh\n# ${L.contact}\nopen ${anchor('contact', 'contact')}`, { exec: 'contact', href: anchor('contact', 'contact') })],
    ['.plan', file([L.plan, ...planned.map((p) => `- ${t(p.text)}`)].join('\n'))],
    ['.bashrc', file([`# ~/.bashrc, ${L.bashrc}`, "alias ll='ls -la'", "alias la='ls -a'", "alias l='ls -1'", "alias ..='cd ..'"].join('\n'))],
    [F.work, dir(projects.map(project), anchor('realisations', 'work'))],
    [F.background, file(background, { href: anchor('parcours', 'background') })],
    [F.skills, dir(skillFiles, anchor('competences', 'skills'))],
    [F.writing, dir(writing, anchor('ecrits', 'writing'))],
  ]);

  return dir([
    ['home', dir([['camil', camil]])],
    ['etc', dir([['hostname', file('lyon')]])],
    ['usr', dir([['bin', dir(commands.map((c): [string, Node] => [c, file(`${L.builtin}${colon}${c}`)]))]])],
    ['tmp', dir([])],
  ]);
}

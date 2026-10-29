// camsh, the terminal's shell. A line is split into words (quotes, escapes, $VARS, ~, wildcards),
// then into pipelines (| ; && ||); each command is a function of its arguments and of the text piped
// into it. Output lines are made of segments, so the same output is coloured on screen and passed as
// plain text through a pipe. The file system is read-only (fs.ts); state (folder, history, aliases)
// lives in this module, so it survives page changes.
import { gsap } from 'gsap';
import { commits, head } from '../data/background';
import { nav, routes, shell as S, site, stream as streamData, type Lang } from '../data/site';
import { anchor } from '../i18n';
import { heal as healJson, lex } from '../lib/json-heal';
import { buildFs, HOME, type Dir, type Node } from './fs';

export type Seg = { t: string; c?: string; run?: string };
export type Line = Seg[];
export type Io = {
  print: (lines: Line[], kind?: 'out' | 'err' | 'echo') => void;
  live: () => { set: (lines: Line[]) => void };
  clear: () => void;
  go: (href: string) => void;
  close: () => void;
  keys: (on?: boolean) => boolean;
};
type Res = { out?: Line[]; err?: Line[]; code?: number; job?: (live: ReturnType<Io['live']>) => Promise<void> };
type Cmd = (args: string[], stdin: string | null, last: boolean) => Res;

const seg = (t: string, c?: string, run?: string): Seg => ({ t, c, run });
const lines = (text: string, c?: string): Line[] => text.split('\n').map((l) => [seg(l, c)]);
const plain = (out: Line[]) => out.map((l) => l.map((s) => s.t).join('')).join('\n');
const bytes = (s: string) => new TextEncoder().encode(s).length;
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const globRe = (g: string, flags = '') => new RegExp(`^${g.split('').map((c) => (c === '*' ? '[^/]*' : c === '?' ? '[^/]' : escapeRe(c))).join('')}$`, flags);
const SIZES = [3, 5, 2, 4, 6, 3, 4, 2, 5];

// JSON on screen: the hero's colours. Other text: titles stand out and web addresses open on a tap.
function colour(text: string): Line[] {
  if (!/^\s*[[{]/.test(text)) {
    return text.split('\n').map((l) => {
      if (/^#{1,3} /.test(l)) return [seg(l, 'h')];
      return l.split(/(https:\/\/\S+)/).filter(Boolean).map((part) => (part.startsWith('https://') ? seg(part, 'link', `open ${part}`) : seg(part)));
    });
  }
  const cls = { k: 'key', s: 'str', n: 'num', p: 'punct' } as const;
  return text.split('\n').map((l) => lex(l).map((t) => seg(t.t, t.open ? 'cut' : cls[t.k])));
}

type State = { cwd: string; old: string; env: Record<string, string>; aliases: Record<string, string>; history: string[]; code: number };
const states: Partial<Record<Lang, State>> = {};
const started = performance.now();

export function createShell(lang: Lang, io: Io, built = document.lastModified) {
  const t = <V>(x: { fr: V; en: V }) => x[lang];
  const M = t(S.msg);
  const colon = lang === 'fr' ? ' : ' : ': '; // French puts a space before a colon
  const sections = Object.fromEntries(nav.map((s) => [anchor(s, lang), `${routes.home[lang]}#${anchor(s, lang)}`]));
  const links: Record<string, string> = { github: site.links.github, linkedin: site.links.linkedin, blog: t(site.links.blog) };
  const st = (states[lang] ??= {
    cwd: HOME,
    old: HOME,
    env: { USER: 'camil', HOME, SHELL: '/bin/camsh', HOSTNAME: 'lyon', LANG: lang === 'fr' ? 'fr_FR.UTF-8' : 'en_GB.UTF-8', PATH: '/usr/bin', TERM: 'xterm-256color' },
    aliases: { ll: 'ls -la', la: 'ls -a', l: 'ls -1', '..': 'cd ..' },
    history: [],
    code: 0,
  });
  let stop: (() => void) | null = null; // interrupts the running stream (Ctrl+C)

  const err = (text: string, code = 1): Res => ({ err: lines(text), code });
  const shown = (abs: string) => (abs === HOME ? '~' : abs.startsWith(`${HOME}/`) ? `~${abs.slice(HOME.length)}` : abs);
  const norm = (p: string) => {
    const parts: string[] = [];
    for (const x of (p.startsWith('/') ? p : `${st.cwd}/${p}`).split('/')) {
      if (!x || x === '.') continue;
      if (x === '..') parts.pop(); else parts.push(x);
    }
    return `/${parts.join('/')}`;
  };
  // the commands, then the file system (it lists them in /usr/bin)
  const cmds: Record<string, Cmd> = {};
  let root: Dir;
  const get = (abs: string): Node | null => {
    let n: Node = root;
    for (const x of abs.split('/').filter(Boolean)) {
      if (n.kind !== 'dir') return null;
      const c = n.children.get(x);
      if (!c) return null;
      n = c;
    }
    return n;
  };
  const names = (d: Dir, all = false) => [...d.children.keys()].filter((n) => all || !n.startsWith('.')).sort((a, b) => a.localeCompare(b));
  const join = (base: string, name: string) => (base === '.' ? name : `${base.replace(/\/$/, '')}/${name}`);
  const read = (cmd: string, p: string): { text: string } | { error: Res } => {
    const n = get(norm(p));
    if (!n) return { error: err(`${cmd}: ${p}: ${M.noFile}`) };
    if (n.kind === 'dir') return { error: err(`${cmd}: ${p}: ${M.isDir}`) };
    return { text: n.text };
  };
  // the files a command reads: its arguments, or what was piped into it
  const inputs = (cmd: string, files: string[], stdin: string | null) => {
    const out: { name: string | null; text: string }[] = [];
    const errs: Line[] = [];
    if (!files.length) {
      if (stdin === null) return { out, errs: lines(`${cmd}: ${M.noInput}`) };
      out.push({ name: null, text: stdin });
    }
    for (const f of files) {
      const r = read(cmd, f);
      if ('error' in r) errs.push(...r.error.err!); else out.push({ name: f, text: r.text });
    }
    return { out, errs };
  };
  // -abc flags and "-n 5" values; the rest are operands
  const flags = (args: string[], withValue = '') => {
    const set = new Set<string>();
    const val: Record<string, string> = {};
    const rest: string[] = [];
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a.startsWith('--')) { const [k, v] = a.slice(2).split('='); set.add(k); if (v !== undefined) val[k] = v; continue; }
      if (/^-\d+$/.test(a)) { val.n = a.slice(1); continue; }
      if (a.startsWith('-') && a.length > 1) {
        for (const c of a.slice(1)) {
          if (withValue.includes(c)) { val[c] = args[++i] ?? ''; break; }
          set.add(c);
        }
        continue;
      }
      rest.push(a);
    }
    return { has: (k: string) => set.has(k), val, rest };
  };
  const entry = (base: string, name: string, n: Node): Seg => {
    const p = join(base, name);
    if (n.kind === 'dir') return seg(name, 'dir', `ls ${p}`);
    return seg(name, n.exec ? 'exec' : undefined, n.exec ? `./${p}` : `cat ${p}`);
  };
  const date = new Date(built); // ls -l: when the site was built
  const stamp = `${date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: '2-digit', month: 'short' })} ${date.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  const long = (n: Node, s: Seg): Line => {
    const mode = n.kind === 'dir' ? 'dr-xr-xr-x' : n.exec ? '-r-xr-xr-x' : '-r--r--r--';
    const size = n.kind === 'dir' ? 4096 : bytes(n.text);
    return [seg(`${mode} 1 camil camil ${String(size).padStart(5)} ${stamp} `, 'muted'), s];
  };
  const uptime = () => Math.max(1, Math.round((performance.now() - started) / 60000));

  Object.assign(cmds, {
    help: () => ({ out: [...t(S.help).map(([k, v]) => [seg(k.padEnd(28), 'key'), seg(` ${v}`)]), [], [seg(t(S.helpFoot), 'muted')]] }),
    ls: (args) => {
      const f = flags(args);
      const all = f.has('a');
      const targets = f.rest.length ? f.rest : ['.'];
      const out: Line[] = [];
      const errs: Line[] = [];
      targets.forEach((p, i) => {
        const n = get(norm(p));
        if (!n) return errs.push(...lines(`ls: ${M.access} '${p}': ${M.noFile}`));
        if (n.kind === 'file') return out.push(f.has('l') ? long(n, entry('.', p, n)) : [entry('.', p, n)]);
        if (targets.length > 1) out.push(...(i ? [[]] : []), [seg(`${p}:`)]);
        const items: [string, Node][] = names(n, all).map((name) => [name, n.children.get(name)!]);
        if (all) items.unshift(['.', n], ['..', get(norm(`${p}/..`))!]);
        if (f.has('l')) {
          out.push([seg(`total ${items.length * 4}`, 'muted')]);
          for (const [name, c] of items) out.push(long(c, entry(p, name, c)));
        } else if (f.has('1')) {
          for (const [name, c] of items) out.push([entry(p, name, c)]);
        } else {
          out.push(items.flatMap(([name, c], j) => [...(j ? [seg('  ')] : []), entry(p, name, c)]));
        }
      });
      return { out, err: errs, code: errs.length ? 2 : 0 };
    },
    cd: (args) => {
      const p = args[0] === '-' ? st.old : args[0] ?? HOME;
      const abs = norm(p);
      const n = get(abs);
      if (!n) return err(`cd: ${p}: ${M.noFile}`);
      if (n.kind !== 'dir') return err(`cd: ${p}: ${M.notDir}`);
      st.old = st.cwd;
      st.cwd = abs;
      st.env.PWD = abs;
      return { out: args[0] === '-' ? lines(shown(abs)) : [] };
    },
    pwd: () => ({ out: lines(st.cwd) }),
    cat: (args, stdin) => {
      const f = flags(args);
      const { out, errs } = inputs('cat', f.rest, stdin);
      const text = out.map((o) => o.text).join('\n');
      const res = f.has('n') ? text.split('\n').map((l, i) => [seg(`${String(i + 1).padStart(6)}  `, 'muted'), seg(l)]) : colour(text);
      return { out: out.length ? res : [], err: errs, code: errs.length ? 1 : 0 };
    },
    head: (args, stdin) => cut('head', args, stdin, (ls, n) => ls.slice(0, n)),
    tail: (args, stdin) => cut('tail', args, stdin, (ls, n) => ls.slice(-n)),
    wc: (args, stdin) => {
      const f = flags(args);
      const { out, errs } = inputs('wc', f.rest, stdin);
      const pick = ['l', 'w', 'c'].filter((k) => f.has(k));
      const cols = pick.length ? pick : ['l', 'w', 'c'];
      const total: Record<string, number> = { l: 0, w: 0, c: 0 };
      const row = (v: Record<string, number>, name: string | null) => [seg(`${cols.map((k) => String(v[k]).padStart(cols.length > 1 ? 6 : 1)).join(' ')}${name ? ` ${name}` : ''}`)];
      const res = out.map(({ name, text }) => {
        const v: Record<string, number> = { l: (text.match(/\n/g) ?? []).length + (text && !text.endsWith('\n') ? 1 : 0), w: text.split(/\s+/).filter(Boolean).length, c: bytes(text) };
        for (const k of cols) total[k] += v[k];
        return row(v, name);
      });
      if (out.length > 1) res.push(row(total, 'total'));
      return { out: res, err: errs, code: errs.length ? 1 : 0 };
    },
    grep: (args, stdin) => {
      const f = flags(args);
      const [pattern, ...paths] = f.rest;
      if (pattern === undefined) return err(lang === 'fr' ? 'Utilisation : grep [-i] [-r] [-n] [-v] [-c] [-l] MOTIF [FICHIER]...' : 'Usage: grep [-i] [-r] [-n] [-v] [-c] [-l] PATTERN [FILE]...', 2);
      let re: RegExp;
      try { re = new RegExp(pattern, f.has('i') ? 'gi' : 'g'); } catch { re = new RegExp(escapeRe(pattern), f.has('i') ? 'gi' : 'g'); }
      const sources: { name: string | null; text: string }[] = [];
      const errs: Line[] = [];
      const walk = (p: string, n: Node) => {
        if (n.kind === 'file') return void sources.push({ name: p, text: n.text });
        if (!f.has('r')) return void errs.push(...lines(`grep: ${p}: ${M.isDir}`));
        for (const name of names(n, true)) walk(join(p, name), n.children.get(name)!);
      };
      if (!paths.length && (f.has('r') || stdin === null)) paths.push('.');
      if (!paths.length) sources.push({ name: null, text: stdin ?? '' });
      for (const p of paths) {
        const n = get(norm(p));
        if (!n) errs.push(...lines(`grep: ${p}: ${M.noFile}`)); else walk(p, n);
      }
      const many = sources.length > 1 || f.has('r');
      const out: Line[] = [];
      for (const s of sources) {
        let count = 0;
        s.text.split('\n').forEach((l, i) => {
          re.lastIndex = 0;
          if (re.test(l) === f.has('v')) return;
          count++;
          if (f.has('c') || f.has('l')) return;
          const line: Line = [];
          if (many && s.name) line.push(seg(s.name, 'file', `cat ${s.name}`), seg(':', 'muted'));
          if (f.has('n')) line.push(seg(String(i + 1), 'num'), seg(':', 'muted'));
          let at = 0;
          if (!f.has('v')) for (const m of l.matchAll(re)) { if (!m[0]) break; line.push(seg(l.slice(at, m.index)), seg(m[0], 'match')); at = m.index! + m[0].length; }
          line.push(seg(l.slice(at)));
          out.push(line);
        });
        if (f.has('c')) out.push([...(many && s.name ? [seg(s.name, 'file'), seg(':', 'muted')] : []), seg(String(count))]);
        else if (f.has('l') && count && s.name) out.push([seg(s.name, 'file', `cat ${s.name}`)]);
      }
      return { out, err: errs, code: errs.length ? 2 : out.length ? 0 : 1 };
    },
    find: (args) => {
      const paths: string[] = [];
      let name: RegExp | null = null;
      let type = '';
      for (let i = 0; i < args.length; i++) {
        if (args[i] === '-name' || args[i] === '-iname') { name = globRe(args[++i] ?? '*', args[i - 1] === '-iname' ? 'i' : ''); continue; }
        if (args[i] === '-type') { type = args[++i] ?? ''; continue; }
        paths.push(args[i]);
      }
      const out: Line[] = [];
      const errs: Line[] = [];
      const walk = (p: string, n: Node, base: string) => {
        if ((!name || name.test(base)) && (!type || (type === 'd') === (n.kind === 'dir'))) out.push([n.kind === 'dir' ? seg(p, 'dir', `ls ${p}`) : seg(p, undefined, `cat ${p}`)]);
        if (n.kind === 'dir') for (const c of names(n, true)) walk(`${p.replace(/\/$/, '')}/${c}`, n.children.get(c)!, c);
      };
      for (const p of paths.length ? paths : ['.']) {
        const n = get(norm(p));
        if (!n) errs.push(...lines(`find: '${p}': ${M.noFile}`)); else walk(p, n, p.split('/').pop() || p);
      }
      return { out, err: errs, code: errs.length ? 1 : 0 };
    },
    tree: (args) => {
      const f = flags(args);
      const p = f.rest[0] ?? '.';
      const n = get(norm(p));
      if (!n) return err(`tree: ${p}: ${M.noFile}`);
      if (n.kind !== 'dir') return { out: [[seg(p)]] };
      const out: Line[] = [[seg(p, 'dir')]];
      let d = 0;
      let fl = 0;
      const walk = (dir: Dir, prefix: string, base: string) => {
        const items = names(dir, f.has('a'));
        items.forEach((name, i) => {
          const c = dir.children.get(name)!;
          const end = i === items.length - 1;
          out.push([seg(`${prefix}${end ? '└── ' : '├── '}`, 'muted'), entry(base, name, c)]);
          if (c.kind === 'dir') { d++; walk(c, `${prefix}${end ? '    ' : '│   '}`, join(base, name)); } else fl++;
        });
      };
      walk(n, '', p);
      out.push([], [seg(`${d} ${M.dirs}, ${fl} ${M.filesN}`)]);
      return { out };
    },
    echo: (args) => ({ out: lines(args.filter((a, i) => !(i === 0 && a === '-n')).join(' ')) }),
    env: () => ({ out: Object.entries(st.env).map(([k, v]) => [seg(k, 'key'), seg(`=${v}`)]) }),
    printenv: (args) => (args.length ? { out: args.filter((a) => a in st.env).map((a) => [seg(st.env[a])]), code: args.every((a) => a in st.env) ? 0 : 1 } : cmds.env([], null, true)),
    export: (args) => {
      if (!args.length) return { out: Object.entries(st.env).map(([k, v]) => [seg(`declare -x ${k}="${v}"`)]) };
      for (const a of args) { const i = a.indexOf('='); if (i > 0) st.env[a.slice(0, i)] = a.slice(i + 1); }
      return {};
    },
    alias: (args) => {
      if (!args.length) return { out: Object.entries(st.aliases).map(([k, v]) => [seg(`alias ${k}='${v}'`)]) };
      const out: Line[] = [];
      for (const a of args) {
        const i = a.indexOf('=');
        if (i > 0) st.aliases[a.slice(0, i)] = a.slice(i + 1);
        else if (st.aliases[a]) out.push([seg(`alias ${a}='${st.aliases[a]}'`)]);
      }
      return { out };
    },
    unalias: (args) => { for (const a of args) delete st.aliases[a]; return {}; },
    history: (args) => {
      if (args[0] === '-c') { st.history.length = 0; return {}; }
      return { out: st.history.map((h, i) => [seg(`${String(i + 1).padStart(5)}  `, 'muted'), seg(h, undefined, h)]) };
    },
    which: (args) => {
      const out = args.filter((a) => cmds[a]).map((a) => [seg(`/usr/bin/${a}`)]);
      return { out, code: out.length === args.length && args.length ? 0 : 1 };
    },
    type: (args) => ({
      out: args.map((a) => [seg(st.aliases[a] ? `${a} ${M.alias} '${st.aliases[a]}'` : cmds[a] || sections[a] ? `${a} ${M.builtin}` : `camsh: type: ${a}: ${M.notFound}`)]),
    }),
    man: (args) => {
      if (!args[0]) return err(M.man);
      const hit = t(S.help).filter(([k]) => k.split(/[\s,|[\]]+/).includes(args[0]));
      if (!hit.length) return err(`${M.noMan} ${args[0]}`, 16);
      return { out: [[seg(`${args[0].toUpperCase()}(1)`, 'key')], ...hit.map(([k, v]) => [seg(`    ${k}`, 'str'), seg(`  ${v}`)])] };
    },
    clear: () => { io.clear(); return {}; },
    exit: () => { io.close(); return {}; },
    whoami: () => ({ out: [[seg('camil')], [seg(t(S.whoami), 'muted')]] }),
    id: () => ({ out: lines(`uid=1000(camil) gid=1000(camil) ${lang === 'fr' ? 'groupes' : 'groups'}=1000(camil)`) }),
    hostname: () => ({ out: lines('lyon') }),
    uname: (args) => ({ out: lines(args.includes('-a') ? t(S.uname) : 'camsh') }),
    date: () => ({ out: lines(new Date().toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB', { dateStyle: 'full', timeStyle: 'medium' })) }),
    uptime: () => ({ out: lines(` ${new Date().toLocaleTimeString('fr-FR')} up ${uptime()} min, 1 ${M.user}`) }),
    neofetch: () => {
      const N = t(S.neofetch);
      const d = streamData[lang] as Record<string, unknown>;
      const looking = Object.values(d).find((v) => Array.isArray(v) && typeof v[0] === 'string') as string[];
      const info: [string, string][] = [
        [N.os, 'camsh 1.0 (TypeScript)'], [N.host, N.hostValue], [N.uptime, `${uptime()} min`], [N.shell, 'camsh'],
        [N.role, String(d.role)], [N.place, 'Lyon'], [N.looking, looking.join(', ')],
        [N.langs, (streamData.slots[lang][0].values[0] as string[]).join(', ')], [N.status, t(head)],
      ];
      const art = ['  ┌────────────┐', '  │ >_         │', '  │            │', '  │            │', '  └────────────┘', '', '', '', '', '', ''];
      const rows: Line[] = [[seg('camil', 'user'), seg('@'), seg('lyon', 'host')], [seg('──────────', 'muted')], ...info.map(([k, v]) => [seg(`${k}${colon}`, 'key'), seg(v)])];
      return { out: rows.map((r, i) => [seg(`${(art[i] ?? '').padEnd(20)}`, 'str'), ...r]) };
    },
    open: (args) => {
      const p = args[0];
      if (!p) return err(`open: ${M.missing}`);
      if (/^https?:\/\//.test(p)) { io.go(p); return {}; }
      const n = get(norm(p));
      if (!n) return err(`open: ${p}: ${M.noFile}`);
      if (!n.href) return err(`open: ${p}: ${M.noPage}`);
      io.go(n.href);
      return {};
    },
    git: (args) => {
      const [sub, ...rest] = args;
      const f = flags(rest, 'n');
      const tag = (c: (typeof commits)[number]) => (c.tag ? [seg(' ('), seg(`tag: ${t(c.tag)}`, 'tag'), seg(')')] : []);
      const full = (c: (typeof commits)[number]): Line[] => [
        [seg(`commit ${c.hash}`, 'num'), ...tag(c)], [seg('Author: Camil Benameur')], [seg(`Date:   ${t(c.when)}`)], [],
        [seg(`    ${t(c.role)} · ${t(c.org)}`)], [seg(`    ${t(c.text)}`)], [],
      ];
      if (sub === 'log') {
        const list = commits.slice(0, f.val.n ? Number(f.val.n) : commits.length);
        const top: Line = [seg('HEAD', 'tag'), seg(`  ${t(head)}`, 'muted')];
        if (f.has('oneline')) return { out: [top, ...list.map((c) => [seg(c.hash, 'num', `git show ${c.hash}`), ...tag(c), seg(` ${t(c.role)} · ${t(c.org)}`)])] };
        return { out: [top, [], ...list.flatMap(full)] };
      }
      if (sub === 'show') {
        const c = f.rest[0] ? commits.find((x) => x.hash.startsWith(f.rest[0])) : commits[0];
        return c ? { out: full(c) } : err(`fatal: ${f.rest[0]}: ${M.noFile}`, 128);
      }
      if (sub === 'status') return { out: lines(M.gitStatus) };
      if (sub === 'branch') return { out: [[seg('* '), seg('main', 'str')], [seg('  sri')]] };
      if (!sub) return { out: lines('usage: git log [--oneline] [-n N] | git show [hash] | git status | git branch') };
      return err(`git: '${sub}' ${M.git}`);
    },
    jq: (args, stdin) => {
      const f = flags(args);
      const [filter = '.', file] = f.rest;
      const { out: src, errs } = inputs('jq', file ? [file] : [], stdin);
      if (errs.length) return { err: errs, code: 2 };
      let data: unknown;
      try { data = JSON.parse(src[0].text); } catch { return err('jq: error: invalid JSON (try: heal)', 2); }
      let vals: unknown[] = [data];
      for (const stage of filter.split('|').map((s) => s.trim())) {
        const next = jqStage(stage);
        if (!next) return err(`jq: ${M.jq}: ${stage}`, 3);
        vals = vals.flatMap(next);
      }
      return { out: vals.flatMap((v) => (f.has('r') && typeof v === 'string' ? lines(v) : colour(JSON.stringify(v, null, f.has('c') ? 0 : 2) ?? 'null'))) };
    },
    heal: (args, stdin) => {
      const raw = args.length ? args.join(' ') : stdin;
      if (raw === null || !raw.trim()) return err(`heal: ${M.noInput}`);
      const src = raw.replace(/^\s*```(?:json)?\s*/, '').replace(/\s*```\s*$/, '');
      const h = healJson(src);
      if (h.scan.error >= 0) return err(`heal: ${M.badJson} (${lang === 'fr' ? 'caractère' : 'character'} ${h.scan.error + 1})`);
      try { JSON.parse(h.keep + h.add); } catch { return err(`heal: ${M.badJson}`); }
      if (!h.add && h.keep === src) return { out: [[seg(M.nothing, 'ok')]] };
      const body = colour(h.keep);
      body[body.length - 1].push(seg(h.add, 'heal'));
      const removed = src.slice(h.keep.length).trim();
      return { out: [...body, [seg(`↳ ${M.added}${colon}`, 'muted'), seg(h.add || '∅', 'heal'), ...(removed ? [seg(`, ${M.removed}${colon}`, 'muted'), seg(removed, 'cut')] : []), seg(` ✓ ${M.valid}`, 'ok')]] };
    },
    stream: (args, stdin, last) => {
      const f = flags(args);
      const { out: src, errs } = inputs('stream', f.rest, stdin);
      if (errs.length) return { err: errs, code: 1 };
      const text = src.map((s) => s.text).join('\n');
      const pct = f.has('full') ? 100 : f.val.cut ? Math.min(100, Math.max(1, Number(f.val.cut) || 70)) : 55 + Math.floor(Math.random() * 36);
      const end = Math.floor((text.length * pct) / 100);
      const finish = (n: number, why: string): Line[] => {
        const body = colour(text.slice(0, n));
        const notes: Line[] = n < text.length ? [[seg(`↳ ${why} ${Math.round((n / text.length) * 100)} %`, 'muted')]] : [];
        if (f.has('heal') && n < text.length) {
          const h = healJson(text.slice(0, n));
          let ok = h.scan.error < 0;
          try { JSON.parse(h.keep + h.add); } catch { ok = false; }
          if (ok) {
            body[body.length - 1].push(seg(h.add, 'heal'));
            notes.push([seg(`↳ ${M.added}${colon}`, 'muted'), seg(h.add, 'heal'), seg(` ✓ ${M.valid}`, 'ok')]);
          } else notes.push([seg(`heal: ${M.badJson}`, 'err')]);
        }
        return [...body, ...notes];
      };
      if (!last) return { out: lines(text.slice(0, end) + (f.has('heal') && end < text.length ? healJson(text.slice(0, end)).add : '')) };
      return {
        job: (live) => new Promise<void>((resolve) => {
          if (matchMedia('(prefers-reduced-motion: reduce)').matches) { live.set(finish(end, M.cut)); return resolve(); }
          const sizes: number[] = [];
          for (let n = 0, k = 0; n < end; k++) { const s = SIZES[k % SIZES.length]; sizes.push(s); n += s; }
          const per = Math.min(0.018, 2.4 / Math.max(1, sizes.length));
          const state = { k: 0 };
          let n = 0;
          const done = (why: string) => { tween.kill(); stop = null; live.set(finish(n, why)); resolve(); };
          const tween = gsap.to(state, {
            k: sizes.length, duration: sizes.length * per, ease: 'none',
            onUpdate: () => {
              n = Math.min(end, sizes.slice(0, Math.floor(state.k)).reduce((a, b) => a + b, 0));
              live.set([...colour(text.slice(0, n)).map((l, i, all) => (i === all.length - 1 ? [...l, seg(' ', 'caret')] : l))]);
            },
            onComplete: () => { n = end; done(M.cut); },
          });
          stop = () => done(M.stopped);
        }),
      };
    },
    // links, sections and the rest of the old mini terminal
    github: () => { io.go(links.github); return {}; },
    linkedin: () => { io.go(links.linkedin); return {}; },
    blog: () => { io.go(links.blog); return {}; },
    [lang === 'fr' ? 'en' : 'fr']: () => { io.go(routes.home[lang === 'fr' ? 'en' : 'fr']); return {}; },
    cv: () => ({ out: lines(t(S.cv)) }),
    sudo: () => err(t(S.sudo)),
    [lang === 'fr' ? 'raccourcis' : 'shortcuts']: (args) => {
      if (args[0] === 'on' || args[0] === 'off') { io.keys(args[0] === 'on'); return { out: lines(t(args[0] === 'on' ? S.keysOn : S.keysOff)) }; }
      return { out: lines(`${lang === 'fr' ? 'raccourcis' : 'shortcuts'} on | off (${io.keys() ? 'on' : 'off'})`) };
    },
  } satisfies Record<string, Cmd>);
  for (const c of ['rm', 'rmdir', 'mv', 'cp', 'mkdir', 'touch', 'chmod', 'chown', 'ln', 'tee', 'apt', 'npm', 'pip', 'brew']) cmds[c] = () => err(`${c}: ${M.readOnly}`);
  for (const c of ['vim', 'vi', 'nano', 'emacs']) cmds[c] = () => err(`${c}: ${M.editor}`);
  for (const c of ['curl', 'wget', 'ssh', 'ping', 'nc']) cmds[c] = () => err(`${c}: ${M.noNet}`);
  cmds.logout = cmds.exit;
  cmds.fastfetch = cmds.neofetch;
  root = buildFs(lang, Object.keys(cmds).sort());

  function cut(cmd: string, args: string[], stdin: string | null, pick: (ls: string[], n: number) => string[]): Res {
    const f = flags(args, 'n');
    const n = Math.max(0, Number(f.val.n ?? 10) || 0);
    const { out, errs } = inputs(cmd, f.rest, stdin);
    const res: Line[] = [];
    out.forEach((o, i) => {
      if (out.length > 1) res.push(...(i ? [[]] : []), [seg(`==> ${o.name} <==`, 'muted')]);
      res.push(...colour(pick(o.text.split('\n'), n).join('\n')));
    });
    return { out: res, err: errs, code: errs.length ? 1 : 0 };
  }

  // jq: `.`, `.a.b`, `."a"`, `.[0]`, `.a[]`, `keys`, `length`, joined by `|`
  function jqStage(stage: string): ((v: unknown) => unknown[]) | null {
    if (stage === 'keys') return (v) => [v && typeof v === 'object' ? (Array.isArray(v) ? v.map((_, i) => i) : Object.keys(v)) : null];
    if (stage === 'length') return (v) => [Array.isArray(v) || typeof v === 'string' ? v.length : v && typeof v === 'object' ? Object.keys(v).length : 0];
    if (!stage.startsWith('.')) return null;
    const steps: (string | number | null)[] = [];
    let s = stage === '.' ? '' : stage;
    while (s) {
      let m: RegExpExecArray | null;
      if ((m = /^\.([\p{L}_][\p{L}\p{N}_]*)/u.exec(s))) steps.push(m[1]);
      else if ((m = /^\."([^"]*)"/.exec(s))) steps.push(m[1]);
      else if ((m = /^\.?\[(-?\d+)\]/.exec(s))) steps.push(Number(m[1]));
      else if ((m = /^\.?\[\]/.exec(s))) steps.push(null);
      else return null;
      s = s.slice(m[0].length);
    }
    return (v) => steps.reduce<unknown[]>((vals, step) => vals.flatMap((x) => {
      if (step === null) return Array.isArray(x) ? x : x && typeof x === 'object' ? Object.values(x) : [];
      if (typeof step === 'number') return [Array.isArray(x) ? (x.at(step) ?? null) : null];
      return [x && typeof x === 'object' && !Array.isArray(x) ? ((x as Record<string, unknown>)[step] ?? null) : null];
    }), [v]);
  }

  // A line into its parts joined by ; && ||, outside quotes, and without its comment.
  function split(line: string): { op: string | null; text: string }[] | string {
    const out: { op: string | null; text: string }[] = [];
    let op: string | null = null;
    let start = 0;
    let end = line.length;
    let q: string | null = null;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === '\\' && q === '"') i++; else if (c === q) q = null; continue; }
      if (c === '\\') { i++; continue; }
      if (c === "'" || c === '"') { q = c; continue; }
      if (c === '#' && (i === 0 || /\s/.test(line[i - 1]))) { end = i; break; }
      const two = line.slice(i, i + 2);
      if (c === ';' || two === '&&' || two === '||') {
        out.push({ op, text: line.slice(start, i) });
        op = c === ';' ? ';' : two;
        if (c !== ';') i++;
        start = i + 1;
      }
    }
    if (q) return M.quote;
    out.push({ op, text: line.slice(start, end) });
    return out;
  }

  // One part into a pipeline of commands. Expands quotes, escapes, $VAR, ${VAR}, $?, a leading ~, and
  // marks unquoted * and ? for wildcard expansion.
  type Word = { v: string; glob: boolean };
  type Command = { words: Word[]; redirect?: string };
  function parse(line: string): { op: string | null; cmds: Command[] }[] | string {
    const seq: { op: string | null; cmds: Command[] }[] = [];
    let cmdsNow: Command[] = [];
    let words: Word[] = [];
    let cur: string | null = null;
    let glob = false;
    let redirect: string | undefined;
    let toFile = false;
    let op: string | null = null;
    const dollar = (i: number): [string, number] => {
      if (line[i + 1] === '?') return [String(st.code), 2];
      const m = /^\{(\w+)\}|^(\w+)/.exec(line.slice(i + 1));
      if (!m) return ['$', 1];
      return [st.env[m[1] ?? m[2]] ?? '', m[0].length + 1];
    };
    const endWord = () => {
      if (cur !== null) { if (toFile) { redirect = cur; toFile = false; } else words.push({ v: cur, glob }); }
      cur = null;
      glob = false;
    };
    const endCmd = () => { endWord(); if (words.length || redirect) cmdsNow.push({ words, redirect }); words = []; redirect = undefined; };
    const endPipe = (next: string | null) => { endCmd(); if (cmdsNow.length) seq.push({ op, cmds: cmdsNow }); cmdsNow = []; op = next; };
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === ' ' || c === '\t') { endWord(); continue; }
      if (c === '#' && cur === null) break;
      if (c === '|' && line[i + 1] === '|') { endPipe('||'); i++; continue; }
      if (c === '&' && line[i + 1] === '&') { endPipe('&&'); i++; continue; }
      if (c === '|') { endCmd(); continue; }
      if (c === ';') { endPipe(';'); continue; }
      if (c === '>') { endWord(); toFile = true; if (line[i + 1] === '>') i++; continue; }
      if (c === '~' && cur === null && (i + 1 === line.length || line[i + 1] === '/' || line[i + 1] === ' ')) { cur = HOME; continue; }
      cur ??= '';
      if (c === '\\') { cur += line[++i] ?? ''; continue; }
      if (c === "'") {
        const j = line.indexOf("'", i + 1);
        if (j < 0) return M.quote;
        cur += line.slice(i + 1, j);
        i = j;
        continue;
      }
      if (c === '"') {
        let j = i + 1;
        for (; j < line.length && line[j] !== '"'; j++) {
          if (line[j] === '\\' && '"\\$'.includes(line[j + 1])) { cur += line[++j]; continue; }
          if (line[j] === '$') { const [v, len] = dollar(j); cur += v; j += len - 1; continue; }
          cur += line[j];
        }
        if (j >= line.length) return M.quote;
        i = j;
        continue;
      }
      if (c === '$') { const [v, len] = dollar(i); cur += v; i += len - 1; continue; }
      if (c === '*' || c === '?') glob = true;
      cur += c;
    }
    endPipe(null);
    return seq;
  }

  // Wildcards, against the file system; a pattern that matches nothing stays as typed (like bash).
  function expand(w: Word): string[] {
    if (!w.glob) return [w.v];
    const abs = w.v.startsWith('/');
    const parts = w.v.split('/').filter((p, i) => p || i === 0);
    let found: string[] = [abs ? '' : '.'];
    for (const part of parts.slice(abs ? 1 : 0)) {
      const re = /[*?]/.test(part) ? globRe(part) : null;
      found = found.flatMap((base) => {
        const n = get(norm(base || '/'));
        if (!n || n.kind !== 'dir') return [];
        const kids = re ? names(n, part.startsWith('.')).filter((x) => re.test(x)) : n.children.has(part) || part === '..' || part === '.' ? [part] : [];
        return kids.map((k) => (base === '.' ? k : `${base}/${k}`));
      });
    }
    return found.length ? found.map((p) => (abs && !p.startsWith('/') ? `/${p}` : p)) : [w.v];
  }

  function exec(c: Command, stdin: string | null, last: boolean): Res {
    if (c.redirect) return err(`camsh: ${c.redirect}: ${M.readOnly}`);
    let words = c.words.flatMap(expand);
    const alias = st.aliases[words[0]];
    if (alias) words = [...alias.split(/\s+/), ...words.slice(1)];
    let [name, ...args] = words;
    if (!name) return {};
    if ((name === 'sh' || name === 'bash' || name === 'source') && args[0]) [name, ...args] = [args[0].includes('/') ? args[0] : `./${args[0]}`, ...args.slice(1)];
    if (name.includes('/')) {
      const n = get(norm(name));
      if (!n) return err(`camsh: ${name}: ${M.noFile}`, 127);
      if (n.kind === 'dir') return err(`camsh: ${name}: ${M.isDir}`, 126);
      if (!n.exec) return err(`camsh: ${name}: ${lang === 'fr' ? 'Permission non accordée' : 'Permission denied'}`, 126);
      io.go(sections[n.exec] ?? routes.home[lang]);
      return {};
    }
    if (cmds[name]) return cmds[name](args, stdin, last);
    if (sections[name]) { io.go(sections[name]); return {}; }
    return err(`${name}: ${M.notFound}`, 127);
  }

  const prompt = (): Line => [seg('camil', 'user'), seg('@'), seg('lyon', 'host'), seg(`:${shown(st.cwd)}$ `)];

  async function run(input: string) {
    let line = input;
    if (line.includes('!!')) line = line.replaceAll('!!', st.history[st.history.length - 1] ?? '');
    io.print([[...prompt(), seg(input)]], 'echo');
    if (line !== input) io.print(lines(line), 'out');
    if (!line.trim()) return;
    if (st.history[st.history.length - 1] !== line) st.history.push(line);
    const parts = split(line);
    if (typeof parts === 'string') { io.print(lines(`camsh: ${parts}`), 'err'); st.code = 2; return; }
    for (const { op, text } of parts) {
      if ((op === '&&' && st.code !== 0) || (op === '||' && st.code === 0)) continue;
      // each part is expanded when its turn comes, so $? and $PWD see what ran before it
      const parsed = parse(text);
      if (typeof parsed === 'string') { io.print(lines(`camsh: ${parsed}`), 'err'); st.code = 2; return; }
      const pipeline = parsed[0]?.cmds ?? [];
      let stdin: string | null = null;
      for (const [i, c] of pipeline.entries()) {
        const last = i === pipeline.length - 1;
        const r = exec(c, stdin, last);
        if (r.err?.length) io.print(r.err, 'err');
        st.code = r.code ?? 0;
        if (r.job) { await r.job(io.live()); continue; }
        if (last) { if (r.out?.length) io.print(r.out); } else stdin = plain(r.out ?? []);
      }
    }
  }

  // Tab: complete a command name (first word) or a path; several matches are listed.
  function complete(line: string): { line: string; options?: string[] } {
    const word = /(\S*)$/.exec(line)![1];
    const before = line.slice(0, line.length - word.length);
    if (!before.trim() || /[|;&]\s*$/.test(before)) {
      if (!word.includes('/')) return pick(before, '', word, [...Object.keys(cmds), ...Object.keys(st.aliases), ...Object.keys(sections)], () => false);
    }
    const slash = word.lastIndexOf('/');
    const dirPart = word.slice(0, slash + 1);
    const base = word.slice(slash + 1);
    const n = get(norm((dirPart || '.').replace(/^~(?=\/|$)/, HOME)));
    if (!n || n.kind !== 'dir') return { line };
    return pick(before, dirPart, base, names(n, base.startsWith('.')), (x) => n.children.get(x)?.kind === 'dir');
  }
  function pick(before: string, dirPart: string, base: string, all: string[], isDir: (x: string) => boolean) {
    const hits = [...new Set(all)].filter((x) => x.startsWith(base)).sort();
    if (!hits.length) return { line: before + dirPart + base };
    if (hits.length === 1) return { line: before + dirPart + hits[0] + (isDir(hits[0]) ? '/' : ' ') };
    let common = hits[0];
    for (const h of hits) while (!h.startsWith(common)) common = common.slice(0, -1);
    return { line: before + dirPart + common, options: common.length > base.length ? undefined : hits.map((h) => h + (isDir(h) ? '/' : '')) };
  }

  return {
    run,
    complete,
    prompt,
    history: () => st.history,
    interrupt: () => { if (stop) { stop(); return true; } return false; },
    busy: () => stop !== null,
  };
}

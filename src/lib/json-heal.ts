// A small JSON healer, in the spirit of go-llm-stream's: given text cut in the middle, say what it
// needs to parse again (close the open string, complete a cut literal, drop a trailing comma, close
// the containers). Not a port of the library: the hero's display comes first. Used by the hero stream
// (motion/stream.ts, components/Stream.astro) and by the terminal's `heal` command.

export type Frame = { ch: '{' | '['; at: number };
export type Scan = {
  stack: Frame[];                                   // containers still open, outermost first
  str: { at: number; key: boolean } | null;         // a string left open at the end
  word: { at: number; text: string } | null;        // a literal or number the end cut into
  expect: 'key' | 'colon' | 'value' | 'next' | 'done';
  comma: number;                                    // index of a trailing comma, or -1
  error: number;                                    // index of the first character that is not JSON, or -1
};

const space = (c: string) => c === ' ' || c === '\n' || c === '\t' || c === '\r';

export function scan(src: string): Scan {
  type F = Frame & { state: 'key' | 'colon' | 'value' | 'next' };
  const stack: F[] = [];
  let top: 'value' | 'done' = 'value';
  let error = -1;
  const fail = (i: number) => { if (error < 0) error = i; };
  const expect = () => stack[stack.length - 1]?.state ?? top;
  const valueDone = () => { const f = stack[stack.length - 1]; if (f) f.state = 'next'; else top = 'done'; };
  const out = (str: Scan['str'], word: Scan['word']): Scan => {
    const t = src.trimEnd();
    return { stack: stack.map(({ ch, at }) => ({ ch, at })), str, word, expect: expect(), comma: !str && t.endsWith(',') ? t.length - 1 : -1, error };
  };
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (space(c)) { i++; continue; }
    const e = expect();
    if (c === '"') {
      const at = i++;
      let closed = false;
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i++] === '"') { closed = true; break; }
      }
      if (!closed) { if (e !== 'key' && e !== 'value') fail(at); return out({ at, key: e === 'key' }, null); }
      if (e === 'key') stack[stack.length - 1].state = 'colon';
      else if (e === 'value') valueDone();
      else fail(at);
      continue;
    }
    if (c === '{' || c === '[') {
      if (e !== 'value') fail(i);
      stack.push({ ch: c, at: i, state: c === '{' ? 'key' : 'value' });
      i++;
      continue;
    }
    if (c === '}' || c === ']') {
      const f = stack.pop();
      if (!f || (f.ch === '{') !== (c === '}')) fail(i);
      valueDone();
      i++;
      continue;
    }
    if (c === ':') { if (e === 'colon') stack[stack.length - 1].state = 'value'; else fail(i); i++; continue; }
    if (c === ',') {
      const f = stack[stack.length - 1];
      if (e === 'next' && f) f.state = f.ch === '{' ? 'key' : 'value'; else fail(i);
      i++;
      continue;
    }
    const m = /^(?:-?[0-9][0-9.eE+-]*|-|[a-z]+)/.exec(src.slice(i));
    if (!m) { fail(i); i++; continue; }
    const at = i;
    i += m[0].length;
    if (e !== 'value') fail(at);
    if (i === src.length) return out(null, { at, text: m[0] });
    if (!/^(?:true|false|null|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)$/.test(m[0])) fail(at);
    valueDone();
  }
  return out(null, null);
}

export type Healed = { keep: string; add: string; scan: Scan };

// What to keep of `src` and what to append so that it parses. `keep` only differs from `src` when a
// trailing comma or a half-written number has to go.
export function heal(src: string): Healed {
  const s = scan(src);
  let keep = src;
  let add = '';
  if (s.str) {
    add = s.str.key ? '": null' : '"';
  } else if (s.word) {
    const w = s.word.text;
    const lit = ['true', 'false', 'null'].find((x) => x.startsWith(w));
    if (lit) add = lit.slice(w.length);
    else if (/[0-9]/.test(w)) keep = src.slice(0, s.word.at) + w.replace(/[-+.eE]+$/, '');
    else { keep = src.slice(0, s.word.at); add = 'null'; } // a lone "-"
  } else if (s.comma >= 0) {
    keep = src.slice(0, s.comma);
  } else if (s.expect === 'colon') {
    add = ': null';
  } else if (s.expect === 'value' && s.stack.length && s.stack[s.stack.length - 1].ch === '{') {
    add = 'null'; // after "key":
  }
  for (let i = s.stack.length - 1; i >= 0; i--) add += s.stack[i].ch === '{' ? '}' : ']';
  return { keep, add, scan: s };
}

// The hero's slots are lines `"key": value` inside the root object. What the healer appends to one cut
// after `prefix`: the closing characters of its own line (with a space before a brace, the way the
// line is written), plus the root's brace when `root` is set.
export function lineClosers(prefix: string, root: boolean): string {
  const add = heal(`{${prefix}`).add.slice(0, -1);
  return add.replace(/}/g, ' }') + (root ? '}' : '');
}

// Coloured tokens for a JSON fragment: k (key), s (string), n (number or literal), p (punctuation).
// Brackets are tokens of their own, so a healed bracket can light up the one it closes.
export type Tok = { k: 'k' | 's' | 'n' | 'p'; t: string; at: number; open?: boolean };

export function lex(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  const punct = (t: string, at: number) => {
    const last = toks[toks.length - 1];
    if (last && last.k === 'p' && !'{}[]'.includes(last.t) && !'{}[]'.includes(t)) last.t += t;
    else toks.push({ k: 'p', t, at });
  };
  while (i < src.length) {
    const c = src[i];
    if (c === '"') {
      const at = i++;
      let open = true;
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i++] === '"') { open = false; break; }
      }
      let j = i;
      while (j < src.length && space(src[j])) j++;
      toks.push({ k: !open && src[j] === ':' ? 'k' : 's', t: src.slice(at, i), at, open: open || undefined });
      continue;
    }
    const m = /^(?:-?[0-9][0-9.eE+-]*|[a-z]+)/.exec(src.slice(i));
    if (m) { toks.push({ k: 'n', t: m[0], at: i }); i += m[0].length; continue; }
    punct(c, i);
    i++;
  }
  return toks;
}

// One JSON value laid out on one line, the way the hero writes it: `["a", "b"]`, `{ "k": "v" }`.
export function inline(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(inline).join(', ')}]`;
  if (v && typeof v === 'object') return `{ ${Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${inline(x)}`).join(', ')} }`;
  return JSON.stringify(v);
}

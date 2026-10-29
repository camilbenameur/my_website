// The signature: the hero's JSON arrives chunk by chunk, each field's check lights when the field is
// complete, the stream is cut and the healer's closing characters appear. One GSAP tween drives a
// single counter (the one clock); every visual reads it. The final state is already in the HTML, so
// reduced motion simply skips this. The replay button plays it again.
// At rest, the last lines (the slots) keep streaming, each on its own rhythm, so several write at
// once: a line erases its value, streams another true one, stops in the middle of a word (or right
// after it) and is healed; each added character lights up with the bracket or quote it closes.
// Off screen, on a hidden tab and after « pause », it all stops (WCAG 2.2.2), and so do the cursors.
import { gsap } from 'gsap';
import { onPage, prefersReducedMotion } from '../engine';
import { lex, lineClosers, scan } from '../lib/json-heal';

type SlotDef = { texts: string[]; from: number; stop: number; narrow: number[]; root: boolean; comma: boolean };
type State = 'typing' | 'cut' | 'healed';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const HOLD = [3.4, 4.3, 2.9, 5]; // seconds a healed line stays, per slot, so the slots drift apart
const SIZES = [3, 1, 4, 2, 3, 5, 2]; // characters per chunk while a slot streams
const phone = matchMedia('(max-width: 599px)'); // the breakpoint of .slot__size--narrow in Stream.astro

// Where a line stops this time: mostly inside its last word, sometimes inside an earlier one,
// sometimes right after the last one (then only brackets are missing).
function pickStop(text: string, from: number): number {
  const words = lex(text).filter((t) => t.k === 's' && t.at >= from);
  const r = Math.random();
  const w = r < 0.2 && words.length > 1 ? words[Math.floor(Math.random() * (words.length - 1))] : words[words.length - 1];
  if (r >= 0.2 && r < 0.38) return w.at + w.t.length;
  const len = w.t.length - 2;
  return w.at + 1 + (len <= 2 ? 1 : 2 + Math.floor(Math.random() * (len - 2)));
}

// One slot line, `n` characters into `text`.
function paint(def: SlotDef, text: string, n: number, state: State): string {
  const prefix = text.slice(0, n);
  const healed = state === 'healed';
  // the brackets of this line still open at the cut: the healer closes them, they light up together
  const open = healed ? scan(`{${prefix}`).stack.slice(1).map((f) => f.at - 1) : [];
  let html = '  ';
  for (const t of lex(prefix)) {
    const pair = healed && (t.open || (t.k === 'p' && open.includes(t.at)));
    html += `<span class="tk ${t.open && state !== 'typing' ? 'cut' : t.k}${pair ? ' pair' : ''}">${esc(t.t)}</span>`;
  }
  if (state === 'typing') html += '<span class="slot__caret"></span>';
  if (healed) {
    html += [...lineClosers(prefix, def.root)].map((c) => (c === ' ' ? c : `<span class="tk heal pair">${c}</span>`)).join('');
    if (def.comma) html += '<span class="tk p">,</span>';
  }
  return html;
}

function slot(el: HTMLElement, def: SlotDef, i: number, rootBrace: HTMLElement | null, running: () => boolean) {
  const live = el.querySelector<HTMLElement>('.slot__live')!;
  const first = [...live.childNodes]; // the chunks of the first stream, put back on replay
  let v = 0;
  let shown = def.stop;
  let tl: gsap.core.Timeline | null = null;
  const set = (text: string, n: number, state: State) => { live.innerHTML = paint(def, text, n, state); };

  const cycle = (wait: number) => {
    const cur = def.texts[v];
    // on phones, only the values short enough for one line (the room the HTML reserves there)
    const pool = phone.matches ? def.narrow : def.texts.map((_, j) => j);
    const nv = pool[(pool.indexOf(v) + 1) % pool.length];
    const next = def.texts[nv];
    const stop = pickStop(next, def.from);
    tl = gsap.timeline({ paused: !running(), onComplete: () => { v = nv; shown = stop; cycle(HOLD[i % HOLD.length] + Math.random() * 0.8); } });
    let t = wait;
    for (let n = shown; n > def.from; t += 0.026) { n = Math.max(def.from, n - 2); tl.call(set, [cur, n, 'typing'], t); }
    t += 0.35;
    for (let n = def.from, k = i; n < stop; k++, t += 0.065) { n = Math.min(stop, n + SIZES[k % SIZES.length]); tl.call(set, [next, n, 'typing'], t); }
    tl.call(set, [next, stop, 'cut'], t);
    tl.call(set, [next, stop, 'healed'], t + 0.4);
    if (def.root && rootBrace) {
      tl.call(() => rootBrace.classList.add('pair'), [], t + 0.4);
      tl.call(() => rootBrace.classList.remove('pair'), [], t + 1.5);
    }
  };

  return {
    start: () => { tl?.kill(); cycle(1 + i * 1.3); },
    reset: () => { tl?.kill(); tl = null; v = 0; shown = def.stop; live.replaceChildren(...first); rootBrace?.classList.remove('pair'); },
    sync: (run: boolean) => { tl?.paused(!run); },
  };
}

onPage(() => {
  const root = document.querySelector<HTMLElement>('[data-stream]');
  if (!root || prefersReducedMotion()) return;
  const step = Number(root.dataset.step) || 0.006;
  const chunks = [...root.querySelectorAll<HTMLElement>('.c')];
  const marks = [...root.querySelectorAll<HTMLElement>('.ok')].map((el) => ({ el, at: Number(el.dataset.at) }));
  const heal = [...root.querySelectorAll<HTMLElement>('[data-heal], [data-heal-note]')];
  const lead = document.querySelector<HTMLElement>('[data-stream-mark]');
  const leadAt = Number(root.querySelector<HTMLElement>('[data-mark-lead]')?.dataset.at ?? -1);
  const replay = root.querySelector<HTMLButtonElement>('[data-stream-replay]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-idle-toggle]');
  const html = document.documentElement;
  let tween: gsap.core.Tween | null = null;
  let after: gsap.core.Tween | null = null;
  let visible = true;
  const running = () => visible && !document.hidden && !html.classList.contains('idle-paused');
  const defs = JSON.parse(root.dataset.slots ?? '[]') as SlotDef[];
  const rootBrace = root.querySelector<HTMLElement>('[data-root]');
  const slots = [...root.querySelectorAll<HTMLElement>('[data-slot]')].map((el, i) => slot(el, defs[i], i, rootBrace, running));

  const render = (n: number) => {
    for (let i = 0; i < chunks.length; i++) chunks[i].classList.toggle('on', i < n);
    for (const m of marks) m.el.classList.toggle('on', n > m.at);
    if (lead) lead.classList.toggle('is-marked', leadAt >= 0 && n > leadAt);
  };
  const setHeal = (on: boolean) => heal.forEach((el) => el.classList.toggle('on', on));
  const syncIdle = () => { const run = running(); slots.forEach((s) => s.sync(run)); };

  const play = (delay: number) => {
    tween?.kill();
    after?.kill();
    slots.forEach((s) => s.reset());
    setHeal(false);
    root.classList.add('is-playing');
    const state = { n: 0 };
    render(0);
    tween = gsap.to(state, {
      n: chunks.length,
      duration: chunks.length * step,
      delay,
      ease: 'none',
      onUpdate: () => render(Math.floor(state.n)),
      onComplete: () => {
        render(chunks.length);
        after = gsap.delayedCall(0.12, () => {
          setHeal(true);
          root.classList.remove('is-playing');
          if (replay) replay.hidden = false;
          slots.forEach((s) => s.start());
          syncIdle();
        });
      },
    });
  };

  const onReplay = () => play(0);
  const onToggle = () => {
    const paused = html.classList.toggle('idle-paused');
    toggle!.setAttribute('aria-pressed', String(paused));
    toggle!.textContent = paused ? toggle!.dataset.off! : toggle!.dataset.on!;
    syncIdle();
  };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; syncIdle(); });
  io.observe(root);
  document.addEventListener('visibilitychange', syncIdle);
  if (toggle) toggle.hidden = false; // only where things move (motion on, JS on)
  toggle?.addEventListener('click', onToggle);
  replay?.addEventListener('click', onReplay);
  play(0.25);
  return () => {
    tween?.kill();
    after?.kill();
    slots.forEach((s) => s.reset());
    io.disconnect();
    document.removeEventListener('visibilitychange', syncIdle);
    replay?.removeEventListener('click', onReplay);
    toggle?.removeEventListener('click', onToggle);
    root.classList.remove('is-playing');
  };
});

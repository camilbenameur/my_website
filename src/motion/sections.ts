// « Taper, puis exécuter »: when a section comes into view, its command is typed (a clip-path in
// character steps, CSS in base.css), then its output prints in the hero's language, one gesture per
// section so the six do not repeat each other:
//   row     Réalisations  a `ls -l` line: the name is typed, the status flag lights in three steps, the
//                         columns follow
//   commit  Parcours      `git log`: the hash is typed first, the dot lands, the SRI lane is drawn, then the
//                         text; HEAD arrives after the first commit
//   trow    Compétences   the TOML fills key by key (key typed, then its values); the empty rest of the
//                         left file is vim's `~`
//   todo    En préparation the `- [ ]` boxes print one after the other, a cursor waits on the next line
//   post    Écrits        the row's rule is drawn, the date typed, the title follows
//   form    Contact       the prompts come up one after the other
// Markup: [data-type] on a command, [data-print="kind"] on each element that prints. Hidden starting
// states are written here, in JS (see hide()), and never under reduced motion; only transform, opacity and clip-path move.
// One IntersectionObserver drives all of it (no layout work at load). Rows in view together print
// 70 ms apart. The one scroll-scrubbed sequence: in « Parcours », the git log's line prints in green.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, onPage, prefersReducedMotion } from '../engine';
import './stream';

gsap.registerPlugin(ScrollTrigger);

const CLIP0 = 'inset(0 100% 0 0)';
const CLIP1 = 'inset(0 0% 0 0)';
const $ = (el: Element, s: string) => el.querySelector<HTMLElement>(s);
const $$ = (el: Element, s: string) => [...el.querySelectorAll<HTMLElement>(s)];

const len = (el: Element) => Math.max(2, (el.textContent ?? '').trim().length);
const dur = (n: number) => Math.min(0.5, 0.1 + 0.03 * n);
/** A keystroke run: the clip opens one character at a time. */
const typed = (tl: gsap.core.Timeline, el: HTMLElement, at: number) => {
  const n = len(el);
  tl.to(el, { clipPath: CLIP1, duration: dur(n), ease: `steps(${n})`, clearProps: 'clipPath' }, at);
};
/** Starting states, written without reading anything back: gsap.set reads the computed style of each
 *  element right after the previous write, which made the page recalculate its styles once per element
 *  (about 150 times at load, a long task of 0.6 to 1.2 s on a throttled phone). The tweens parse these
 *  inline values when they play, and clearProps removes them at the end. */
type Hidden = Partial<Record<'opacity' | 'transform' | 'transformOrigin' | 'clipPath', string>>;
const hide = (t: Element | Element[] | HTMLCollection | null, st: Hidden) => {
  const list = t == null ? [] : t instanceof Element ? [t] : [...t];
  for (const el of list) Object.assign((el as HTMLElement).style, st);
};
const rise = (tl: gsap.core.Timeline, t: gsap.TweenTarget, at: number, stagger = 0, d = 0.4) =>
  tl.to(t, { opacity: 1, y: 0, duration: d, ease: ease.out, stagger, clearProps: 'opacity,transform' }, at);

type Printer = { prep: (el: HTMLElement) => void; play: (el: HTMLElement, tl: gsap.core.Timeline) => void };

const printers: Record<string, Printer> = {
  row: {
    prep: (el) => {
      // from 0, not dimmed: a faint flag still counts as text with too little contrast (axe, Lighthouse)
      hide($(el, '.flag'), { opacity: '0' });
      hide($(el, '.ls__name'), { clipPath: CLIP0 });
      hide($$(el, '.ls__line, .ls__where, .ls__go'), { opacity: '0', transform: 'translateX(-6px)' });
    },
    play: (el, tl) => {
      typed(tl, $(el, '.ls__name')!, 0);
      tl.to($(el, '.flag'), { opacity: 1, duration: 0.45, ease: 'steps(3)', clearProps: 'opacity' }, 0.1);
      tl.to($$(el, '.ls__line, .ls__where, .ls__go'), { opacity: 1, x: 0, duration: 0.45, ease: ease.out, stagger: 0.09, clearProps: 'opacity,transform' }, 0.2);
    },
  },
  commit: {
    prep: (el) => {
      hide($(el, '.log__hash'), { clipPath: CLIP0 });
      hide($(el, '.dot'), { opacity: '0', transform: 'scale(0.3)' });
      hide($(el, '.lane'), { transform: 'scaleY(0)', transformOrigin: '50% 0' });
      hide($$(el, '.log__meta time, .log__tag, .log__role, .log__org, .log__text'), { opacity: '0', transform: 'translateY(8px)' });
    },
    play: (el, tl) => {
      typed(tl, $(el, '.log__hash')!, 0);
      tl.to($(el, '.dot'), { scale: 1, opacity: 1, duration: 0.3, ease: ease.out, clearProps: 'opacity,transform' }, 0.15);
      const lane = $(el, '.lane');
      if (lane) tl.to(lane, { scaleY: 1, duration: 0.55, ease: ease.run, clearProps: 'transform' }, 0.2);
      rise(tl, $$(el, '.log__meta time, .log__tag, .log__role, .log__org, .log__text'), 0.3, 0.06);
    },
  },
  head: {
    prep: (el) => {
      hide($(el, '.dot'), { opacity: '0', transform: 'scale(0.3)' });
      hide($(el, '.log__ref'), { clipPath: CLIP0 });
      hide($(el, '.muted'), { opacity: '0' });
    },
    play: (el, tl) => {
      tl.to($(el, '.dot'), { scale: 1, opacity: 1, duration: 0.35, ease: ease.out, clearProps: 'opacity,transform' }, 0.9);
      typed(tl, $(el, '.log__ref')!, 1);
      tl.to($(el, '.muted'), { opacity: 1, duration: 0.4, ease: ease.out, clearProps: 'opacity' }, 1.25);
    },
  },
  table: {
    prep: (el) => {
      hide($(el, '.toml__head'), { clipPath: CLIP0 });
      hide($(el, '.toml__title'), { opacity: '0', transform: 'translateY(6px)' });
    },
    play: (el, tl) => {
      typed(tl, $(el, '.toml__head')!, 0);
      rise(tl, $(el, '.toml__title'), 0.15, 0, 0.35);
    },
  },
  trow: {
    prep: (el) => {
      hide($(el, 'dt'), { clipPath: CLIP0 });
      hide($$(el, 'dd .chips li'), { opacity: '0', transform: 'scale(0.9)', transformOrigin: '0 50%' });
      hide($$(el, 'dd .toml__prose'), { opacity: '0', transform: 'translateY(6px)' });
    },
    play: (el, tl) => {
      typed(tl, $(el, 'dt')!, 0);
      tl.to($$(el, 'dd .chips li'), { opacity: 1, scale: 1, duration: 0.3, ease: ease.out, stagger: 0.04, clearProps: 'opacity,transform' }, 0.2);
      rise(tl, $$(el, 'dd .toml__prose'), 0.2, 0, 0.4);
    },
  },
  fill: {
    prep: (el) => { hide(el.children, { opacity: '0' }); },
    play: (el, tl) => { tl.to(el.children, { opacity: 1, duration: 0.2, ease: 'none', stagger: 0.035, clearProps: 'opacity' }, 0.1); },
  },
  fade: {
    prep: (el) => { hide(el, { opacity: '0', transform: 'translateY(8px)' }); },
    play: (el, tl) => { rise(tl, el, 0); },
  },
  todo: {
    prep: (el) => {
      const items = $$(el, 'li:not(.todo__next)');
      hide(items.map((li) => $(li, '.todo__box')).filter((x): x is HTMLElement => !!x), { clipPath: CLIP0 });
      hide(items.flatMap((li) => $$(li, '.todo__text, .todo__n')), { opacity: '0', transform: 'translateY(6px)' });
      hide($(el, '.todo__next'), { opacity: '0' });
    },
    play: (el, tl) => {
      const items = $$(el, 'li:not(.todo__next)');
      items.forEach((li, i) => {
        const at = i * 0.16;
        typed(tl, $(li, '.todo__box')!, at);
        rise(tl, $$(li, '.todo__text, .todo__n'), at + 0.1, 0.03, 0.35);
      });
      const next = $(el, '.todo__next')!;
      tl.to(next, { opacity: 1, duration: 0.2, ease: 'none', clearProps: 'opacity' }, items.length * 0.16 + 0.15);
      tl.call(() => next.classList.add('is-waiting'));
    },
  },
  post: {
    prep: (el) => {
      hide($(el, '.post__rule'), { transform: 'scaleX(0)', transformOrigin: '0 50%' });
      hide($(el, '.post__date'), { clipPath: CLIP0 });
      hide($$(el, '.post__main, .post__fix'), { opacity: '0', transform: 'translateY(8px)' });
    },
    play: (el, tl) => {
      tl.to($(el, '.post__rule'), { scaleX: 1, duration: 0.6, ease: ease.run, clearProps: 'transform' }, 0);
      typed(tl, $(el, '.post__date')!, 0.05);
      rise(tl, $$(el, '.post__main, .post__fix'), 0.2, 0.06);
    },
  },
  form: {
    prep: (el) => { hide($$(el, '.field, .form__privacy, .form__foot'), { opacity: '0', transform: 'translateY(10px)' }); },
    play: (el, tl) => { rise(tl, $$(el, '.field, .form__privacy, .form__foot'), 0.15, 0.1, 0.45); },
  },
};

onPage(() => {
  if (prefersReducedMotion()) return;
  const mine = gsap.context(() => {});
  const targets = [...document.querySelectorAll<HTMLElement>('[data-print]')];
  targets.forEach((el) => printers[el.dataset.print!]?.prep(el));

  const io = new IntersectionObserver((entries) => {
    let i = 0;
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      io.unobserve(el);
      if (el.hasAttribute('data-type')) {
        const text = el.querySelector<HTMLElement>('.cmd__text');
        el.style.setProperty('--n', String(Math.max(4, text?.textContent?.length ?? 12)));
        el.classList.add('is-typed');
      } else {
        const delay = 0.25 + i++ * 0.07;
        mine.add(() => printers[el.dataset.print!].play(el, gsap.timeline({ delay })));
      }
    }
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll<HTMLElement>('[data-type]').forEach((el) => io.observe(el));
  targets.forEach((el) => io.observe(el));

  // The scrubbed line is created only when « Parcours » comes within a screen: measuring scroll
  // positions forces a layout, which the page load does not need to pay.
  const bar = document.querySelector<HTMLElement>('[data-log-progress]');
  let t = 0;
  let ro: ResizeObserver | null = null;
  const near = new IntersectionObserver(([e]) => {
    if (!e?.isIntersecting || !bar) return;
    near.disconnect();
    gsap.fromTo(bar, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: bar.parentElement, start: 'top 70%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true },
    });
    // Sections skip layout until they come near (content-visibility): when one takes its real
    // height, the page grows, and the line's start and end must be measured again.
    ro = new ResizeObserver(() => { clearTimeout(t); t = window.setTimeout(() => ScrollTrigger.refresh(), 200); });
    ro.observe(document.body);
  }, { rootMargin: '0px 0px 100% 0px' });
  if (bar?.parentElement) near.observe(bar.parentElement);
  return () => {
    io.disconnect(); near.disconnect(); ro?.disconnect(); clearTimeout(t); mine.revert();
    for (const el of targets) for (const x of [el, ...el.querySelectorAll<HTMLElement>('[style]')]) {
      for (const p of ['opacity', 'transform', 'transform-origin', 'clip-path']) x.style.removeProperty(p);
    }
  };
});

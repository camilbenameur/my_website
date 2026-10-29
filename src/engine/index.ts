// Engine core: framework-agnostic page lifecycle, taken from fde-site. No DOM access at import time.
//   boot(setup)            once, on first load: setup → page init → intro
//   leave() → cleanup()    before the route swaps (leave runs in parallel with the fetch)
//   enter()                after the new page is in the DOM: init → enter animation → intro
// Project code hooks in with onPage(fn): fn runs on every page load inside a gsap.context, so the
// tweens and ScrollTriggers it creates are reverted automatically. Return a cleanup for the rest.
// No loader on this site: the hero's stream is the arrival (DESIGN.md, « Loader »).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScroll, resetScroll, startScroll, stopScroll } from './scroll';
import { initReveals } from './reveal';
import { playEnter, playLeave } from './transition';
import { prefersReducedMotion } from './env';
import { goToHash, initAnchors } from './anchors';

export { onScroll, scrollState, scrollToTarget, stopScroll, startScroll } from './scroll';
export { setTransition } from './transition';
export { ease, isTouch, isMobile, prefersReducedMotion } from './env';

export type PageFn = (page: { intro: gsap.core.Timeline; path: string }) => void | (() => void);
const pageFns = new Set<PageFn>();
const cleanups: (() => void)[] = [];
let ctx: gsap.Context | null = null;
let intro: gsap.core.Timeline | null = null;
let ready = false;
let booted = false;

/** Run fn on every page load (and now, if a page is ready). Returns an unsubscribe. */
export function onPage(fn: PageFn) {
  pageFns.add(fn);
  if (ready) runPageFn(fn);
  return () => { pageFns.delete(fn); };
}

function runPageFn(fn: PageFn) {
  ctx?.add(() => {
    const c = fn({ intro: intro!, path: location.pathname });
    if (typeof c === 'function') cleanups.push(c);
  });
}

// Flags on <html>. Re-applied on every page because Astro swaps root attributes.
export function syncFlags() {
  const h = document.documentElement.classList;
  h.add('js', 'is-booted');
  h.toggle('motion', !prefersReducedMotion());
}

// Each page function runs in its own task, so no single task blocks the main thread for long on a
// slow phone (Lighthouse TBT). A navigation in the middle stops the loop: `gen` changes.
let gen = 0;
const yieldToMain = () => new Promise<void>((r) => setTimeout(r, 0));

async function initPage() {
  syncFlags();
  const g = ++gen;
  ctx = gsap.context(() => {
    intro = initReveals(document);
  });
  ready = true;
  for (const fn of [...pageFns]) {
    await yieldToMain();
    if (g !== gen || !ready) return;
    runPageFn(fn);
  }
  if (ScrollTrigger.getAll().length) requestAnimationFrame(() => ScrollTrigger.refresh());
}

export function boot(setup?: () => void) {
  if (booted) return;
  booted = true;
  syncFlags();
  initScroll();
  initAnchors();
  setup?.();
  initPage();
  startScroll();
  if (location.hash) goToHash(location.hash, true); // a link like /#parcours opened directly
  intro?.play();
}

export async function leave() {
  stopScroll();
  await playLeave();
}

export function cleanup() {
  if (!ready) return;
  ready = false;
  cleanups.splice(0).forEach((c) => c());
  ctx?.revert();
  ctx = null;
}

export async function enter({ transition = true, scrollTop = true } = {}) {
  if (!booted) return;
  cleanup();
  if (scrollTop && !(location.hash && goToHash(location.hash, true))) resetScroll();
  initPage();
  if (transition) await playEnter();
  startScroll();
  intro?.play();
}

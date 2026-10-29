// Declarative reveals through data attributes, run by ONE IntersectionObserver and CSS transitions
// (base.css), so a page with many headings costs no layout work at load. Authoring:
//   data-split   a heading: its line rises out of a mask
//   data-reveal  a block: it rises and fades in ("up", default) or only fades ("fade")
//   data-delay   extra delay, in seconds
// SplitText was dropped on 29/10/2026: splitting every heading at boot was the largest long task
// on a throttled phone (Lighthouse TBT). Under reduced motion nothing is hidden or moved.
import { gsap } from 'gsap';
import { prefersReducedMotion } from './env';

let io: IntersectionObserver | null = null;

/** Wire every reveal inside `root`. Returns the (empty) intro timeline the engine plays on entry. */
export function initReveals(root: ParentNode = document) {
  const intro = gsap.timeline({ paused: true });
  io?.disconnect();
  if (prefersReducedMotion()) return intro;
  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      const delay = parseFloat(el.dataset.delay || '0');
      if (delay) el.style.transitionDelay = `${delay}s`;
      el.classList.add('is-in');
      io!.unobserve(el);
    }
  }, { rootMargin: '0px 0px -10% 0px' });
  root.querySelectorAll<HTMLElement>('[data-split], [data-reveal]').forEach((el) => io!.observe(el));
  return intro;
}

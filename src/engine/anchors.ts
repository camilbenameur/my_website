// In-page links (href="#id" on the current page). Lenis and Astro's router both listened to these
// clicks and fought over them: the scroll stopped half-way (28/10/2026). One handler owns them now.
// It scrolls the target just under the sticky header, updates the hash without a history entry
// (Astro keeps its own state there), and moves focus to the target for keyboard and screen readers.
// Where the target lands is set once, in CSS: html's scroll-padding-top, which native anchor jumps,
// focus scrolling and Lenis all apply. Adding the header height here as well landed 88 px too low.
import { scrollToTarget, scrollPadTop } from './scroll';

function targetOf(hash: string) {
  if (!hash || hash === '#') return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

// A smooth scroll can be cut short (a resize or a ScrollTrigger refresh while it runs). Once it
// should be over, land on the target unless the visitor has scrolled on their own in the meantime.
let settle = 0;
function settleOn(el: HTMLElement) {
  clearTimeout(settle);
  let touched = false;
  const mark = () => { touched = true; };
  const events = ['wheel', 'touchstart', 'keydown'] as const;
  events.forEach((t) => addEventListener(t, mark, { passive: true, once: true }));
  settle = window.setTimeout(() => {
    events.forEach((t) => removeEventListener(t, mark));
    const off = el.getBoundingClientRect().top - scrollPadTop();
    if (!touched && Math.abs(off) > 4) scrollToTarget(el, { immediate: true });
  }, 1700);
}

/** Scroll to the element named by a hash. Returns false when the page has no such element. */
export function goToHash(hash: string, immediate = false) {
  const el = targetOf(hash);
  if (!el) return false;
  scrollToTarget(el, { immediate });
  if (!immediate) settleOn(el);
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  return true;
}

let bound = false;
export function initAnchors() {
  if (bound) return;
  bound = true;
  // Capture on window runs before the router's and Lenis's own listeners.
  addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash || !targetOf(url.hash)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    // The click stops here, so a menu or a dialog the link sits in never hears it: close it first.
    a.closest('dialog')?.close();
    history.replaceState(history.state, '', url.hash);
    goToHash(url.hash);
  }, true);
}

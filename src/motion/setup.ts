// Global motion, once on the client.
//   transition  the terminal clears (the curtain covers the page), the next command is typed, then the
//               new page prints. Leave ≤ 0.4 s, enter ≤ 0.6 s (top-notch §4).
//   shared      from the project list to a project page, the project's name travels from its row to the
//               page title (FLIP), and the curtain stays out of the way.
import { gsap } from 'gsap';
import { ease, prefersReducedMotion, setTransition } from '../engine';

let shared: { slug: string; rect: DOMRect } | null = null;
let nextCmd = '';

function commandFor(url: URL) {
  const p = url.pathname.replace(/\/$/, '') || '/';
  return p === '/' || p === '/en' ? 'cd ~' : `cd ~${p}`;
}

export function setupMotion() {
  // Remember where the clicked project name is, and which command the curtain will type.
  document.addEventListener('astro:before-preparation', (e) => {
    const to = e.to as URL;
    nextCmd = commandFor(to);
    shared = null;
    const src = (e.sourceElement as HTMLElement | undefined)?.closest?.('[data-shared]') as HTMLElement | null;
    const name = src?.querySelector<HTMLElement>('[data-shared-name]');
    if (src && name) shared = { slug: src.dataset.shared!, rect: name.getBoundingClientRect() };
  });

  setTransition({
    leave: (c) => {
      const cmd = c.querySelector<HTMLElement>('[data-curtain-cmd]');
      if (cmd) cmd.textContent = nextCmd;
      if (shared) {
        // keep the name in place, fade everything else
        const main = document.getElementById('main');
        return gsap.to(main, { autoAlpha: 0, duration: 0.25, ease: ease.soft });
      }
      return gsap.timeline()
        .set(c, { autoAlpha: 1, opacity: 0 })
        .to(c, { opacity: 1, duration: 0.22, ease: 'power2.inOut' })
        .fromTo(cmd, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.16, ease: `steps(${Math.max(4, nextCmd.length)})` }, 0.06);
    },
    enter: (c) => {
      const main = document.getElementById('main');
      const tl = gsap.timeline();
      if (shared) {
        const target = document.querySelector<HTMLElement>(`[data-shared-target="${shared.slug}"]`);
        if (target) {
          const to = target.getBoundingClientRect();
          const from = shared.rect;
          tl.from(target, { x: from.left - to.left, y: from.top - to.top, scale: from.height / to.height, transformOrigin: '0 0', duration: 0.55, ease: ease.out, clearProps: 'transform' }, 0);
        }
        tl.fromTo(main, { autoAlpha: 1 }, { autoAlpha: 1, duration: 0 }, 0);
        tl.from(main?.querySelectorAll('[data-enter]') ?? [], { autoAlpha: 0, y: 14, duration: 0.45, ease: ease.out, stagger: 0.05 }, 0.12);
        shared = null;
        return tl;
      }
      return tl
        .set(main, { autoAlpha: 1 })
        .to(c, { opacity: 0, duration: 0.35, ease: 'power2.inOut' })
        .set(c, { autoAlpha: 0 })
        .from(main?.querySelectorAll('[data-enter]') ?? [], { autoAlpha: 0, y: 12, duration: 0.45, ease: ease.out, stagger: 0.04 }, 0.1);
    },
  });

  if (prefersReducedMotion()) shared = null;
}

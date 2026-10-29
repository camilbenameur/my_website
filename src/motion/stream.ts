// The signature: the hero's JSON arrives chunk by chunk, each field's check lights when the field is
// complete, the stream is cut and the healer's closing characters appear. One GSAP tween drives a
// single counter (the one clock); every visual reads it. The final state is already in the HTML, so
// reduced motion simply skips this. The replay button plays it again.
// At rest, the stream keeps trying to finish its last field, « prochain » (what comes next): the cut
// value is erased, typed again, cut again and repaired, every few seconds. Off screen, on a hidden tab
// and after « pause », it stops (WCAG 2.2.2), and so do the blinking cursors.
import { gsap } from 'gsap';
import { onPage, prefersReducedMotion } from '../engine';

onPage(() => {
  const root = document.querySelector<HTMLElement>('[data-stream]');
  if (!root || prefersReducedMotion()) return;
  const step = Number(root.dataset.step) || 0.006;
  const chunks = [...root.querySelectorAll<HTMLElement>('.c')];
  const marks = [...root.querySelectorAll<HTMLElement>('.ok')].map((el) => ({ el, at: Number(el.dataset.at) }));
  const heal = [...root.querySelectorAll<HTMLElement>('[data-heal], [data-heal-note]')];
  const cut = [...root.querySelectorAll<HTMLElement>('.c.cut')];
  const lead = document.querySelector<HTMLElement>('[data-stream-mark]');
  const leadAt = Number(root.querySelector<HTMLElement>('[data-mark-lead]')?.dataset.at ?? -1);
  const replay = root.querySelector<HTMLButtonElement>('[data-stream-replay]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-idle-toggle]');
  const html = document.documentElement;
  let tween: gsap.core.Tween | null = null;
  let idle: gsap.core.Timeline | null = null;
  let visible = true;

  const render = (n: number) => {
    for (let i = 0; i < chunks.length; i++) chunks[i].classList.toggle('on', i < n);
    for (const m of marks) m.el.classList.toggle('on', n > m.at);
    if (lead) lead.classList.toggle('is-marked', leadAt >= 0 && n > leadAt);
  };
  const setHeal = (on: boolean) => heal.forEach((el) => el.classList.toggle('on', on));

  // The idle loop: erase the cut value backwards, hesitate, type it again slowly, cut, repair. Built
  // once. The rest between two tries is short, so the field reads as still trying rather than done.
  const buildIdle = () => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4, paused: true, delay: 1.6 });
    tl.call(() => { root.classList.add('is-playing'); setHeal(false); });
    cut.slice().reverse().forEach((el, i) => tl.call(() => el.classList.remove('on'), [], 0.1 + i * 0.12));
    const back = 0.1 + cut.length * 0.12 + 0.6;
    cut.forEach((el, i) => tl.call(() => el.classList.add('on'), [], back + i * 0.24));
    tl.call(() => { setHeal(true); root.classList.remove('is-playing'); }, [], back + cut.length * 0.24 + 0.3);
    return tl;
  };
  const syncIdle = () => {
    if (!idle) return;
    const run = visible && !document.hidden && !html.classList.contains('idle-paused');
    if (run) idle.play(); else idle.pause();
  };

  const play = (delay: number) => {
    tween?.kill();
    idle?.pause(0);
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
        gsap.delayedCall(0.12, () => {
          setHeal(true);
          root.classList.remove('is-playing');
          if (replay) replay.hidden = false;
          idle ??= buildIdle();
          idle.restart(true);
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
    idle?.kill();
    io.disconnect();
    document.removeEventListener('visibilitychange', syncIdle);
    replay?.removeEventListener('click', onReplay);
    toggle?.removeEventListener('click', onToggle);
    root.classList.remove('is-playing');
  };
});

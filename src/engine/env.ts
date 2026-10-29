export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = () => matchMedia('(hover: none), (pointer: coarse)').matches;
export const isMobile = () => matchMedia('(max-width: 767px)').matches;

// Shared easing vocabulary (top-notch §4: entries decelerate, ease-in-out only for the curtain).
// `type` is a keystroke landing, `run` is output arriving, `inOut` drives the page curtain.
export const ease = {
  out: 'expo.out',
  soft: 'power3.out',
  type: 'power2.out',
  run: 'power4.out',
  inOut: 'power3.inOut',
} as const;

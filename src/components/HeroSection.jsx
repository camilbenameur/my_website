import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { HiArrowDown } from "react-icons/hi";
import { profile, roles, socials, tickerItems } from "../data/content";

const socialIcons = {
  github: SiGithub,
  linkedin: SiLinkedin,
};

function RoleRotator() {
  const prefersReducedMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <span className="relative inline-flex overflow-hidden align-bottom text-accent">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={roleIndex}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="whitespace-nowrap"
        >
          {roles[roleIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col overflow-hidden bg-grid"
    >
      <div className="pointer-events-none absolute inset-0 bg-glow" aria-hidden="true" />
      {/* Fade the grid out toward the bottom edge */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pt-24 pb-16 sm:px-6">
        {/* Status pill */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex w-fit items-center gap-2.5 border border-line bg-panel/70 px-4 py-2 font-mono text-xs tracking-wide text-slate-300 backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" aria-hidden="true" />
          {profile.title} @ {profile.company} — {profile.companyLocation}
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[14vw] leading-[0.95] font-bold tracking-tighter text-white sm:text-7xl lg:text-8xl"
        >
          {profile.firstName}
          <br />
          {profile.lastName}
          <span className="text-accent">.</span>
        </motion.h1>

        {/* Role line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 text-xl font-medium text-slate-300 sm:text-2xl"
        >
          Building <RoleRotator />
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 max-w-xl text-base text-faint sm:text-lg"
        >
          {profile.heroLine}
        </motion.p>

        {/* CTAs + socials */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#projects"
            className="flex min-h-12 items-center gap-2 bg-accent px-6 font-mono text-sm font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-white"
          >
            Selected work
            <HiArrowDown aria-hidden="true" />
          </a>
          <a
            href={profile.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center border border-line px-6 font-mono text-sm uppercase tracking-widest text-slate-200 transition-colors hover:border-accent hover:text-accent"
          >
            Read the blog ↗
          </a>
          <span className="hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
          <div className="flex gap-2">
            {socials.map((social) => {
              const Icon = socialIcons[social.id];
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} profile`}
                  className="flex h-12 w-12 items-center justify-center border border-line text-slate-300 transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Tech ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative border-t border-line"
      >
        <div className="relative overflow-hidden py-4" aria-hidden="true">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0">
                {tickerItems.map((item) => (
                  <span
                    key={`${copy}-${item}`}
                    className="mx-6 flex items-center gap-6 font-mono text-xs uppercase tracking-[0.25em] text-faint"
                  >
                    {item}
                    <span className="text-accent/50">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { profile, sections } from "../data/content";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPosition = window.scrollY + 120;
      let current = "hero";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && scrollPosition >= element.offsetTop) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        scrolled || isOpen
          ? "border-line bg-ink/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <a
          href="#hero"
          className="group flex min-h-11 items-center gap-3 font-mono text-sm text-slate-200"
          aria-label="Back to top"
        >
          <span className="flex h-7 w-7 items-center justify-center border border-accent/60 text-xs font-bold text-accent transition-colors group-hover:bg-accent group-hover:text-ink">
            CB
          </span>
          <span className="hidden tracking-wide sm:inline">
            camil<span className="text-faint">@</span>benameur
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`relative flex min-h-11 items-center px-3 font-mono text-xs uppercase tracking-widest transition-colors ${
                activeSection === section.id
                  ? "text-accent"
                  : "text-faint hover:text-slate-200"
              }`}
            >
              <span className="mr-1.5 text-[10px] opacity-60">{section.num}</span>
              {section.label}
              {activeSection === section.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-x-3 bottom-2 h-px bg-accent"
                />
              )}
            </a>
          ))}
          <a
            href={profile.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 flex min-h-11 items-center border border-line px-4 font-mono text-xs uppercase tracking-widest text-slate-200 transition-colors hover:border-accent hover:text-accent"
          >
            Blog ↗
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-11 w-11 items-center justify-center text-slate-200 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-line bg-ink/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col px-4 py-4">
              {sections.map((section, i) => (
                <motion.a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`flex min-h-12 items-center gap-3 border-b border-line/50 font-mono text-sm uppercase tracking-widest ${
                    activeSection === section.id ? "text-accent" : "text-slate-300"
                  }`}
                >
                  <span className="text-xs text-faint">{section.num}</span>
                  {section.label}
                </motion.a>
              ))}
              <motion.a
                href={profile.blogUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * sections.length }}
                className="flex min-h-12 items-center gap-3 font-mono text-sm uppercase tracking-widest text-slate-300"
              >
                <span className="text-xs text-faint">→</span>
                Blog ↗
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navigation;

import { motion } from "framer-motion";

function SectionHeading({ num, label, title, intro }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12 sm:mb-16"
    >
      <div className="mb-4 flex items-center gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          [{num}] — {label}
        </span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>
      <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 max-w-2xl text-base text-faint sm:text-lg">{intro}</p>
      )}
    </motion.div>
  );
}

export default SectionHeading;

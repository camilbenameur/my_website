import { motion } from "framer-motion";
import { FiGithub, FiArrowUpRight } from "react-icons/fi";
import { projects } from "../data/content";
import SectionHeading from "./SectionHeading";

const featured = projects.filter((p) => p.featured);
const others = projects.filter((p) => !p.featured);

function FeaturedRow({ project, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: 0.05 * index, ease: "easeOut" }}
      className="group relative border-t border-line py-10 transition-colors hover:bg-panel/60 sm:py-12"
    >
      <div className="grid gap-6 sm:grid-cols-12 sm:gap-8">
        {/* Index + category */}
        <div className="sm:col-span-3">
          <p className="font-mono text-4xl font-bold text-line transition-colors group-hover:text-accent sm:text-5xl">
            {project.index}
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-faint">
            {project.category}
          </p>
        </div>

        {/* Body */}
        <div className="sm:col-span-6">
          <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {project.title}
          </h3>
          <p className="mt-3 leading-relaxed text-body">{project.description}</p>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
            {project.technologies.map((tech) => (
              <li key={tech} className="font-mono text-xs text-faint">
                {tech}
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div className="flex flex-row flex-wrap content-start gap-3 sm:col-span-3 sm:flex-col sm:items-end">
          {project.blog && (
            <a
              href={project.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 border border-accent/60 px-4 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-ink"
            >
              {project.blogLabel || "Deep dive"}
              <FiArrowUpRight aria-hidden="true" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository for ${project.title}`}
              className="inline-flex min-h-11 items-center gap-1.5 border border-line px-4 font-mono text-xs uppercase tracking-wider text-slate-300 transition-colors hover:border-accent hover:text-accent"
            >
              <FiGithub aria-hidden="true" />
              Source
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          num="03"
          label="Selected Work"
          title="Built, shipped, owned."
          intro="Industrial ownership, infrastructure engineering, and focused side projects."
        />

        {/* Featured case studies */}
        <div className="border-b border-line">
          {featured.map((project, index) => (
            <FeaturedRow key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Other builds */}
        <div className="mt-16">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-faint">
            Also on the bench
          </p>
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {others.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.08 * index, ease: "easeOut" }}
                className="group flex flex-col bg-ink p-6 transition-colors hover:bg-panel sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">
                    {project.title}
                  </h3>
                  <span className="font-mono text-xs text-faint">
                    {project.index}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body">
                  {project.description}
                </p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <li key={tech} className="font-mono text-[11px] text-faint">
                        {tech}
                      </li>
                    ))}
                  </ul>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub repository for ${project.title}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-slate-300 transition-colors hover:border-accent hover:text-accent"
                    >
                      <FiGithub size={16} />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center font-mono text-xs text-faint"
        >
          More on{" "}
          <a
            href="https://github.com/camilbenameur"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            github.com/camilbenameur
          </a>
        </motion.p>
      </div>
    </section>
  );
}

export default ProjectsSection;

import { motion } from "framer-motion";
import {
  profile,
  stats,
  experience,
  education,
  focusTags,
} from "../data/content";
import profilePicture from "../assets/profile_picture.jpg";
import SectionHeading from "./SectionHeading";

function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading num="01" label="About" title="The engineer behind the systems." />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-4"
          >
            <figure className="corner-ticks border border-line bg-panel p-3">
              <img
                src={profilePicture}
                alt={profile.name}
                loading="lazy"
                className="aspect-square w-full object-cover grayscale transition duration-500 hover:grayscale-0"
              />
              <figcaption className="flex items-center justify-between pt-3 font-mono text-[11px] uppercase tracking-widest text-faint">
                <span>{profile.location}</span>
                <span>{profile.coordinates}</span>
              </figcaption>
            </figure>

            {/* Focus tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {focusTags.map((tag) => (
                <span
                  key={tag}
                  className="border border-line px-3 py-1.5 font-mono text-xs text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Narrative + records */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-8"
          >
            <p className="text-lg leading-relaxed text-body sm:text-xl">
              {profile.summary}
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-1 divide-y divide-line border border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map((stat) => (
                <div key={stat.value} className="px-6 py-5">
                  <p className="font-mono text-3xl font-bold text-accent">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-faint">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Experience / Education */}
            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-accent">
                  Experience
                </h3>
                <ul className="space-y-5 border-l border-line pl-5">
                  {experience.map((item) => (
                    <li key={item.role} className="relative">
                      <span
                        className="absolute -left-[23px] top-1.5 h-1.5 w-1.5 bg-accent"
                        aria-hidden="true"
                      />
                      <p className="font-semibold text-white">{item.role}</p>
                      <p className="font-mono text-xs text-faint">{item.org}</p>
                      <p className="mt-1 text-sm text-body">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-accent">
                  Education
                </h3>
                <ul className="space-y-5 border-l border-line pl-5">
                  {education.map((item) => (
                    <li key={item.degree} className="relative">
                      <span
                        className="absolute -left-[23px] top-1.5 h-1.5 w-1.5 bg-accent"
                        aria-hidden="true"
                      />
                      <p className="font-semibold text-white">{item.degree}</p>
                      <p className="font-mono text-xs text-faint">{item.org}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;

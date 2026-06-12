import { motion } from "framer-motion";
import {
  SiPython,
  SiTensorflow,
  SiScikitlearn,
  SiGithubactions,
  SiDocker,
  SiGit,
  SiMysql,
  SiOpencv,
  SiPytorch,
  SiGo,
  SiOpenai,
  SiAnthropic,
  SiTauri,
  SiLinux,
  SiPostgresql,
  SiDebian,
  SiGnu,
} from "react-icons/si";
import SectionHeading from "./SectionHeading";

const skillModules = [
  {
    id: "MOD-A",
    name: "Applied AI & Automation",
    skills: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "LLM Agents", icon: SiOpenai, color: "#74aa9c" },
      { name: "MCP Servers", icon: SiAnthropic, color: "#D97757" },
      { name: "LLM Streaming", icon: SiOpenai, color: "#5eead4" },
      { name: "Industrial AI Delivery", icon: SiOpenai, color: "#fbbf24" },
    ],
  },
  {
    id: "MOD-B",
    name: "Software Architecture & Platforms",
    skills: [
      { name: "Go", icon: SiGo, color: "#00ADD8" },
      { name: "Hexagonal Architecture", icon: SiGo, color: "#00ADD8" },
      { name: "High-Performance Data Infrastructure", icon: SiPostgresql, color: "#6c9eff" },
      { name: "Linux Orchestration", icon: SiLinux, color: "#FCC624" },
      { name: "Tauri", icon: SiTauri, color: "#FFC131" },
    ],
  },
  {
    id: "MOD-C",
    name: "DevOps & Industrial Tooling",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "Docker (Multi-stage)", icon: SiDocker, color: "#2496ED" },
      { name: "Debian Packaging", icon: SiDebian, color: "#d8556a" },
      { name: "Makefile", icon: SiGnu, color: "#A42E2B" },
      { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
      { name: "MySQL & SQLite", icon: SiMysql, color: "#4479A1" },
    ],
  },
  {
    id: "MOD-D",
    name: "Academic AI & Vision",
    skills: [
      { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
      { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
      { name: "scikit-learn", icon: SiScikitlearn, color: "#F7931E" },
      { name: "YOLOv8", icon: SiPython, color: "#00BFFF" },
      { name: "OpenCV", icon: SiOpencv, color: "#5C3EE8" },
    ],
  },
];

function SkillsSection() {
  return (
    <section id="skills" className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          num="02"
          label="Capabilities"
          title="The toolbox, organized."
          intro="Engineering Degree from Polytech Dijon, Master's in AI & Databases from Université de Bourgogne. Expert in high-performance Go and industrial Python."
        />

        <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
          {skillModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.08 * index, ease: "easeOut" }}
              className="group bg-ink p-6 transition-colors hover:bg-panel sm:p-8"
            >
              <div className="mb-6 flex items-baseline justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {module.name}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-faint transition-colors group-hover:text-accent">
                  {module.id}
                </span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {module.skills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <li
                      key={skill.name}
                      className="flex items-center gap-2 border border-line bg-panel px-3 py-2 text-sm text-slate-300 transition-colors hover:border-accent/50 hover:text-white"
                    >
                      <Icon size={15} style={{ color: skill.color }} aria-hidden="true" />
                      {skill.name}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;

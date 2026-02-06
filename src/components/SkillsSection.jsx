import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  SiDebian
} from "react-icons/si";

// Regroupement de toutes les compétences par catégorie
const skillCategories = [
  {
    name: "Applied AI & Automation",
    color: "from-blue-500 to-purple-600",
    skills: [
      { name: "Python", icon: <SiPython />, color: "#3776AB" },
      { name: "LLM Agents", icon: <SiOpenai />, color: "#412991" },
      { name: "MCP Servers", icon: <SiAnthropic />, color: "#D97757" },
      { name: "LLM Streaming", icon: <SiOpenai />, color: "#007ACC" },
      { name: "Industrial AI Delivery", icon: <SiOpenai />, color: "#74aa9c" }
    ]
  },
  {
    name: "Software Architecture & Platforms",
    color: "from-green-500 to-teal-600",
    skills: [
      { name: "Go", icon: <SiGo />, color: "#00ADD8" },
      { name: "Hexagonal Architecture", icon: <SiGo />, color: "#00ADD8" },
      { name: "High-Performance Data Infrastructure", icon: <SiPostgresql />, color: "#4169E1" },
      { name: "Linux Orchestration", icon: <SiLinux />, color: "#FCC624" },
      { name: "Tauri", icon: <SiTauri />, color: "#FFC131" }
    ]
  },
  {
    name: "DevOps & Industrial Tooling",
    color: "from-orange-500 to-red-600",
    skills: [
      { name: "Git", icon: <SiGit />, color: "#F05032" },
      { name: "Docker (Multi-stage)", icon: <SiDocker />, color: "#2496ED" },
      { name: "Debian Packaging", icon: <SiDebian />, color: "#A81D33" },
      { name: "Makefile", icon: <SiGit />, color: "#29016A" },
      { name: "GitHub Actions", icon: <SiGithubactions />, color: "#2088FF" },
      { name: "MySQL & SQLite", icon: <SiMysql />, color: "#4479A1" }
    ]
  },
  {
    name: "Academic AI & Vision",
    color: "from-indigo-500 to-blue-600",
    skills: [
      { name: "TensorFlow", icon: <SiTensorflow />, color: "#FF6F00" },
      { name: "PyTorch", icon: <SiPytorch />, color: "#EE4C2C" },
      { name: "scikit-learn", icon: <SiScikitlearn />, color: "#F7931E" },
      { name: "YOLOv8", icon: <SiPython />, color: "#00BFFF" },
      { name: "OpenCV", icon: <SiOpencv />, color: "#5C3EE8" }
    ]
  }
];

function SkillsSection() {
  const [hoveredSkill, setHoveredSkill] = useState(null);

  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-2">Technical Skills</h2>
          <div className="mx-auto w-24 h-1 bg-blue-600 mb-6 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Software Engineer with an Engineering Degree from Polytech Dijon and a Master's 
            in AI & Databases from Université de Bourgogne. Expert in high-performance Go and industrial Python.
          </p>
        </motion.div>

        {/* Skills Showcase */}
        <div className="space-y-16">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: catIndex * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Category Shelf */}
              <div className="relative">
                {/* Shelf Label */}
                <div className="flex items-center mb-6">
                  <div className={`h-8 w-2 rounded-full bg-gradient-to-b ${category.color} mr-3`}></div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{category.name}</h3>
                </div>
                
                {/* Skills on Shelf */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative">
                  {/* Shelf Effect */}
                  <div className="absolute left-0 right-0 h-2 bottom-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-b-xl"></div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-8 items-center">
                    {category.skills.map((skill, index) => (
                      <motion.div
                        key={`${category.name}-${skill.name}`}
                        initial={{ scale: 0.8, y: 20, opacity: 0 }}
                        whileInView={{ scale: 1, y: 0, opacity: 1 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: 0.2 + index * 0.1,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ 
                          y: -15, 
                          scale: 1.1,
                          transition: { duration: 0.2 } 
                        }}
                        onHoverStart={() => setHoveredSkill(`${category.name}-${skill.name}`)}
                        onHoverEnd={() => setHoveredSkill(null)}
                        viewport={{ once: true }}
                        className="relative flex flex-col items-center"
                      >
                        {/* Icon with shadow */}
                        <div className="relative">
                          <div 
                            className="text-4xl p-4 bg-gray-50 dark:bg-gray-700 rounded-full shadow-md"
                            style={{ color: skill.color }}
                          >
                            {skill.icon}
                          </div>
                          
                          {/* Shadow beneath icon */}
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-black/10 dark:bg-black/30 blur-md rounded-full"></div>
                        </div>
                        
                        {/* Skill name */}
                        <span className="mt-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {skill.name}
                        </span>
                        
                        {/* Popup on hover */}
                        <AnimatePresence>
                          {hoveredSkill === `${category.name}-${skill.name}` && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs py-1 px-3 rounded-md shadow-lg z-10 whitespace-nowrap"
                            >
                              {skill.name}
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
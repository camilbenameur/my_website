import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { HiOutlineChip } from "react-icons/hi";
import { BsCode } from "react-icons/bs";
import { MdOutlineDevices } from "react-icons/md";

function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleProjects, setVisibleProjects] = useState([]);
  
  // Projets mis à jour selon votre profil réel
  const projects = [
    {
      title: "SoftdPAC Installer",
      description: "Project Owner and Lead Developer of a 64k+ LOC deployment orchestrator built from scratch. Hexagonal Go backend, dynamic Debian packaging, and multi-stage build pipelines for a global Schneider Electric release.",
      image: "/images/projects/schneider.svg",
      blog: "https://blog.camilbenameur.com/blog/from-backlog-to-offline-installer",
      blogLabel: "Read Design Story",
      category: "Schneider Electric",
      featured: true,
      technologies: ["Go (Hexagonal)", "Tauri", "Debian Packaging", "Multi-stage Builds", "MVP Delivery"]
    },
    {
      title: "SoftdPAC Legacy Modernization",
      description: "Modernized and optimized the SoftdPAC runtime with refactoring, concurrency improvements in Go, and scalable container orchestration across Linux industrial hardware.",
      image: "/images/projects/runtime.svg",
      category: "Schneider Electric",
      featured: true,
      technologies: ["Go", "Refactoring", "Concurrency", "Docker Fleet", "Linux Orchestration"]
    },
    {
      title: "go-llm-stream",
      description: "A high-performance O(n) Go library for incremental JSON parsing of LLM streams. Achieves 316+ MB/s with zero allocations and features automatic healing of malformed outputs.",
      image: "/images/projects/go-llm-stream.svg",
      github: "https://github.com/camilbenameur/go-llm-stream",
      blog: "https://blog.camilbenameur.com/blog/on-streaming-optimization",
      blogLabel: "Read Technical Deep Dive",
      category: "Infrastructure & Go",
      featured: true,
      technologies: ["Go", "JSON Parsing", "State Machines", "LLM Streaming", "Benchmarking"]
    },
    {
      title: "Portfolio Website",
      description: "Personal portfolio website built with React and TailwindCSS showcasing my projects and skills.",
      image: "/images/projects/portfolio.svg",
      github: "https://github.com/camilbenameur/my_website",
      category: "Other Projects",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Vite"]
    },
    {
      title: "ESP32 Stereovision System",
      description: "AI-powered stereovision camera system using ESP32 microcontrollers to detect grass and measure distances.",
      image: "/images/projects/esp32-vision.svg",
      github: "https://github.com/camilbenameur/esp32-stereovision",
      category: "Other Projects",
      technologies: ["Python", "ESP32", "YOLOv8", "Computer Vision", "TensorFlow Lite"]
    }
  ];

  // Catégories adaptées à vos projets
  const categories = ["All", ...new Set(projects.map(project => project.category))];

  useEffect(() => {
    if (selectedCategory === "All") {
      setVisibleProjects(projects);
    } else {
      const filteredProjects = projects.filter(project => project.category === selectedCategory);
      setVisibleProjects(filteredProjects);
    }
  }, [selectedCategory]);

  const getCategoryIcon = (category) => {
    switch(category) {
      case "Web Development":
        return <BsCode />;
      case "Schneider Electric":
        return <HiOutlineChip />;
      case "Infrastructure & Go":
        return <HiOutlineChip />;
      case "Other Projects":
        return <BsCode />;
      default:
        return <MdOutlineDevices />;
    }
  };

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-2">Projects</h2>
          <div className="mx-auto w-24 h-1 bg-blue-600 mb-6 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Industrial ownership, infrastructure engineering, and focused side projects
          </p>
        </motion.div>

        {/* Filter Categories - Minimaliste */}
        <div className="flex justify-center gap-3 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid - Minimal et élégant */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {visibleProjects.map((project) => (
              <motion.div
                key={project.title}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={project.image || "/images/projects/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {project.featured && (
                    <div className="absolute top-3 left-3 bg-blue-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                  {project.blog && (
                    <div className="absolute top-3 right-3 bg-white/90 text-gray-900 text-xs px-2 py-1 rounded">
                      Featured Article
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-xl">{project.title}</h3>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        aria-label={`GitHub repository for ${project.title}`}
                      >
                        <FiGithub size={18} />
                      </a>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span 
                        key={index} 
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      {getCategoryIcon(project.category)}
                      <span className="ml-1">{project.category}</span>
                    </span>
                    
                    <div className="flex gap-2">
                      {project.blog && (
                        <motion.a
                          href={project.blog}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md inline-flex items-center gap-1 font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {project.blogLabel || "Deep Dive"}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </motion.a>
                      )}
                      {!project.blog && project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
                        >
                          View Repo
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Note de bas de page */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            For more details and projects, visit my{" "}
            <a 
              href="https://github.com/camilbenameur" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              GitHub profile
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default ProjectsSection;
// Single source of truth for everything the site says.
// Components own how it looks; this file owns what it is.

export const profile = {
  name: "Camil Benameur",
  firstName: "Camil",
  lastName: "Benameur",
  title: "Software Engineer",
  company: "Schneider Electric",
  companyLocation: "Carros",
  location: "Nice, France",
  coordinates: "43.70°N / 7.26°E",
  blogUrl: "https://blog.camilbenameur.com",
  summary:
    "Software Engineer at Schneider Electric (Carros) delivering industrial orchestration platforms end-to-end. I own complex Go and Python systems — including a 64k+ LOC deployment pipeline with hexagonal architecture — and ship production-grade AI integrations for industrial workflows.",
  heroLine:
    "I lead end-to-end delivery of industrial orchestrators, specializing in Go, Python, and high-performance system architectures.",
};

export const roles = [
  "industrial orchestrators",
  "high-performance Go systems",
  "production AI integrations",
  "deployment pipelines",
];

export const socials = [
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/camilbenameur",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/camil-benameur-14a762194/",
  },
];

export const stats = [
  { value: "64k+", label: "LOC orchestrator owned end-to-end" },
  { value: "316 MB/s", label: "zero-allocation LLM stream parsing" },
  { value: "0→1", label: "MVP to global Schneider Electric release" },
];

export const experience = [
  {
    role: "Software Engineer",
    org: "Schneider Electric — Carros",
    detail: "Industrial orchestration platforms, Go & Python systems.",
  },
  {
    role: "Project Owner / Lead Developer",
    org: "SoftdPAC Installer",
    detail: "64k+ LOC deployment orchestrator built from scratch.",
  },
  {
    role: "Copilot Champion & AI Enthusiast",
    org: "Schneider Electric",
    detail: "Leading monthly AI best-practice sessions.",
  },
];

export const education = [
  {
    degree: "Engineering Degree, Software Development",
    org: "Polytech Dijon",
  },
  {
    degree: "Master's in AI & Databases",
    org: "Université de Bourgogne",
  },
  {
    degree: "Specialization",
    org: "Transformer models & LLM integration",
  },
];

export const focusTags = [
  "Go",
  "Hexagonal Architecture",
  "Tauri",
  "Industrial DevOps",
  "LLM Agents",
];

export const tickerItems = [
  "Go",
  "Python",
  "Hexagonal Architecture",
  "Tauri",
  "LLM Streaming",
  "Debian Packaging",
  "Docker",
  "Linux Orchestration",
  "MCP Servers",
  "Computer Vision",
];

export const projects = [
  {
    id: "softdpac-installer",
    index: "001",
    title: "SoftdPAC Installer",
    category: "Schneider Electric",
    featured: true,
    description:
      "Project Owner and Lead Developer of a 64k+ LOC deployment orchestrator built from scratch. Hexagonal Go backend, dynamic Debian packaging, and multi-stage build pipelines for a global Schneider Electric release.",
    technologies: ["Go (Hexagonal)", "Tauri", "Debian Packaging", "Multi-stage Builds", "MVP Delivery"],
    blog: "https://blog.camilbenameur.com/blog/from-backlog-to-offline-installer",
    blogLabel: "Read the design story",
  },
  {
    id: "softdpac-modernization",
    index: "002",
    title: "SoftdPAC Legacy Modernization",
    category: "Schneider Electric",
    featured: true,
    description:
      "Modernized and optimized the SoftdPAC runtime with refactoring, concurrency improvements in Go, and scalable container orchestration across Linux industrial hardware.",
    technologies: ["Go", "Refactoring", "Concurrency", "Docker Fleet", "Linux Orchestration"],
  },
  {
    id: "go-llm-stream",
    index: "003",
    title: "go-llm-stream",
    category: "Infrastructure & Go",
    featured: true,
    description:
      "A high-performance O(n) Go library for incremental JSON parsing of LLM streams. Achieves 316+ MB/s with zero allocations and features automatic healing of malformed outputs.",
    technologies: ["Go", "JSON Parsing", "State Machines", "LLM Streaming", "Benchmarking"],
    github: "https://github.com/camilbenameur/go-llm-stream",
    blog: "https://blog.camilbenameur.com/blog/on-streaming-optimization",
    blogLabel: "Read the technical deep dive",
  },
  {
    id: "portfolio",
    index: "004",
    title: "Portfolio Website",
    category: "Side Project",
    featured: false,
    description:
      "This site — built with React, Tailwind CSS, and Framer Motion on Vite.",
    technologies: ["React", "TailwindCSS", "Framer Motion", "Vite"],
    github: "https://github.com/camilbenameur/my_website",
  },
  {
    id: "esp32-stereovision",
    index: "005",
    title: "ESP32 Stereovision System",
    category: "Side Project",
    featured: false,
    description:
      "AI-powered stereovision camera system using ESP32 microcontrollers to detect grass and measure distances.",
    technologies: ["Python", "ESP32", "YOLOv8", "Computer Vision", "TensorFlow Lite"],
    github: "https://github.com/camilbenameur/esp32-stereovision",
  },
];

export const sections = [
  { id: "about", num: "01", label: "About" },
  { id: "skills", num: "02", label: "Capabilities" },
  { id: "projects", num: "03", label: "Work" },
  { id: "contact", num: "04", label: "Contact" },
];

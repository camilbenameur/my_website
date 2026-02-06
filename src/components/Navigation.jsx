import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { BsSun, BsMoon } from "react-icons/bs";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const sections = ["hero", "about", "skills", "projects", "contact"];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    if (darkMode) {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");      
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Liens de navigation
  const navLinks = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "blog", label: "Blog", href: "https://blog.camilbenameur.com", external: true },
    { id: "contact", label: "Contact" }
  ];

  // Fermer le menu mobile lors du clic sur un lien
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white dark:bg-gray-900 shadow-lg py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <motion.a 
          href="#hero" 
          className={`text-xl md:text-2xl font-bold ${
            scrolled ? "text-gray-900 dark:text-white" : "text-white"
          } flex items-center gap-2`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            CB
          </motion.div>
          <span className={scrolled ? "" : "hidden md:inline"}>Camil Benameur</span>
        </motion.a>

        {/* Navigation pour desktop */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.external ? link.href : `#${link.id}`}
              onClick={link.external ? undefined : handleLinkClick}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className={`relative px-4 py-2 rounded-md transition-colors ${
                scrolled 
                  ? activeSection === link.id
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  : activeSection === link.id
                      ? "text-white bg-white/20"
                      : "text-white/90 hover:bg-white/10"
              }`}
            >
              {link.label}
              {activeSection === link.id && !link.external && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-blue-500 rounded-full"
                />
              )}
            </a>
          ))}

          {/* Bouton thème clair/sombre */}
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className={`ml-2 p-2 rounded-full ${
              scrolled 
                ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                : "bg-white/20 text-white"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
          </motion.button>
        </div>

        {/* Bouton menu mobile */}
        <div className="md:hidden flex items-center">
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className={`mr-4 p-2 rounded-full ${
              scrolled 
                ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                : "bg-white/20 text-white"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
          </motion.button>
          
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded ${
              scrolled 
                ? "text-gray-900 dark:text-white" 
                : "text-white"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Menu"
          >
            {isOpen ? <HiX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.external ? link.href : `#${link.id}`}
                  onClick={link.external ? undefined : handleLinkClick}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={`block py-3 px-4 rounded-lg ${
                    activeSection === link.id && !link.external
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                  {link.external && (
                    <span className="ml-1 text-xs text-gray-400">↗</span>
                  )}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navigation;
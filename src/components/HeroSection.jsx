import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { HiChevronDown } from "react-icons/hi";

function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  
  // Texte pour l'effet de machine à écrire
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const roles = ["Software Engineer", "Go & Python Developer", "AI Enthusiast"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(200);

  // Effet de parallaxe
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effet de machine à écrire
  useEffect(() => {
    const currentRole = roles[roleIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(currentRole.substring(0, index + 1));
        setIndex(index + 1);
        
        if (index === currentRole.length) {
          setIsDeleting(true);
          setTypingSpeed(100); // Pause avant de commencer à effacer
        }
      } else {
        setText(currentRole.substring(0, index - 1));
        setIndex(index - 1);
        
        if (index === 1) {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % roles.length);
          setTypingSpeed(150);
        }
      }
    }, typingSpeed);
    
    return () => clearTimeout(timer);
  }, [index, isDeleting, roleIndex, roles, typingSpeed]);

  // Les variants d'animation pour les boutons sociaux
  const socialVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.5 + i * 0.2,
        duration: 0.5
      }
    })
  };

  return (
    <section
      id="hero"
      className="min-h-screen relative flex items-center justify-center bg-fixed bg-center bg-cover overflow-hidden"
      style={{ 
        backgroundImage: `url('/images/hero-bg.svg')`
      }}
    >
      {/* Overlay avec dégradé */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"
        style={{ 
          transform: `translateY(${scrollY * 0.1}px)` 
        }}
      ></div>
      
      {/* Particules/Motifs décoratifs */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-blue-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 40 - 20],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, Math.random() * 0.5 + 0.8, 1]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4">
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
          {/* Badge/tag en haut */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block mx-auto mb-6 bg-blue-600/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
          >
            Hello, welcome to my portfolio
          </motion.div>
          
          {/* Nom avec animation raffinée */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Camil Benameur
          </motion.h1>
          
          {/* Sous-titre animé (machine à écrire) */}
          <motion.div
            className="h-12 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <h2 className="text-2xl md:text-4xl font-medium">
              I am a <span className="text-blue-400">{text}</span>
              <span className="animate-pulse">|</span>
            </h2>
          </motion.div>
          
          {/* Description courte */}
          <motion.p
            className="mt-6 text-lg text-gray-300 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            Software Engineer at Schneider Electric (Carros). I lead end-to-end delivery of industrial
            orchestrators, specializing in Go, Python, and high-performance system architectures.
          </motion.p>
          
          {/* Boutons d'action */}
          <motion.div 
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
          >
            <motion.a
              href="#projects"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-full font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              SoftdPAC Installer
            </motion.a>
            <motion.a
              href="https://blog.camilbenameur.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 transition-all rounded-full font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Read the Blog
            </motion.a>
          </motion.div>
          
          {/* Liens sociaux */}
          <div className="mt-10 flex justify-center gap-4">
            <motion.a
              href="https://github.com/camilbenameur"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
              variants={socialVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              whileHover={{ scale: 1.1 }}
              aria-label="GitHub Profile"
            >
              <SiGithub size={24} />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/camil-benameur-14a762194/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
              variants={socialVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              whileHover={{ scale: 1.1 }}
              aria-label="LinkedIn Profile"
            >
              <SiLinkedin size={24} />
            </motion.a>
          </div>
        </div>
      </div>
      
      {/* Bouton de défilement vers le bas */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.a
          href="#about"
          className="flex flex-col items-center text-white/80 hover:text-white transition-colors"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <HiChevronDown size={24} />
        </motion.a>
      </motion.div>
    </section>
  );
}

export default HeroSection;
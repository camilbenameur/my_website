import { motion } from "framer-motion";
import { 
  SiGithub, 
  SiLinkedin, 
  SiX 
} from "react-icons/si";
import { 
  HiChevronUp 
} from "react-icons/hi";

function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Logo et informations centrées */}
        <div className="max-w-md mx-auto">
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center mb-4 justify-center">
              <div className="h-10 w-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold mr-3">
                CB
              </div>
              <span className="text-xl font-bold">Camil Benameur</span>
            </div>
            <p className="text-gray-300 mb-6">
              Creating elegant solutions to complex problems.
            </p>
            <div className="flex space-x-3 justify-center">
              <motion.a 
                href="https://github.com/camilbenameur" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                aria-label="GitHub Profile"
                whileHover={{ y: -3 }}
              >
                <SiGithub size={20} />
              </motion.a>
              <motion.a 
                href="https://www.linkedin.com/in/camil-benameur-14a762194/" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                aria-label="LinkedIn Profile"
                whileHover={{ y: -3 }}
              >
                <SiLinkedin size={20} />
              </motion.a>
              <motion.a 
                href="https://twitter.com/camilbenameur" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                aria-label="Twitter Profile"
                whileHover={{ y: -3 }}
              >
                <SiX size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>
        
        {/* Copyright simple */}
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 pt-6 border-t border-gray-700/50 text-center"
        >
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Camil Benameur
          </p>
          
          {/* Scroll to top button */}
          <motion.div 
            className="mt-6"
            whileHover={{ scale: 1.1 }}
          >
            <a 
              href="#hero" 
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-all shadow-lg shadow-blue-500/20"
              aria-label="Scroll to top"
            >
              <HiChevronUp size={24} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
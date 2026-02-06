import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaCode } from "react-icons/fa";
import profile_picture from "../assets/profile_picture.jpg";

function AboutSection() {
  return (
    <section id="about" className="min-h-screen flex items-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-16 relative after:content-[''] after:block after:w-24 after:h-1 after:bg-blue-500 after:mx-auto after:mt-4"
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}  
        >
          About Me
        </motion.h2>
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image avec animations */}
          <motion.div 
            className="lg:w-1/3"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative mx-auto w-64 h-64 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
              <img
                src={profile_picture}
                alt="Camil"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            {/* Social links */}
            <div className="flex justify-center mt-6 space-x-6">
              <a href="https://www.linkedin.com/in/camil-benameur-14a762194/" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <FaLinkedin />
              </a>
              <a href="https://github.com/camilbenameur" target="_blank" rel="noopener noreferrer" className="text-2xl text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors">
                <FaGithub />
              </a>
              <a href="#projects" className="text-2xl text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors">
                <FaCode />
              </a>
            </div>
          </motion.div>
          
          {/* Content */}
          <motion.div 
            className="lg:w-2/3 space-y-6"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                Hi, I'm Camil
              </h3>
              <p className="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
                Software Engineer at Schneider Electric (Carros) delivering industrial orchestration platforms
                end-to-end. I own complex Go and Python systems, including a 64k+ LOC deployment pipeline with
                hexagonal architecture, and ship production-grade AI integrations for industrial workflows.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Experience</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Software Engineer at Schneider Electric (Carros)</li>
                    <li>• Project Owner / Lead Developer for SoftdPAC Installer</li>
                    <li>• Copilot Champion & AI Enthusiast: Leading monthly best-practice sessions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Education</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Engineering Degree in Software Development (Polytech Dijon)</li>
                    <li>• Master's in AI & Databases (Université de Bourgogne)</li>
                    <li>• Specialized in Transformer models & LLM integration</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center md:justify-start"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {["Go", "Hexagonal Architecture", "Tauri", "Industrial DevOps", "LLM Agents"].map((skill) => (
                <span 
                  key={skill}
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </motion.div>
            
            <div className="flex justify-center md:justify-start pt-4">
              <a 
                href="#contact" 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
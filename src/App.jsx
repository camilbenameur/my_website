import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

function App() {

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navigation />
      <div className="pt-0">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
